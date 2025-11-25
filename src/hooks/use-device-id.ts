"use client";

import { useState, useEffect } from "react";

const DEVICE_ID_KEY = "toddler-learning-device-id";

/**
 * Generates a unique device identifier.
 * Uses crypto.randomUUID if available, falls back to timestamp + random.
 */
function generateDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Hook to get or create a unique device identifier.
 * This ID persists across sessions and is used for cloud sync.
 */
export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    let id = localStorage.getItem(DEVICE_ID_KEY);

    if (!id) {
      id = generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }

    setDeviceId(id);
    setIsLoading(false);
  }, []);

  return { deviceId, isLoading };
}

/**
 * Get device ID synchronously (for use outside React).
 * Returns null if not in browser or not yet generated.
 */
export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DEVICE_ID_KEY);
}

/**
 * Get or create device ID synchronously.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateDeviceId can only be called in browser");
  }

  let id = localStorage.getItem(DEVICE_ID_KEY);

  if (!id) {
    id = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }

  return id;
}
