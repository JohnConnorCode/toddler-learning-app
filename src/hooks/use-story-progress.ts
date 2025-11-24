import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoryProgress } from "@/lib/stories-data";

interface StoryProgressState {
  /** Map of story ID to progress */
  stories: Record<string, StoryProgress>;
  /** Stories marked as favorites */
  favorites: string[];
  /** Last story read */
  lastStoryRead: string | null;

  /** Start reading a story */
  startStory: (storyId: string) => void;

  /** Update page progress */
  updatePageProgress: (storyId: string, pageNumber: number) => void;

  /** Mark story as completed */
  completeStory: (storyId: string) => void;

  /** Answer comprehension question */
  answerQuestion: (storyId: string, correct: boolean) => void;

  /** Toggle favorite status */
  toggleFavorite: (storyId: string) => void;

  /** Get progress for a specific story */
  getStoryProgress: (storyId: string) => StoryProgress | undefined;

  /** Check if story has been read */
  hasReadStory: (storyId: string) => boolean;

  /** Get completion percentage */
  getCompletionPercentage: (storyId: string, totalPages: number) => number;

  /** Reset all progress (for testing) */
  resetAllProgress: () => void;
}

export const useStoryProgress = create<StoryProgressState>()(
  persist(
    (set, get) => ({
      stories: {},
      favorites: [],
      lastStoryRead: null,

      startStory: (storyId: string) => {
        set((state) => {
          const existing = state.stories[storyId];

          if (existing) {
            // Update last read time
            return {
              stories: {
                ...state.stories,
                [storyId]: {
                  ...existing,
                  lastReadAt: new Date(),
                },
              },
              lastStoryRead: storyId,
            };
          }

          // Create new progress entry
          return {
            stories: {
              ...state.stories,
              [storyId]: {
                storyId,
                started: true,
                completed: false,
                lastPageRead: 1,
                timesRead: 1,
                questionsCorrect: 0,
                questionsAttempted: 0,
                firstReadAt: new Date(),
                lastReadAt: new Date(),
                favorited: false,
              },
            },
            lastStoryRead: storyId,
          };
        });
      },

      updatePageProgress: (storyId: string, pageNumber: number) => {
        set((state) => {
          const existing = state.stories[storyId];

          if (!existing) {
            // Auto-start if not started
            get().startStory(storyId);
            return state;
          }

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...existing,
                lastPageRead: Math.max(existing.lastPageRead, pageNumber),
                lastReadAt: new Date(),
              },
            },
          };
        });
      },

      completeStory: (storyId: string) => {
        set((state) => {
          const existing = state.stories[storyId];

          if (!existing) {
            return state;
          }

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...existing,
                completed: true,
                timesRead: existing.timesRead + 1,
                lastReadAt: new Date(),
              },
            },
          };
        });
      },

      answerQuestion: (storyId: string, correct: boolean) => {
        set((state) => {
          const existing = state.stories[storyId];

          if (!existing) {
            return state;
          }

          return {
            stories: {
              ...state.stories,
              [storyId]: {
                ...existing,
                questionsAttempted: existing.questionsAttempted + 1,
                questionsCorrect: existing.questionsCorrect + (correct ? 1 : 0),
              },
            },
          };
        });
      },

      toggleFavorite: (storyId: string) => {
        set((state) => {
          const isFavorited = state.favorites.includes(storyId);
          const existing = state.stories[storyId];

          return {
            favorites: isFavorited
              ? state.favorites.filter((id) => id !== storyId)
              : [...state.favorites, storyId],
            stories: existing
              ? {
                  ...state.stories,
                  [storyId]: {
                    ...existing,
                    favorited: !isFavorited,
                  },
                }
              : state.stories,
          };
        });
      },

      getStoryProgress: (storyId: string) => {
        return get().stories[storyId];
      },

      hasReadStory: (storyId: string) => {
        const progress = get().stories[storyId];
        return progress ? progress.started : false;
      },

      getCompletionPercentage: (storyId: string, totalPages: number) => {
        const progress = get().stories[storyId];
        if (!progress || totalPages === 0) return 0;

        return Math.round((progress.lastPageRead / totalPages) * 100);
      },

      resetAllProgress: () => {
        set({
          stories: {},
          favorites: [],
          lastStoryRead: null,
        });
      },
    }),
    {
      name: "story-progress",
    }
  )
);
