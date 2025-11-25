"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveSession {
  type: "level-lesson" | "phonics" | "math" | "story" | "practice";
  // Level lesson specific
  levelId?: string;
  levelTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  activityIndex?: number;
  totalActivities?: number;
  // Generic activity tracking
  activityId?: string;
  activityTitle?: string;
  progress?: number; // 0-100
  // Metadata
  startedAt: number;
  lastActiveAt: number;
}

interface SessionState {
  activeSession: ActiveSession | null;

  // Actions
  startSession: (session: Omit<ActiveSession, "startedAt" | "lastActiveAt">) => void;
  updateSession: (updates: Partial<ActiveSession>) => void;
  clearSession: () => void;

  // Helpers
  hasActiveSession: () => boolean;
  getResumeUrl: () => string | null;
  getResumeLabel: () => string;
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSession: null,

      startSession: (session) => {
        const now = Date.now();
        set({
          activeSession: {
            ...session,
            startedAt: now,
            lastActiveAt: now,
          },
        });
      },

      updateSession: (updates) => {
        const current = get().activeSession;
        if (current) {
          set({
            activeSession: {
              ...current,
              ...updates,
              lastActiveAt: Date.now(),
            },
          });
        }
      },

      clearSession: () => {
        set({ activeSession: null });
      },

      hasActiveSession: () => {
        const session = get().activeSession;
        if (!session) return false;

        // Session expires after 24 hours
        const expiryTime = 24 * 60 * 60 * 1000;
        const isExpired = Date.now() - session.lastActiveAt > expiryTime;

        if (isExpired) {
          set({ activeSession: null });
          return false;
        }

        return true;
      },

      getResumeUrl: () => {
        const session = get().activeSession;
        if (!session) return null;

        switch (session.type) {
          case "level-lesson":
            if (session.levelId && session.lessonId) {
              return `/levels/${session.levelId}/lessons/${session.lessonId}`;
            }
            break;
          case "phonics":
            return "/phonics";
          case "math":
            if (session.activityId) {
              return `/math/lesson/${session.activityId}`;
            }
            return "/math";
          case "story":
            return "/stories";
          case "practice":
            return "/practice";
        }
        return null;
      },

      getResumeLabel: () => {
        const session = get().activeSession;
        if (!session) return "Continue Learning";

        switch (session.type) {
          case "level-lesson":
            const activityPart = session.activityIndex !== undefined && session.totalActivities
              ? ` (Activity ${session.activityIndex + 1}/${session.totalActivities})`
              : "";
            return `${session.levelTitle || "Level"}: ${session.lessonTitle || "Lesson"}${activityPart}`;
          case "phonics":
            return session.activityTitle || "Phonics Practice";
          case "math":
            return session.activityTitle || "Math Lesson";
          case "story":
            return session.activityTitle || "Story Time";
          case "practice":
            return session.activityTitle || "Skills Practice";
          default:
            return "Continue Learning";
        }
      },
    }),
    {
      name: "learning-session",
      version: 1,
    }
  )
);
