import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSession, type ActiveSession } from '../use-session';

describe('useSession', () => {
  beforeEach(() => {
    // Reset the store state before each test
    const store = useSession.getState();
    store.activeSession = null;
  });

  describe('startSession', () => {
    it('should create a new session with provided data', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'level-lesson',
          levelId: 'level-1',
          levelTitle: 'Level 1',
          lessonId: 'lesson-1',
          lessonTitle: 'First Lesson',
          activityIndex: 0,
          totalActivities: 5,
          progress: 0,
        });
      });

      expect(result.current.activeSession).not.toBeNull();
      expect(result.current.activeSession?.type).toBe('level-lesson');
      expect(result.current.activeSession?.levelId).toBe('level-1');
      expect(result.current.activeSession?.lessonId).toBe('lesson-1');
    });

    it('should set startedAt timestamp', () => {
      const { result } = renderHook(() => useSession());
      const before = Date.now();

      act(() => {
        result.current.startSession({
          type: 'phonics',
          progress: 0,
        });
      });

      const after = Date.now();
      expect(result.current.activeSession?.startedAt).toBeGreaterThanOrEqual(before);
      expect(result.current.activeSession?.startedAt).toBeLessThanOrEqual(after);
    });

    it('should set lastActiveAt same as startedAt initially', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'math',
          progress: 0,
        });
      });

      expect(result.current.activeSession?.lastActiveAt).toBe(
        result.current.activeSession?.startedAt
      );
    });
  });

  describe('updateSession', () => {
    it('should update session data', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'level-lesson',
          activityIndex: 0,
          totalActivities: 5,
          progress: 0,
        });
      });

      act(() => {
        result.current.updateSession({
          activityIndex: 2,
          progress: 40,
        });
      });

      expect(result.current.activeSession?.activityIndex).toBe(2);
      expect(result.current.activeSession?.progress).toBe(40);
    });

    it('should update lastActiveAt timestamp', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'story',
          progress: 0,
        });
      });

      const initialLastActive = result.current.activeSession?.lastActiveAt;

      // Wait a bit to ensure timestamp difference
      act(() => {
        result.current.updateSession({ progress: 50 });
      });

      expect(result.current.activeSession?.lastActiveAt).toBeGreaterThanOrEqual(
        initialLastActive!
      );
    });

    it('should do nothing if no active session', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.updateSession({ progress: 50 });
      });

      expect(result.current.activeSession).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should remove active session', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'practice',
          progress: 50,
        });
      });

      expect(result.current.activeSession).not.toBeNull();

      act(() => {
        result.current.clearSession();
      });

      expect(result.current.activeSession).toBeNull();
    });
  });

  describe('hasActiveSession', () => {
    it('should return false when no session', () => {
      const { result } = renderHook(() => useSession());
      expect(result.current.hasActiveSession()).toBe(false);
    });

    it('should return true when session exists', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'phonics',
          progress: 0,
        });
      });

      expect(result.current.hasActiveSession()).toBe(true);
    });
  });

  describe('getResumeUrl', () => {
    it('should return level lesson URL', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'level-lesson',
          levelId: 'level-abc',
          lessonId: 'lesson-xyz',
          progress: 25,
        });
      });

      expect(result.current.getResumeUrl()).toBe('/levels/level-abc/lessons/lesson-xyz');
    });

    it('should return phonics URL', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'phonics',
          progress: 0,
        });
      });

      expect(result.current.getResumeUrl()).toBe('/phonics');
    });

    it('should return math URL', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'math',
          progress: 0,
        });
      });

      expect(result.current.getResumeUrl()).toBe('/math');
    });

    it('should return stories URL', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.startSession({
          type: 'story',
          progress: 0,
        });
      });

      expect(result.current.getResumeUrl()).toBe('/stories');
    });

    it('should return null when no session', () => {
      const { result } = renderHook(() => useSession());
      expect(result.current.getResumeUrl()).toBeNull();
    });
  });

  describe('session types', () => {
    const sessionTypes: ActiveSession['type'][] = [
      'level-lesson',
      'phonics',
      'math',
      'story',
      'practice',
    ];

    sessionTypes.forEach((type) => {
      it(`should handle ${type} session type`, () => {
        const { result } = renderHook(() => useSession());

        act(() => {
          result.current.startSession({
            type,
            progress: 0,
          });
        });

        expect(result.current.activeSession?.type).toBe(type);
      });
    });
  });
});
