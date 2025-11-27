"use client";

import { useCallback, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Audio settings store
interface AudioSettingsState {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
}

export const useAudioSettings = create<AudioSettingsState>()(
  persist(
    (set, get) => ({
      volume: 1.0,
      isMuted: false,
      setVolume: (volume) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
        Howler.volume(get().isMuted ? 0 : volume);
      },
      setMuted: (muted) => {
        set({ isMuted: muted });
        Howler.volume(muted ? 0 : get().volume);
      },
      toggleMute: () => {
        const newMuted = !get().isMuted;
        set({ isMuted: newMuted });
        Howler.volume(newMuted ? 0 : get().volume);
      },
    }),
    {
      name: "audio-settings",
    }
  )
);

// Cache for Howl instances to avoid recreating them
const audioCache = new Map<string, Howl>();
const loadingPromises = new Map<string, Promise<Howl>>();
const failedPaths = new Set<string>();

// Audio types
type AudioType = "letter-phonics" | "letter-name" | "letter-example" | "word" | "sentence" | "phoneme";

interface AudioError {
  path: string;
  error: string;
  timestamp: number;
}

// Track errors for debugging
const audioErrors: AudioError[] = [];
const MAX_ERRORS = 50;

function logAudioError(path: string, error: string) {
  audioErrors.push({ path, error, timestamp: Date.now() });
  if (audioErrors.length > MAX_ERRORS) {
    audioErrors.shift();
  }
  console.warn(`[Audio] Error loading ${path}:`, error);
}

export function useAudio() {
  const { volume, isMuted } = useAudioSettings();
  const currentlyPlaying = useRef<Howl | null>(null);
  const isUnmounted = useRef(false);

  // Use refs for volume/muted so getHowl doesn't need to be recreated
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  // Keep refs in sync
  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    isUnmounted.current = false;
    return () => {
      isUnmounted.current = true;
      // Stop any currently playing audio when component unmounts
      if (currentlyPlaying.current) {
        currentlyPlaying.current.stop();
      }
    };
  }, []);

  // Apply volume settings
  useEffect(() => {
    Howler.volume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  /**
   * Get or create a Howl instance for a given audio file
   */
  const getHowl = useCallback(async (src: string): Promise<Howl | null> => {
    // Skip if we know this file doesn't exist
    if (failedPaths.has(src)) {
      return null;
    }

    // Return cached instance
    if (audioCache.has(src)) {
      return audioCache.get(src)!;
    }

    // Wait for existing load
    if (loadingPromises.has(src)) {
      return loadingPromises.get(src)!;
    }

    // Create new Howl with promise-based loading
    // Use refs for volume to avoid recreating this callback
    const loadPromise = new Promise<Howl>((resolve, reject) => {
      const howl = new Howl({
        src: [src],
        html5: true,
        preload: true,
        volume: isMutedRef.current ? 0 : volumeRef.current,
        onload: () => {
          audioCache.set(src, howl);
          loadingPromises.delete(src);
          resolve(howl);
        },
        onloaderror: (_id, error) => {
          failedPaths.add(src);
          loadingPromises.delete(src);
          logAudioError(src, String(error));
          reject(new Error(`Failed to load: ${src}`));
        },
      });
    });

    loadingPromises.set(src, loadPromise);

    try {
      return await loadPromise;
    } catch {
      return null;
    }
  }, []); // Now stable - doesn't depend on volume/isMuted

  /**
   * Play audio with error handling and cancellation support
   */
  const playAudio = useCallback(async (
    src: string,
    onEnd?: () => void,
    onError?: (error: Error) => void
  ): Promise<boolean> => {
    // Don't play if muted (use ref for stable callback)
    if (isMutedRef.current) {
      onEnd?.();
      return false;
    }

    const howl = await getHowl(src);

    if (!howl || isUnmounted.current) {
      onEnd?.();
      return false;
    }

    // Stop previous audio
    if (currentlyPlaying.current) {
      currentlyPlaying.current.stop();
    }

    currentlyPlaying.current = howl;

    return new Promise((resolve) => {
      const endHandler = () => {
        if (!isUnmounted.current) {
          onEnd?.();
        }
        currentlyPlaying.current = null;
        resolve(true);
      };

      const errorHandler = (_id: number, error: unknown) => {
        if (!isUnmounted.current) {
          onError?.(new Error(String(error)));
          onEnd?.();
        }
        currentlyPlaying.current = null;
        resolve(false);
      };

      howl.once("end", endHandler);
      howl.once("loaderror", errorHandler);
      howl.once("playerror", errorHandler);
      howl.play();
    });
  }, [getHowl]); // Stable - no longer depends on isMuted

  /**
   * Build audio path based on type
   */
  const getAudioPath = useCallback((type: AudioType, value: string): string => {
    const valueLower = value.toLowerCase();
    switch (type) {
      case "letter-phonics":
        return `/audio/letters/${valueLower}-phonics.mp3`;
      case "letter-name":
        return `/audio/letters/${valueLower}-name.mp3`;
      case "letter-example":
        return `/audio/letters/${valueLower}-example.mp3`;
      case "word":
        return `/audio/words/${valueLower}.mp3`;
      case "sentence":
        return `/audio/sentences/${valueLower}.mp3`;
      case "phoneme":
        return `/audio/phonemes/${valueLower}.mp3`;
      default:
        return `/audio/words/${valueLower}.mp3`;
    }
  }, []);

  /**
   * Play a letter sound
   */
  const playLetterSound = useCallback(async (
    letter: string,
    type: "phonics" | "name" | "example",
    onEnd?: () => void
  ) => {
    const audioType: AudioType = `letter-${type}` as AudioType;
    const path = getAudioPath(audioType, letter);
    return playAudio(path, onEnd);
  }, [getAudioPath, playAudio]);

  /**
   * Play a word sound
   */
  const playWordSound = useCallback(async (
    word: string,
    onEnd?: () => void
  ) => {
    const path = getAudioPath("word", word);
    return playAudio(path, onEnd);
  }, [getAudioPath, playAudio]);

  /**
   * Play a sentence sound
   */
  const playSentenceSound = useCallback(async (
    word: string,
    onEnd?: () => void
  ) => {
    const path = getAudioPath("sentence", word);
    return playAudio(path, onEnd);
  }, [getAudioPath, playAudio]);

  /**
   * Play a phoneme sound
   */
  const playPhonemeSound = useCallback(async (
    phoneme: string,
    onEnd?: () => void
  ) => {
    const path = getAudioPath("phoneme", phoneme);
    return playAudio(path, onEnd);
  }, [getAudioPath, playAudio]);

  /**
   * Play a phoneme with TTS fallback for missing audio files
   * Uses pre-recorded audio when available, falls back to TTS pronunciation
   */
  const playPhonemeWithFallback = useCallback(async (
    phoneme: string,
    onEnd?: () => void
  ): Promise<boolean> => {
    const path = getAudioPath("phoneme", phoneme);

    // First try the audio file
    if (!failedPaths.has(path)) {
      const success = await playAudio(path, onEnd);
      if (success) return true;
    }

    // Fall back to TTS with phonetic pronunciation
    // Map phoneme to a pronounceable representation
    const phonemeMap: Record<string, string> = {
      // Vowels - use short/long vowel sounds
      a: "ah",
      e: "eh",
      i: "ih",
      o: "oh",
      u: "uh",
      // Consonants - just the sound
      b: "buh",
      c: "kuh",
      d: "duh",
      f: "fff",
      g: "guh",
      h: "huh",
      j: "juh",
      k: "kuh",
      l: "lll",
      m: "mmm",
      n: "nnn",
      p: "puh",
      q: "kwuh",
      r: "rrr",
      s: "sss",
      t: "tuh",
      v: "vvv",
      w: "wuh",
      x: "ks",
      y: "yuh",
      z: "zzz",
      // Digraphs
      sh: "shh",
      ch: "chh",
      th: "thh",
      wh: "wh",
      ph: "fff",
      // Common blends
      bl: "bl",
      cl: "cl",
      fl: "fl",
      gl: "gl",
      pl: "pl",
      sl: "sl",
      br: "br",
      cr: "cr",
      dr: "dr",
      fr: "fr",
      gr: "gr",
      pr: "pr",
      tr: "tr",
    };

    const pronunciation = phonemeMap[phoneme.toLowerCase()] || phoneme;

    // Use browser TTS with settings optimized for phoneme pronunciation
    if (typeof window !== "undefined" && window.speechSynthesis) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(pronunciation);
        utterance.rate = 0.6; // Very slow for clear phoneme
        utterance.pitch = 1.0;
        utterance.volume = isMutedRef.current ? 0 : volumeRef.current;

        utterance.onend = () => {
          onEnd?.();
          resolve(true);
        };

        utterance.onerror = () => {
          onEnd?.();
          resolve(false);
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      });
    }

    onEnd?.();
    return false;
  }, [getAudioPath, playAudio]);

  /**
   * Stop all currently playing sounds
   */
  const stopAll = useCallback(() => {
    if (currentlyPlaying.current) {
      currentlyPlaying.current.stop();
      currentlyPlaying.current = null;
    }
    Howler.stop();
  }, []);

  /**
   * Preload audio files for better performance
   */
  const preload = useCallback(async (paths: string[]): Promise<void> => {
    const promises = paths.map((path) => getHowl(path).catch(() => null));
    await Promise.all(promises);
  }, [getHowl]);

  /**
   * Preload common audio for a specific activity
   */
  const preloadForActivity = useCallback(async (activity: "phonics" | "words" | "blending") => {
    const paths: string[] = [];

    switch (activity) {
      case "phonics":
        // Preload first 5 letters
        ["a", "b", "c", "d", "e"].forEach((letter) => {
          paths.push(`/audio/letters/${letter}-phonics.mp3`);
          paths.push(`/audio/letters/${letter}-name.mp3`);
        });
        break;
      case "words":
        // Preload common first words
        ["cat", "dog", "sun", "hat", "bed"].forEach((word) => {
          paths.push(`/audio/words/${word}.mp3`);
        });
        break;
      case "blending":
        // Preload common phonemes
        ["c", "a", "t", "d", "o", "g"].forEach((phoneme) => {
          paths.push(`/audio/phonemes/${phoneme}.mp3`);
        });
        break;
    }

    await preload(paths);
  }, [preload]);

  /**
   * Play a sequence of sounds with delays
   */
  const playSequence = useCallback(async (
    sounds: Array<{ type: AudioType; value: string }>,
    delayMs: number = 800
  ): Promise<boolean> => {
    for (const sound of sounds) {
      if (isUnmounted.current) return false;

      const path = getAudioPath(sound.type, sound.value);
      const success = await playAudio(path);

      if (!success && failedPaths.has(path)) {
        // Skip failed audio but continue sequence
        continue;
      }

      // Delay between sounds
      if (delayMs > 0 && !isUnmounted.current) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    return true;
  }, [getAudioPath, playAudio]);

  /**
   * Request service worker to cache audio files
   */
  const cacheAudioFiles = useCallback((urls: string[]) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_AUDIO",
        urls,
      });
    }
  }, []);

  /**
   * Get audio loading errors for debugging
   */
  const getErrors = useCallback(() => [...audioErrors], []);

  /**
   * Check if audio is currently playing
   */
  const isPlaying = useCallback(() => {
    return currentlyPlaying.current?.playing() ?? false;
  }, []);

  return {
    playLetterSound,
    playWordSound,
    playSentenceSound,
    playPhonemeSound,
    playPhonemeWithFallback,
    playSequence,
    playAudio,
    stopAll,
    preload,
    preloadForActivity,
    cacheAudioFiles,
    getErrors,
    isPlaying,
  };
}

// Volume control component helper
export function useVolumeControl() {
  const { volume, isMuted, setVolume, setMuted, toggleMute } = useAudioSettings();

  return {
    volume,
    isMuted,
    setVolume,
    setMuted,
    toggleMute,
  };
}

/**
 * Text-to-speech hook for narration
 * Uses browser's built-in speechSynthesis API
 */
export function useSpeech() {
  const { volume, isMuted } = useAudioSettings();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isUnmounted = useRef(false);

  useEffect(() => {
    isUnmounted.current = false;
    return () => {
      isUnmounted.current = true;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Speak text using TTS
   */
  const speak = useCallback(
    (
      text: string,
      options?: {
        rate?: number;
        pitch?: number;
        onEnd?: () => void;
        onWord?: (wordIndex: number) => void;
      }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
          options?.onEnd?.();
          resolve(false);
          return;
        }

        if (isMuted) {
          options?.onEnd?.();
          resolve(false);
          return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = volume;
        utterance.rate = options?.rate ?? 0.8; // Slower for toddlers
        utterance.pitch = options?.pitch ?? 1.1; // Slightly higher pitch

        // Track word boundaries
        let wordIndex = 0;
        utterance.onboundary = (event) => {
          if (event.name === "word" && !isUnmounted.current) {
            options?.onWord?.(wordIndex);
            wordIndex++;
          }
        };

        utterance.onend = () => {
          if (!isUnmounted.current) {
            options?.onEnd?.();
          }
          resolve(true);
        };

        utterance.onerror = () => {
          if (!isUnmounted.current) {
            options?.onEnd?.();
          }
          resolve(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      });
    },
    [volume, isMuted]
  );

  /**
   * Speak words one at a time with callbacks
   */
  const speakWords = useCallback(
    async (
      words: string[],
      onWordStart?: (index: number) => void,
      onComplete?: () => void,
      delayMs: number = 100
    ): Promise<void> => {
      for (let i = 0; i < words.length; i++) {
        if (isUnmounted.current) break;

        onWordStart?.(i);
        await speak(words[i], { rate: 0.75 });

        // Small delay between words
        if (i < words.length - 1 && delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
      onComplete?.();
    },
    [speak]
  );

  /**
   * Stop speech
   */
  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  /**
   * Check if speech synthesis is supported
   */
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return {
    speak,
    speakWords,
    stop,
    isSupported,
  };
}

/**
 * Unified Audio System Hook
 * Combines file playback (Howler.js) and text-to-speech (Web Speech API)
 * into a single, easy-to-use API with unified volume control.
 */
export function useAudioSystem() {
  const audio = useAudio();
  const speech = useSpeech();
  const { volume, isMuted, setVolume, toggleMute } = useAudioSettings();
  const isUnmounted = useRef(false);

  useEffect(() => {
    isUnmounted.current = false;
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  /**
   * Stop all audio (both file playback and TTS)
   */
  const stopAll = useCallback(() => {
    audio.stopAll();
    speech.stop();
  }, [audio, speech]);

  /**
   * Speak text using TTS with unified volume
   * Shorthand for speech.speak with simpler API
   */
  const speak = useCallback(
    async (
      text: string,
      options?: {
        rate?: number;
        pitch?: number;
        onEnd?: () => void;
      }
    ): Promise<boolean> => {
      return speech.speak(text, options);
    },
    [speech]
  );

  /**
   * Play audio file
   * Shorthand for audio.playAudio
   */
  const playFile = useCallback(
    async (
      src: string,
      onEnd?: () => void
    ): Promise<boolean> => {
      return audio.playAudio(src, onEnd);
    },
    [audio]
  );

  /**
   * Auto-detect and play: if path starts with "/" it's a file, otherwise use TTS
   * Convenience method for simple use cases
   */
  const play = useCallback(
    async (
      input: string,
      options?: {
        type?: "file" | "tts" | "auto";
        onEnd?: () => void;
        rate?: number;
      }
    ): Promise<boolean> => {
      const type = options?.type ?? "auto";
      const isFile = type === "file" || (type === "auto" && input.startsWith("/"));

      if (isFile) {
        return audio.playAudio(input, options?.onEnd);
      } else {
        return speech.speak(input, {
          rate: options?.rate ?? 0.8,
          onEnd: options?.onEnd
        });
      }
    },
    [audio, speech]
  );

  return {
    // Unified controls
    play,
    playFile,
    speak,
    stopAll,

    // Volume control (affects both systems)
    volume,
    isMuted,
    setVolume,
    toggleMute,

    // File playback (Howler.js)
    playLetterSound: audio.playLetterSound,
    playWordSound: audio.playWordSound,
    playSentenceSound: audio.playSentenceSound,
    playPhonemeSound: audio.playPhonemeSound,
    playPhonemeWithFallback: audio.playPhonemeWithFallback,
    playSequence: audio.playSequence,
    playAudio: audio.playAudio,
    preload: audio.preload,
    preloadForActivity: audio.preloadForActivity,
    cacheAudioFiles: audio.cacheAudioFiles,
    isPlaying: audio.isPlaying,
    getErrors: audio.getErrors,

    // Text-to-speech (Web Speech API)
    speakWords: speech.speakWords,
    stopSpeech: speech.stop,
    isTTSSupported: speech.isSupported,
  };
}
