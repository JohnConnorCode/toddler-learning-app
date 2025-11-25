/**
 * Subject Registry
 *
 * Central configuration system for all learning subjects.
 * Enables modular addition of new subjects (math, science, etc.)
 * without code changes to the core framework.
 */

import type {
  SubjectId,
  ColorTheme,
  IconConfig,
  MasteryConfig,
  DEFAULT_MASTERY_CONFIG,
  DifficultyLevel,
} from './types';

// ============================================
// SUBJECT CONFIGURATION
// ============================================

export interface SubjectConfig {
  /** Unique identifier for the subject */
  id: SubjectId;

  /** Display name */
  name: string;

  /** Short description */
  description: string;

  /** Icon configuration */
  icon: IconConfig;

  /** Color theme for UI */
  theme: ColorTheme;

  /** Order in subject list */
  order: number;

  /** Whether subject is currently active */
  enabled: boolean;

  /** Minimum age recommendation */
  minAge?: number;

  /** Maximum age recommendation */
  maxAge?: number;

  /** Activity types supported by this subject */
  activityTypes: string[];

  /** Content categories within this subject */
  categories: SubjectCategory[];

  /** Custom mastery configuration */
  masteryConfig?: Partial<MasteryConfig>;

  /** Route path prefix */
  routePrefix: string;

  /** Feature flags */
  features?: {
    hasStories?: boolean;
    hasGames?: boolean;
    hasAssessment?: boolean;
    hasAdaptiveLearning?: boolean;
  };
}

export interface SubjectCategory {
  id: string;
  name: string;
  description?: string;
  icon?: IconConfig;
  order: number;
  parentId?: string; // For nested categories
}

// ============================================
// ACTIVITY TYPE CONFIGURATION
// ============================================

export interface ActivityTypeConfig {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Which subjects can use this activity */
  subjects: SubjectId[];

  /** Component path for rendering */
  componentName: string;

  /** Default duration in seconds */
  defaultDuration: number;

  /** XP multiplier for this activity type */
  xpMultiplier: number;

  /** Whether activity supports adaptive difficulty */
  adaptiveDifficulty: boolean;

  /** Required content type */
  contentType?: string;
}

// ============================================
// REGISTERED SUBJECTS
// ============================================

export const SUBJECTS: Record<SubjectId, SubjectConfig> = {
  reading: {
    id: 'reading',
    name: 'Reading',
    description: 'Learn letters, sounds, words, and stories',
    icon: { name: 'BookOpen', library: 'lucide', emoji: '📚' },
    theme: {
      primary: '#6366F1', // Indigo
      secondary: '#818CF8',
      background: '#EEF2FF',
      accent: '#4F46E5',
    },
    order: 1,
    enabled: true,
    minAge: 2,
    maxAge: 7,
    activityTypes: [
      'phonics',
      'letter-tracing',
      'word-building',
      'sight-words',
      'word-families',
      'blending',
      'digraphs',
      'vowel-teams',
      'story-reading',
      'comprehension',
    ],
    categories: [
      { id: 'phonics', name: 'Phonics', order: 1 },
      { id: 'sight-words', name: 'Sight Words', order: 2 },
      { id: 'word-building', name: 'Word Building', order: 3 },
      { id: 'word-families', name: 'Word Families', order: 4 },
      { id: 'blending', name: 'Blending', order: 5 },
      { id: 'advanced-phonics', name: 'Advanced Phonics', order: 6 },
      { id: 'stories', name: 'Stories', order: 7 },
    ],
    routePrefix: '/reading',
    features: {
      hasStories: true,
      hasGames: true,
      hasAssessment: true,
      hasAdaptiveLearning: true,
    },
  },

  math: {
    id: 'math',
    name: 'Math',
    description: 'Numbers, counting, and basic operations',
    icon: { name: 'Calculator', library: 'lucide', emoji: '🔢' },
    theme: {
      primary: '#10B981', // Emerald
      secondary: '#34D399',
      background: '#ECFDF5',
      accent: '#059669',
    },
    order: 2,
    enabled: false, // Coming soon
    minAge: 2,
    maxAge: 7,
    activityTypes: [
      'counting',
      'number-recognition',
      'number-tracing',
      'quantity-matching',
      'more-less',
      'addition',
      'subtraction',
      'shapes',
      'patterns',
      'sorting',
    ],
    categories: [
      { id: 'numbers', name: 'Numbers', order: 1 },
      { id: 'counting', name: 'Counting', order: 2 },
      { id: 'operations', name: 'Operations', order: 3 },
      { id: 'shapes', name: 'Shapes', order: 4 },
      { id: 'patterns', name: 'Patterns', order: 5 },
    ],
    routePrefix: '/math',
    features: {
      hasStories: false,
      hasGames: true,
      hasAssessment: true,
      hasAdaptiveLearning: true,
    },
  },
};

// ============================================
// REGISTERED ACTIVITY TYPES
// ============================================

export const ACTIVITY_TYPES: Record<string, ActivityTypeConfig> = {
  // Reading activities
  phonics: {
    id: 'phonics',
    name: 'Phonics',
    subjects: ['reading'],
    componentName: 'ActivityPhonics',
    defaultDuration: 60,
    xpMultiplier: 1,
    adaptiveDifficulty: true,
  },
  'letter-tracing': {
    id: 'letter-tracing',
    name: 'Letter Tracing',
    subjects: ['reading'],
    componentName: 'ActivityLetterTracing',
    defaultDuration: 45,
    xpMultiplier: 1,
    adaptiveDifficulty: false,
  },
  'word-building': {
    id: 'word-building',
    name: 'Word Building',
    subjects: ['reading'],
    componentName: 'ActivityWordBuilding',
    defaultDuration: 90,
    xpMultiplier: 1.2,
    adaptiveDifficulty: true,
  },
  'sight-words': {
    id: 'sight-words',
    name: 'Sight Words',
    subjects: ['reading'],
    componentName: 'ActivitySightWords',
    defaultDuration: 60,
    xpMultiplier: 1,
    adaptiveDifficulty: true,
  },
  'word-families': {
    id: 'word-families',
    name: 'Word Families',
    subjects: ['reading'],
    componentName: 'ActivityWordFamilies',
    defaultDuration: 90,
    xpMultiplier: 1.2,
    adaptiveDifficulty: true,
  },
  blending: {
    id: 'blending',
    name: 'Sound Blending',
    subjects: ['reading'],
    componentName: 'ActivityBlending',
    defaultDuration: 60,
    xpMultiplier: 1.1,
    adaptiveDifficulty: true,
  },
  digraphs: {
    id: 'digraphs',
    name: 'Digraphs',
    subjects: ['reading'],
    componentName: 'ActivityDigraphs',
    defaultDuration: 60,
    xpMultiplier: 1.2,
    adaptiveDifficulty: true,
  },
  'vowel-teams': {
    id: 'vowel-teams',
    name: 'Vowel Teams',
    subjects: ['reading'],
    componentName: 'ActivityVowelTeams',
    defaultDuration: 60,
    xpMultiplier: 1.2,
    adaptiveDifficulty: true,
  },
  'story-reading': {
    id: 'story-reading',
    name: 'Story Time',
    subjects: ['reading'],
    componentName: 'ActivityStoryReading',
    defaultDuration: 180,
    xpMultiplier: 1.5,
    adaptiveDifficulty: false,
  },
  comprehension: {
    id: 'comprehension',
    name: 'Comprehension',
    subjects: ['reading'],
    componentName: 'ActivityComprehension',
    defaultDuration: 120,
    xpMultiplier: 1.3,
    adaptiveDifficulty: true,
  },
  assessment: {
    id: 'assessment',
    name: 'Assessment',
    subjects: ['reading', 'math'],
    componentName: 'ActivityAssessment',
    defaultDuration: 300,
    xpMultiplier: 2,
    adaptiveDifficulty: true,
  },

  // Math activities (for future)
  counting: {
    id: 'counting',
    name: 'Counting',
    subjects: ['math'],
    componentName: 'ActivityCounting',
    defaultDuration: 60,
    xpMultiplier: 1,
    adaptiveDifficulty: true,
  },
  'number-recognition': {
    id: 'number-recognition',
    name: 'Number Recognition',
    subjects: ['math'],
    componentName: 'ActivityNumberRecognition',
    defaultDuration: 60,
    xpMultiplier: 1,
    adaptiveDifficulty: true,
  },
  addition: {
    id: 'addition',
    name: 'Addition',
    subjects: ['math'],
    componentName: 'ActivityAddition',
    defaultDuration: 90,
    xpMultiplier: 1.2,
    adaptiveDifficulty: true,
  },
  subtraction: {
    id: 'subtraction',
    name: 'Subtraction',
    subjects: ['math'],
    componentName: 'ActivitySubtraction',
    defaultDuration: 90,
    xpMultiplier: 1.2,
    adaptiveDifficulty: true,
  },
  shapes: {
    id: 'shapes',
    name: 'Shapes',
    subjects: ['math'],
    componentName: 'ActivityShapes',
    defaultDuration: 60,
    xpMultiplier: 1,
    adaptiveDifficulty: true,
  },
};

// ============================================
// REGISTRY FUNCTIONS
// ============================================

/**
 * Get subject configuration by ID
 */
export function getSubject(id: SubjectId): SubjectConfig | undefined {
  return SUBJECTS[id];
}

/**
 * Get all enabled subjects
 */
export function getEnabledSubjects(): SubjectConfig[] {
  return Object.values(SUBJECTS)
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get all subjects (including disabled)
 */
export function getAllSubjects(): SubjectConfig[] {
  return Object.values(SUBJECTS).sort((a, b) => a.order - b.order);
}

/**
 * Get activity type configuration
 */
export function getActivityType(id: string): ActivityTypeConfig | undefined {
  return ACTIVITY_TYPES[id];
}

/**
 * Get activity types for a subject
 */
export function getActivityTypesForSubject(subjectId: SubjectId): ActivityTypeConfig[] {
  return Object.values(ACTIVITY_TYPES).filter((a) =>
    a.subjects.includes(subjectId)
  );
}

/**
 * Check if an activity type is valid for a subject
 */
export function isActivityValidForSubject(
  activityType: string,
  subjectId: SubjectId
): boolean {
  const activity = ACTIVITY_TYPES[activityType];
  return activity ? activity.subjects.includes(subjectId) : false;
}

/**
 * Get categories for a subject
 */
export function getCategoriesForSubject(subjectId: SubjectId): SubjectCategory[] {
  const subject = SUBJECTS[subjectId];
  return subject ? subject.categories.sort((a, b) => a.order - b.order) : [];
}

/**
 * Register a new subject (for dynamic extension)
 */
export function registerSubject(config: SubjectConfig): void {
  SUBJECTS[config.id] = config;
}

/**
 * Register a new activity type
 */
export function registerActivityType(config: ActivityTypeConfig): void {
  ACTIVITY_TYPES[config.id] = config;
}

/**
 * Enable or disable a subject
 */
export function setSubjectEnabled(id: SubjectId, enabled: boolean): void {
  if (SUBJECTS[id]) {
    SUBJECTS[id].enabled = enabled;
  }
}
