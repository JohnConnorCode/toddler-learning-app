"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LetterOrder = "alphabetical" | "phonics-first";
export type WordDifficulty = "easy" | "medium" | "hard";

export type Settings = {
    // Letter Learning
    letterOrder: LetterOrder;

    // Audio
    isMuted: boolean;
    volume: number; // 0-1

    // Gameplay
    autoAdvance: boolean;
    showHints: boolean;
    wordDifficulty: WordDifficulty;
    showWordFamilies: boolean;
    delayBetweenWords: number; // milliseconds

    // Progression
    lockProgression: boolean; // NEW: Control whether units/activities are locked

    // Accessibility
    autoPlaySuccess: boolean;
};

type SettingsStore = Settings & {
    setLetterOrder: (order: LetterOrder) => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    toggleAutoAdvance: () => void;
    toggleShowHints: () => void;
    setWordDifficulty: (difficulty: WordDifficulty) => void;
    toggleShowWordFamilies: () => void;
    setDelayBetweenWords: (delay: number) => void;
    toggleLockProgression: () => void;
    toggleAutoPlaySuccess: () => void;
    resetSettings: () => void;
};

const defaultSettings: Settings = {
    letterOrder: "alphabetical",
    isMuted: false,
    volume: 1.0,
    autoAdvance: true,
    showHints: true,
    wordDifficulty: "easy",
    showWordFamilies: false,
    delayBetweenWords: 3000,
    lockProgression: false, // Default: All units unlocked for parent control
    autoPlaySuccess: true,
};

export const useSettings = create<SettingsStore>()(
    persist(
        (set) => ({
            ...defaultSettings,

            setLetterOrder: (order) => set({ letterOrder: order }),

            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

            setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

            toggleAutoAdvance: () => set((state) => ({ autoAdvance: !state.autoAdvance })),

            toggleShowHints: () => set((state) => ({ showHints: !state.showHints })),

            setWordDifficulty: (difficulty) => set({ wordDifficulty: difficulty }),

            toggleShowWordFamilies: () => set((state) => ({ showWordFamilies: !state.showWordFamilies })),

            setDelayBetweenWords: (delay) => set({ delayBetweenWords: Math.max(1000, Math.min(10000, delay)) }),

            toggleLockProgression: () => set((state) => ({ lockProgression: !state.lockProgression })),

            toggleAutoPlaySuccess: () => set((state) => ({ autoPlaySuccess: !state.autoPlaySuccess })),

            resetSettings: () => set(defaultSettings),
        }),
        {
            name: "toddler-learning-settings",
        }
    )
);

// Define phonics-first letter order (research-backed optimal sequence)
export const PHONICS_FIRST_ORDER = [
    // Set 1: Most common, easiest to blend (CVC words: sat, pin, tap)
    "s", "a", "t", "p", "i", "n",
    // Set 2: Common consonants and vowels
    "m", "d", "g", "o", "c", "k",
    // Set 3: More consonants
    "e", "u", "r", "h", "b", "f", "l",
    // Set 4: Less common
    "j", "v", "w", "x", "y", "z", "q",
];

export const ALPHABETICAL_ORDER = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
];
