import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserBadge,
  BADGES,
  XP_REWARDS,
  calculateLevel,
  getXPForNextLevel,
  getLevelProgress,
  getBadgeById,
} from "@/lib/achievements-data";

interface AchievementsState {
  /** Total XP earned */
  totalXP: number;
  /** Current XP level */
  level: number;
  /** Badges earned */
  badges: UserBadge[];
  /** Current streak (days) */
  currentStreak: number;
  /** Longest streak ever */
  longestStreak: number;
  /** Last activity date */
  lastActivityDate: string | null;
  /** Activity tracking */
  stats: {
    lessonsCompleted: number;
    lessonsPerfect: number;
    storiesRead: number;
    storiesCompleted: number;
    activitiesTried: Set<string>;
    levelsVisited: Set<number>;
    totalXPEarned: number;
  };

  /** Add XP and check for level up */
  addXP: (amount: number, source: string) => {
    xpAdded: number;
    leveledUp: boolean;
    newLevel?: number;
    newBadges: UserBadge[];
  };

  /** Update daily streak */
  updateStreak: () => void;

  /** Award a badge */
  awardBadge: (badgeId: string) => void;

  /** Check if badge is earned */
  hasBadge: (badgeId: string) => boolean;

  /** Track activity completion */
  trackActivity: (activityType: string) => void;

  /** Track lesson completion */
  trackLessonComplete: (perfect: boolean) => void;

  /** Track story read */
  trackStoryRead: (completed: boolean) => void;

  /** Track level visit */
  trackLevelVisit: (levelNumber: number) => void;

  /** Check and award eligible badges */
  checkBadgeEligibility: () => UserBadge[];

  /** Get XP for next level */
  getXPToNextLevel: () => number;

  /** Get level progress percentage */
  getLevelProgressPercent: () => number;

  /** Reset all achievements (for testing) */
  resetAchievements: () => void;
}

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      level: 1,
      badges: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      stats: {
        lessonsCompleted: 0,
        lessonsPerfect: 0,
        storiesRead: 0,
        storiesCompleted: 0,
        activitiesTried: new Set(),
        levelsVisited: new Set(),
        totalXPEarned: 0,
      },

      addXP: (amount: number, source: string) => {
        const state = get();
        const oldLevel = state.level;
        const newTotalXP = state.totalXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        const leveledUp = newLevel > oldLevel;

        set({
          totalXP: newTotalXP,
          level: newLevel,
          stats: {
            ...state.stats,
            totalXPEarned: state.stats.totalXPEarned + amount,
          },
        });

        // Check for new badges after XP update
        const newBadges = get().checkBadgeEligibility();

        return {
          xpAdded: amount,
          leveledUp,
          newLevel: leveledUp ? newLevel : undefined,
          newBadges,
        };
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        const lastDate = state.lastActivityDate
          ? new Date(state.lastActivityDate)
          : null;

        // If already did activity today, don't update
        if (lastDate && lastDate.toDateString() === today) {
          return;
        }

        let newStreak = 1;

        if (lastDate) {
          const daysDiff = Math.floor(
            (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            // Consecutive day
            newStreak = state.currentStreak + 1;
          } else if (daysDiff > 1) {
            // Streak broken
            newStreak = 1;
          }
        }

        const longestStreak = Math.max(state.longestStreak, newStreak);

        set({
          currentStreak: newStreak,
          longestStreak,
          lastActivityDate: today,
        });

        // Award streak XP
        get().addXP(XP_REWARDS.DAILY_LOGIN, "daily-login");

        // Check for streak badges
        get().checkBadgeEligibility();
      },

      awardBadge: (badgeId: string) => {
        const state = get();

        // Check if already has badge
        if (state.badges.some((b) => b.badgeId === badgeId)) {
          return;
        }

        const badge = getBadgeById(badgeId);
        if (!badge) return;

        const newBadge: UserBadge = {
          badgeId,
          earnedAt: new Date(),
        };

        set({
          badges: [...state.badges, newBadge],
        });

        // Award XP for earning badge
        get().addXP(badge.xpReward, `badge-${badgeId}`);
      },

      hasBadge: (badgeId: string) => {
        return get().badges.some((b) => b.badgeId === badgeId);
      },

      trackActivity: (activityType: string) => {
        const state = get();
        const activitiesTried = new Set(state.stats.activitiesTried);
        activitiesTried.add(activityType);

        set({
          stats: {
            ...state.stats,
            activitiesTried,
          },
        });

        get().checkBadgeEligibility();
      },

      trackLessonComplete: (perfect: boolean) => {
        const state = get();

        set({
          stats: {
            ...state.stats,
            lessonsCompleted: state.stats.lessonsCompleted + 1,
            lessonsPerfect: perfect
              ? state.stats.lessonsPerfect + 1
              : state.stats.lessonsPerfect,
          },
        });

        // Award XP
        const xp = perfect
          ? XP_REWARDS.LESSON_PERFECT
          : XP_REWARDS.LESSON_COMPLETE;
        get().addXP(xp, "lesson-complete");
        get().checkBadgeEligibility();
      },

      trackStoryRead: (completed: boolean) => {
        const state = get();

        set({
          stats: {
            ...state.stats,
            storiesRead: state.stats.storiesRead + 1,
            storiesCompleted: completed
              ? state.stats.storiesCompleted + 1
              : state.stats.storiesCompleted,
          },
        });

        // Award XP
        const xp = completed ? XP_REWARDS.STORY_COMPLETE : XP_REWARDS.STORY_READ;
        get().addXP(xp, "story-read");
        get().checkBadgeEligibility();
      },

      trackLevelVisit: (levelNumber: number) => {
        const state = get();
        const levelsVisited = new Set(state.stats.levelsVisited);
        levelsVisited.add(levelNumber);

        set({
          stats: {
            ...state.stats,
            levelsVisited,
          },
        });

        get().checkBadgeEligibility();
      },

      checkBadgeEligibility: () => {
        const state = get();
        const newBadges: UserBadge[] = [];

        BADGES.forEach((badge) => {
          // Skip if already has badge
          if (state.hasBadge(badge.id)) return;

          let eligible = false;

          switch (badge.category) {
            case "streak":
              eligible = state.currentStreak >= badge.requirement;
              break;

            case "completion":
              // Based on level number - would need integration with level progress
              break;

            case "mastery":
              eligible = state.stats.lessonsPerfect >= badge.requirement;
              break;

            case "explorer":
              if (badge.id === "try-all-activities") {
                eligible = state.stats.activitiesTried.size >= badge.requirement;
              } else if (badge.id === "visit-all-levels") {
                eligible = state.stats.levelsVisited.size >= badge.requirement;
              }
              break;

            case "reader":
              eligible = state.stats.storiesCompleted >= badge.requirement;
              break;

            case "learner":
              eligible = state.totalXP >= badge.requirement;
              break;
          }

          if (eligible) {
            state.awardBadge(badge.id);
            newBadges.push({
              badgeId: badge.id,
              earnedAt: new Date(),
            });
          }
        });

        return newBadges;
      },

      getXPToNextLevel: () => {
        return getXPForNextLevel(get().totalXP);
      },

      getLevelProgressPercent: () => {
        return getLevelProgress(get().totalXP);
      },

      resetAchievements: () => {
        set({
          totalXP: 0,
          level: 1,
          badges: [],
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          stats: {
            lessonsCompleted: 0,
            lessonsPerfect: 0,
            storiesRead: 0,
            storiesCompleted: 0,
            activitiesTried: new Set(),
            levelsVisited: new Set(),
            totalXPEarned: 0,
          },
        });
      },
    }),
    {
      name: "achievements",
      // Custom serialization for Sets
      partialize: (state) => ({
        ...state,
        stats: {
          ...state.stats,
          activitiesTried: Array.from(state.stats.activitiesTried),
          levelsVisited: Array.from(state.stats.levelsVisited),
        },
      }),
      // Custom deserialization
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.stats.activitiesTried = new Set(state.stats.activitiesTried as any);
          state.stats.levelsVisited = new Set(state.stats.levelsVisited as any);
        }
      },
    }
  )
);
