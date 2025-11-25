/**
 * Standardized Activity Component Interface
 *
 * Defines the contract that all activity components must implement.
 * Enables consistent behavior and data flow across different activity types.
 */

import type {
  BaseContentItem,
  ActivityResult,
  DifficultyLevel,
  SubjectId,
} from './types';

// ============================================
// ACTIVITY COMPONENT PROPS
// ============================================

/**
 * Base props that every activity component receives
 */
export interface ActivityComponentProps<TContent = BaseContentItem> {
  /** The content item(s) for this activity */
  content: TContent | TContent[];

  /** Subject this activity belongs to */
  subjectId: SubjectId;

  /** Activity type identifier */
  activityType: string;

  /** Activity ID for tracking */
  activityId: string;

  /** Current difficulty level */
  difficulty: DifficultyLevel;

  /** Callback when activity is completed */
  onComplete: (result: ActivityResult) => void;

  /** Callback when user exits/cancels */
  onExit: () => void;

  /** Callback for partial progress */
  onProgress?: (progress: ActivityProgress) => void;

  /** Whether to show hints */
  showHints?: boolean;

  /** Whether audio is enabled */
  audioEnabled?: boolean;

  /** Custom configuration for this activity instance */
  config?: ActivityConfig;
}

/**
 * Progress update during activity
 */
export interface ActivityProgress {
  /** Items completed so far */
  itemsCompleted: number;
  /** Total items in activity */
  totalItems: number;
  /** Correct answers so far */
  correctAnswers: number;
  /** Current score (0-100) */
  currentScore: number;
  /** Time elapsed in seconds */
  timeElapsed: number;
}

/**
 * Activity-specific configuration
 */
export interface ActivityConfig {
  /** Time limit in seconds (0 = no limit) */
  timeLimit?: number;
  /** Number of items to include */
  itemCount?: number;
  /** Whether to shuffle items */
  shuffleItems?: boolean;
  /** Number of attempts allowed per item */
  attemptsPerItem?: number;
  /** Whether to show immediate feedback */
  immediateFeedback?: boolean;
  /** Whether to allow skipping */
  allowSkip?: boolean;
  /** Custom styling overrides */
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}

// ============================================
// ACTIVITY STATE MANAGEMENT
// ============================================

/**
 * Common state structure for activity components
 */
export interface ActivityState<TContent = BaseContentItem> {
  /** Current item index */
  currentIndex: number;
  /** All items in this activity */
  items: TContent[];
  /** Answers given by user */
  answers: ActivityAnswer[];
  /** Current phase of activity */
  phase: ActivityPhase;
  /** Start time */
  startedAt: number;
  /** Attempts on current item */
  currentAttempts: number;
}

export interface ActivityAnswer {
  itemId: string;
  userAnswer: unknown;
  correctAnswer: unknown;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number; // milliseconds
}

export type ActivityPhase =
  | 'intro' // Showing instructions
  | 'active' // User is interacting
  | 'feedback' // Showing result of attempt
  | 'complete' // Activity finished
  | 'paused'; // Activity paused

// ============================================
// ACTIVITY RESULT HELPERS
// ============================================

/**
 * Calculate final score from answers
 */
export function calculateActivityScore(answers: ActivityAnswer[]): number {
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
}

/**
 * Calculate XP earned from activity
 */
export function calculateActivityXP(
  score: number,
  difficulty: DifficultyLevel,
  totalItems: number,
  timeBonus: boolean = false
): number {
  // Base XP from score
  const baseXP = Math.round((score / 100) * totalItems * 2);

  // Difficulty multiplier (1x to 2x)
  const difficultyMultiplier = 0.8 + difficulty * 0.2;

  // Time bonus (10% extra if completed quickly)
  const timeBonusMultiplier = timeBonus ? 1.1 : 1;

  return Math.round(baseXP * difficultyMultiplier * timeBonusMultiplier);
}

/**
 * Create activity result object
 */
export function createActivityResult(
  activityId: string,
  subjectId: SubjectId,
  activityType: string,
  answers: ActivityAnswer[],
  difficulty: DifficultyLevel,
  startTime: number
): ActivityResult {
  const score = calculateActivityScore(answers);
  const duration = Math.round((Date.now() - startTime) / 1000);
  const xpEarned = calculateActivityXP(score, difficulty, answers.length);

  return {
    activityId,
    subjectId,
    activityType,
    isCorrect: score >= 70, // 70% threshold for "correct"
    score,
    xpEarned,
    duration,
    attempts: answers.reduce((sum, a) => sum + a.attempts, 0),
    timestamp: new Date().toISOString(),
    metadata: {
      totalItems: answers.length,
      correctItems: answers.filter((a) => a.isCorrect).length,
      difficulty,
    },
  };
}

// ============================================
// ACTIVITY HOOKS HELPERS
// ============================================

/**
 * Initial state creator for activity components
 */
export function createInitialActivityState<TContent extends BaseContentItem>(
  items: TContent[],
  config?: ActivityConfig
): ActivityState<TContent> {
  const shuffledItems = config?.shuffleItems
    ? [...items].sort(() => Math.random() - 0.5)
    : items;

  const limitedItems = config?.itemCount
    ? shuffledItems.slice(0, config.itemCount)
    : shuffledItems;

  return {
    currentIndex: 0,
    items: limitedItems,
    answers: [],
    phase: 'intro',
    startedAt: Date.now(),
    currentAttempts: 0,
  };
}

/**
 * Reducer actions for activity state
 */
export type ActivityAction<TContent = BaseContentItem> =
  | { type: 'START' }
  | { type: 'SUBMIT_ANSWER'; answer: ActivityAnswer }
  | { type: 'NEXT_ITEM' }
  | { type: 'SKIP_ITEM' }
  | { type: 'SHOW_FEEDBACK' }
  | { type: 'COMPLETE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RETRY' }
  | { type: 'RESET'; items: TContent[] };

/**
 * Reducer for activity state
 */
export function activityReducer<TContent extends BaseContentItem>(
  state: ActivityState<TContent>,
  action: ActivityAction<TContent>
): ActivityState<TContent> {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'active', startedAt: Date.now() };

    case 'SUBMIT_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.answer],
        phase: 'feedback',
        currentAttempts: 0,
      };

    case 'NEXT_ITEM':
      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.items.length;
      return {
        ...state,
        currentIndex: nextIndex,
        phase: isComplete ? 'complete' : 'active',
        currentAttempts: 0,
      };

    case 'SKIP_ITEM':
      const skipAnswer: ActivityAnswer = {
        itemId: state.items[state.currentIndex].id,
        userAnswer: null,
        correctAnswer: null,
        isCorrect: false,
        attempts: 0,
        timeSpent: 0,
      };
      return activityReducer(
        { ...state, answers: [...state.answers, skipAnswer] },
        { type: 'NEXT_ITEM' }
      );

    case 'SHOW_FEEDBACK':
      return { ...state, phase: 'feedback' };

    case 'COMPLETE':
      return { ...state, phase: 'complete' };

    case 'PAUSE':
      return { ...state, phase: 'paused' };

    case 'RESUME':
      return { ...state, phase: 'active' };

    case 'RETRY':
      return {
        ...state,
        currentAttempts: state.currentAttempts + 1,
        phase: 'active',
      };

    case 'RESET':
      return createInitialActivityState(action.items);

    default:
      return state;
  }
}

// ============================================
// FEEDBACK HELPERS
// ============================================

export interface FeedbackConfig {
  correctMessages: string[];
  incorrectMessages: string[];
  encouragementMessages: string[];
  celebrationThreshold: number; // Score to trigger celebration
}

export const DEFAULT_FEEDBACK_CONFIG: FeedbackConfig = {
  correctMessages: [
    'Great job!',
    'Awesome!',
    'You got it!',
    'Perfect!',
    'Wonderful!',
    'Amazing!',
    'Super!',
  ],
  incorrectMessages: [
    'Try again!',
    'Almost!',
    'Keep trying!',
    'You can do it!',
    "Let's try once more!",
  ],
  encouragementMessages: [
    "You're doing great!",
    'Keep going!',
    'Nice effort!',
    "You're learning!",
    'Good try!',
  ],
  celebrationThreshold: 80,
};

export function getRandomFeedback(
  isCorrect: boolean,
  config: FeedbackConfig = DEFAULT_FEEDBACK_CONFIG
): string {
  const messages = isCorrect
    ? config.correctMessages
    : config.incorrectMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

export function shouldCelebrate(
  score: number,
  config: FeedbackConfig = DEFAULT_FEEDBACK_CONFIG
): boolean {
  return score >= config.celebrationThreshold;
}
