"use client";

import { useCallback } from "react";
import { Howl } from "howler";

// Cache for Howl instances to avoid recreating them
const audioCache = new Map<string, Howl>();

// Preload commonly used sounds
const preloadSounds = [
    '/audio/letters/a-phonics.mp3',
    '/audio/letters/b-phonics.mp3',
    '/audio/letters/c-phonics.mp3',
];

type AudioType = "letter-phonics" | "letter-name" | "letter-example" | "word" | "sentence";

export function useAudio() {
    /**
     * Get or create a Howl instance for a given audio file
     */
    const getHowl = useCallback((src: string): Howl => {
        if (audioCache.has(src)) {
            return audioCache.get(src)!;
        }

        const howl = new Howl({
            src: [src],
            html5: true, // Use HTML5 audio for better compatibility
            preload: preloadSounds.includes(src),
            volume: 1.0,
            onloaderror: (id, error) => {
                console.error(`Failed to load audio: ${src}`, error);
            },
        });

        audioCache.set(src, howl);
        return howl;
    }, []);

    /**
     * Play a letter sound
     */
    const playLetterSound = useCallback((
        letter: string,
        type: "phonics" | "name" | "example",
        onEnd?: () => void
    ) => {
        const letterLower = letter.toLowerCase();
        const audioPath = `/audio/letters/${letterLower}-${type}.mp3`;

        const howl = getHowl(audioPath);

        if (onEnd) {
            howl.once('end', onEnd);
        }

        howl.play();
    }, [getHowl]);

    /**
     * Play a word sound
     */
    const playWordSound = useCallback((
        word: string,
        onEnd?: () => void
    ) => {
        const wordLower = word.toLowerCase();
        const audioPath = `/audio/words/${wordLower}.mp3`;

        const howl = getHowl(audioPath);

        if (onEnd) {
            howl.once('end', onEnd);
        }

        howl.play();
    }, [getHowl]);

    /**
     * Play a sentence sound
     */
    const playSentenceSound = useCallback((
        word: string,
        onEnd?: () => void
    ) => {
        const wordLower = word.toLowerCase();
        const audioPath = `/audio/sentences/${wordLower}.mp3`;

        const howl = getHowl(audioPath);

        if (onEnd) {
            howl.once('end', onEnd);
        }

        howl.play();
    }, [getHowl]);

    /**
     * Stop all currently playing sounds
     */
    const stopAll = useCallback(() => {
        audioCache.forEach(howl => {
            howl.stop();
        });
    }, []);

    /**
     * Preload audio files for better performance
     */
    const preload = useCallback((paths: string[]) => {
        paths.forEach(path => {
            if (!audioCache.has(path)) {
                getHowl(path);
            }
        });
    }, [getHowl]);

    /**
     * Play a sequence of sounds with delays
     */
    const playSequence = useCallback(async (
        sounds: Array<{ type: AudioType; value: string }>,
        delayMs: number = 800
    ) => {
        for (const sound of sounds) {
            await new Promise<void>((resolve) => {
                switch (sound.type) {
                    case "letter-phonics":
                        playLetterSound(sound.value, "phonics", resolve);
                        break;
                    case "letter-name":
                        playLetterSound(sound.value, "name", resolve);
                        break;
                    case "letter-example":
                        playLetterSound(sound.value, "example", resolve);
                        break;
                    case "word":
                        playWordSound(sound.value, resolve);
                        break;
                    case "sentence":
                        playSentenceSound(sound.value, resolve);
                        break;
                }
            });

            // Delay between sounds
            if (delayMs > 0) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }, [playLetterSound, playWordSound, playSentenceSound]);

    return {
        playLetterSound,
        playWordSound,
        playSentenceSound,
        playSequence,
        stopAll,
        preload,
    };
}
