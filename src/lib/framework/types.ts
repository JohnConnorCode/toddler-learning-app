/**
 * Core Framework Types
 *
 * This module defines the foundational types for a modular, multi-subject
 * learning platform. Currently supports reading/phonics, designed to extend
 * to math, science, and other subjects.
 */

// ============================================
// CONTENT TYPES
// ============================================

/**
 * Base interface for all learning content items
 */
export interface BaseContentItem {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  description?: string;
  image?: string;
  audio?: string;
  hints?: string[];
  tags?: string[];
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/**
 * A learning unit groups related content items
 */
export interface BaseUnit<T extends BaseContentItem = BaseContentItem> {
  id: string;
  title: string;
  description: string;
  items: T[];
  prerequisites?: string[];
  color?: string;
  icon?: string;
  estimatedMinutes?: number;
  order?: number;
}

/**
 * A lesson contains multiple activities
 */
export interface BaseLesson {
  id: string;
  unitId?: string;
  title: string;
  description?: string;
  activities: BaseActivity[];
  objectives?: string[];
  estimatedMinutes?: number;
  order?: number;
}

/**
 * An activity is a single interactive learning task
 */
export interface BaseActivity {
  id: string;
  type: string; // Activity type from registry
  title: string;
  description?: string;
  contentId?: string; // Reference to content item
  contentIds?: string[]; // For activities with multiple items
  duration?: number; // Expected duration in seconds
  config?: Record<string, unknown>; // Activity-specific configuration
}

// ============================================
// PROGRESS TYPES
// ============================================

/**
 * Progress tracking for a single content item
 */
export interface ItemProgress {
  itemId: string;
  subjectId: string;
  attempts: number;
  correctAttempts: number;
  mastery: number; // 0-100
  lastAttempted?: string; // ISO date
  completedAt?: string; // ISO date when mastery >= threshold
  timeSpent: number; // Total seconds
  streakCount: number; // Current correct streak
}

/**
 * Progress tracking for a unit
 */
export interface UnitProgress {
  unitId: string;
  subjectId: string;
  unlocked: boolean;
  started: boolean;
  completed: boolean;
  itemsCompleted: number;
  totalItems: number;
  masteryAverage: number;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Progress tracking for a lesson
 */
export interface LessonProgress {
  lessonId: string;
  subjectId: string;
  unitId?: string;
  started: boolean;
  completed: boolean;
  activitiesCompleted: number;
  totalActivities: number;
  starsEarned: number; // 0-3 stars
  bestScore?: number;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Overall progress for a subject
 */
export interface SubjectProgress {
  subjectId: string;
  itemProgress: Record<string, ItemProgress>;
  unitProgress: Record<string, UnitProgress>;
  lessonProgress: Record<string, LessonProgress>;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt?: string;
  startedAt?: string;
}

// ============================================
// ACTIVITY RESULT TYPES
// ============================================

/**
 * Result of completing an activity
 */
export interface ActivityResult {
  activityId: string;
  subjectId: string;
  activityType: string;
  itemId?: string;
  isCorrect: boolean;
  score: number; // 0-100
  xpEarned: number;
  duration: number; // Seconds
  attempts: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Session tracking for analytics
 */
export interface LearningSession {
  id: string;
  profileId: string;
  subjectId: string;
  startedAt: string;
  endedAt?: string;
  activities: ActivityResult[];
  totalXP: number;
  itemsCompleted: number;
}

// ============================================
// MASTERY & PROGRESSION
// ============================================

export interface MasteryConfig {
  /** Points gained per correct answer */
  correctGain: number;
  /** Points lost per incorrect answer */
  incorrectLoss: number;
  /** Minimum attempts before mastery can reach 100 */
  minAttemptsForMastery: number;
  /** Mastery threshold to consider item "completed" */
  completionThreshold: number;
  /** Decay rate per day of inactivity (0-1) */
  decayRate: number;
}

export const DEFAULT_MASTERY_CONFIG: MasteryConfig = {
  correctGain: 25,
  incorrectLoss: 10,
  minAttemptsForMastery: 3,
  completionThreshold: 80,
  decayRate: 0.05,
};

/**
 * Calculate new mastery score
 */
export function calculateMastery(
  currentMastery: number,
  isCorrect: boolean,
  attempts: number,
  config: MasteryConfig = DEFAULT_MASTERY_CONFIG
): number {
  if (isCorrect) {
    // Scale gain based on attempts - faster mastery with fewer attempts
    const gainMultiplier = Math.max(1, config.minAttemptsForMastery / Math.max(attempts, 1));
    const gain = config.correctGain * Math.min(gainMultiplier, 2);
    return Math.min(100, currentMastery + gain);
  } else {
    return Math.max(0, currentMastery - config.incorrectLoss);
  }
}

/**
 * Calculate XP earned from activity
 */
export function calculateXP(
  score: number,
  difficulty: DifficultyLevel,
  isFirstCompletion: boolean
): number {
  const baseXP = score * 0.1; // 0-10 XP based on score
  const difficultyBonus = difficulty * 2; // 2-10 bonus based on difficulty
  const firstCompletionBonus = isFirstCompletion ? 5 : 0;

  return Math.round(baseXP + difficultyBonus + firstCompletionBonus);
}

/**
 * Calculate stars earned (0-3) based on score
 */
export function calculateStars(score: number): 0 | 1 | 2 | 3 {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

// ============================================
// UTILITY TYPES
// ============================================

export type SubjectId = 'reading' | 'math' | 'science' | 'art' | string;

export interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  accent?: string;
}

export interface IconConfig {
  name: string;
  library?: 'lucide' | 'custom';
  emoji?: string;
}
