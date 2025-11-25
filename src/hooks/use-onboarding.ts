"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingStep =
  | "welcome"
  | "parent-setup"
  | "child-intro"
  | "guided-lesson"
  | "complete";

export interface ChildProfile {
  name: string;
  age: number;
  avatarEmoji: string;
}

export interface ParentPreferences {
  dailyGoalMinutes: number;
  enableSoundEffects: boolean;
  enableBackgroundMusic: boolean;
  enableProgressNotifications: boolean;
  parentEmail?: string;
}

interface OnboardingState {
  // Onboarding progress
  isOnboardingComplete: boolean;
  currentStep: OnboardingStep;
  hasSeenWelcome: boolean;

  // Child profile data
  childProfile: ChildProfile | null;

  // Parent preferences
  parentPreferences: ParentPreferences;

  // Guided lesson progress
  guidedLessonProgress: {
    hasCompletedLetterDemo: boolean;
    hasCompletedSoundDemo: boolean;
    hasCompletedWordDemo: boolean;
  };

  // Actions
  setCurrentStep: (step: OnboardingStep) => void;
  setChildProfile: (profile: ChildProfile) => void;
  updateChildProfile: (updates: Partial<ChildProfile>) => void;
  setParentPreferences: (prefs: Partial<ParentPreferences>) => void;
  completeGuidedLessonStep: (step: keyof OnboardingState["guidedLessonProgress"]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  skipOnboarding: () => void;
}

const DEFAULT_PARENT_PREFERENCES: ParentPreferences = {
  dailyGoalMinutes: 15,
  enableSoundEffects: true,
  enableBackgroundMusic: true,
  enableProgressNotifications: true,
};

const DEFAULT_GUIDED_PROGRESS = {
  hasCompletedLetterDemo: false,
  hasCompletedSoundDemo: false,
  hasCompletedWordDemo: false,
};

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnboardingComplete: false,
      currentStep: "welcome",
      hasSeenWelcome: false,
      childProfile: null,
      parentPreferences: DEFAULT_PARENT_PREFERENCES,
      guidedLessonProgress: DEFAULT_GUIDED_PROGRESS,

      // Actions
      setCurrentStep: (step) => {
        set({ currentStep: step });
        if (step === "welcome") {
          set({ hasSeenWelcome: true });
        }
      },

      setChildProfile: (profile) => {
        set({ childProfile: profile });
      },

      updateChildProfile: (updates) => {
        const current = get().childProfile;
        if (current) {
          set({ childProfile: { ...current, ...updates } });
        }
      },

      setParentPreferences: (prefs) => {
        set((state) => ({
          parentPreferences: { ...state.parentPreferences, ...prefs },
        }));
      },

      completeGuidedLessonStep: (step) => {
        set((state) => ({
          guidedLessonProgress: {
            ...state.guidedLessonProgress,
            [step]: true,
          },
        }));
      },

      completeOnboarding: () => {
        set({
          isOnboardingComplete: true,
          currentStep: "complete",
        });
      },

      resetOnboarding: () => {
        set({
          isOnboardingComplete: false,
          currentStep: "welcome",
          hasSeenWelcome: false,
          childProfile: null,
          parentPreferences: DEFAULT_PARENT_PREFERENCES,
          guidedLessonProgress: DEFAULT_GUIDED_PROGRESS,
        });
      },

      skipOnboarding: () => {
        // Allow skipping but mark as seen
        set({
          isOnboardingComplete: true,
          currentStep: "complete",
          hasSeenWelcome: true,
        });
      },
    }),
    {
      name: "little-learner-onboarding",
      version: 1,
    }
  )
);

// Helper hooks for specific onboarding data
export function useChildName(): string {
  const childProfile = useOnboarding((state) => state.childProfile);
  return childProfile?.name || "Little Learner";
}

export function useChildAge(): number | null {
  const childProfile = useOnboarding((state) => state.childProfile);
  return childProfile?.age ?? null;
}

export function useIsFirstVisit(): boolean {
  const { isOnboardingComplete, hasSeenWelcome } = useOnboarding();
  return !isOnboardingComplete && !hasSeenWelcome;
}

// Avatar emoji options for children
export const AVATAR_EMOJIS = [
  "🦁", // Lion
  "🐻", // Bear
  "🐰", // Bunny
  "🦊", // Fox
  "🐼", // Panda
  "🐨", // Koala
  "🦋", // Butterfly
  "🐬", // Dolphin
  "🦄", // Unicorn
  "🐸", // Frog
  "🐯", // Tiger
  "🐶", // Dog
] as const;

// Age options (2-5 years old)
export const AGE_OPTIONS = [
  { value: 2, label: "2 years old", emoji: "✌️" },
  { value: 3, label: "3 years old", emoji: "🤟" },
  { value: 4, label: "4 years old", emoji: "🖖" },
  { value: 5, label: "5 years old", emoji: "🖐️" },
] as const;

// Daily goal options
export const DAILY_GOAL_OPTIONS = [
  { value: 5, label: "5 minutes", description: "Quick session" },
  { value: 10, label: "10 minutes", description: "Regular practice" },
  { value: 15, label: "15 minutes", description: "Recommended" },
  { value: 20, label: "20 minutes", description: "Extended learning" },
] as const;
