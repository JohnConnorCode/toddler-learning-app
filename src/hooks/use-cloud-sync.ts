"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";

// Storage keys to sync (in priority order)
const SYNC_STORAGE_KEYS = [
  "profiles-storage",
  "achievements",
  "level-progress",
  "story-progress",
  "learning-progress-storage",
  "phonics-progress",
  "little-learner-onboarding",
  "toddler-learning-settings",
  "accessibility-storage",
  "audio-settings",
];

type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline" | "not_logged_in";

interface CloudSyncState {
  lastSynced: number | null;
  syncStatus: SyncStatus;
  error: string | null;
  isOnline: boolean;
  setLastSynced: (time: number) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setError: (error: string | null) => void;
  setIsOnline: (online: boolean) => void;
}

// Persist sync metadata
const useCloudSyncStore = create<CloudSyncState>()(
  persist(
    (set) => ({
      lastSynced: null,
      syncStatus: "idle",
      error: null,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      setLastSynced: (time) => set({ lastSynced: time }),
      setSyncStatus: (status) => set({ syncStatus: status }),
      setError: (error) => set({ error }),
      setIsOnline: (online) => set({ isOnline: online }),
    }),
    {
      name: "cloud-sync-meta",
    }
  )
);

/**
 * Saves all localStorage data to Supabase using user_id
 */
async function saveToCloud(userId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const now = new Date().toISOString();
    const updates: Array<{
      user_id: string;
      storage_key: string;
      state_data: unknown;
      updated_at: string;
    }> = [];

    for (const key of SYNC_STORAGE_KEYS) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          updates.push({
            user_id: userId,
            storage_key: key,
            state_data: parsed,
            updated_at: now,
          });
        } catch {
          // Skip invalid JSON
        }
      }
    }

    if (updates.length === 0) return true;

    // Upsert all data
    const { error } = await supabase.from("user_state").upsert(updates, {
      onConflict: "user_id,storage_key",
    });

    if (error) {
      console.error("Cloud save error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Save to cloud error:", err);
    return false;
  }
}

/**
 * Restores all data from Supabase to localStorage
 */
async function restoreFromCloudData(userId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("user_state")
      .select("storage_key, state_data, updated_at")
      .eq("user_id", userId);

    if (error) {
      console.error("Cloud restore error:", error);
      return false;
    }

    if (!data || data.length === 0) {
      // No cloud data yet
      return true;
    }

    // Compare timestamps and restore newer cloud data
    for (const row of data) {
      const localData = localStorage.getItem(row.storage_key);
      let shouldRestore = true;

      if (localData) {
        // Check if local data has a timestamp
        try {
          const local = JSON.parse(localData);
          // For Zustand stores, check state.lastUpdated or similar
          if (local.state?.lastActivityDate || local.state?.updatedAt) {
            const localTime = new Date(
              local.state.lastActivityDate || local.state.updatedAt
            ).getTime();
            const cloudTime = new Date(row.updated_at).getTime();
            shouldRestore = cloudTime > localTime;
          }
        } catch {
          // If can't parse, restore from cloud
        }
      }

      if (shouldRestore && row.state_data) {
        localStorage.setItem(row.storage_key, JSON.stringify(row.state_data));
      }
    }

    return true;
  } catch (err) {
    console.error("Restore from cloud error:", err);
    return false;
  }
}

/**
 * Main cloud sync hook - uses authenticated user_id
 */
export function useCloudSync() {
  const {
    lastSynced,
    syncStatus,
    error,
    isOnline,
    setLastSynced,
    setSyncStatus,
    setError,
    setIsOnline,
  } = useCloudSyncStore();

  const { user, isAuthenticated } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline, setSyncStatus]);

  // Update status when auth changes
  useEffect(() => {
    if (!isAuthenticated && supabase) {
      setSyncStatus("not_logged_in");
    }
  }, [isAuthenticated, setSyncStatus]);

  // Sync now function
  const syncNow = useCallback(async () => {
    if (!supabase) {
      setError("Cloud sync not configured");
      return;
    }

    if (!isAuthenticated || !user?.id) {
      setSyncStatus("not_logged_in");
      return;
    }

    if (!navigator.onLine) {
      setSyncStatus("offline");
      return;
    }

    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      setSyncStatus("syncing");
      setError(null);

      const success = await saveToCloud(user.id);

      if (success) {
        setSyncStatus("success");
        setLastSynced(Date.now());
      } else {
        setSyncStatus("error");
        setError("Failed to sync to cloud");
      }
    } catch (err) {
      setSyncStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      isSyncingRef.current = false;
    }
  }, [isAuthenticated, user, setError, setLastSynced, setSyncStatus]);

  // Debounced auto-sync
  const queueSync = useCallback(() => {
    if (!isAuthenticated) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncNow();
    }, 2000); // 2 second debounce
  }, [isAuthenticated, syncNow]);

  // Restore from cloud
  const restoreFromCloud = useCallback(async () => {
    if (!supabase) return false;

    if (!isAuthenticated || !user?.id) {
      setSyncStatus("not_logged_in");
      return false;
    }

    if (!navigator.onLine) {
      setSyncStatus("offline");
      return false;
    }

    try {
      setSyncStatus("syncing");
      const success = await restoreFromCloudData(user.id);

      if (success) {
        setSyncStatus("success");
        // Reload page to apply restored data
        window.location.reload();
        return true;
      } else {
        setSyncStatus("error");
        setError("Failed to restore from cloud");
        return false;
      }
    } catch (err) {
      setSyncStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  }, [isAuthenticated, user, setError, setSyncStatus]);

  // Auto-sync on localStorage changes
  useEffect(() => {
    if (!supabase || !isAuthenticated) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && SYNC_STORAGE_KEYS.includes(e.key)) {
        queueSync();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isAuthenticated, queueSync]);

  // Initial sync on mount when authenticated
  useEffect(() => {
    if (!supabase || !isAuthenticated || !user?.id) return;

    if (navigator.onLine) {
      // Small delay to let localStorage initialize
      const timer = setTimeout(() => {
        syncNow();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.id, syncNow]);

  return {
    syncStatus,
    lastSynced,
    error,
    isOnline,
    isEnabled: !!supabase,
    isLoggedIn: isAuthenticated,
    userEmail: user?.email,
    syncNow,
    queueSync,
    restoreFromCloud,
  };
}

/**
 * Standalone function to trigger sync (for use outside React)
 */
export async function triggerCloudSync() {
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id && navigator.onLine) {
    saveToCloud(user.id).catch(console.error);
  }
}
