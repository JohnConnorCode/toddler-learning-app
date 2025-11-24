/**
 * Interactive Story Books Data Structure
 * Inspired by Duolingo ABC's story book system
 */

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type StoryCategory = "animals" | "family" | "adventure" | "nature" | "friendship" | "learning";

export interface StoryWord {
  /** The word text */
  text: string;
  /** Index of this word in the sentence */
  index: number;
  /** Optional phonetic pronunciation */
  phonetic?: string;
  /** Optional definition for vocabulary learning */
  definition?: string;
}

export interface StoryPage {
  /** Unique page identifier */
  id: string;
  /** Page number (1-indexed for display) */
  pageNumber: number;
  /** Main text content of the page */
  text: string;
  /** Parsed words for read-along highlighting */
  words: StoryWord[];
  /** Image URL or path for the page illustration */
  image?: string;
  /** Alternative text for image accessibility */
  imageAlt?: string;
  /** Optional audio narration file */
  audioUrl?: string;
  /** Background color for the page */
  backgroundColor?: string;
}

export interface ComprehensionQuestion {
  /** Unique question ID */
  id: string;
  /** The question text */
  question: string;
  /** Possible answer choices */
  options: string[];
  /** Index of correct answer (0-based) */
  correctAnswerIndex: number;
  /** Explanation shown after answering */
  explanation?: string;
  /** Image to accompany question */
  image?: string;
}

export interface Story {
  /** Unique story identifier */
  id: string;
  /** Story title */
  title: string;
  /** Author name */
  author: string;
  /** Illustrator name */
  illustrator?: string;
  /** Short description/synopsis */
  description: string;
  /** Cover image URL */
  coverImage: string;
  /** Reading difficulty level */
  difficulty: DifficultyLevel;
  /** Story category/theme */
  category: StoryCategory;
  /** Estimated reading time in minutes */
  estimatedMinutes: number;
  /** Total word count */
  wordCount: number;
  /** All pages in the story */
  pages: StoryPage[];
  /** Optional comprehension questions */
  comprehensionQuestions?: ComprehensionQuestion[];
  /** Level that unlocks this story */
  unlockLevel?: number;
  /** Featured/recommended flag */
  featured?: boolean;
  /** Tags for filtering/search */
  tags?: string[];
  /** Color theme for the story */
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface StoryProgress {
  /** Story ID */
  storyId: string;
  /** Has been opened */
  started: boolean;
  /** Has been read to the end */
  completed: boolean;
  /** Last page number reached */
  lastPageRead: number;
  /** Total times read */
  timesRead: number;
  /** Comprehension questions answered correctly */
  questionsCorrect: number;
  /** Total comprehension questions attempted */
  questionsAttempted: number;
  /** Timestamp of first read */
  firstReadAt?: Date;
  /** Timestamp of last read */
  lastReadAt?: Date;
  /** Favorited by user */
  favorited?: boolean;
}

/**
 * Helper function to parse text into StoryWord objects
 */
export function parseTextToWords(text: string, pageId: string): StoryWord[] {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  return words.map((text, index) => ({
    text,
    index,
  }));
}

/**
 * Sample story data
 */
export const STORIES: Story[] = [
  {
    id: "story-cat-hat",
    title: "The Cat in the Hat",
    author: "Little Learner Books",
    description: "A playful cat visits on a rainy day!",
    coverImage: "/images/stories/cat-hat-cover.jpg",
    difficulty: "beginner",
    category: "animals",
    estimatedMinutes: 3,
    wordCount: 45,
    unlockLevel: 2,
    featured: true,
    tags: ["rhyming", "pets", "fun"],
    theme: {
      primary: "#FF6B6B",
      secondary: "#FF8E8E",
      background: "#FFF5F5",
    },
    pages: [
      {
        id: "cat-hat-p1",
        pageNumber: 1,
        text: "A cat sat on a mat.",
        words: parseTextToWords("A cat sat on a mat.", "cat-hat-p1"),
        image: "/images/stories/cat-on-mat.jpg",
        imageAlt: "A happy cat sitting on a colorful mat",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "cat-hat-p2",
        pageNumber: 2,
        text: "The cat had a hat.",
        words: parseTextToWords("The cat had a hat.", "cat-hat-p2"),
        image: "/images/stories/cat-with-hat.jpg",
        imageAlt: "The cat wearing a tall striped hat",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "cat-hat-p3",
        pageNumber: 3,
        text: "The hat was big and red.",
        words: parseTextToWords("The hat was big and red.", "cat-hat-p3"),
        image: "/images/stories/big-red-hat.jpg",
        imageAlt: "Close-up of the big red hat",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "cat-hat-p4",
        pageNumber: 4,
        text: "The cat was happy!",
        words: parseTextToWords("The cat was happy!", "cat-hat-p4"),
        image: "/images/stories/happy-cat.jpg",
        imageAlt: "The cat smiling and dancing",
        backgroundColor: "#FFF9E6",
      },
    ],
    comprehensionQuestions: [
      {
        id: "cat-hat-q1",
        question: "Where was the cat sitting?",
        options: ["On a mat", "On a chair", "On a bed", "On a tree"],
        correctAnswerIndex: 0,
        explanation: "The story says 'A cat sat on a mat.'",
      },
      {
        id: "cat-hat-q2",
        question: "What color was the hat?",
        options: ["Blue", "Green", "Red", "Yellow"],
        correctAnswerIndex: 2,
        explanation: "The hat was big and red!",
      },
    ],
  },
  {
    id: "story-sun-fun",
    title: "Sun and Fun",
    author: "Little Learner Books",
    description: "Playing outside on a sunny day!",
    coverImage: "/images/stories/sun-fun-cover.jpg",
    difficulty: "beginner",
    category: "nature",
    estimatedMinutes: 3,
    wordCount: 40,
    unlockLevel: 1,
    featured: true,
    tags: ["weather", "outdoor", "play"],
    theme: {
      primary: "#FFD700",
      secondary: "#FFE55C",
      background: "#FFFBEB",
    },
    pages: [
      {
        id: "sun-fun-p1",
        pageNumber: 1,
        text: "The sun is up!",
        words: parseTextToWords("The sun is up!", "sun-fun-p1"),
        image: "/images/stories/bright-sun.jpg",
        imageAlt: "A bright yellow sun in a blue sky",
        backgroundColor: "#E6F3FF",
      },
      {
        id: "sun-fun-p2",
        pageNumber: 2,
        text: "Let's run and play!",
        words: parseTextToWords("Let's run and play!", "sun-fun-p2"),
        image: "/images/stories/kids-running.jpg",
        imageAlt: "Children running in a park",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "sun-fun-p3",
        pageNumber: 3,
        text: "We have so much fun!",
        words: parseTextToWords("We have so much fun!", "sun-fun-p3"),
        image: "/images/stories/happy-playing.jpg",
        imageAlt: "Children laughing and playing",
        backgroundColor: "#FFF9E6",
      },
    ],
    comprehensionQuestions: [
      {
        id: "sun-fun-q1",
        question: "What is in the sky?",
        options: ["The moon", "The sun", "Stars", "Clouds"],
        correctAnswerIndex: 1,
        explanation: "The story says 'The sun is up!'",
      },
    ],
  },
  {
    id: "story-dog-log",
    title: "Dog on a Log",
    author: "Little Learner Books",
    description: "A brave dog's adventure!",
    coverImage: "/images/stories/dog-log-cover.jpg",
    difficulty: "beginner",
    category: "animals",
    estimatedMinutes: 4,
    wordCount: 50,
    unlockLevel: 3,
    tags: ["adventure", "pets", "courage"],
    theme: {
      primary: "#8B4513",
      secondary: "#A0522D",
      background: "#FFF5E6",
    },
    pages: [
      {
        id: "dog-log-p1",
        pageNumber: 1,
        text: "A dog found a log.",
        words: parseTextToWords("A dog found a log.", "dog-log-p1"),
        image: "/images/stories/dog-finds-log.jpg",
        imageAlt: "A dog discovering a fallen log",
        backgroundColor: "#E6F2E6",
      },
      {
        id: "dog-log-p2",
        pageNumber: 2,
        text: "The dog jumped on the log.",
        words: parseTextToWords("The dog jumped on the log.", "dog-log-p2"),
        image: "/images/stories/dog-jumping.jpg",
        imageAlt: "The dog jumping onto the log",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "dog-log-p3",
        pageNumber: 3,
        text: "The log started to roll!",
        words: parseTextToWords("The log started to roll!", "dog-log-p3"),
        image: "/images/stories/rolling-log.jpg",
        imageAlt: "The log rolling with the dog on it",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "dog-log-p4",
        pageNumber: 4,
        text: "The dog did not fall.",
        words: parseTextToWords("The dog did not fall.", "dog-log-p4"),
        image: "/images/stories/balanced-dog.jpg",
        imageAlt: "The dog balancing carefully",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "dog-log-p5",
        pageNumber: 5,
        text: "What a brave dog!",
        words: parseTextToWords("What a brave dog!", "dog-log-p5"),
        image: "/images/stories/proud-dog.jpg",
        imageAlt: "The dog standing proudly",
        backgroundColor: "#E6FFE6",
      },
    ],
    comprehensionQuestions: [
      {
        id: "dog-log-q1",
        question: "What did the dog find?",
        options: ["A stick", "A ball", "A log", "A bone"],
        correctAnswerIndex: 2,
        explanation: "The dog found a log!",
      },
      {
        id: "dog-log-q2",
        question: "Did the dog fall off the log?",
        options: ["Yes", "No"],
        correctAnswerIndex: 1,
        explanation: "The dog did not fall. What a brave dog!",
      },
    ],
  },
];

/**
 * Get story by ID
 */
export function getStoryById(id: string): Story | undefined {
  return STORIES.find(story => story.id === id);
}

/**
 * Get stories by difficulty
 */
export function getStoriesByDifficulty(difficulty: DifficultyLevel): Story[] {
  return STORIES.filter(story => story.difficulty === difficulty);
}

/**
 * Get stories by category
 */
export function getStoriesByCategory(category: StoryCategory): Story[] {
  return STORIES.filter(story => story.category === category);
}

/**
 * Get stories unlocked at or before a level
 */
export function getUnlockedStories(levelNumber: number): Story[] {
  return STORIES.filter(
    story => !story.unlockLevel || story.unlockLevel <= levelNumber
  );
}

/**
 * Get featured stories
 */
export function getFeaturedStories(): Story[] {
  return STORIES.filter(story => story.featured);
}
