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

  // LEVEL 3: Sight Words
  {
    id: "level-3",
    levelNumber: 3,
    title: "Sight Word Station",
    theme: "High-Frequency Words",
    description: "Learn words you'll see everywhere!",
    color: {
      primary: "#4ECDC4",
      secondary: "#7FE7DF",
      background: "#F0FFFE",
    },
    icon: "👀",
    lessons: [
      {
        id: "level-3-lesson-1",
        levelId: "level-3",
        lessonNumber: 1,
        title: "Sight Words: the, a, is",
        description: "Learn your first sight words",
        objectives: ["Recognize 'the', 'a', 'is'", "Read sentences with sight words"],
        activities: [
          { id: "l3-l1-a1", type: "sight-words", title: "Meet 'the'", description: "Learn the word 'the'", contentId: "the", duration: 60 },
          { id: "l3-l1-a2", type: "sight-words", title: "Meet 'a'", description: "Learn the word 'a'", contentId: "a", duration: 60 },
          { id: "l3-l1-a3", type: "sight-words", title: "Meet 'is'", description: "Learn the word 'is'", contentId: "is", duration: 60 },
          { id: "l3-l1-a4", type: "assessment", title: "Practice Time", description: "Find the sight words", duration: 90 },
        ],
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-2",
        levelId: "level-3",
        lessonNumber: 2,
        title: "Sight Words: I, can, see",
        description: "More essential sight words",
        objectives: ["Recognize 'I', 'can', 'see'", "Build simple sentences"],
        activities: [
          { id: "l3-l2-a1", type: "sight-words", title: "Meet 'I'", description: "Learn the word 'I'", contentId: "I", duration: 60 },
          { id: "l3-l2-a2", type: "sight-words", title: "Meet 'can'", description: "Learn the word 'can'", contentId: "can", duration: 60 },
          { id: "l3-l2-a3", type: "sight-words", title: "Meet 'see'", description: "Learn the word 'see'", contentId: "see", duration: 60 },
          { id: "l3-l2-a4", type: "blending", title: "Read: I can see", description: "Read a simple sentence", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-3",
        levelId: "level-3",
        lessonNumber: 3,
        title: "Sight Words: we, like, to",
        description: "Words for actions",
        objectives: ["Recognize 'we', 'like', 'to'", "Read action sentences"],
        activities: [
          { id: "l3-l3-a1", type: "sight-words", title: "Meet 'we'", description: "Learn the word 'we'", contentId: "we", duration: 60 },
          { id: "l3-l3-a2", type: "sight-words", title: "Meet 'like'", description: "Learn the word 'like'", contentId: "like", duration: 60 },
          { id: "l3-l3-a3", type: "sight-words", title: "Meet 'to'", description: "Learn the word 'to'", contentId: "to", duration: 60 },
          { id: "l3-l3-a4", type: "assessment", title: "Word Hunt", description: "Find all the sight words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-4",
        levelId: "level-3",
        lessonNumber: 4,
        title: "Sight Words: and, my, you",
        description: "Connecting words",
        objectives: ["Recognize 'and', 'my', 'you'", "Connect ideas in sentences"],
        activities: [
          { id: "l3-l4-a1", type: "sight-words", title: "Meet 'and'", description: "Learn the word 'and'", contentId: "and", duration: 60 },
          { id: "l3-l4-a2", type: "sight-words", title: "Meet 'my'", description: "Learn the word 'my'", contentId: "my", duration: 60 },
          { id: "l3-l4-a3", type: "sight-words", title: "Meet 'you'", description: "Learn the word 'you'", contentId: "you", duration: 60 },
          { id: "l3-l4-a4", type: "blending", title: "Read Together", description: "Read sentences with these words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-5",
        levelId: "level-3",
        lessonNumber: 5,
        title: "Sight Words: he, she, it",
        description: "Words for people and things",
        objectives: ["Recognize 'he', 'she', 'it'", "Use pronouns in sentences"],
        activities: [
          { id: "l3-l5-a1", type: "sight-words", title: "Meet 'he'", description: "Learn the word 'he'", contentId: "he", duration: 60 },
          { id: "l3-l5-a2", type: "sight-words", title: "Meet 'she'", description: "Learn the word 'she'", contentId: "she", duration: 60 },
          { id: "l3-l5-a3", type: "sight-words", title: "Meet 'it'", description: "Learn the word 'it'", contentId: "it", duration: 60 },
          { id: "l3-l5-a4", type: "assessment", title: "Match Game", description: "Match pronouns to pictures", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-6",
        levelId: "level-3",
        lessonNumber: 6,
        title: "Sight Words: go, look, for",
        description: "Action sight words",
        objectives: ["Recognize 'go', 'look', 'for'", "Read action sentences"],
        activities: [
          { id: "l3-l6-a1", type: "sight-words", title: "Meet 'go'", description: "Learn the word 'go'", contentId: "go", duration: 60 },
          { id: "l3-l6-a2", type: "sight-words", title: "Meet 'look'", description: "Learn the word 'look'", contentId: "look", duration: 60 },
          { id: "l3-l6-a3", type: "sight-words", title: "Meet 'for'", description: "Learn the word 'for'", contentId: "for", duration: 60 },
          { id: "l3-l6-a4", type: "blending", title: "Action Sentences", description: "Read action sentences", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-7",
        levelId: "level-3",
        lessonNumber: 7,
        title: "Sight Words: in, on, up",
        description: "Position words",
        objectives: ["Recognize 'in', 'on', 'up'", "Understand position words"],
        activities: [
          { id: "l3-l7-a1", type: "sight-words", title: "Meet 'in'", description: "Learn the word 'in'", contentId: "in", duration: 60 },
          { id: "l3-l7-a2", type: "sight-words", title: "Meet 'on'", description: "Learn the word 'on'", contentId: "on", duration: 60 },
          { id: "l3-l7-a3", type: "sight-words", title: "Meet 'up'", description: "Learn the word 'up'", contentId: "up", duration: 60 },
          { id: "l3-l7-a4", type: "assessment", title: "Where Is It?", description: "Match words to positions", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-3-lesson-8",
        levelId: "level-3",
        lessonNumber: 8,
        title: "Sight Word Review",
        description: "Practice all sight words learned",
        objectives: ["Review all 21 sight words", "Read simple stories"],
        activities: [
          { id: "l3-l8-a1", type: "assessment", title: "Word Flash", description: "Quick sight word recognition", duration: 120 },
          { id: "l3-l8-a2", type: "story", title: "Read a Story", description: "Read using sight words", contentId: "sight-word-story-1", duration: 180 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-sight-words",
  },

  // LEVEL 4: Word Families
  {
    id: "level-4",
    levelNumber: 4,
    title: "Rhyme Time",
    theme: "Word Families",
    description: "Discover words that sound alike!",
    color: {
      primary: "#A8E6CF",
      secondary: "#C8F5DE",
      background: "#F5FFF9",
    },
    icon: "🎵",
    lessons: [
      {
        id: "level-4-lesson-1",
        levelId: "level-4",
        lessonNumber: 1,
        title: "-at Family",
        description: "Words that end in -at",
        objectives: ["Learn the -at word family", "Read and spell -at words"],
        activities: [
          { id: "l4-l1-a1", type: "word-families", title: "Meet -at", description: "Learn the -at ending", contentId: "at", duration: 60 },
          { id: "l4-l1-a2", type: "word-building", title: "Build: cat", description: "Spell 'cat'", contentId: "cat", duration: 60 },
          { id: "l4-l1-a3", type: "word-building", title: "Build: bat", description: "Spell 'bat'", contentId: "bat", duration: 60 },
          { id: "l4-l1-a4", type: "word-building", title: "Build: hat", description: "Spell 'hat'", contentId: "hat", duration: 60 },
          { id: "l4-l1-a5", type: "assessment", title: "Rhyme Time", description: "Find words that rhyme", duration: 90 },
        ],
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-2",
        levelId: "level-4",
        lessonNumber: 2,
        title: "-an Family",
        description: "Words that end in -an",
        objectives: ["Learn the -an word family", "Read and spell -an words"],
        activities: [
          { id: "l4-l2-a1", type: "word-families", title: "Meet -an", description: "Learn the -an ending", contentId: "an", duration: 60 },
          { id: "l4-l2-a2", type: "word-building", title: "Build: can", description: "Spell 'can'", contentId: "can", duration: 60 },
          { id: "l4-l2-a3", type: "word-building", title: "Build: man", description: "Spell 'man'", contentId: "man", duration: 60 },
          { id: "l4-l2-a4", type: "word-building", title: "Build: fan", description: "Spell 'fan'", contentId: "fan", duration: 60 },
          { id: "l4-l2-a5", type: "assessment", title: "Family Match", description: "Match -an words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-3",
        levelId: "level-4",
        lessonNumber: 3,
        title: "-ap Family",
        description: "Words that end in -ap",
        objectives: ["Learn the -ap word family", "Read and spell -ap words"],
        activities: [
          { id: "l4-l3-a1", type: "word-families", title: "Meet -ap", description: "Learn the -ap ending", contentId: "ap", duration: 60 },
          { id: "l4-l3-a2", type: "word-building", title: "Build: cap", description: "Spell 'cap'", contentId: "cap", duration: 60 },
          { id: "l4-l3-a3", type: "word-building", title: "Build: map", description: "Spell 'map'", contentId: "map", duration: 60 },
          { id: "l4-l3-a4", type: "word-building", title: "Build: tap", description: "Spell 'tap'", contentId: "tap", duration: 60 },
          { id: "l4-l3-a5", type: "blending", title: "Blend -ap Words", description: "Blend sounds together", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-4",
        levelId: "level-4",
        lessonNumber: 4,
        title: "-ig Family",
        description: "Words that end in -ig",
        objectives: ["Learn the -ig word family", "Read and spell -ig words"],
        activities: [
          { id: "l4-l4-a1", type: "word-families", title: "Meet -ig", description: "Learn the -ig ending", contentId: "ig", duration: 60 },
          { id: "l4-l4-a2", type: "word-building", title: "Build: big", description: "Spell 'big'", contentId: "big", duration: 60 },
          { id: "l4-l4-a3", type: "word-building", title: "Build: pig", description: "Spell 'pig'", contentId: "pig", duration: 60 },
          { id: "l4-l4-a4", type: "word-building", title: "Build: dig", description: "Spell 'dig'", contentId: "dig", duration: 60 },
          { id: "l4-l4-a5", type: "assessment", title: "-ig Hunt", description: "Find -ig words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-5",
        levelId: "level-4",
        lessonNumber: 5,
        title: "-in Family",
        description: "Words that end in -in",
        objectives: ["Learn the -in word family", "Read and spell -in words"],
        activities: [
          { id: "l4-l5-a1", type: "word-families", title: "Meet -in", description: "Learn the -in ending", contentId: "in", duration: 60 },
          { id: "l4-l5-a2", type: "word-building", title: "Build: pin", description: "Spell 'pin'", contentId: "pin", duration: 60 },
          { id: "l4-l5-a3", type: "word-building", title: "Build: win", description: "Spell 'win'", contentId: "win", duration: 60 },
          { id: "l4-l5-a4", type: "word-building", title: "Build: fin", description: "Spell 'fin'", contentId: "fin", duration: 60 },
          { id: "l4-l5-a5", type: "blending", title: "Blend -in Words", description: "Blend sounds", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-6",
        levelId: "level-4",
        lessonNumber: 6,
        title: "-op Family",
        description: "Words that end in -op",
        objectives: ["Learn the -op word family", "Read and spell -op words"],
        activities: [
          { id: "l4-l6-a1", type: "word-families", title: "Meet -op", description: "Learn the -op ending", contentId: "op", duration: 60 },
          { id: "l4-l6-a2", type: "word-building", title: "Build: hop", description: "Spell 'hop'", contentId: "hop", duration: 60 },
          { id: "l4-l6-a3", type: "word-building", title: "Build: top", description: "Spell 'top'", contentId: "top", duration: 60 },
          { id: "l4-l6-a4", type: "word-building", title: "Build: pop", description: "Spell 'pop'", contentId: "pop", duration: 60 },
          { id: "l4-l6-a5", type: "assessment", title: "Rhyme Match", description: "Match rhyming words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-7",
        levelId: "level-4",
        lessonNumber: 7,
        title: "-ot Family",
        description: "Words that end in -ot",
        objectives: ["Learn the -ot word family", "Read and spell -ot words"],
        activities: [
          { id: "l4-l7-a1", type: "word-families", title: "Meet -ot", description: "Learn the -ot ending", contentId: "ot", duration: 60 },
          { id: "l4-l7-a2", type: "word-building", title: "Build: hot", description: "Spell 'hot'", contentId: "hot", duration: 60 },
          { id: "l4-l7-a3", type: "word-building", title: "Build: pot", description: "Spell 'pot'", contentId: "pot", duration: 60 },
          { id: "l4-l7-a4", type: "word-building", title: "Build: dot", description: "Spell 'dot'", contentId: "dot", duration: 60 },
          { id: "l4-l7-a5", type: "blending", title: "Read -ot Words", description: "Read all -ot words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-4-lesson-8",
        levelId: "level-4",
        lessonNumber: 8,
        title: "-ug Family",
        description: "Words that end in -ug",
        objectives: ["Learn the -ug word family", "Read and spell -ug words"],
        activities: [
          { id: "l4-l8-a1", type: "word-families", title: "Meet -ug", description: "Learn the -ug ending", contentId: "ug", duration: 60 },
          { id: "l4-l8-a2", type: "word-building", title: "Build: bug", description: "Spell 'bug'", contentId: "bug", duration: 60 },
          { id: "l4-l8-a3", type: "word-building", title: "Build: hug", description: "Spell 'hug'", contentId: "hug", duration: 60 },
          { id: "l4-l8-a4", type: "word-building", title: "Build: rug", description: "Spell 'rug'", contentId: "rug", duration: 60 },
          { id: "l4-l8-a5", type: "assessment", title: "Family Review", description: "Review all word families", duration: 120 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 7,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-rhyme-time",
  },

  // LEVEL 5: Blending Mastery
  {
    id: "level-5",
    levelNumber: 5,
    title: "Blending Bridge",
    theme: "Sound Blending Mastery",
    description: "Become a blending expert!",
    color: {
      primary: "#FFD93D",
      secondary: "#FFE66D",
      background: "#FFFEF5",
    },
    icon: "🌉",
    lessons: [
      {
        id: "level-5-lesson-1",
        levelId: "level-5",
        lessonNumber: 1,
        title: "Blend CVC Words",
        description: "Master consonant-vowel-consonant blending",
        objectives: ["Blend CVC words fluently", "Read words automatically"],
        activities: [
          { id: "l5-l1-a1", type: "blending", title: "Blend: sat", description: "s-a-t → sat", contentId: "sat", duration: 60 },
          { id: "l5-l1-a2", type: "blending", title: "Blend: pen", description: "p-e-n → pen", contentId: "pen", duration: 60 },
          { id: "l5-l1-a3", type: "blending", title: "Blend: hit", description: "h-i-t → hit", contentId: "hit", duration: 60 },
          { id: "l5-l1-a4", type: "blending", title: "Blend: cup", description: "c-u-p → cup", contentId: "cup", duration: 60 },
          { id: "l5-l1-a5", type: "assessment", title: "Speed Blend", description: "Quick blending practice", duration: 90 },
        ],
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-2",
        levelId: "level-5",
        lessonNumber: 2,
        title: "Initial Blends: bl, cl",
        description: "Words starting with bl and cl",
        objectives: ["Blend bl- and cl- words", "Read initial blend words"],
        activities: [
          { id: "l5-l2-a1", type: "blending", title: "Blend: blue", description: "Learn bl- blend", contentId: "blue", duration: 60 },
          { id: "l5-l2-a2", type: "blending", title: "Blend: clap", description: "Learn cl- blend", contentId: "clap", duration: 60 },
          { id: "l5-l2-a3", type: "word-building", title: "Build: black", description: "Spell 'black'", contentId: "black", duration: 60 },
          { id: "l5-l2-a4", type: "word-building", title: "Build: clock", description: "Spell 'clock'", contentId: "clock", duration: 60 },
          { id: "l5-l2-a5", type: "assessment", title: "Blend Sort", description: "Sort bl- and cl- words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-3",
        levelId: "level-5",
        lessonNumber: 3,
        title: "Initial Blends: fl, gl",
        description: "Words starting with fl and gl",
        objectives: ["Blend fl- and gl- words", "Read initial blend words"],
        activities: [
          { id: "l5-l3-a1", type: "blending", title: "Blend: flag", description: "Learn fl- blend", contentId: "flag", duration: 60 },
          { id: "l5-l3-a2", type: "blending", title: "Blend: glad", description: "Learn gl- blend", contentId: "glad", duration: 60 },
          { id: "l5-l3-a3", type: "word-building", title: "Build: flip", description: "Spell 'flip'", contentId: "flip", duration: 60 },
          { id: "l5-l3-a4", type: "word-building", title: "Build: glow", description: "Spell 'glow'", contentId: "glow", duration: 60 },
          { id: "l5-l3-a5", type: "blending", title: "Read Blend Words", description: "Read fl- and gl- words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-4",
        levelId: "level-5",
        lessonNumber: 4,
        title: "Initial Blends: br, cr, dr",
        description: "R-blend words",
        objectives: ["Blend br-, cr-, dr- words", "Read r-blend words fluently"],
        activities: [
          { id: "l5-l4-a1", type: "blending", title: "Blend: brown", description: "Learn br- blend", contentId: "brown", duration: 60 },
          { id: "l5-l4-a2", type: "blending", title: "Blend: crab", description: "Learn cr- blend", contentId: "crab", duration: 60 },
          { id: "l5-l4-a3", type: "blending", title: "Blend: drum", description: "Learn dr- blend", contentId: "drum", duration: 60 },
          { id: "l5-l4-a4", type: "word-building", title: "Build: frog", description: "Spell 'frog'", contentId: "frog", duration: 60 },
          { id: "l5-l4-a5", type: "assessment", title: "R-Blend Race", description: "Quick r-blend reading", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-5",
        levelId: "level-5",
        lessonNumber: 5,
        title: "Initial Blends: st, sp, sn",
        description: "S-blend words",
        objectives: ["Blend st-, sp-, sn- words", "Read s-blend words"],
        activities: [
          { id: "l5-l5-a1", type: "blending", title: "Blend: star", description: "Learn st- blend", contentId: "star", duration: 60 },
          { id: "l5-l5-a2", type: "blending", title: "Blend: spot", description: "Learn sp- blend", contentId: "spot", duration: 60 },
          { id: "l5-l5-a3", type: "blending", title: "Blend: snow", description: "Learn sn- blend", contentId: "snow", duration: 60 },
          { id: "l5-l5-a4", type: "word-building", title: "Build: swim", description: "Spell 'swim'", contentId: "swim", duration: 60 },
          { id: "l5-l5-a5", type: "blending", title: "S-Blend Practice", description: "Read s-blend sentences", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-6",
        levelId: "level-5",
        lessonNumber: 6,
        title: "Final Blends: -nd, -nk",
        description: "Words ending in -nd and -nk",
        objectives: ["Read -nd and -nk ending words", "Spell final blend words"],
        activities: [
          { id: "l5-l6-a1", type: "blending", title: "Blend: hand", description: "Learn -nd ending", contentId: "hand", duration: 60 },
          { id: "l5-l6-a2", type: "blending", title: "Blend: pink", description: "Learn -nk ending", contentId: "pink", duration: 60 },
          { id: "l5-l6-a3", type: "word-building", title: "Build: sand", description: "Spell 'sand'", contentId: "sand", duration: 60 },
          { id: "l5-l6-a4", type: "word-building", title: "Build: sink", description: "Spell 'sink'", contentId: "sink", duration: 60 },
          { id: "l5-l6-a5", type: "assessment", title: "End Blend Match", description: "Match final blends", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-7",
        levelId: "level-5",
        lessonNumber: 7,
        title: "Final Blends: -st, -mp",
        description: "Words ending in -st and -mp",
        objectives: ["Read -st and -mp ending words", "Master final blends"],
        activities: [
          { id: "l5-l7-a1", type: "blending", title: "Blend: best", description: "Learn -st ending", contentId: "best", duration: 60 },
          { id: "l5-l7-a2", type: "blending", title: "Blend: jump", description: "Learn -mp ending", contentId: "jump", duration: 60 },
          { id: "l5-l7-a3", type: "word-building", title: "Build: fast", description: "Spell 'fast'", contentId: "fast", duration: 60 },
          { id: "l5-l7-a4", type: "word-building", title: "Build: lamp", description: "Spell 'lamp'", contentId: "lamp", duration: 60 },
          { id: "l5-l7-a5", type: "blending", title: "Read Final Blends", description: "Practice all final blends", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-5-lesson-8",
        levelId: "level-5",
        lessonNumber: 8,
        title: "Blending Review",
        description: "Master all blends",
        objectives: ["Review all blends learned", "Read blended words fluently"],
        activities: [
          { id: "l5-l8-a1", type: "assessment", title: "Blend Challenge", description: "Read blend words quickly", duration: 120 },
          { id: "l5-l8-a2", type: "story", title: "Blend Story", description: "Read a story with blends", contentId: "blend-story-1", duration: 180 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-blend-adventure",
  },

  // LEVEL 6: Reading Stories
  {
    id: "level-6",
    levelNumber: 6,
    title: "Story Mountain",
    theme: "Reading Stories",
    description: "Read your first complete stories!",
    color: {
      primary: "#9B59B6",
      secondary: "#BB6BD9",
      background: "#FAF5FF",
    },
    icon: "⛰️",
    lessons: [
      {
        id: "level-6-lesson-1",
        levelId: "level-6",
        lessonNumber: 1,
        title: "Short Stories: The Cat",
        description: "Read your first short story",
        objectives: ["Read a complete short story", "Understand story meaning"],
        activities: [
          { id: "l6-l1-a1", type: "sight-words", title: "Story Words", description: "Learn words for the story", duration: 90 },
          { id: "l6-l1-a2", type: "story", title: "Read: The Cat", description: "Read about a cat", contentId: "story-the-cat", duration: 180 },
          { id: "l6-l1-a3", type: "assessment", title: "Story Questions", description: "Answer questions about the story", duration: 90 },
        ],
        estimatedMinutes: 6,
      },
      {
        id: "level-6-lesson-2",
        levelId: "level-6",
        lessonNumber: 2,
        title: "Short Stories: The Dog",
        description: "Read about a playful dog",
        objectives: ["Read with expression", "Retell the story"],
        activities: [
          { id: "l6-l2-a1", type: "sight-words", title: "Story Words", description: "Learn words for the story", duration: 90 },
          { id: "l6-l2-a2", type: "story", title: "Read: The Dog", description: "Read about a dog", contentId: "story-the-dog", duration: 180 },
          { id: "l6-l2-a3", type: "assessment", title: "Retell", description: "Tell what happened", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-6-lesson-3",
        levelId: "level-6",
        lessonNumber: 3,
        title: "Short Stories: At School",
        description: "A story about school",
        objectives: ["Read longer sentences", "Make connections to life"],
        activities: [
          { id: "l6-l3-a1", type: "sight-words", title: "School Words", description: "Learn school vocabulary", duration: 90 },
          { id: "l6-l3-a2", type: "story", title: "Read: At School", description: "Read about school", contentId: "story-at-school", duration: 180 },
          { id: "l6-l3-a3", type: "assessment", title: "Connect", description: "Connect to your life", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-6-lesson-4",
        levelId: "level-6",
        lessonNumber: 4,
        title: "Short Stories: My Family",
        description: "A story about family",
        objectives: ["Read about families", "Identify characters"],
        activities: [
          { id: "l6-l4-a1", type: "sight-words", title: "Family Words", description: "Learn family vocabulary", duration: 90 },
          { id: "l6-l4-a2", type: "story", title: "Read: My Family", description: "Read about a family", contentId: "story-my-family", duration: 180 },
          { id: "l6-l4-a3", type: "assessment", title: "Characters", description: "Who is in the story?", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-6-lesson-5",
        levelId: "level-6",
        lessonNumber: 5,
        title: "Short Stories: The Park",
        description: "Adventure at the park",
        objectives: ["Read with fluency", "Visualize the story"],
        activities: [
          { id: "l6-l5-a1", type: "sight-words", title: "Park Words", description: "Learn park vocabulary", duration: 90 },
          { id: "l6-l5-a2", type: "story", title: "Read: The Park", description: "Read about the park", contentId: "story-the-park", duration: 180 },
          { id: "l6-l5-a3", type: "assessment", title: "Picture It", description: "Describe what you see", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-6-lesson-6",
        levelId: "level-6",
        lessonNumber: 6,
        title: "Reading Practice",
        description: "Practice reading skills",
        objectives: ["Improve reading speed", "Read independently"],
        activities: [
          { id: "l6-l6-a1", type: "blending", title: "Quick Read", description: "Read words quickly", duration: 90 },
          { id: "l6-l6-a2", type: "story", title: "Choose a Story", description: "Pick a story to read", contentId: "story-choice-1", duration: 180 },
          { id: "l6-l6-a3", type: "assessment", title: "Reading Check", description: "Check your reading", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-adventure",
  },

  // LEVEL 7: Vowels
  {
    id: "level-7",
    levelNumber: 7,
    title: "Vowel Valley",
    theme: "Long & Short Vowels",
    description: "Master all vowel sounds!",
    color: {
      primary: "#F39C12",
      secondary: "#F8B84D",
      background: "#FFF8ED",
    },
    icon: "🏔️",
    lessons: [
      {
        id: "level-7-lesson-1",
        levelId: "level-7",
        lessonNumber: 1,
        title: "Short A vs Long A",
        description: "Compare short and long A sounds",
        objectives: ["Distinguish short and long A", "Read both A sounds"],
        activities: [
          { id: "l7-l1-a1", type: "phonics", title: "Short A", description: "Review short A sound", contentId: "short-a", duration: 60 },
          { id: "l7-l1-a2", type: "phonics", title: "Long A", description: "Learn long A sound", contentId: "long-a", duration: 60 },
          { id: "l7-l1-a3", type: "word-building", title: "cat vs cake", description: "Compare A sounds", duration: 90 },
          { id: "l7-l1-a4", type: "assessment", title: "A Sound Sort", description: "Sort short and long A", duration: 90 },
        ],
        estimatedMinutes: 5,
      },
      {
        id: "level-7-lesson-2",
        levelId: "level-7",
        lessonNumber: 2,
        title: "Short E vs Long E",
        description: "Compare short and long E sounds",
        objectives: ["Distinguish short and long E", "Read both E sounds"],
        activities: [
          { id: "l7-l2-a1", type: "phonics", title: "Short E", description: "Review short E sound", contentId: "short-e", duration: 60 },
          { id: "l7-l2-a2", type: "phonics", title: "Long E", description: "Learn long E sound", contentId: "long-e", duration: 60 },
          { id: "l7-l2-a3", type: "word-building", title: "bed vs bead", description: "Compare E sounds", duration: 90 },
          { id: "l7-l2-a4", type: "assessment", title: "E Sound Sort", description: "Sort short and long E", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-7-lesson-3",
        levelId: "level-7",
        lessonNumber: 3,
        title: "Short I vs Long I",
        description: "Compare short and long I sounds",
        objectives: ["Distinguish short and long I", "Read both I sounds"],
        activities: [
          { id: "l7-l3-a1", type: "phonics", title: "Short I", description: "Review short I sound", contentId: "short-i", duration: 60 },
          { id: "l7-l3-a2", type: "phonics", title: "Long I", description: "Learn long I sound", contentId: "long-i", duration: 60 },
          { id: "l7-l3-a3", type: "word-building", title: "hit vs hike", description: "Compare I sounds", duration: 90 },
          { id: "l7-l3-a4", type: "assessment", title: "I Sound Sort", description: "Sort short and long I", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-7-lesson-4",
        levelId: "level-7",
        lessonNumber: 4,
        title: "Short O vs Long O",
        description: "Compare short and long O sounds",
        objectives: ["Distinguish short and long O", "Read both O sounds"],
        activities: [
          { id: "l7-l4-a1", type: "phonics", title: "Short O", description: "Review short O sound", contentId: "short-o", duration: 60 },
          { id: "l7-l4-a2", type: "phonics", title: "Long O", description: "Learn long O sound", contentId: "long-o", duration: 60 },
          { id: "l7-l4-a3", type: "word-building", title: "hop vs hope", description: "Compare O sounds", duration: 90 },
          { id: "l7-l4-a4", type: "assessment", title: "O Sound Sort", description: "Sort short and long O", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-7-lesson-5",
        levelId: "level-7",
        lessonNumber: 5,
        title: "Short U vs Long U",
        description: "Compare short and long U sounds",
        objectives: ["Distinguish short and long U", "Read both U sounds"],
        activities: [
          { id: "l7-l5-a1", type: "phonics", title: "Short U", description: "Review short U sound", contentId: "short-u", duration: 60 },
          { id: "l7-l5-a2", type: "phonics", title: "Long U", description: "Learn long U sound", contentId: "long-u", duration: 60 },
          { id: "l7-l5-a3", type: "word-building", title: "cub vs cube", description: "Compare U sounds", duration: 90 },
          { id: "l7-l5-a4", type: "assessment", title: "U Sound Sort", description: "Sort short and long U", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-7-lesson-6",
        levelId: "level-7",
        lessonNumber: 6,
        title: "Magic E",
        description: "How silent E changes vowels",
        objectives: ["Understand the magic E rule", "Apply magic E to reading"],
        activities: [
          { id: "l7-l6-a1", type: "phonics", title: "Magic E Rule", description: "Learn how E changes vowels", duration: 90 },
          { id: "l7-l6-a2", type: "word-building", title: "tap → tape", description: "Add magic E", duration: 60 },
          { id: "l7-l6-a3", type: "word-building", title: "pin → pine", description: "Add magic E", duration: 60 },
          { id: "l7-l6-a4", type: "assessment", title: "Magic E Challenge", description: "Change words with E", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-7-lesson-7",
        levelId: "level-7",
        lessonNumber: 7,
        title: "Vowel Review",
        description: "Master all vowel sounds",
        objectives: ["Review all vowel sounds", "Read vowel words fluently"],
        activities: [
          { id: "l7-l7-a1", type: "assessment", title: "Vowel Sort", description: "Sort all vowel sounds", duration: 120 },
          { id: "l7-l7-a2", type: "story", title: "Vowel Story", description: "Read a vowel-focused story", contentId: "vowel-story", duration: 180 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-vowel-adventure",
  },

  // LEVEL 8: Digraphs
  {
    id: "level-8",
    levelNumber: 8,
    title: "Digraph Den",
    theme: "Special Letter Pairs",
    description: "Learn sh, ch, th, and more!",
    color: {
      primary: "#E74C3C",
      secondary: "#EC7063",
      background: "#FEEFED",
    },
    icon: "🏠",
    lessons: [
      {
        id: "level-8-lesson-1",
        levelId: "level-8",
        lessonNumber: 1,
        title: "The SH Sound",
        description: "Learn the sh digraph",
        objectives: ["Recognize the sh sound", "Read sh words"],
        activities: [
          { id: "l8-l1-a1", type: "phonics", title: "Meet SH", description: "Learn the sh sound", contentId: "sh", duration: 60 },
          { id: "l8-l1-a2", type: "word-building", title: "Build: ship", description: "Spell 'ship'", contentId: "ship", duration: 60 },
          { id: "l8-l1-a3", type: "word-building", title: "Build: fish", description: "Spell 'fish'", contentId: "fish", duration: 60 },
          { id: "l8-l1-a4", type: "blending", title: "Read SH Words", description: "Read sh words", duration: 90 },
          { id: "l8-l1-a5", type: "assessment", title: "SH Hunt", description: "Find sh words", duration: 90 },
        ],
        estimatedMinutes: 6,
      },
      {
        id: "level-8-lesson-2",
        levelId: "level-8",
        lessonNumber: 2,
        title: "The CH Sound",
        description: "Learn the ch digraph",
        objectives: ["Recognize the ch sound", "Read ch words"],
        activities: [
          { id: "l8-l2-a1", type: "phonics", title: "Meet CH", description: "Learn the ch sound", contentId: "ch", duration: 60 },
          { id: "l8-l2-a2", type: "word-building", title: "Build: chip", description: "Spell 'chip'", contentId: "chip", duration: 60 },
          { id: "l8-l2-a3", type: "word-building", title: "Build: lunch", description: "Spell 'lunch'", contentId: "lunch", duration: 60 },
          { id: "l8-l2-a4", type: "blending", title: "Read CH Words", description: "Read ch words", duration: 90 },
          { id: "l8-l2-a5", type: "assessment", title: "CH Challenge", description: "Master ch words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-8-lesson-3",
        levelId: "level-8",
        lessonNumber: 3,
        title: "The TH Sounds",
        description: "Learn both th sounds",
        objectives: ["Recognize voiced and unvoiced th", "Read th words"],
        activities: [
          { id: "l8-l3-a1", type: "phonics", title: "Meet TH", description: "Learn the th sounds", contentId: "th", duration: 90 },
          { id: "l8-l3-a2", type: "word-building", title: "Build: this", description: "Spell 'this'", contentId: "this", duration: 60 },
          { id: "l8-l3-a3", type: "word-building", title: "Build: think", description: "Spell 'think'", contentId: "think", duration: 60 },
          { id: "l8-l3-a4", type: "blending", title: "Read TH Words", description: "Read th words", duration: 90 },
          { id: "l8-l3-a5", type: "assessment", title: "TH Sort", description: "Sort th sounds", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 7,
      },
      {
        id: "level-8-lesson-4",
        levelId: "level-8",
        lessonNumber: 4,
        title: "The WH Sound",
        description: "Learn the wh digraph",
        objectives: ["Recognize the wh sound", "Read wh question words"],
        activities: [
          { id: "l8-l4-a1", type: "phonics", title: "Meet WH", description: "Learn the wh sound", contentId: "wh", duration: 60 },
          { id: "l8-l4-a2", type: "sight-words", title: "What, When, Where", description: "Learn question words", duration: 90 },
          { id: "l8-l4-a3", type: "word-building", title: "Build: whale", description: "Spell 'whale'", contentId: "whale", duration: 60 },
          { id: "l8-l4-a4", type: "assessment", title: "Question Words", description: "Use wh words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-8-lesson-5",
        levelId: "level-8",
        lessonNumber: 5,
        title: "The CK Sound",
        description: "Learn the ck ending",
        objectives: ["Recognize the ck sound", "Read ck words"],
        activities: [
          { id: "l8-l5-a1", type: "phonics", title: "Meet CK", description: "Learn the ck ending", contentId: "ck", duration: 60 },
          { id: "l8-l5-a2", type: "word-building", title: "Build: duck", description: "Spell 'duck'", contentId: "duck", duration: 60 },
          { id: "l8-l5-a3", type: "word-building", title: "Build: rock", description: "Spell 'rock'", contentId: "rock", duration: 60 },
          { id: "l8-l5-a4", type: "blending", title: "Read CK Words", description: "Read ck words", duration: 90 },
          { id: "l8-l5-a5", type: "assessment", title: "CK Practice", description: "Master ck words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-8-lesson-6",
        levelId: "level-8",
        lessonNumber: 6,
        title: "The NG Sound",
        description: "Learn the ng ending",
        objectives: ["Recognize the ng sound", "Read ng words"],
        activities: [
          { id: "l8-l6-a1", type: "phonics", title: "Meet NG", description: "Learn the ng ending", contentId: "ng", duration: 60 },
          { id: "l8-l6-a2", type: "word-building", title: "Build: ring", description: "Spell 'ring'", contentId: "ring", duration: 60 },
          { id: "l8-l6-a3", type: "word-building", title: "Build: sing", description: "Spell 'sing'", contentId: "sing", duration: 60 },
          { id: "l8-l6-a4", type: "blending", title: "Read NG Words", description: "Read ng words", duration: 90 },
          { id: "l8-l6-a5", type: "assessment", title: "NG Challenge", description: "Master ng words", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-8-lesson-7",
        levelId: "level-8",
        lessonNumber: 7,
        title: "Digraph Review",
        description: "Master all digraphs",
        objectives: ["Review all digraph sounds", "Read digraph words fluently"],
        activities: [
          { id: "l8-l7-a1", type: "assessment", title: "Digraph Sort", description: "Sort all digraphs", duration: 120 },
          { id: "l8-l7-a2", type: "story", title: "Digraph Story", description: "Read a digraph story", contentId: "digraph-story", duration: 180 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-digraph-detective",
  },

  // LEVEL 9: Fluency
  {
    id: "level-9",
    levelNumber: 9,
    title: "Fluency Forest",
    theme: "Reading with Confidence",
    description: "Read smoothly and quickly!",
    color: {
      primary: "#27AE60",
      secondary: "#58D68D",
      background: "#EAFAF1",
    },
    icon: "🌲",
    lessons: [
      {
        id: "level-9-lesson-1",
        levelId: "level-9",
        lessonNumber: 1,
        title: "Reading Speed",
        description: "Build reading fluency",
        objectives: ["Read words quickly", "Improve automaticity"],
        activities: [
          { id: "l9-l1-a1", type: "blending", title: "Speed Read", description: "Read words quickly", duration: 120 },
          { id: "l9-l1-a2", type: "assessment", title: "Timed Reading", description: "Read against time", duration: 120 },
          { id: "l9-l1-a3", type: "story", title: "Fluency Practice", description: "Read a short story", contentId: "fluency-1", duration: 180 },
        ],
        estimatedMinutes: 7,
      },
      {
        id: "level-9-lesson-2",
        levelId: "level-9",
        lessonNumber: 2,
        title: "Reading Expression",
        description: "Read with feeling",
        objectives: ["Use expression when reading", "Read punctuation"],
        activities: [
          { id: "l9-l2-a1", type: "phonics", title: "Punctuation", description: "Learn punctuation marks", duration: 90 },
          { id: "l9-l2-a2", type: "story", title: "Express Yourself", description: "Read with expression", contentId: "expression-1", duration: 180 },
          { id: "l9-l2-a3", type: "assessment", title: "Expression Check", description: "Practice expression", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-9-lesson-3",
        levelId: "level-9",
        lessonNumber: 3,
        title: "Phrases and Sentences",
        description: "Read in meaningful chunks",
        objectives: ["Read phrases smoothly", "Group words naturally"],
        activities: [
          { id: "l9-l3-a1", type: "blending", title: "Phrase Practice", description: "Read common phrases", duration: 90 },
          { id: "l9-l3-a2", type: "story", title: "Sentence Flow", description: "Read flowing sentences", contentId: "phrases-1", duration: 180 },
          { id: "l9-l3-a3", type: "assessment", title: "Phrase Reading", description: "Practice phrase reading", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-9-lesson-4",
        levelId: "level-9",
        lessonNumber: 4,
        title: "Story Comprehension",
        description: "Understand what you read",
        objectives: ["Comprehend story meaning", "Answer questions"],
        activities: [
          { id: "l9-l4-a1", type: "story", title: "Read and Think", description: "Read and understand", contentId: "comprehension-1", duration: 180 },
          { id: "l9-l4-a2", type: "assessment", title: "Story Questions", description: "Answer comprehension questions", duration: 120 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 5,
      },
      {
        id: "level-9-lesson-5",
        levelId: "level-9",
        lessonNumber: 5,
        title: "Independent Reading",
        description: "Read on your own",
        objectives: ["Read independently", "Choose your own book"],
        activities: [
          { id: "l9-l5-a1", type: "story", title: "Free Choice", description: "Choose a story to read", contentId: "choice-1", duration: 240 },
          { id: "l9-l5-a2", type: "assessment", title: "Share Your Story", description: "Tell about your story", duration: 120 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-9-lesson-6",
        levelId: "level-9",
        lessonNumber: 6,
        title: "Fluency Challenge",
        description: "Test your reading skills",
        objectives: ["Demonstrate fluent reading", "Read with confidence"],
        activities: [
          { id: "l9-l6-a1", type: "assessment", title: "Fluency Test", description: "Show your reading skills", duration: 180 },
          { id: "l9-l6-a2", type: "story", title: "Celebration Read", description: "Read your favorite story", contentId: "celebration-1", duration: 180 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-fluency-forest",
  },

  // LEVEL 10: Master Reader
  {
    id: "level-10",
    levelNumber: 10,
    title: "Reading Rainbow",
    theme: "Master Reader",
    description: "You're a reading superstar!",
    color: {
      primary: "#8E44AD",
      secondary: "#A569BD",
      background: "#F4ECF7",
    },
    icon: "🌈",
    lessons: [
      {
        id: "level-10-lesson-1",
        levelId: "level-10",
        lessonNumber: 1,
        title: "Vowel Teams: AI, AY",
        description: "Learn ai and ay vowel teams",
        objectives: ["Read ai and ay words", "Spell vowel team words"],
        activities: [
          { id: "l10-l1-a1", type: "phonics", title: "Meet AI", description: "Learn the ai team", contentId: "ai", duration: 60 },
          { id: "l10-l1-a2", type: "phonics", title: "Meet AY", description: "Learn the ay team", contentId: "ay", duration: 60 },
          { id: "l10-l1-a3", type: "word-building", title: "Build: rain", description: "Spell 'rain'", contentId: "rain", duration: 60 },
          { id: "l10-l1-a4", type: "word-building", title: "Build: play", description: "Spell 'play'", contentId: "play", duration: 60 },
          { id: "l10-l1-a5", type: "assessment", title: "AI/AY Practice", description: "Practice vowel teams", duration: 90 },
        ],
        estimatedMinutes: 6,
      },
      {
        id: "level-10-lesson-2",
        levelId: "level-10",
        lessonNumber: 2,
        title: "Vowel Teams: EE, EA",
        description: "Learn ee and ea vowel teams",
        objectives: ["Read ee and ea words", "Distinguish between ee and ea"],
        activities: [
          { id: "l10-l2-a1", type: "phonics", title: "Meet EE", description: "Learn the ee team", contentId: "ee", duration: 60 },
          { id: "l10-l2-a2", type: "phonics", title: "Meet EA", description: "Learn the ea team", contentId: "ea", duration: 60 },
          { id: "l10-l2-a3", type: "word-building", title: "Build: tree", description: "Spell 'tree'", contentId: "tree", duration: 60 },
          { id: "l10-l2-a4", type: "word-building", title: "Build: read", description: "Spell 'read'", contentId: "read", duration: 60 },
          { id: "l10-l2-a5", type: "assessment", title: "EE/EA Practice", description: "Practice vowel teams", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-10-lesson-3",
        levelId: "level-10",
        lessonNumber: 3,
        title: "Vowel Teams: OA, OW",
        description: "Learn oa and ow vowel teams",
        objectives: ["Read oa and ow words", "Understand long O sounds"],
        activities: [
          { id: "l10-l3-a1", type: "phonics", title: "Meet OA", description: "Learn the oa team", contentId: "oa", duration: 60 },
          { id: "l10-l3-a2", type: "phonics", title: "Meet OW", description: "Learn the ow team", contentId: "ow", duration: 60 },
          { id: "l10-l3-a3", type: "word-building", title: "Build: boat", description: "Spell 'boat'", contentId: "boat", duration: 60 },
          { id: "l10-l3-a4", type: "word-building", title: "Build: snow", description: "Spell 'snow'", contentId: "snow", duration: 60 },
          { id: "l10-l3-a5", type: "assessment", title: "OA/OW Practice", description: "Practice vowel teams", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-10-lesson-4",
        levelId: "level-10",
        lessonNumber: 4,
        title: "Vowel Teams: OO",
        description: "Learn the oo sounds",
        objectives: ["Read both oo sounds", "Distinguish moon vs book"],
        activities: [
          { id: "l10-l4-a1", type: "phonics", title: "Long OO", description: "Learn moon sound", contentId: "oo-long", duration: 60 },
          { id: "l10-l4-a2", type: "phonics", title: "Short OO", description: "Learn book sound", contentId: "oo-short", duration: 60 },
          { id: "l10-l4-a3", type: "word-building", title: "Build: moon", description: "Spell 'moon'", contentId: "moon", duration: 60 },
          { id: "l10-l4-a4", type: "word-building", title: "Build: book", description: "Spell 'book'", contentId: "book", duration: 60 },
          { id: "l10-l4-a5", type: "assessment", title: "OO Sort", description: "Sort oo sounds", duration: 90 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 6,
      },
      {
        id: "level-10-lesson-5",
        levelId: "level-10",
        lessonNumber: 5,
        title: "Advanced Reading",
        description: "Read longer stories",
        objectives: ["Read longer texts", "Build reading stamina"],
        activities: [
          { id: "l10-l5-a1", type: "story", title: "Long Story", description: "Read a longer story", contentId: "long-story-1", duration: 300 },
          { id: "l10-l5-a2", type: "assessment", title: "Story Review", description: "Discuss the story", duration: 120 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 7,
      },
      {
        id: "level-10-lesson-6",
        levelId: "level-10",
        lessonNumber: 6,
        title: "Reading Champion!",
        description: "Celebrate your achievement",
        objectives: ["Show all reading skills", "Celebrate success"],
        activities: [
          { id: "l10-l6-a1", type: "assessment", title: "Final Challenge", description: "Show everything you learned", duration: 180 },
          { id: "l10-l6-a2", type: "story", title: "Champion Story", description: "Read your graduation story", contentId: "champion-story", duration: 240 },
        ],
        prerequisites: { previousLesson: true },
        estimatedMinutes: 7,
      },
    ],
    prerequisites: { previousLevel: true, minCompletion: 75 },
    rewardStoryId: "story-reading-champion",
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
