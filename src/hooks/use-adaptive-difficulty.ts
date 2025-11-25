"use client";

/**
 * Adaptive Difficulty Hook
 *
 * Tracks user performance and dynamically adjusts difficulty to maintain
 * optimal challenge level (not too easy, not too hard).
 *
 * Research shows children learn best in the "zone of proximal development"
 * where tasks are challenging but achievable with effort.
 */

import { useState, useCallback, useMemo, useEffect } from "react";

// Performance tracking window
const PERFORMANCE_WINDOW = 10; // Last N attempts to consider
const MIN_ATTEMPTS_FOR_ADJUSTMENT = 3; // Need at least this many attempts

// Difficulty adjustment thresholds
const INCREASE_THRESHOLD = 0.85; // If >85% correct, increase difficulty
const DECREASE_THRESHOLD = 0.50; // If <50% correct, decrease difficulty
const HINT_THRESHOLD = 0.40; // If <40% correct, start showing hints

// Difficulty levels
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

interface AttemptRecord {
  timestamp: number;
  isCorrect: boolean;
  difficulty: DifficultyLevel;
  problemId: string;
  attempts: number; // How many tries it took
}

interface AdaptiveDifficultyState {
  currentDifficulty: DifficultyLevel;
  recentAttempts: AttemptRecord[];
  showHints: boolean;
  streakCount: number;
  longestStreak: number;
}

interface AdaptiveDifficultyReturn {
  /** Current recommended difficulty level */
  difficulty: DifficultyLevel;
  /** Whether to show hints based on recent performance */
  showHints: boolean;
  /** Current correct streak */
  streak: number;
  /** Longest streak achieved */
  longestStreak: number;
  /** Success rate over recent attempts */
  successRate: number;
  /** Record a problem attempt */
  recordAttempt: (problemId: string, isCorrect: boolean, attempts: number, difficulty: DifficultyLevel) => void;
  /** Manually adjust difficulty */
  setDifficulty: (level: DifficultyLevel) => void;
  /** Reset adaptive state */
  reset: () => void;
  /** Get performance summary */
  getPerformanceSummary: () => PerformanceSummary;
}

interface PerformanceSummary {
  totalAttempts: number;
  correctAttempts: number;
  successRate: number;
  averageAttempts: number;
  difficultyTrend: "increasing" | "decreasing" | "stable";
  recommendation: string;
}

const STORAGE_KEY = "adaptive-difficulty-state";

function loadState(): AdaptiveDifficultyState {
  if (typeof window === "undefined") {
    return getDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out old attempts (older than 7 days)
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      parsed.recentAttempts = (parsed.recentAttempts || []).filter(
        (a: AttemptRecord) => a.timestamp > cutoff
      );
      return { ...getDefaultState(), ...parsed };
    }
  } catch {
    // Ignore errors
  }
  return getDefaultState();
}

function getDefaultState(): AdaptiveDifficultyState {
  return {
    currentDifficulty: 1,
    recentAttempts: [],
    showHints: false,
    streakCount: 0,
    longestStreak: 0,
  };
}

function saveState(state: AdaptiveDifficultyState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore errors
  }
}

/**
 * Hook for adaptive difficulty management
 */
export function useAdaptiveDifficulty(
  subjectId: string = "default"
): AdaptiveDifficultyReturn {
  const [state, setState] = useState<AdaptiveDifficultyState>(getDefaultState);

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Calculate success rate from recent attempts
  const successRate = useMemo(() => {
    if (state.recentAttempts.length === 0) return 0.5; // Default to 50%

    const recent = state.recentAttempts.slice(-PERFORMANCE_WINDOW);
    const correct = recent.filter((a) => a.isCorrect).length;
    return correct / recent.length;
  }, [state.recentAttempts]);

  // Determine if we should show hints
  const shouldShowHints = useMemo(() => {
    if (state.recentAttempts.length < MIN_ATTEMPTS_FOR_ADJUSTMENT) {
      return false;
    }
    return successRate < HINT_THRESHOLD || state.showHints;
  }, [state.recentAttempts.length, successRate, state.showHints]);

  // Calculate recommended difficulty adjustment
  const calculateNewDifficulty = useCallback(
    (current: DifficultyLevel, rate: number): DifficultyLevel => {
      if (state.recentAttempts.length < MIN_ATTEMPTS_FOR_ADJUSTMENT) {
        return current; // Not enough data
      }

      if (rate >= INCREASE_THRESHOLD && current < 5) {
        return (current + 1) as DifficultyLevel;
      }

      if (rate < DECREASE_THRESHOLD && current > 1) {
        return (current - 1) as DifficultyLevel;
      }

      return current;
    },
    [state.recentAttempts.length]
  );

  // Record an attempt
  const recordAttempt = useCallback(
    (
      problemId: string,
      isCorrect: boolean,
      attempts: number,
      difficulty: DifficultyLevel
    ) => {
      setState((prev) => {
        const newAttempt: AttemptRecord = {
          timestamp: Date.now(),
          isCorrect,
          difficulty,
          problemId,
          attempts,
        };

        // Add to recent attempts (keep last PERFORMANCE_WINDOW * 2)
        const newAttempts = [
          ...prev.recentAttempts.slice(-(PERFORMANCE_WINDOW * 2 - 1)),
          newAttempt,
        ];

        // Calculate new success rate
        const recent = newAttempts.slice(-PERFORMANCE_WINDOW);
        const correct = recent.filter((a) => a.isCorrect).length;
        const rate = correct / recent.length;

        // Update streak
        const newStreak = isCorrect ? prev.streakCount + 1 : 0;
        const newLongestStreak = Math.max(newStreak, prev.longestStreak);

        // Calculate new difficulty
        const newDifficulty =
          newAttempts.length >= MIN_ATTEMPTS_FOR_ADJUSTMENT
            ? calculateNewDifficulty(prev.currentDifficulty, rate)
            : prev.currentDifficulty;

        // Update hints based on performance
        const newShowHints =
          rate < HINT_THRESHOLD && newAttempts.length >= MIN_ATTEMPTS_FOR_ADJUSTMENT;

        const newState: AdaptiveDifficultyState = {
          currentDifficulty: newDifficulty,
          recentAttempts: newAttempts,
          showHints: newShowHints,
          streakCount: newStreak,
          longestStreak: newLongestStreak,
        };

        saveState(newState);
        return newState;
      });
    },
    [calculateNewDifficulty]
  );

  // Manual difficulty adjustment
  const setDifficulty = useCallback((level: DifficultyLevel) => {
    setState((prev) => {
      const newState = { ...prev, currentDifficulty: level };
      saveState(newState);
      return newState;
    });
  }, []);

  // Reset state
  const reset = useCallback(() => {
    const defaultState = getDefaultState();
    setState(defaultState);
    saveState(defaultState);
  }, []);

  // Get performance summary
  const getPerformanceSummary = useCallback((): PerformanceSummary => {
    const attempts = state.recentAttempts;
    const totalAttempts = attempts.length;

    if (totalAttempts === 0) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        successRate: 0,
        averageAttempts: 0,
        difficultyTrend: "stable",
        recommendation: "Start learning to see your progress!",
      };
    }

    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const avgAttempts =
      attempts.reduce((sum, a) => sum + a.attempts, 0) / totalAttempts;

    // Calculate difficulty trend
    const firstHalf = attempts.slice(0, Math.floor(totalAttempts / 2));
    const secondHalf = attempts.slice(Math.floor(totalAttempts / 2));

    const firstAvgDiff =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, a) => sum + a.difficulty, 0) / firstHalf.length
        : 0;
    const secondAvgDiff =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, a) => sum + a.difficulty, 0) / secondHalf.length
        : 0;

    let difficultyTrend: "increasing" | "decreasing" | "stable" = "stable";
    if (secondAvgDiff - firstAvgDiff > 0.5) {
      difficultyTrend = "increasing";
    } else if (firstAvgDiff - secondAvgDiff > 0.5) {
      difficultyTrend = "decreasing";
    }

    // Generate recommendation
    let recommendation: string;
    const rate = correctAttempts / totalAttempts;

    if (rate >= INCREASE_THRESHOLD) {
      recommendation = "Excellent! Ready for harder problems!";
    } else if (rate >= 0.7) {
      recommendation = "Great progress! Keep practicing!";
    } else if (rate >= DECREASE_THRESHOLD) {
      recommendation = "Good effort! Take your time with each problem.";
    } else {
      recommendation = "Let's practice together! Hints are here to help.";
    }

    return {
      totalAttempts,
      correctAttempts,
      successRate: rate,
      averageAttempts: avgAttempts,
      difficultyTrend,
      recommendation,
    };
  }, [state.recentAttempts]);

  return {
    difficulty: state.currentDifficulty,
    showHints: shouldShowHints,
    streak: state.streakCount,
    longestStreak: state.longestStreak,
    successRate,
    recordAttempt,
    setDifficulty,
    reset,
    getPerformanceSummary,
  };
}

/**
 * Get problems filtered by difficulty
 */
export function filterProblemsByDifficulty<T extends { difficulty: number }>(
  problems: T[],
  targetDifficulty: DifficultyLevel,
  count: number = 10
): T[] {
  // Get problems at or near target difficulty
  const atTarget = problems.filter((p) => p.difficulty === targetDifficulty);
  const nearTarget = problems.filter(
    (p) => Math.abs(p.difficulty - targetDifficulty) === 1
  );

  // Prioritize exact matches, then nearby
  const selected: T[] = [];

  // Add problems at target difficulty
  const shuffledTarget = [...atTarget].sort(() => Math.random() - 0.5);
  selected.push(...shuffledTarget.slice(0, Math.ceil(count * 0.7)));

  // Fill remaining with nearby difficulty
  if (selected.length < count && nearTarget.length > 0) {
    const shuffledNear = [...nearTarget].sort(() => Math.random() - 0.5);
    selected.push(...shuffledNear.slice(0, count - selected.length));
  }

  // If still not enough, add any remaining
  if (selected.length < count) {
    const remaining = problems.filter((p) => !selected.includes(p));
    const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5);
    selected.push(...shuffledRemaining.slice(0, count - selected.length));
  }

  // Shuffle final selection
  return selected.sort(() => Math.random() - 0.5);
}
