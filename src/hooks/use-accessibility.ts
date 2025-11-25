"use client";

import { useEffect, useState, useCallback } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccessibilityState {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  audioDescriptions: boolean;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
  setAudioDescriptions: (value: boolean) => void;
}

const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      audioDescriptions: true,
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setHighContrast: (value) => set({ highContrast: value }),
      setLargeText: (value) => set({ largeText: value }),
      setAudioDescriptions: (value) => set({ audioDescriptions: value }),
    }),
    {
      name: "accessibility-storage",
    }
  )
);

export function useAccessibility() {
  const store = useAccessibilityStore();
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  // Detect system preference for reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Detect system high contrast preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    if (mediaQuery.matches && !store.highContrast) {
      store.setHighContrast(true);
    }
  }, [store]);

  // Check if reduced motion is active (either system or user preference)
  const shouldReduceMotion = store.reducedMotion || systemReducedMotion;

  // Helper to announce messages to screen readers
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (typeof window === "undefined") return;

    const announcer = document.getElementById(`aria-live-${priority}`);
    if (announcer) {
      announcer.textContent = "";
      // Small delay to ensure screen reader picks up the change
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }, []);

  return {
    ...store,
    shouldReduceMotion,
    systemReducedMotion,
    announce,
  };
}

// Motion variants for Framer Motion that respect reduced motion
export const safeMotionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  // Reduced motion safe alternatives
  reducedFadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

// Get motion props based on accessibility settings
export function getMotionProps(shouldReduceMotion: boolean) {
  return {
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring", stiffness: 200, damping: 20 },
  };
}
