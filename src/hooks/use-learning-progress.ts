"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  LetterMasteryData,
  MasteryLevel,
  ActivityReadiness,
  LearningRecommendation,
  calculateMasteryLevel,
  calculateNextReviewDate,
  getLettersDueForReview,
  calculateActivityReadiness,
  getLearningRecommendations,
  sortWordsByDecodability,
  calculateLearningProgress,
  generateLetterPracticeSession,
  DailyReviewItem,
} from "@/lib/learning-engine";

// ============ STORE TYPES ============

interface LearningProgressState {
  // Letter mastery data
  letterMastery: Record<string, LetterMasteryData>;

  // Completed phonics units
  completedUnits: number[];

  // Current unit being worked on
  currentUnitId: number | null;

  // Session state
  lastPracticeDate: string | null;
  practiceStreak: number;

  // Hydration state
  _hasHydrated: boolean;
}

interface LearningProgressActions {
  // Core actions
  recordLetterPractice: (letter: string, correct: boolean) => void;
  markUnitComplete: (unitId: number) => void;
  setCurrentUnit: (unitId: number | null) => void;

  // Getters
  getLetterMastery: (letter: string) => LetterMasteryData;
  getMasteredLetters: () => string[];
  getActivityReadiness: (activity: string) => ActivityReadiness;
  getRecommendations: () => LearningRecommendation[];
  getReviewItems: () => DailyReviewItem[];
  getLearningStats: () => ReturnType<typeof calculateLearningProgress>;

  // Word helpers
  sortWordsByDecodability: <T extends { word: string }>(words: T[]) => T[];

  // Practice session
  startPracticeSession: (letter: string) => ReturnType<typeof generateLetterPracticeSession>;

  // Utility
  reset: () => void;
  setHasHydrated: (state: boolean) => void;
}

type LearningProgressStore = LearningProgressState & LearningProgressActions;

// ============ DEFAULT STATE ============

const DEFAULT_STATE: LearningProgressState = {
  letterMastery: {},
  completedUnits: [],
  currentUnitId: 1,
  lastPracticeDate: null,
  practiceStreak: 0,
  _hasHydrated: false,
};

// ============ HELPER FUNCTIONS ============

function createDefaultLetterMastery(letter: string): LetterMasteryData {
  return {
    letter: letter.toUpperCase(),
    exposures: 0,
    correctAnswers: 0,
    lastPracticed: null,
    lastAccuracy: 0,
    masteryLevel: "not-started",
    nextReviewDate: null,
    practiceHistory: [],
  };
}

function updatePracticeStreak(
  lastPracticeDate: string | null,
  currentStreak: number
): { newStreak: number; newLastDate: string } {
  const today = new Date().toISOString().split("T")[0];

  if (!lastPracticeDate) {
    return { newStreak: 1, newLastDate: today };
  }

  const lastDate = lastPracticeDate.split("T")[0];

  if (lastDate === today) {
    // Same day, no streak change
    return { newStreak: currentStreak, newLastDate: lastPracticeDate };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayStr) {
    // Consecutive day, increment streak
    return { newStreak: currentStreak + 1, newLastDate: today };
  }

  // Streak broken, reset to 1
  return { newStreak: 1, newLastDate: today };
}

// ============ STORE IMPLEMENTATION ============

export const useLearningProgress = create<LearningProgressStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      // Core actions
      recordLetterPractice: (letter: string, correct: boolean) => {
        const upperLetter = letter.toUpperCase();
        const now = new Date().toISOString();

        set((state) => {
          const currentMastery = state.letterMastery[upperLetter] ||
            createDefaultLetterMastery(upperLetter);

          const newExposures = currentMastery.exposures + 1;
          const newCorrect = currentMastery.correctAnswers + (correct ? 1 : 0);
          const accuracy = newExposures > 0 ? newCorrect / newExposures : 0;

          // Calculate new mastery level
          const updatedMastery: LetterMasteryData = {
            ...currentMastery,
            exposures: newExposures,
            correctAnswers: newCorrect,
            lastPracticed: now,
            lastAccuracy: accuracy,
            masteryLevel: "not-started", // Will be recalculated
            practiceHistory: [
              ...currentMastery.practiceHistory.slice(-19), // Keep last 20 sessions
              {
                date: now,
                correct: correct ? 1 : 0,
                total: 1,
                accuracy: correct ? 100 : 0,
              },
            ],
          };

          // Calculate mastery level
          updatedMastery.masteryLevel = calculateMasteryLevel(updatedMastery);

          // Calculate next review date if progressing
          if (updatedMastery.masteryLevel === "mastered" ||
              updatedMastery.masteryLevel === "developing") {
            const consecutiveCorrect = updatedMastery.practiceHistory
              .slice(-5)
              .filter((s) => s.accuracy >= 80).length;
            const nextReview = calculateNextReviewDate(
              updatedMastery.masteryLevel,
              consecutiveCorrect
            );
            updatedMastery.nextReviewDate = nextReview.toISOString();
          }

          // Update practice streak
          const { newStreak, newLastDate } = updatePracticeStreak(
            state.lastPracticeDate,
            state.practiceStreak
          );

          return {
            ...state,
            letterMastery: {
              ...state.letterMastery,
              [upperLetter]: updatedMastery,
            },
            lastPracticeDate: newLastDate,
            practiceStreak: newStreak,
          };
        });
      },

      markUnitComplete: (unitId: number) => {
        set((state) => ({
          ...state,
          completedUnits: state.completedUnits.includes(unitId)
            ? state.completedUnits
            : [...state.completedUnits, unitId],
        }));
      },

      setCurrentUnit: (unitId: number | null) => {
        set((state) => ({ ...state, currentUnitId: unitId }));
      },

      // Getters
      getLetterMastery: (letter: string): LetterMasteryData => {
        const state = get();
        const upperLetter = letter.toUpperCase();
        return (
          state.letterMastery[upperLetter] ||
          createDefaultLetterMastery(upperLetter)
        );
      },

      getMasteredLetters: (): string[] => {
        const state = get();
        return Object.entries(state.letterMastery)
          .filter(
            ([, data]) =>
              data.masteryLevel === "mastered" ||
              data.masteryLevel === "developing"
          )
          .map(([letter]) => letter);
      },

      getActivityReadiness: (activity: string): ActivityReadiness => {
        const state = get();
        return calculateActivityReadiness(
          activity,
          state.letterMastery,
          state.completedUnits
        );
      },

      getRecommendations: (): LearningRecommendation[] => {
        const state = get();
        return getLearningRecommendations(
          state.letterMastery,
          state.completedUnits,
          state.currentUnitId
        );
      },

      getReviewItems: (): DailyReviewItem[] => {
        const state = get();
        return getLettersDueForReview(state.letterMastery);
      },

      getLearningStats: () => {
        const state = get();
        return calculateLearningProgress(state.letterMastery);
      },

      // Word helpers
      sortWordsByDecodability: <T extends { word: string }>(words: T[]): T[] => {
        const state = get();
        const masteredLetters = Object.entries(state.letterMastery)
          .filter(
            ([, data]) =>
              data.masteryLevel === "mastered" ||
              data.masteryLevel === "developing"
          )
          .map(([letter]) => letter);
        return sortWordsByDecodability(words, masteredLetters);
      },

      // Practice session
      startPracticeSession: (letter: string) => {
        const state = get();
        const upperLetter = letter.toUpperCase();
        const currentMastery = state.letterMastery[upperLetter];
        return generateLetterPracticeSession(
          upperLetter,
          currentMastery,
          state.letterMastery
        );
      },

      // Utility
      reset: () => {
        set({ ...DEFAULT_STATE, _hasHydrated: true });
      },

      setHasHydrated: (hydrated: boolean) => {
        set({ _hasHydrated: hydrated });
      },
    }),
    {
      name: "learning-progress-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Hydration hook
export const useLearningProgressHydrated = () =>
  useLearningProgress((state) => state._hasHydrated);
