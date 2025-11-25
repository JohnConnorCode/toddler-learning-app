import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDailyGoals, useActivityTimer } from '../use-daily-goals';

// Mock date for consistent testing
const mockDate = new Date('2024-01-15T10:00:00Z');

describe('useDailyGoals', () => {
  beforeEach(() => {
    // Reset the store state before each test
    const store = useDailyGoals.getState();
    store.todayMinutes = 0;
    store.todayDate = mockDate.toISOString().split('T')[0];
    store.currentStreak = 0;
    store.longestStreak = 0;
    store.lastCompletedDate = null;
    store.dailyGoalMinutes = 15;
  });

  describe('initial state', () => {
    it('should have default daily goal of 15 minutes', () => {
      const { result } = renderHook(() => useDailyGoals());
      expect(result.current.dailyGoalMinutes).toBe(15);
    });

    it('should start with 0 minutes today', () => {
      const { result } = renderHook(() => useDailyGoals());
      expect(result.current.todayMinutes).toBe(0);
    });
  });

  describe('setDailyGoal', () => {
    it('should update daily goal', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.setDailyGoal(20);
      });
      expect(result.current.dailyGoalMinutes).toBe(20);
    });

    it('should clamp goal to minimum 5 minutes', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.setDailyGoal(2);
      });
      expect(result.current.dailyGoalMinutes).toBe(5);
    });

    it('should clamp goal to maximum 60 minutes', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.setDailyGoal(100);
      });
      expect(result.current.dailyGoalMinutes).toBe(60);
    });
  });

  describe('addMinutes', () => {
    it('should add minutes to today total', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(5);
      });
      expect(result.current.todayMinutes).toBe(5);
    });

    it('should accumulate minutes across multiple adds', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(3);
        result.current.addMinutes(4);
        result.current.addMinutes(2);
      });
      expect(result.current.todayMinutes).toBe(9);
    });
  });

  describe('getTodayProgress', () => {
    it('should return 0% when no minutes logged', () => {
      const { result } = renderHook(() => useDailyGoals());
      expect(result.current.getTodayProgress()).toBe(0);
    });

    it('should return percentage of goal completed', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(7.5); // Half of 15 minutes
      });
      expect(result.current.getTodayProgress()).toBe(50);
    });

    it('should cap at 100%', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(30); // Double the goal
      });
      expect(result.current.getTodayProgress()).toBe(100);
    });
  });

  describe('isGoalComplete', () => {
    it('should return false when goal not met', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(10);
      });
      expect(result.current.isGoalComplete()).toBe(false);
    });

    it('should return true when goal is met', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(15);
      });
      expect(result.current.isGoalComplete()).toBe(true);
    });

    it('should return true when goal is exceeded', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(20);
      });
      expect(result.current.isGoalComplete()).toBe(true);
    });
  });

  describe('getMinutesRemaining', () => {
    it('should return full goal when no minutes logged', () => {
      const { result } = renderHook(() => useDailyGoals());
      expect(result.current.getMinutesRemaining()).toBe(15);
    });

    it('should return remaining minutes', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(10);
      });
      expect(result.current.getMinutesRemaining()).toBe(5);
    });

    it('should return 0 when goal exceeded', () => {
      const { result } = renderHook(() => useDailyGoals());
      act(() => {
        result.current.addMinutes(20);
      });
      expect(result.current.getMinutesRemaining()).toBe(0);
    });
  });
});

describe('useActivityTimer', () => {
  beforeEach(() => {
    const store = useDailyGoals.getState();
    store.todayMinutes = 0;
  });

  it('should track activity duration in minutes', () => {
    const { result } = renderHook(() => useActivityTimer());
    act(() => {
      result.current.trackActivity(120); // 2 minutes in seconds
    });
    const dailyGoalsState = useDailyGoals.getState();
    expect(dailyGoalsState.todayMinutes).toBe(2);
  });

  it('should not track activities shorter than 30 seconds', () => {
    const { result } = renderHook(() => useActivityTimer());
    act(() => {
      result.current.trackActivity(20); // 20 seconds
    });
    const dailyGoalsState = useDailyGoals.getState();
    expect(dailyGoalsState.todayMinutes).toBe(0);
  });

  it('should track activities of exactly 30 seconds', () => {
    const { result } = renderHook(() => useActivityTimer());
    act(() => {
      result.current.trackActivity(30);
    });
    const dailyGoalsState = useDailyGoals.getState();
    expect(dailyGoalsState.todayMinutes).toBe(0.5);
  });
});
