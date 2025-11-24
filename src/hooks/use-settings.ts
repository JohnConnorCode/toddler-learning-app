"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LetterOrder = "alphabetical" | "phonics-first";

export type Settings = {
    letterOrder: LetterOrder;
    isMuted: boolean;
    volume: number; // 0-1
    autoAdvance: boolean;
    showHints: boolean;
};

type SettingsStore = Settings & {
    setLetterOrder: (order: LetterOrder) => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    toggleAutoAdvance: () => void;
    toggleShowHints: () => void;
    resetSettings: () => void;
};

const defaultSettings: Settings = {
    letterOrder: "alphabetical",
    isMuted: false,
    volume: 1.0,
    autoAdvance: true,
    showHints: true,
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
