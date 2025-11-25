/**
 * Mascot Hook
 *
 * Provides access to the selected mascot and its messages
 */

import { useMemo, useCallback } from 'react';
import { useProfile } from './use-onboarding';
import {
  MascotConfig,
  MascotId,
  MascotMessages,
  MASCOTS,
  DEFAULT_MASCOT_ID,
  getMascot,
  getMascotsForInterests,
  getRandomMascotMessage,
} from '@/lib/theme-data';
import { useTheme } from './use-theme';

export interface UseMascotReturn {
  /** The active mascot configuration */
  mascot: MascotConfig;
  /** The active mascot ID */
  mascotId: MascotId;
  /** Get a message of a specific type */
  getMessage: (type: keyof MascotMessages) => string;
  /** Get a greeting message */
  greet: () => string;
  /** Get an encouraging message */
  encourage: () => string;
  /** Get a celebration message */
  celebrate: () => string;
  /** Get a happy/success message */
  happy: () => string;
  /** Get a thinking/waiting message */
  think: () => string;
  /** Mascots available based on selected interests */
  availableMascots: MascotConfig[];
}

/**
 * Hook to access the current mascot and its messages
 *
 * @example
 * ```tsx
 * const { mascot, celebrate, greet } = useMascot();
 *
 * // Display mascot
 * <span>{mascot.emoji}</span>
 * <span>{mascot.name}</span>
 *
 * // Get messages
 * const greeting = greet(); // "BEEP BOOP! Hello, human friend!"
 * const success = celebrate(); // "BEEP BOOP! VICTORY!"
 * ```
 */
export function useMascot(): UseMascotReturn {
  const { profile } = useProfile();
  const { interests } = useTheme();

  const mascotId = useMemo(() => {
    return profile?.selectedMascot || DEFAULT_MASCOT_ID;
  }, [profile?.selectedMascot]);

  const mascot = useMemo(() => getMascot(mascotId), [mascotId]);

  const getMessage = useCallback(
    (type: keyof MascotMessages) => {
      return getRandomMascotMessage(mascotId, type);
    },
    [mascotId]
  );

  const greet = useCallback(() => getMessage('greeting'), [getMessage]);
  const encourage = useCallback(() => getMessage('encouraging'), [getMessage]);
  const celebrate = useCallback(() => getMessage('celebrating'), [getMessage]);
  const happy = useCallback(() => getMessage('happy'), [getMessage]);
  const think = useCallback(() => getMessage('thinking'), [getMessage]);

  const availableMascots = useMemo(() => {
    return getMascotsForInterests(interests);
  }, [interests]);

  return {
    mascot,
    mascotId,
    getMessage,
    greet,
    encourage,
    celebrate,
    happy,
    think,
    availableMascots,
  };
}

/**
 * Get all mascots for selection UI
 */
export function useAllMascots(): MascotConfig[] {
  return useMemo(() => Object.values(MASCOTS), []);
}

/**
 * Get a specific mascot by ID
 */
export function useMascotById(id: MascotId): MascotConfig {
  return useMemo(() => getMascot(id), [id]);
}
