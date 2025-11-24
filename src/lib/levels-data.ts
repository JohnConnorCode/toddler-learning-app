/**
 * Level and Lesson Data Structure
 * Inspired by Duolingo ABC's 10-level progression system
 * Each level contains 12-15 themed lessons with multiple activities
 */

export type ActivityType =
  | "phonics" // Letter sounds and recognition
  | "word-building" // Spell words by selecting letters
  | "sight-words" // High-frequency word recognition
  | "word-families" // Rhyming patterns
  | "blending" // Sound blending practice
  | "story" // Interactive read-along story
  | "assessment" // Check understanding
  | "tracing" // Letter tracing (future)
  | "mini-game"; // Reward game (future)

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  /** Points to existing data (e.g., letter ID, word family, etc.) */
  contentId?: string;
  /** Estimated duration in seconds */
  duration: number;
  /** Is this activity locked initially? */
  locked?: boolean;
}

export interface Lesson {
  id: string;
  levelId: string;
  lessonNumber: number;
  title: string;
  description: string;
  /** Learning objectives for this lesson */
  objectives: string[];
  /** Sequential activities in this lesson */
  activities: Activity[];
  /** Requirements to unlock this lesson */
  prerequisites?: {
    /** Previous lesson must be completed */
    previousLesson?: boolean;
    /** Minimum stars earned in level */
    minStars?: number;
  };
  /** Visual theme/icon for lesson */
  icon?: string;
  /** Estimated total duration (sum of activities) */
  estimatedMinutes: number;
}

export interface Level {
  id: string;
  levelNumber: number;
  title: string;
  theme: string;
  description: string;
  /** Color theme for UI */
  color: {
    primary: string;
    secondary: string;
    background: string;
  };
  /** Icon or illustration */
  icon: string;
  /** All lessons in this level */
  lessons: Lesson[];
  /** Requirements to unlock this level */
  prerequisites?: {
    /** Previous level must be completed */
    previousLevel?: boolean;
    /** Minimum completion percentage of previous level */
    minCompletion?: number;
  };
  /** Reward story unlocked upon completion */
  rewardStoryId?: string;
}

export interface LevelProgress {
  levelId: string;
  lessonsCompleted: string[]; // lesson IDs
  currentLesson: string | null;
  starsEarned: number;
  totalStars: number;
  percentComplete: number;
  unlockedAt?: Date;
  completedAt?: Date;
}

export interface UserProgress {
  currentLevel: string;
  levels: Record<string, LevelProgress>;
  totalStarsEarned: number;
  streak: number;
  lastActivityDate?: Date;
  unlockedStories: string[];
}

// ============================================================================
// LEVEL DEFINITIONS
// ============================================================================

export const LEVELS: Level[] = [
  // LEVEL 1: Getting Started with Letters
  {
    id: "level-1",
    levelNumber: 1,
    title: "Letter Land",
    theme: "Introduction to Letters",
    description: "Meet the alphabet! Learn letter shapes and sounds.",
    color: {
      primary: "#FFB800", // Yellow
      secondary: "#FFD700",
      background: "#FFF9F0",
    },
    icon: "🔤",
    lessons: [
      {
        id: "level-1-lesson-1",
        levelId: "level-1",
        lessonNumber: 1,
        title: "Letters A-E",
        description: "Learn the first 5 letters and their sounds",
        objectives: [
          "Recognize letters A, B, C, D, E",
          "Say the sound each letter makes",
          "Match letters to pictures"
        ],
        activities: [
          {
            id: "l1-l1-a1",
            type: "phonics",
            title: "Meet Letter A",
            description: "Learn the letter A and its sound",
            contentId: "A",
            duration: 60,
          },
          {
            id: "l1-l1-a2",
            type: "phonics",
            title: "Meet Letter B",
            description: "Learn the letter B and its sound",
            contentId: "B",
            duration: 60,
          },
          {
            id: "l1-l1-a3",
            type: "phonics",
            title: "Meet Letter C",
            description: "Learn the letter C and its sound",
            contentId: "C",
            duration: 60,
          },
          {
            id: "l1-l1-a4",
            type: "phonics",
            title: "Meet Letter D",
            description: "Learn the letter D and its sound",
            contentId: "D",
            duration: 60,
          },
          {
            id: "l1-l1-a5",
            type: "phonics",
            title: "Meet Letter E",
            description: "Learn the letter E and its sound",
            contentId: "E",
            duration: 60,
          },
        ],
        estimatedMinutes: 5,
      },
      {
        id: "level-1-lesson-2",
        levelId: "level-1",
        lessonNumber: 2,
        title: "Letters F-J",
        description: "Continue learning letters and sounds",
        objectives: [
          "Recognize letters F, G, H, I, J",
          "Practice letter sounds",
          "Build simple words"
        ],
        activities: [
          {
            id: "l1-l2-a1",
            type: "phonics",
            title: "Meet Letter F",
            description: "Learn the letter F and its sound",
            contentId: "F",
            duration: 60,
          },
          {
            id: "l1-l2-a2",
            type: "phonics",
            title: "Meet Letter G",
            description: "Learn the letter G and its sound",
            contentId: "G",
            duration: 60,
          },
          {
            id: "l1-l2-a3",
            type: "phonics",
            title: "Meet Letter H",
            description: "Learn the letter H and its sound",
            contentId: "H",
            duration: 60,
          },
          {
            id: "l1-l2-a4",
            type: "phonics",
            title: "Meet Letter I",
            description: "Learn the letter I and its sound",
            contentId: "I",
            duration: 60,
          },
          {
            id: "l1-l2-a5",
            type: "phonics",
            title: "Meet Letter J",
            description: "Learn the letter J and its sound",
            contentId: "J",
            duration: 60,
          },
        ],
        prerequisites: {
          previousLesson: true,
        },
        estimatedMinutes: 5,
      },
      // ... More lessons for Level 1 (K-O, P-T, U-Z, Review)
    ],
    rewardStoryId: "story-animals",
  },

  // LEVEL 2: Building Words
  {
    id: "level-2",
    levelNumber: 2,
    title: "Word Workshop",
    theme: "Simple Word Building",
    description: "Start building your first words!",
    color: {
      primary: "#FF6B6B", // Red
      secondary: "#FF8E8E",
      background: "#FFF5F5",
    },
    icon: "🔨",
    lessons: [
      {
        id: "level-2-lesson-1",
        levelId: "level-2",
        lessonNumber: 1,
        title: "CVC Words - Short A",
        description: "Build words with short 'a' sound",
        objectives: [
          "Blend consonant-vowel-consonant sounds",
          "Spell simple CVC words",
          "Read CVC words aloud"
        ],
        activities: [
          {
            id: "l2-l1-a1",
            type: "word-building",
            title: "Build: cat",
            description: "Spell the word 'cat'",
            contentId: "cat",
            duration: 90,
          },
          {
            id: "l2-l1-a2",
            type: "word-building",
            title: "Build: hat",
            description: "Spell the word 'hat'",
            contentId: "hat",
            duration: 90,
          },
          {
            id: "l2-l1-a3",
            type: "blending",
            title: "Blend Sounds",
            description: "Practice blending letter sounds",
            duration: 120,
          },
        ],
        estimatedMinutes: 5,
      },
    ],
    prerequisites: {
      previousLevel: true,
      minCompletion: 80,
    },
    rewardStoryId: "story-cat-hat",
  },

  // LEVEL 3-10: Placeholder structure (to be expanded)
  {
    id: "level-3",
    levelNumber: 3,
    title: "Sight Word Station",
    theme: "High-Frequency Words",
    description: "Learn words you'll see everywhere!",
    color: {
      primary: "#4ECDC4", // Teal
      secondary: "#7FE7DF",
      background: "#F0FFFE",
    },
    icon: "👀",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-4",
    levelNumber: 4,
    title: "Rhyme Time",
    theme: "Word Families",
    description: "Discover words that sound alike!",
    color: {
      primary: "#A8E6CF", // Green
      secondary: "#C8F5DE",
      background: "#F5FFF9",
    },
    icon: "🎵",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-5",
    levelNumber: 5,
    title: "Blending Bridge",
    theme: "Sound Blending Mastery",
    description: "Become a blending expert!",
    color: {
      primary: "#FFD93D", // Gold
      secondary: "#FFE66D",
      background: "#FFFEF5",
    },
    icon: "🌉",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-6",
    levelNumber: 6,
    title: "Story Mountain",
    theme: "Reading Stories",
    description: "Read your first complete stories!",
    color: {
      primary: "#9B59B6", // Purple
      secondary: "#BB6BD9",
      background: "#FAF5FF",
    },
    icon: "⛰️",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-7",
    levelNumber: 7,
    title: "Vowel Valley",
    theme: "Long & Short Vowels",
    description: "Master all vowel sounds!",
    color: {
      primary: "#F39C12", // Orange
      secondary: "#F8B84D",
      background: "#FFF8ED",
    },
    icon: "🏔️",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-8",
    levelNumber: 8,
    title: "Digraph Den",
    theme: "Special Letter Pairs",
    description: "Learn sh, ch, th, and more!",
    color: {
      primary: "#E74C3C", // Dark Red
      secondary: "#EC7063",
      background: "#FEEFED",
    },
    icon: "🏠",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-9",
    levelNumber: 9,
    title: "Fluency Forest",
    theme: "Reading with Confidence",
    description: "Read smoothly and quickly!",
    color: {
      primary: "#27AE60", // Dark Green
      secondary: "#58D68D",
      background: "#EAFAF1",
    },
    icon: "🌲",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },

  {
    id: "level-10",
    levelNumber: 10,
    title: "Reading Rainbow",
    theme: "Master Reader",
    description: "You're a reading superstar!",
    color: {
      primary: "#8E44AD", // Deep Purple
      secondary: "#A569BD",
      background: "#F4ECF7",
    },
    icon: "🌈",
    lessons: [],
    prerequisites: {
      previousLevel: true,
      minCompletion: 75,
    },
  },
];

// Helper functions
export function getLevelById(levelId: string): Level | undefined {
  return LEVELS.find(level => level.id === levelId);
}

export function getLessonById(lessonId: string): { level: Level; lesson: Lesson } | undefined {
  for (const level of LEVELS) {
    const lesson = level.lessons.find(l => l.id === lessonId);
    if (lesson) {
      return { level, lesson };
    }
  }
  return undefined;
}

export function getNextLesson(currentLessonId: string): { level: Level; lesson: Lesson } | undefined {
  const current = getLessonById(currentLessonId);
  if (!current) return undefined;

  const { level, lesson } = current;
  const currentIndex = level.lessons.findIndex(l => l.id === lesson.id);

  // Next lesson in same level
  if (currentIndex < level.lessons.length - 1) {
    return {
      level,
      lesson: level.lessons[currentIndex + 1],
    };
  }

  // First lesson of next level
  const nextLevel = LEVELS.find(l => l.levelNumber === level.levelNumber + 1);
  if (nextLevel && nextLevel.lessons.length > 0) {
    return {
      level: nextLevel,
      lesson: nextLevel.lessons[0],
    };
  }

  return undefined;
}

export function isLessonUnlocked(
  lessonId: string,
  userProgress: UserProgress
): boolean {
  const result = getLessonById(lessonId);
  if (!result) return false;

  const { level, lesson } = result;

  // Check level prerequisites
  if (level.prerequisites?.previousLevel) {
    const prevLevel = LEVELS.find(l => l.levelNumber === level.levelNumber - 1);
    if (prevLevel) {
      const prevLevelProgress = userProgress.levels[prevLevel.id];
      if (!prevLevelProgress) return false;

      const minCompletion = level.prerequisites.minCompletion || 100;
      if (prevLevelProgress.percentComplete < minCompletion) return false;
    }
  }

  // Check lesson prerequisites
  if (lesson.prerequisites?.previousLesson) {
    const prevLessonIndex = level.lessons.findIndex(l => l.id === lesson.id) - 1;
    if (prevLessonIndex >= 0) {
      const prevLesson = level.lessons[prevLessonIndex];
      const levelProgress = userProgress.levels[level.id];
      if (!levelProgress?.lessonsCompleted.includes(prevLesson.id)) {
        return false;
      }
    }
  }

  return true;
}
