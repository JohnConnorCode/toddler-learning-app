"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PhonicsState {
    mode: "letter-names" | "phonics";
    toggleMode: () => void;
    setMode: (mode: "letter-names" | "phonics") => void;
}

export const usePhonicsStore = create<PhonicsState>()(
    persist(
        (set) => ({
            mode: "phonics", // Default to phonics as it's best practice
            toggleMode: () => set((state) => ({ mode: state.mode === "phonics" ? "letter-names" : "phonics" })),
            setMode: (mode) => set({ mode }),
        }),
        {
            name: "phonics-storage",
        }
    )
);

// Helper to get the sound to play based on mode
export function getLetterSound(letter: string, phoneticSound: string, mode: "letter-names" | "phonics") {
    return mode === "phonics" ? phoneticSound : letter;
}
