/**
 * Theme Hook
 *
 * Provides access to the active theme based on child's primary interest
 */

import { useMemo } from 'react';
import { useProfile } from './use-onboarding';
import {
  InterestTheme,
  InterestThemeId,
  INTEREST_THEMES,
  DEFAULT_THEME_ID,
  getTheme,
  getCountingEmojis,
  getRandomThemeEmoji,
  getThemeColorVars,
} from '@/lib/theme-data';

export interface UseThemeReturn {
  /** The active theme based on child's primary interest */
  theme: InterestTheme;
  /** The primary interest theme ID */
  themeId: InterestThemeId;
  /** All selected interests */
  interests: InterestThemeId[];
  /** Whether user has completed interest selection */
  hasInterests: boolean;
  /** Get emojis for counting/math */
  getEmojis: () => string[];
  /** Get a random emoji from the theme */
  getRandomEmoji: () => string;
  /** Get CSS variables for theming */
  getCssVars: () => Record<string, string>;
  /** Tailwind gradient class for the theme */
  gradientClass: string;
}

/**
 * Hook to access the current theme based on child's interests
 *
 * @example
 * ```tsx
 * const { theme, getEmojis } = useTheme();
 *
 * // Use theme colors
 * <div style={{ background: theme.colors.primary }}>...</div>
 *
 * // Get counting emojis for math
 * const emojis = getEmojis(); // ['🤖', '⚙️', '🔧', '🦾', '🔩']
 * ```
 */
export function useTheme(): UseThemeReturn {
  const { profile } = useProfile();

  const themeId = useMemo(() => {
    // Use primary interest if set, otherwise default
    if (profile?.primaryInterest) {
      return profile.primaryInterest;
    }
    // Fallback to first interest if available
    if (profile?.interests && profile.interests.length > 0) {
      return profile.interests[0];
    }
    return DEFAULT_THEME_ID;
  }, [profile?.primaryInterest, profile?.interests]);

  const theme = useMemo(() => getTheme(themeId), [themeId]);

  const interests = useMemo(() => {
    return profile?.interests || [];
  }, [profile?.interests]);

  const hasInterests = interests.length > 0;

  const getEmojis = useMemo(() => {
    return () => getCountingEmojis(themeId);
  }, [themeId]);

  const getRandomEmoji = useMemo(() => {
    return () => getRandomThemeEmoji(themeId);
  }, [themeId]);

  const getCssVars = useMemo(() => {
    return () => getThemeColorVars(themeId);
  }, [themeId]);

  const gradientClass = `bg-gradient-to-br ${theme.colors.gradient}`;

  return {
    theme,
    themeId,
    interests,
    hasInterests,
    getEmojis,
    getRandomEmoji,
    getCssVars,
    gradientClass,
  };
}

/**
 * Get themed emoji for a specific problem (consistent based on ID)
 *
 * @param problemId - Unique identifier for the problem
 * @param themeId - Optional override theme ID
 * @returns A consistent emoji for this problem
 */
export function useThemedEmoji(problemId: string, themeId?: InterestThemeId): string {
  const { themeId: activeThemeId } = useTheme();
  const effectiveThemeId = themeId || activeThemeId;

  return useMemo(() => {
    const emojis = INTEREST_THEMES[effectiveThemeId].emojis;
    // Create a simple hash from the problem ID for consistency
    let hash = 0;
    for (let i = 0; i < problemId.length; i++) {
      hash = ((hash << 5) - hash) + problemId.charCodeAt(i);
      hash = hash & hash;
    }
    return emojis[Math.abs(hash) % emojis.length];
  }, [problemId, effectiveThemeId]);
}

/**
 * Get all themes for selection UI
 */
export function useAllThemes(): InterestTheme[] {
  return useMemo(() => Object.values(INTEREST_THEMES), []);
}
