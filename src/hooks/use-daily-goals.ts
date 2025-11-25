"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DailyGoalState {
  // Settings
  dailyGoalMinutes: number;

  // Today's progress
  todayMinutes: number;
  todayDate: string; // ISO date string

  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;

  // Actions
  setDailyGoal: (minutes: number) => void;
  addMinutes: (minutes: number) => void;
  checkAndResetDay: () => void;

  // Computed
  getTodayProgress: () => number; // 0-100
  isGoalComplete: () => boolean;
  getMinutesRemaining: () => number;
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

export const useDailyGoals = create<DailyGoalState>()(
  persist(
    (set, get) => ({
      dailyGoalMinutes: 15, // Default 15 minutes per day
      todayMinutes: 0,
      todayDate: getTodayDateString(),
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,

      setDailyGoal: (minutes) => {
        set({ dailyGoalMinutes: Math.max(5, Math.min(60, minutes)) });
      },

      addMinutes: (minutes) => {
        const state = get();
        state.checkAndResetDay();

        const newMinutes = state.todayMinutes + minutes;
        const wasComplete = state.todayMinutes >= state.dailyGoalMinutes;
        const isNowComplete = newMinutes >= state.dailyGoalMinutes;

        set({ todayMinutes: newMinutes });

        // Check if we just completed the daily goal
        if (!wasComplete && isNowComplete) {
          const today = getTodayDateString();
          const yesterday = getYesterdayDateString();
          const lastCompleted = state.lastCompletedDate;

          let newStreak = 1;
          if (lastCompleted === yesterday) {
            // Consecutive day - increment streak
            newStreak = state.currentStreak + 1;
          } else if (lastCompleted === today) {
            // Same day - keep current streak
            newStreak = state.currentStreak;
          }

          set({
            lastCompletedDate: today,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
          });
        }
      },

      checkAndResetDay: () => {
        const today = getTodayDateString();
        const state = get();

        if (state.todayDate !== today) {
          // It's a new day
          const yesterday = getYesterdayDateString();

          // Check if streak should be broken
          const streakBroken =
            state.lastCompletedDate !== yesterday &&
            state.lastCompletedDate !== today;

          set({
            todayDate: today,
            todayMinutes: 0,
            currentStreak: streakBroken ? 0 : state.currentStreak,
          });
        }
      },

      getTodayProgress: () => {
        const state = get();
        state.checkAndResetDay();
        return Math.min(100, (state.todayMinutes / state.dailyGoalMinutes) * 100);
      },

      isGoalComplete: () => {
        const state = get();
        state.checkAndResetDay();
        return state.todayMinutes >= state.dailyGoalMinutes;
      },

      getMinutesRemaining: () => {
        const state = get();
        state.checkAndResetDay();
        return Math.max(0, state.dailyGoalMinutes - state.todayMinutes);
      },
    }),
    {
      name: "daily-goals",
      version: 1,
    }
  )
);

// Helper hook for tracking time spent in activities
export function useActivityTimer() {
  const { addMinutes } = useDailyGoals();

  const trackActivity = (durationSeconds: number) => {
    const minutes = durationSeconds / 60;
    if (minutes >= 0.5) {
      // Only track if at least 30 seconds
      addMinutes(minutes);
    }
  };

  return { trackActivity };
}
