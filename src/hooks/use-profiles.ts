/**
 * Profile Management Store
 * Handles multi-child profiles, activity logging, and analytics
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type ChildProfile,
  type ActivityLog,
  type DailyStats,
  createDefaultProfile,
  generateActivityLogId,
  getTodayDateString,
} from "@/lib/profiles-data";

interface ProfileState {
  // Profiles
  profiles: ChildProfile[];
  activeProfileId: string | null;

  // Activity logs
  activityLogs: ActivityLog[];

  // Daily stats
  dailyStats: DailyStats[];

  // Session tracking
  sessionStartTime: number | null;
  totalSessionTime: number; // seconds

  // Profile management
  createProfile: (
    name: string,
    age: number,
    avatar: string
  ) => ChildProfile;
  deleteProfile: (profileId: string) => void;
  updateProfile: (profileId: string, updates: Partial<ChildProfile>) => void;
  setActiveProfile: (profileId: string | null) => void;
  getActiveProfile: () => ChildProfile | null;

  // Activity tracking
  logActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  startSession: () => void;
  endSession: () => number; // returns session duration
  getActivityLogs: (profileId: string, limit?: number) => ActivityLog[];
  getTodayStats: (profileId: string) => DailyStats | null;

  // Analytics
  getDailyStats: (profileId: string, days?: number) => DailyStats[];
  getTotalTimeSpent: (profileId: string) => number;
  getCompletionStats: (profileId: string) => {
    lessonsCompleted: number;
    storiesRead: number;
    totalActivities: number;
  };
  getStreakDays: (profileId: string) => number;

  // Parental controls
  checkTimeLimit: (profileId: string) => {
    limitReached: boolean;
    timeRemaining: number;
  };
  checkContentAccess: (profileId: string, levelNumber: number) => boolean;

  // Utilities
  clearAllData: () => void;
}

const INITIAL_STATE = {
  profiles: [],
  activeProfileId: null,
  activityLogs: [],
  dailyStats: [],
  sessionStartTime: null,
  totalSessionTime: 0,
};

export const useProfiles = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // Profile management
      createProfile: (name: string, age: number, avatar: string) => {
        const newProfile = createDefaultProfile(name, age, avatar);
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: state.profiles.length === 0 ? newProfile.id : state.activeProfileId,
        }));
        return newProfile;
      },

      deleteProfile: (profileId: string) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== profileId),
          activeProfileId:
            state.activeProfileId === profileId ? null : state.activeProfileId,
          activityLogs: state.activityLogs.filter(
            (log) => log.profileId !== profileId
          ),
          dailyStats: state.dailyStats.filter(
            (stat) => stat.profileId !== profileId
          ),
        }));
      },

      updateProfile: (profileId: string, updates: Partial<ChildProfile>) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId ? { ...p, ...updates } : p
          ),
        }));
      },

      setActiveProfile: (profileId: string | null) => {
        // End current session before switching
        if (get().sessionStartTime) {
          get().endSession();
        }
        set({ activeProfileId: profileId, sessionStartTime: null });
      },

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.id === activeProfileId) || null;
      },

      // Activity tracking
      logActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => {
        const log: ActivityLog = {
          ...activity,
          id: generateActivityLogId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          activityLogs: [...state.activityLogs, log],
        }));

        // Update daily stats
        const today = getTodayDateString();
        const profileId = activity.profileId;

        set((state) => {
          const existingStatIndex = state.dailyStats.findIndex(
            (s) => s.date === today && s.profileId === profileId
          );

          let newDailyStats = [...state.dailyStats];

          if (existingStatIndex >= 0) {
            // Update existing stat
            const existing = newDailyStats[existingStatIndex];
            newDailyStats[existingStatIndex] = {
              ...existing,
              timeSpent: existing.timeSpent + Math.floor(activity.duration / 60),
              lessonsCompleted:
                existing.lessonsCompleted +
                (activity.activityType === "lesson" && activity.completed ? 1 : 0),
              storiesRead:
                existing.storiesRead +
                (activity.activityType === "story" && activity.completed ? 1 : 0),
              xpEarned: existing.xpEarned + (activity.xpEarned || 0),
              activitiesCompleted:
                existing.activitiesCompleted + (activity.completed ? 1 : 0),
            };
          } else {
            // Create new stat
            newDailyStats.push({
              date: today,
              profileId,
              timeSpent: Math.floor(activity.duration / 60),
              lessonsCompleted:
                activity.activityType === "lesson" && activity.completed ? 1 : 0,
              storiesRead:
                activity.activityType === "story" && activity.completed ? 1 : 0,
              xpEarned: activity.xpEarned || 0,
              activitiesCompleted: activity.completed ? 1 : 0,
            });
          }

          return { dailyStats: newDailyStats };
        });
      },

      startSession: () => {
        set({ sessionStartTime: Date.now() });
      },

      endSession: () => {
        const { sessionStartTime, totalSessionTime } = get();
        if (!sessionStartTime) return 0;

        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
        set({
          sessionStartTime: null,
          totalSessionTime: totalSessionTime + sessionDuration,
        });

        return sessionDuration;
      },

      getActivityLogs: (profileId: string, limit?: number) => {
        const logs = get()
          .activityLogs.filter((log) => log.profileId === profileId)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

        return limit ? logs.slice(0, limit) : logs;
      },

      getTodayStats: (profileId: string) => {
        const today = getTodayDateString();
        return (
          get().dailyStats.find(
            (s) => s.date === today && s.profileId === profileId
          ) || null
        );
      },

      // Analytics
      getDailyStats: (profileId: string, days: number = 7) => {
        const stats = get()
          .dailyStats.filter((s) => s.profileId === profileId)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, days);

        return stats.reverse(); // Chronological order
      },

      getTotalTimeSpent: (profileId: string) => {
        return get()
          .dailyStats.filter((s) => s.profileId === profileId)
          .reduce((total, stat) => total + stat.timeSpent, 0);
      },

      getCompletionStats: (profileId: string) => {
        const stats = get().dailyStats.filter((s) => s.profileId === profileId);

        return {
          lessonsCompleted: stats.reduce(
            (sum, s) => sum + s.lessonsCompleted,
            0
          ),
          storiesRead: stats.reduce((sum, s) => sum + s.storiesRead, 0),
          totalActivities: stats.reduce(
            (sum, s) => sum + s.activitiesCompleted,
            0
          ),
        };
      },

      getStreakDays: (profileId: string) => {
        const stats = get()
          .dailyStats.filter((s) => s.profileId === profileId)
          .sort((a, b) => b.date.localeCompare(a.date));

        if (stats.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < stats.length; i++) {
          const statDate = new Date(stats[i].date);
          statDate.setHours(0, 0, 0, 0);

          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          expectedDate.setHours(0, 0, 0, 0);

          if (statDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }

        return streak;
      },

      // Parental controls
      checkTimeLimit: (profileId: string) => {
        const profile = get().profiles.find((p) => p.id === profileId);
        if (!profile || profile.settings.dailyTimeLimit === 0) {
          return { limitReached: false, timeRemaining: Infinity };
        }

        const todayStats = get().getTodayStats(profileId);
        const timeSpent = todayStats?.timeSpent || 0; // minutes
        const limit = profile.settings.dailyTimeLimit;
        const remaining = limit - timeSpent;

        return {
          limitReached: remaining <= 0,
          timeRemaining: Math.max(0, remaining),
        };
      },

      checkContentAccess: (profileId: string, levelNumber: number) => {
        const profile = get().profiles.find((p) => p.id === profileId);
        if (!profile || profile.settings.contentLevel === 0) {
          return true; // All levels accessible
        }

        return levelNumber <= profile.settings.contentLevel;
      },

      // Utilities
      clearAllData: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: "profiles-storage",
    }
  )
);

/**
 * Hook to check if a profile should be prompted for a break
 * Returns true if child has been playing for too long
 */
export function useBreakReminder(profileId: string | null): boolean {
  const { getTodayStats } = useProfiles();

  if (!profileId) return false;

  const todayStats = getTodayStats(profileId);
  if (!todayStats) return false;

  // Suggest break after 30 minutes of continuous play
  return todayStats.timeSpent >= 30;
}

/**
 * Hook to get profile theme
 */
export function useProfileTheme() {
  const activeProfile = useProfiles((state) => state.getActiveProfile());
  return activeProfile?.theme || {
    primary: "#FF6B6B",
    secondary: "#FFB6B6",
    background: "#FFF5F5",
  };
}
