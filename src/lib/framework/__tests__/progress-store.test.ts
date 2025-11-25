import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useProgressStore,
  useSubjectProgress,
  useGlobalProgress,
} from '../progress-store';

describe('useProgressStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useProgressStore.getState().resetAllProgress();
  });

  describe('initializeSubject', () => {
    it('should create empty subject progress', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.initializeSubject('reading');
      });

      expect(result.current.subjects['reading']).toBeDefined();
      expect(result.current.subjects['reading'].totalXP).toBe(0);
    });

    it('should not overwrite existing subject', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.initializeSubject('reading');
        result.current.recordItemAttempt('reading', 'item-1', true);
        result.current.initializeSubject('reading'); // Try to reinitialize
      });

      const itemProgress = result.current.getItemProgress('reading', 'item-1');
      expect(itemProgress?.attempts).toBe(1);
    });
  });

  describe('recordItemAttempt', () => {
    it('should record correct attempt', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.recordItemAttempt('reading', 'letter-a', true);
      });

      const progress = result.current.getItemProgress('reading', 'letter-a');
      expect(progress?.attempts).toBe(1);
      expect(progress?.correctAttempts).toBe(1);
      expect(progress?.mastery).toBeGreaterThan(0);
    });

    it('should record incorrect attempt', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.recordItemAttempt('reading', 'letter-a', true);
        result.current.recordItemAttempt('reading', 'letter-a', false);
      });

      const progress = result.current.getItemProgress('reading', 'letter-a');
      expect(progress?.attempts).toBe(2);
      expect(progress?.correctAttempts).toBe(1);
    });

    it('should track streak count', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.recordItemAttempt('reading', 'letter-a', true);
        result.current.recordItemAttempt('reading', 'letter-a', true);
        result.current.recordItemAttempt('reading', 'letter-a', true);
      });

      const progress = result.current.getItemProgress('reading', 'letter-a');
      expect(progress?.streakCount).toBe(3);
    });

    it('should reset streak on incorrect', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.recordItemAttempt('reading', 'letter-a', true);
        result.current.recordItemAttempt('reading', 'letter-a', true);
        result.current.recordItemAttempt('reading', 'letter-a', false);
      });

      const progress = result.current.getItemProgress('reading', 'letter-a');
      expect(progress?.streakCount).toBe(0);
    });
  });

  describe('completeLesson', () => {
    it('should mark lesson as completed', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.completeLesson('reading', 'lesson-1', 85);
      });

      const progress = result.current.getLessonProgress('reading', 'lesson-1');
      expect(progress?.completed).toBe(true);
      expect(progress?.starsEarned).toBe(2); // 85 = 2 stars
    });

    it('should award 3 stars for 90+ score', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.completeLesson('reading', 'lesson-1', 95);
      });

      const progress = result.current.getLessonProgress('reading', 'lesson-1');
      expect(progress?.starsEarned).toBe(3);
    });

    it('should keep best score on replay', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.completeLesson('reading', 'lesson-1', 95);
        result.current.completeLesson('reading', 'lesson-1', 70);
      });

      const progress = result.current.getLessonProgress('reading', 'lesson-1');
      expect(progress?.bestScore).toBe(95);
      expect(progress?.starsEarned).toBe(3);
    });
  });

  describe('unlockUnit', () => {
    it('should unlock a unit', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.unlockUnit('reading', 'unit-2');
      });

      expect(result.current.isUnitUnlocked('reading', 'unit-2')).toBe(true);
    });
  });

  describe('completeUnit', () => {
    it('should mark unit as completed', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.completeUnit('reading', 'unit-1');
      });

      const progress = result.current.getUnitProgress('reading', 'unit-1');
      expect(progress?.completed).toBe(true);
      expect(progress?.completedAt).toBeDefined();
    });
  });

  describe('completeActivity', () => {
    it('should add XP to total', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.completeActivity({
          activityId: 'activity-1',
          subjectId: 'reading',
          activityType: 'quiz',
          isCorrect: true,
          score: 100,
          xpEarned: 15,
          duration: 60,
          attempts: 1,
          timestamp: new Date().toISOString(),
        });
      });

      expect(result.current.totalXP).toBe(15);
    });

    it('should level up when XP threshold reached', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        // Add enough XP to level up (100 XP for level 2)
        result.current.completeActivity({
          activityId: 'activity-1',
          subjectId: 'reading',
          activityType: 'quiz',
          isCorrect: true,
          score: 100,
          xpEarned: 150,
          duration: 60,
          attempts: 1,
          timestamp: new Date().toISOString(),
        });
      });

      expect(result.current.currentLevel).toBeGreaterThan(1);
    });
  });

  describe('getters', () => {
    it('getItemMastery should return 0 for unknown item', () => {
      const { result } = renderHook(() => useProgressStore());
      expect(result.current.getItemMastery('reading', 'unknown')).toBe(0);
    });

    it('isItemCompleted should check against threshold', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        // Get mastery to 80+
        for (let i = 0; i < 4; i++) {
          result.current.recordItemAttempt('reading', 'letter-a', true);
        }
      });

      expect(result.current.isItemCompleted('reading', 'letter-a')).toBe(true);
    });

    it('isLessonCompleted should return false for incomplete', () => {
      const { result } = renderHook(() => useProgressStore());
      expect(result.current.isLessonCompleted('reading', 'lesson-1')).toBe(false);
    });
  });

  describe('resetAllProgress', () => {
    it('should reset all state', () => {
      const { result } = renderHook(() => useProgressStore());

      act(() => {
        result.current.recordItemAttempt('reading', 'letter-a', true);
        result.current.completeLesson('reading', 'lesson-1', 100);
        result.current.resetAllProgress();
      });

      expect(result.current.totalXP).toBe(0);
      expect(result.current.currentLevel).toBe(1);
      expect(Object.keys(result.current.subjects)).toHaveLength(0);
    });
  });
});

describe('useSubjectProgress', () => {
  beforeEach(() => {
    useProgressStore.getState().resetAllProgress();
  });

  it('should auto-initialize subject', () => {
    const { result } = renderHook(() => useSubjectProgress('math'));
    expect(result.current.progress).not.toBeNull();
  });

  it('should provide subject-specific helpers', () => {
    const { result } = renderHook(() => useSubjectProgress('reading'));

    act(() => {
      result.current.recordAttempt('item-1', true);
    });

    expect(result.current.getItemMastery('item-1')).toBeGreaterThan(0);
  });
});

describe('useGlobalProgress', () => {
  beforeEach(() => {
    useProgressStore.getState().resetAllProgress();
  });

  it('should return global stats', () => {
    const { result } = renderHook(() => useGlobalProgress());

    expect(result.current.totalXP).toBe(0);
    expect(result.current.currentLevel).toBe(1);
  });

  it('should calculate XP for next level', () => {
    const { result } = renderHook(() => useGlobalProgress());
    expect(result.current.xpForNextLevel).toBe(100);
  });
});
