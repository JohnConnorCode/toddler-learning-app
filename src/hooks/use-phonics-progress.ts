"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PhonicsUnit,
  PHONICS_UNITS,
  UnitProgress,
  LetterProgress,
  isUnitUnlocked,
  getNextUnit,
  calculateOverallProgress,
} from "@/lib/systematic-phonics-data";

const STORAGE_KEY = "phonics-progress";

interface PhonicsProgressState {
  unitProgress: Record<number, UnitProgress>;
  letterProgress: Record<string, LetterProgress>;
  completedUnits: number[];
  currentUnitId: number | null;
  lastUpdated: string;
}

const DEFAULT_STATE: PhonicsProgressState = {
  unitProgress: {},
  letterProgress: {},
  completedUnits: [],
  currentUnitId: 1, // Start with Unit 1
  lastUpdated: new Date().toISOString(),
};

export function usePhonicsProgress() {
  const [state, setState] = useState<PhonicsProgressState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch (error) {
        console.error("Failed to load phonics progress:", error);
      }
    } else {
      // Initialize Unit 1 as unlocked
      setState((prev) => ({
        ...prev,
        unitProgress: {
          1: {
            unitId: 1,
            unlocked: true,
            completed: false,
            lettersCompleted: 0,
            totalLetters: PHONICS_UNITS[0].letters.length,
          },
        },
      }));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // Start practicing a unit
  const startUnit = useCallback((unitId: number) => {
    setState((prev) => {
      const unit = PHONICS_UNITS.find((u) => u.id === unitId);
      if (!unit) return prev;

      return {
        ...prev,
        currentUnitId: unitId,
        unitProgress: {
          ...prev.unitProgress,
          [unitId]: {
            unitId,
            unlocked: true,
            completed: false,
            lettersCompleted: 0,
            totalLetters: unit.letters.length,
            startedAt: new Date().toISOString(),
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Mark a letter as practiced
  const markLetterPracticed = useCallback((letterId: string) => {
    setState((prev) => ({
      ...prev,
      letterProgress: {
        ...prev.letterProgress,
        [letterId]: {
          letterId,
          practiced: true,
          mastered: prev.letterProgress[letterId]?.mastered || false,
          lastPracticed: new Date().toISOString(),
          accuracy: prev.letterProgress[letterId]?.accuracy,
        },
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Mark a letter as mastered (80%+ accuracy)
  const markLetterMastered = useCallback((letterId: string, accuracy: number) => {
    setState((prev) => ({
      ...prev,
      letterProgress: {
        ...prev.letterProgress,
        [letterId]: {
          letterId,
          practiced: true,
          mastered: accuracy >= 80,
          lastPracticed: new Date().toISOString(),
          accuracy,
        },
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Complete a unit (unlock next)
  const completeUnit = useCallback((unitId: number, masteryScore: number) => {
    setState((prev) => {
      const newCompletedUnits = [...prev.completedUnits];
      if (!newCompletedUnits.includes(unitId)) {
        newCompletedUnits.push(unitId);
      }

      // Unlock next unit(s)
      const newUnitProgress = { ...prev.unitProgress };
      PHONICS_UNITS.forEach((unit) => {
        if (
          !newCompletedUnits.includes(unit.id) &&
          isUnitUnlocked(unit.id, newCompletedUnits)
        ) {
          newUnitProgress[unit.id] = {
            unitId: unit.id,
            unlocked: true,
            completed: false,
            lettersCompleted: 0,
            totalLetters: unit.letters.length,
          };
        }
      });

      // Mark current unit as completed
      newUnitProgress[unitId] = {
        ...newUnitProgress[unitId],
        completed: true,
        masteryScore,
        completedAt: new Date().toISOString(),
      };

      // Set next unit as current
      const nextUnit = getNextUnit(newCompletedUnits);

      return {
        ...prev,
        unitProgress: newUnitProgress,
        completedUnits: newCompletedUnits,
        currentUnitId: nextUnit?.id || null,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setState({
      ...DEFAULT_STATE,
      unitProgress: {
        1: {
          unitId: 1,
          unlocked: true,
          completed: false,
          lettersCompleted: 0,
          totalLetters: PHONICS_UNITS[0].letters.length,
        },
      },
    });
  }, []);

  // Get progress for a specific unit
  const getUnitProgress = useCallback(
    (unitId: number): UnitProgress | undefined => {
      return state.unitProgress[unitId];
    },
    [state.unitProgress]
  );

  // Get progress for a specific letter
  const getLetterProgress = useCallback(
    (letterId: string): LetterProgress | undefined => {
      return state.letterProgress[letterId];
    },
    [state.letterProgress]
  );

  // Check if unit is unlocked
  const isUnitUnlockedCheck = useCallback(
    (unitId: number): boolean => {
      return isUnitUnlocked(unitId, state.completedUnits);
    },
    [state.completedUnits]
  );

  // Get next recommended unit
  const getNextRecommendedUnit = useCallback((): PhonicsUnit | null => {
    return getNextUnit(state.completedUnits);
  }, [state.completedUnits]);

  // Get overall progress percentage
  const getOverallProgress = useCallback((): number => {
    return calculateOverallProgress(state.completedUnits);
  }, [state.completedUnits]);

  // Get all unlocked units
  const getUnlockedUnits = useCallback((): PhonicsUnit[] => {
    return PHONICS_UNITS.filter((unit) => isUnitUnlocked(unit.id, state.completedUnits));
  }, [state.completedUnits]);

  // Update letter completion count for a unit
  const updateUnitLetterCompletion = useCallback((unitId: number) => {
    setState((prev) => {
      const unit = PHONICS_UNITS.find((u) => u.id === unitId);
      if (!unit) return prev;

      const completedLetters = unit.letters.filter(
        (letter) => prev.letterProgress[letter]?.mastered
      ).length;

      return {
        ...prev,
        unitProgress: {
          ...prev.unitProgress,
          [unitId]: {
            ...prev.unitProgress[unitId],
            lettersCompleted: completedLetters,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  return {
    // State
    state,
    isLoaded,
    currentUnitId: state.currentUnitId,
    completedUnits: state.completedUnits,

    // Actions
    startUnit,
    markLetterPracticed,
    markLetterMastered,
    completeUnit,
    resetProgress,
    updateUnitLetterCompletion,

    // Getters
    getUnitProgress,
    getLetterProgress,
    isUnitUnlocked: isUnitUnlockedCheck,
    getNextRecommendedUnit,
    getOverallProgress,
    getUnlockedUnits,
  };
}
