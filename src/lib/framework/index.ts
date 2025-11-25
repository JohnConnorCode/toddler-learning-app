/**
 * Learning Framework
 *
 * A modular, extensible framework for building educational applications.
 * Supports multiple subjects (reading, math, etc.) with consistent
 * progress tracking, activity management, and analytics.
 *
 * @example
 * ```tsx
 * import {
 *   useSubjectProgress,
 *   getSubject,
 *   createActivityResult,
 * } from '@/lib/framework';
 *
 * // Use subject-specific progress
 * const { recordAttempt, getItemMastery } = useSubjectProgress('reading');
 *
 * // Get subject configuration
 * const readingConfig = getSubject('reading');
 *
 * // Create activity result
 * const result = createActivityResult(activityId, 'reading', 'phonics', answers, 2, startTime);
 * ```
 */

// Core types
export type {
  // Content types
  BaseContentItem,
  BaseUnit,
  BaseLesson,
  BaseActivity,
  DifficultyLevel,

  // Progress types
  ItemProgress,
  UnitProgress,
  LessonProgress,
  SubjectProgress,
  ActivityResult,
  LearningSession,

  // Configuration types
  MasteryConfig,
  SubjectId,
  ColorTheme,
  IconConfig,
} from './types';

// Type utilities
export {
  calculateMastery,
  calculateXP,
  calculateStars,
  DEFAULT_MASTERY_CONFIG,
} from './types';

// Subject registry
export type { SubjectConfig, SubjectCategory, ActivityTypeConfig } from './subject-registry';

export {
  SUBJECTS,
  ACTIVITY_TYPES,
  getSubject,
  getEnabledSubjects,
  getAllSubjects,
  getActivityType,
  getActivityTypesForSubject,
  isActivityValidForSubject,
  getCategoriesForSubject,
  registerSubject,
  registerActivityType,
  setSubjectEnabled,
} from './subject-registry';

// Progress store
export type { ProgressState } from './progress-store';

export {
  useProgressStore,
  useSubjectProgress,
  useReadingProgress,
  useMathProgress,
  useGlobalProgress,
} from './progress-store';

// Activity interface
export type {
  ActivityComponentProps,
  ActivityProgress,
  ActivityConfig,
  ActivityState,
  ActivityAnswer,
  ActivityPhase,
  ActivityAction,
  FeedbackConfig,
} from './activity-interface';

export {
  calculateActivityScore,
  calculateActivityXP,
  createActivityResult,
  createInitialActivityState,
  activityReducer,
  getRandomFeedback,
  shouldCelebrate,
  DEFAULT_FEEDBACK_CONFIG,
} from './activity-interface';
