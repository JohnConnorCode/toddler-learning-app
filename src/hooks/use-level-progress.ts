/**
 * Level Progress Store
 * Tracks user progress through the 10-level system
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type UserProgress,
  type LevelProgress,
  LEVELS,
  getLevelById,
  getLessonById,
  getNextLesson,
} from "@/lib/levels-data";

interface LevelProgressState extends UserProgress {
  // Hydration state - CRITICAL for SSR
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Actions
  completeLesson: (lessonId: string, starsEarned: number) => void;
  startLesson: (lessonId: string) => void;
  unlockStory: (storyId: string) => void;
  resetProgress: () => void;
  updateStreak: () => void;

  // Computed values
  getCurrentLevel: () => ReturnType<typeof getLevelById>;
  getCurrentLesson: () => ReturnType<typeof getLessonById>;
  getLevelProgress: (levelId: string) => LevelProgress | undefined;
  getTotalProgress: () => {
    totalLevels: number;
    completedLevels: number;
    percentComplete: number;
  };
}

const getInitialProgress = (): UserProgress => {
  const initialLevels: Record<string, LevelProgress> = {};

  // Initialize all levels with empty progress
  LEVELS.forEach((level) => {
    const totalStars = level.lessons.reduce(
      (sum, lesson) => sum + lesson.activities.length * 3, // 3 stars per activity
      0
    );

    initialLevels[level.id] = {
      levelId: level.id,
      lessonsCompleted: [],
      currentLesson: level.lessons[0]?.id || null,
      starsEarned: 0,
      totalStars,
      percentComplete: 0,
    };
  });

  // Unlock first level
  initialLevels["level-1"].unlockedAt = new Date();

  return {
    currentLevel: "level-1",
    levels: initialLevels,
    totalStarsEarned: 0,
    streak: 0,
    unlockedStories: [],
  };
};

export const useLevelProgress = create<LevelProgressState>()(
  persist(
    (set, get) => ({
      ...getInitialProgress(),

      // Hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      completeLesson: (lessonId: string, starsEarned: number) => {
        const result = getLessonById(lessonId);
        if (!result) return;

        const { level, lesson } = result;

        set((state) => {
          const levelProgress = state.levels[level.id];
          if (!levelProgress) return state;

          // Don't add if already completed
          const alreadyCompleted = levelProgress.lessonsCompleted.includes(lessonId);
          const newLessonsCompleted = alreadyCompleted
            ? levelProgress.lessonsCompleted
            : [...levelProgress.lessonsCompleted, lessonId];

          const newStarsEarned = alreadyCompleted
            ? levelProgress.starsEarned
            : levelProgress.starsEarned + starsEarned;

          const percentComplete = (newLessonsCompleted.length / level.lessons.length) * 100;

          // Check if level is now complete
          const isLevelComplete = percentComplete === 100;
          const completedAt = isLevelComplete && !levelProgress.completedAt
            ? new Date()
            : levelProgress.completedAt;

          // Unlock next level if this one is complete
          const nextLevel = LEVELS.find(l => l.levelNumber === level.levelNumber + 1);
          const nextLevelProgress = nextLevel ? state.levels[nextLevel.id] : undefined;

          // Determine next lesson
          const nextLesson = getNextLesson(lessonId);
          const currentLesson = nextLesson?.lesson.id || null;

          const updatedLevels = {
            ...state.levels,
            [level.id]: {
              ...levelProgress,
              lessonsCompleted: newLessonsCompleted,
              starsEarned: newStarsEarned,
              percentComplete,
              completedAt,
              currentLesson,
            },
          };

          // Unlock next level if current is complete
          if (isLevelComplete && nextLevelProgress && !nextLevelProgress.unlockedAt) {
            updatedLevels[nextLevel!.id] = {
              ...nextLevelProgress,
              unlockedAt: new Date(),
            };
          }

          // Unlock reward story if level has one
          const newUnlockedStories = [...state.unlockedStories];
          if (isLevelComplete && level.rewardStoryId && !newUnlockedStories.includes(level.rewardStoryId)) {
            newUnlockedStories.push(level.rewardStoryId);
          }

          return {
            levels: updatedLevels,
            totalStarsEarned: state.totalStarsEarned + (alreadyCompleted ? 0 : starsEarned),
            currentLevel: nextLesson?.level.id || state.currentLevel,
            unlockedStories: newUnlockedStories,
          };
        });

        // Update streak
        get().updateStreak();
      },

      startLesson: (lessonId: string) => {
        const result = getLessonById(lessonId);
        if (!result) return;

        const { level } = result;

        set((state) => ({
          levels: {
            ...state.levels,
            [level.id]: {
              ...state.levels[level.id],
              currentLesson: lessonId,
            },
          },
        }));
      },

      unlockStory: (storyId: string) => {
        set((state) => {
          if (state.unlockedStories.includes(storyId)) return state;

          return {
            unlockedStories: [...state.unlockedStories, storyId],
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toDateString();
          const lastActivity = state.lastActivityDate
            ? new Date(state.lastActivityDate).toDateString()
            : null;

          // Same day - no change
          if (lastActivity === today) {
            return state;
          }

          // Yesterday - increment streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastActivity === yesterday.toDateString()) {
            return {
              streak: state.streak + 1,
              lastActivityDate: new Date(),
            };
          }

          // More than 1 day ago - reset streak
          return {
            streak: 1,
            lastActivityDate: new Date(),
          };
        });
      },

      resetProgress: () => {
        set(getInitialProgress());
      },

      // Computed values
      getCurrentLevel: () => {
        const state = get();
        return getLevelById(state.currentLevel);
      },

      getCurrentLesson: () => {
        const state = get();
        const level = state.getCurrentLevel();
        if (!level) return undefined;

        const levelProgress = state.levels[level.id];
        if (!levelProgress?.currentLesson) return undefined;

        return getLessonById(levelProgress.currentLesson);
      },

      getLevelProgress: (levelId: string) => {
        return get().levels[levelId];
      },

      getTotalProgress: () => {
        const state = get();
        const completedLevels = Object.values(state.levels).filter(
          (progress) => progress.percentComplete === 100
        ).length;

        return {
          totalLevels: LEVELS.length,
          completedLevels,
          percentComplete: (completedLevels / LEVELS.length) * 100,
        };
      },
    }),
    {
      name: "level-progress",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Hook to check if level progress store has hydrated
 */
export function useLevelProgressHydrated() {
  return useLevelProgress((state) => state._hasHydrated);
}
