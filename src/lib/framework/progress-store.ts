/**
 * Generic Progress Store Factory
 *
 * Creates Zustand stores for tracking learning progress across any subject.
 * Eliminates duplicate progress tracking code between subjects.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  SubjectId,
  ItemProgress,
  UnitProgress,
  LessonProgress,
  SubjectProgress,
  ActivityResult,
  MasteryConfig,
  DifficultyLevel,
} from './types';
import {
  calculateMastery,
  calculateXP,
  calculateStars,
  DEFAULT_MASTERY_CONFIG,
} from './types';

// ============================================
// STORE STATE INTERFACE
// ============================================

export interface ProgressState {
  /** Progress data per subject */
  subjects: Record<SubjectId, SubjectProgress>;

  /** Global stats */
  totalXP: number;
  currentLevel: number;
  overallStreak: number;
  lastActivityDate: string | null;

  /** Actions */
  initializeSubject: (subjectId: SubjectId) => void;
  recordItemAttempt: (
    subjectId: SubjectId,
    itemId: string,
    isCorrect: boolean,
    config?: Partial<MasteryConfig>
  ) => ItemProgress;
  completeActivity: (result: ActivityResult) => void;
  completeLesson: (
    subjectId: SubjectId,
    lessonId: string,
    score: number,
    unitId?: string
  ) => LessonProgress;
  unlockUnit: (subjectId: SubjectId, unitId: string) => void;
  completeUnit: (subjectId: SubjectId, unitId: string) => void;

  /** Getters */
  getItemProgress: (subjectId: SubjectId, itemId: string) => ItemProgress | null;
  getUnitProgress: (subjectId: SubjectId, unitId: string) => UnitProgress | null;
  getLessonProgress: (subjectId: SubjectId, lessonId: string) => LessonProgress | null;
  getSubjectProgress: (subjectId: SubjectId) => SubjectProgress | null;
  getItemMastery: (subjectId: SubjectId, itemId: string) => number;
  isItemCompleted: (subjectId: SubjectId, itemId: string, threshold?: number) => boolean;
  isUnitUnlocked: (subjectId: SubjectId, unitId: string) => boolean;
  isLessonCompleted: (subjectId: SubjectId, lessonId: string) => boolean;

  /** Streak management */
  updateStreak: () => void;
  getStreakDays: () => number;

  /** Reset */
  resetSubjectProgress: (subjectId: SubjectId) => void;
  resetAllProgress: () => void;
}

// ============================================
// INITIAL STATE HELPERS
// ============================================

function createEmptySubjectProgress(subjectId: SubjectId): SubjectProgress {
  return {
    subjectId,
    itemProgress: {},
    unitProgress: {},
    lessonProgress: {},
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    startedAt: new Date().toISOString(),
  };
}

function createEmptyItemProgress(
  subjectId: SubjectId,
  itemId: string
): ItemProgress {
  return {
    itemId,
    subjectId,
    attempts: 0,
    correctAttempts: 0,
    mastery: 0,
    timeSpent: 0,
    streakCount: 0,
  };
}

function createEmptyUnitProgress(
  subjectId: SubjectId,
  unitId: string
): UnitProgress {
  return {
    unitId,
    subjectId,
    unlocked: false,
    started: false,
    completed: false,
    itemsCompleted: 0,
    totalItems: 0,
    masteryAverage: 0,
  };
}

function createEmptyLessonProgress(
  subjectId: SubjectId,
  lessonId: string
): LessonProgress {
  return {
    lessonId,
    subjectId,
    started: false,
    completed: false,
    activitiesCompleted: 0,
    totalActivities: 0,
    starsEarned: 0,
  };
}

// ============================================
// LEVEL CALCULATION
// ============================================

const XP_PER_LEVEL = 100;
const LEVEL_SCALING = 1.2; // Each level requires 20% more XP

function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpRequired = XP_PER_LEVEL;
  let xpAccumulated = 0;

  while (xpAccumulated + xpRequired <= totalXP) {
    xpAccumulated += xpRequired;
    level++;
    xpRequired = Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_SCALING, level - 1));
  }

  return level;
}

function getXPForNextLevel(currentLevel: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_SCALING, currentLevel - 1));
}

// ============================================
// DATE HELPERS
// ============================================

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function isConsecutiveDay(lastDate: string | null): boolean {
  if (!lastDate) return false;
  const last = new Date(lastDate);
  const today = new Date();
  const diffTime = today.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

function isSameDay(lastDate: string | null): boolean {
  if (!lastDate) return false;
  return getDateString() === lastDate;
}

// ============================================
// PROGRESS STORE
// ============================================

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      subjects: {},
      totalXP: 0,
      currentLevel: 1,
      overallStreak: 0,
      lastActivityDate: null,

      // Initialize a subject's progress
      initializeSubject: (subjectId) => {
        set((state) => {
          if (state.subjects[subjectId]) return state;
          return {
            subjects: {
              ...state.subjects,
              [subjectId]: createEmptySubjectProgress(subjectId),
            },
          };
        });
      },

      // Record an attempt on a content item
      recordItemAttempt: (subjectId, itemId, isCorrect, config) => {
        const mergedConfig = { ...DEFAULT_MASTERY_CONFIG, ...config };
        let updatedProgress: ItemProgress;

        set((state) => {
          // Ensure subject exists
          const subject = state.subjects[subjectId] || createEmptySubjectProgress(subjectId);
          const existing = subject.itemProgress[itemId] || createEmptyItemProgress(subjectId, itemId);

          const attempts = existing.attempts + 1;
          const correctAttempts = isCorrect ? existing.correctAttempts + 1 : existing.correctAttempts;
          const newMastery = calculateMastery(existing.mastery, isCorrect, attempts, mergedConfig);
          const streakCount = isCorrect ? existing.streakCount + 1 : 0;

          updatedProgress = {
            ...existing,
            attempts,
            correctAttempts,
            mastery: Math.round(newMastery),
            streakCount,
            lastAttempted: new Date().toISOString(),
            completedAt:
              newMastery >= mergedConfig.completionThreshold && !existing.completedAt
                ? new Date().toISOString()
                : existing.completedAt,
          };

          return {
            subjects: {
              ...state.subjects,
              [subjectId]: {
                ...subject,
                itemProgress: {
                  ...subject.itemProgress,
                  [itemId]: updatedProgress,
                },
                lastActivityAt: new Date().toISOString(),
              },
            },
          };
        });

        return updatedProgress!;
      },

      // Complete an activity and award XP
      completeActivity: (result) => {
        set((state) => {
          const xpEarned = result.xpEarned;
          const newTotalXP = state.totalXP + xpEarned;
          const newLevel = calculateLevelFromXP(newTotalXP);

          // Update subject XP
          const subject = state.subjects[result.subjectId];
          const updatedSubject = subject
            ? {
                ...subject,
                totalXP: subject.totalXP + xpEarned,
                lastActivityAt: result.timestamp,
              }
            : createEmptySubjectProgress(result.subjectId);

          return {
            totalXP: newTotalXP,
            currentLevel: newLevel,
            lastActivityDate: getDateString(),
            subjects: {
              ...state.subjects,
              [result.subjectId]: updatedSubject,
            },
          };
        });

        // Update streak
        get().updateStreak();
      },

      // Complete a lesson
      completeLesson: (subjectId, lessonId, score, unitId) => {
        const stars = calculateStars(score);
        let updatedLesson: LessonProgress;

        set((state) => {
          const subject = state.subjects[subjectId] || createEmptySubjectProgress(subjectId);
          const existing = subject.lessonProgress[lessonId] || createEmptyLessonProgress(subjectId, lessonId);

          updatedLesson = {
            ...existing,
            completed: true,
            starsEarned: Math.max(stars, existing.starsEarned),
            bestScore: Math.max(score, existing.bestScore || 0),
            completedAt: new Date().toISOString(),
            unitId,
          };

          return {
            subjects: {
              ...state.subjects,
              [subjectId]: {
                ...subject,
                lessonProgress: {
                  ...subject.lessonProgress,
                  [lessonId]: updatedLesson,
                },
              },
            },
          };
        });

        return updatedLesson!;
      },

      // Unlock a unit
      unlockUnit: (subjectId, unitId) => {
        set((state) => {
          const subject = state.subjects[subjectId] || createEmptySubjectProgress(subjectId);
          const existing = subject.unitProgress[unitId] || createEmptyUnitProgress(subjectId, unitId);

          return {
            subjects: {
              ...state.subjects,
              [subjectId]: {
                ...subject,
                unitProgress: {
                  ...subject.unitProgress,
                  [unitId]: {
                    ...existing,
                    unlocked: true,
                  },
                },
              },
            },
          };
        });
      },

      // Complete a unit
      completeUnit: (subjectId, unitId) => {
        set((state) => {
          const subject = state.subjects[subjectId] || createEmptySubjectProgress(subjectId);
          const existing = subject.unitProgress[unitId] || createEmptyUnitProgress(subjectId, unitId);

          return {
            subjects: {
              ...state.subjects,
              [subjectId]: {
                ...subject,
                unitProgress: {
                  ...subject.unitProgress,
                  [unitId]: {
                    ...existing,
                    completed: true,
                    completedAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        });
      },

      // Getters
      getItemProgress: (subjectId, itemId) => {
        const subject = get().subjects[subjectId];
        return subject?.itemProgress[itemId] || null;
      },

      getUnitProgress: (subjectId, unitId) => {
        const subject = get().subjects[subjectId];
        return subject?.unitProgress[unitId] || null;
      },

      getLessonProgress: (subjectId, lessonId) => {
        const subject = get().subjects[subjectId];
        return subject?.lessonProgress[lessonId] || null;
      },

      getSubjectProgress: (subjectId) => {
        return get().subjects[subjectId] || null;
      },

      getItemMastery: (subjectId, itemId) => {
        const progress = get().getItemProgress(subjectId, itemId);
        return progress?.mastery || 0;
      },

      isItemCompleted: (subjectId, itemId, threshold = DEFAULT_MASTERY_CONFIG.completionThreshold) => {
        const mastery = get().getItemMastery(subjectId, itemId);
        return mastery >= threshold;
      },

      isUnitUnlocked: (subjectId, unitId) => {
        const progress = get().getUnitProgress(subjectId, unitId);
        return progress?.unlocked || false;
      },

      isLessonCompleted: (subjectId, lessonId) => {
        const progress = get().getLessonProgress(subjectId, lessonId);
        return progress?.completed || false;
      },

      // Streak management
      updateStreak: () => {
        set((state) => {
          const today = getDateString();

          if (isSameDay(state.lastActivityDate)) {
            // Already played today, no streak change
            return state;
          }

          if (isConsecutiveDay(state.lastActivityDate)) {
            // Consecutive day, increment streak
            return {
              overallStreak: state.overallStreak + 1,
              lastActivityDate: today,
            };
          }

          // Streak broken, reset to 1
          return {
            overallStreak: 1,
            lastActivityDate: today,
          };
        });
      },

      getStreakDays: () => {
        const state = get();
        // If last activity was today or yesterday, streak is valid
        if (isSameDay(state.lastActivityDate) || isConsecutiveDay(state.lastActivityDate)) {
          return state.overallStreak;
        }
        return 0; // Streak broken
      },

      // Reset functions
      resetSubjectProgress: (subjectId) => {
        set((state) => ({
          subjects: {
            ...state.subjects,
            [subjectId]: createEmptySubjectProgress(subjectId),
          },
        }));
      },

      resetAllProgress: () => {
        set({
          subjects: {},
          totalXP: 0,
          currentLevel: 1,
          overallStreak: 0,
          lastActivityDate: null,
        });
      },
    }),
    {
      name: 'learning-progress-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        subjects: state.subjects,
        totalXP: state.totalXP,
        currentLevel: state.currentLevel,
        overallStreak: state.overallStreak,
        lastActivityDate: state.lastActivityDate,
      }),
    }
  )
);

// ============================================
// CONVENIENCE HOOKS
// ============================================

/**
 * Hook for subject-specific progress
 */
export function useSubjectProgress(subjectId: SubjectId) {
  const store = useProgressStore();

  // Initialize subject on first use
  if (!store.subjects[subjectId]) {
    store.initializeSubject(subjectId);
  }

  return {
    progress: store.getSubjectProgress(subjectId),
    recordAttempt: (itemId: string, isCorrect: boolean) =>
      store.recordItemAttempt(subjectId, itemId, isCorrect),
    getItemMastery: (itemId: string) => store.getItemMastery(subjectId, itemId),
    isItemCompleted: (itemId: string) => store.isItemCompleted(subjectId, itemId),
    completeLesson: (lessonId: string, score: number, unitId?: string) =>
      store.completeLesson(subjectId, lessonId, score, unitId),
    isLessonCompleted: (lessonId: string) => store.isLessonCompleted(subjectId, lessonId),
    unlockUnit: (unitId: string) => store.unlockUnit(subjectId, unitId),
    isUnitUnlocked: (unitId: string) => store.isUnitUnlocked(subjectId, unitId),
    reset: () => store.resetSubjectProgress(subjectId),
  };
}

/**
 * Hook for reading progress specifically
 */
export function useReadingProgress() {
  return useSubjectProgress('reading');
}

/**
 * Hook for math progress (future)
 */
export function useMathProgress() {
  return useSubjectProgress('math');
}

/**
 * Hook for global stats
 */
export function useGlobalProgress() {
  const store = useProgressStore();

  return {
    totalXP: store.totalXP,
    currentLevel: store.currentLevel,
    streak: store.getStreakDays(),
    xpForNextLevel: getXPForNextLevel(store.currentLevel),
    completeActivity: store.completeActivity,
    updateStreak: store.updateStreak,
  };
}
