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
    const loadPromise = new Promise<Howl>((resolve, reject) => {
      const howl = new Howl({
        src: [src],
        html5: true,
        preload: true,
        volume: isMuted ? 0 : volume,
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
  }, [volume, isMuted]);

  /**
   * Play audio with error handling and cancellation support
   */
  const playAudio = useCallback(async (
    src: string,
    onEnd?: () => void,
    onError?: (error: Error) => void
  ): Promise<boolean> => {
    // Don't play if muted
    if (isMuted) {
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
  }, [getHowl, isMuted]);

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
