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
 * Comprehensive Story Library
 * 20+ stories across all difficulty levels and categories
 */
export const STORIES: Story[] = [
  // ============================================
  // BEGINNER STORIES (Levels 1-3)
  // ============================================
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
  {
    id: "story-big-pig",
    title: "The Big Pig",
    author: "Little Learner Books",
    description: "A pig who loves to dig!",
    coverImage: "/images/stories/big-pig-cover.jpg",
    difficulty: "beginner",
    category: "animals",
    estimatedMinutes: 3,
    wordCount: 35,
    unlockLevel: 1,
    tags: ["farm", "rhyming", "animals"],
    theme: {
      primary: "#FFC0CB",
      secondary: "#FFB6C1",
      background: "#FFF0F5",
    },
    pages: [
      {
        id: "big-pig-p1",
        pageNumber: 1,
        text: "I see a big pig.",
        words: parseTextToWords("I see a big pig.", "big-pig-p1"),
        imageAlt: "A large pink pig",
        backgroundColor: "#FFF0F5",
      },
      {
        id: "big-pig-p2",
        pageNumber: 2,
        text: "The pig can dig.",
        words: parseTextToWords("The pig can dig.", "big-pig-p2"),
        imageAlt: "Pig digging in mud",
        backgroundColor: "#E6F2E6",
      },
      {
        id: "big-pig-p3",
        pageNumber: 3,
        text: "Dig, pig, dig!",
        words: parseTextToWords("Dig, pig, dig!", "big-pig-p3"),
        imageAlt: "Pig happily digging",
        backgroundColor: "#FFF9E6",
      },
    ],
    comprehensionQuestions: [
      {
        id: "big-pig-q1",
        question: "What can the pig do?",
        options: ["Run", "Dig", "Fly", "Swim"],
        correctAnswerIndex: 1,
        explanation: "The pig can dig!",
      },
    ],
  },
  {
    id: "story-hop-pop",
    title: "Hop and Pop",
    author: "Little Learner Books",
    description: "A frog who loves to hop!",
    coverImage: "/images/stories/hop-pop-cover.jpg",
    difficulty: "beginner",
    category: "animals",
    estimatedMinutes: 3,
    wordCount: 40,
    unlockLevel: 2,
    tags: ["rhyming", "frog", "fun"],
    theme: {
      primary: "#32CD32",
      secondary: "#98FB98",
      background: "#F0FFF0",
    },
    pages: [
      {
        id: "hop-pop-p1",
        pageNumber: 1,
        text: "A frog can hop.",
        words: parseTextToWords("A frog can hop.", "hop-pop-p1"),
        imageAlt: "A green frog",
        backgroundColor: "#F0FFF0",
      },
      {
        id: "hop-pop-p2",
        pageNumber: 2,
        text: "Hop, hop, hop!",
        words: parseTextToWords("Hop, hop, hop!", "hop-pop-p2"),
        imageAlt: "Frog hopping",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "hop-pop-p3",
        pageNumber: 3,
        text: "The frog hops on top.",
        words: parseTextToWords("The frog hops on top.", "hop-pop-p3"),
        imageAlt: "Frog on a rock",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "hop-pop-p4",
        pageNumber: 4,
        text: "Pop! It is fun to hop!",
        words: parseTextToWords("Pop! It is fun to hop!", "hop-pop-p4"),
        imageAlt: "Happy frog jumping",
        backgroundColor: "#F0FFF0",
      },
    ],
    comprehensionQuestions: [
      {
        id: "hop-pop-q1",
        question: "What animal is in the story?",
        options: ["A dog", "A cat", "A frog", "A bird"],
        correctAnswerIndex: 2,
        explanation: "The story is about a frog that can hop!",
      },
    ],
  },
  {
    id: "story-red-bed",
    title: "The Red Bed",
    author: "Little Learner Books",
    description: "Time for bed!",
    coverImage: "/images/stories/red-bed-cover.jpg",
    difficulty: "beginner",
    category: "family",
    estimatedMinutes: 3,
    wordCount: 38,
    unlockLevel: 1,
    tags: ["bedtime", "rhyming", "sleep"],
    theme: {
      primary: "#DC143C",
      secondary: "#FF6B6B",
      background: "#FFF5F5",
    },
    pages: [
      {
        id: "red-bed-p1",
        pageNumber: 1,
        text: "I have a red bed.",
        words: parseTextToWords("I have a red bed.", "red-bed-p1"),
        imageAlt: "A cozy red bed",
        backgroundColor: "#FFF5F5",
      },
      {
        id: "red-bed-p2",
        pageNumber: 2,
        text: "Ted is on my bed.",
        words: parseTextToWords("Ted is on my bed.", "red-bed-p2"),
        imageAlt: "Teddy bear on bed",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "red-bed-p3",
        pageNumber: 3,
        text: "I rest my head.",
        words: parseTextToWords("I rest my head.", "red-bed-p3"),
        imageAlt: "Child resting head on pillow",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "red-bed-p4",
        pageNumber: 4,
        text: "Time for bed, Ted!",
        words: parseTextToWords("Time for bed, Ted!", "red-bed-p4"),
        imageAlt: "Child and teddy sleeping",
        backgroundColor: "#E6F9FF",
      },
    ],
    comprehensionQuestions: [
      {
        id: "red-bed-q1",
        question: "What color is the bed?",
        options: ["Blue", "Red", "Green", "Yellow"],
        correctAnswerIndex: 1,
        explanation: "The bed is red!",
      },
    ],
  },
  {
    id: "story-my-pet",
    title: "My Pet",
    author: "Little Learner Books",
    description: "A child and their pet!",
    coverImage: "/images/stories/my-pet-cover.jpg",
    difficulty: "beginner",
    category: "animals",
    estimatedMinutes: 3,
    wordCount: 42,
    unlockLevel: 2,
    tags: ["pets", "love", "friendship"],
    theme: {
      primary: "#9370DB",
      secondary: "#DDA0DD",
      background: "#F5F0FF",
    },
    pages: [
      {
        id: "my-pet-p1",
        pageNumber: 1,
        text: "I have a pet.",
        words: parseTextToWords("I have a pet.", "my-pet-p1"),
        imageAlt: "Child with a pet",
        backgroundColor: "#F5F0FF",
      },
      {
        id: "my-pet-p2",
        pageNumber: 2,
        text: "My pet is wet.",
        words: parseTextToWords("My pet is wet.", "my-pet-p2"),
        imageAlt: "Pet in the bath",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "my-pet-p3",
        pageNumber: 3,
        text: "I help my pet get dry.",
        words: parseTextToWords("I help my pet get dry.", "my-pet-p3"),
        imageAlt: "Drying off the pet",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "my-pet-p4",
        pageNumber: 4,
        text: "I love my pet!",
        words: parseTextToWords("I love my pet!", "my-pet-p4"),
        imageAlt: "Child hugging pet",
        backgroundColor: "#FFE6F0",
      },
    ],
    comprehensionQuestions: [
      {
        id: "my-pet-q1",
        question: "Was the pet wet or dry?",
        options: ["Dry", "Wet", "Cold", "Hot"],
        correctAnswerIndex: 1,
        explanation: "The pet was wet!",
      },
    ],
  },

  // ============================================
  // INTERMEDIATE STORIES (Levels 4-6)
  // ============================================
  {
    id: "story-best-friends",
    title: "Best Friends",
    author: "Little Learner Books",
    description: "Two friends play together!",
    coverImage: "/images/stories/best-friends-cover.jpg",
    difficulty: "intermediate",
    category: "friendship",
    estimatedMinutes: 4,
    wordCount: 65,
    unlockLevel: 4,
    featured: true,
    tags: ["friendship", "play", "sharing"],
    theme: {
      primary: "#FF69B4",
      secondary: "#FFB6C1",
      background: "#FFF0F5",
    },
    pages: [
      {
        id: "best-friends-p1",
        pageNumber: 1,
        text: "Sam and Kim are best friends.",
        words: parseTextToWords("Sam and Kim are best friends.", "best-friends-p1"),
        imageAlt: "Two children smiling",
        backgroundColor: "#FFF0F5",
      },
      {
        id: "best-friends-p2",
        pageNumber: 2,
        text: "They like to play in the sand.",
        words: parseTextToWords("They like to play in the sand.", "best-friends-p2"),
        imageAlt: "Children playing in sandbox",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "best-friends-p3",
        pageNumber: 3,
        text: "Sam makes a big sand hill.",
        words: parseTextToWords("Sam makes a big sand hill.", "best-friends-p3"),
        imageAlt: "Child building sand hill",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "best-friends-p4",
        pageNumber: 4,
        text: "Kim helps Sam dig.",
        words: parseTextToWords("Kim helps Sam dig.", "best-friends-p4"),
        imageAlt: "Friends digging together",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "best-friends-p5",
        pageNumber: 5,
        text: "Best friends help each other!",
        words: parseTextToWords("Best friends help each other!", "best-friends-p5"),
        imageAlt: "Friends hugging",
        backgroundColor: "#FFE6F0",
      },
    ],
    comprehensionQuestions: [
      {
        id: "best-friends-q1",
        question: "Who are best friends?",
        options: ["Sam and Kim", "Tom and Tim", "Dan and Jan", "Bob and Rob"],
        correctAnswerIndex: 0,
        explanation: "Sam and Kim are best friends!",
      },
      {
        id: "best-friends-q2",
        question: "What did Sam make?",
        options: ["A cake", "A sand hill", "A house", "A toy"],
        correctAnswerIndex: 1,
        explanation: "Sam makes a big sand hill!",
      },
    ],
  },
  {
    id: "story-trip-shop",
    title: "Trip to the Shop",
    author: "Little Learner Books",
    description: "Shopping with Mom!",
    coverImage: "/images/stories/trip-shop-cover.jpg",
    difficulty: "intermediate",
    category: "family",
    estimatedMinutes: 4,
    wordCount: 70,
    unlockLevel: 4,
    tags: ["shopping", "family", "helping"],
    theme: {
      primary: "#20B2AA",
      secondary: "#66CDAA",
      background: "#F0FFFF",
    },
    pages: [
      {
        id: "trip-shop-p1",
        pageNumber: 1,
        text: "Mom and I go to the shop.",
        words: parseTextToWords("Mom and I go to the shop.", "trip-shop-p1"),
        imageAlt: "Child and mom walking to store",
        backgroundColor: "#F0FFFF",
      },
      {
        id: "trip-shop-p2",
        pageNumber: 2,
        text: "We need to get lots of things.",
        words: parseTextToWords("We need to get lots of things.", "trip-shop-p2"),
        imageAlt: "Shopping list",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "trip-shop-p3",
        pageNumber: 3,
        text: "I help Mom pick the best apples.",
        words: parseTextToWords("I help Mom pick the best apples.", "trip-shop-p3"),
        imageAlt: "Picking apples at store",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "trip-shop-p4",
        pageNumber: 4,
        text: "We get bread, milk, and eggs.",
        words: parseTextToWords("We get bread, milk, and eggs.", "trip-shop-p4"),
        imageAlt: "Groceries in cart",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "trip-shop-p5",
        pageNumber: 5,
        text: "I am a big helper!",
        words: parseTextToWords("I am a big helper!", "trip-shop-p5"),
        imageAlt: "Proud child helping",
        backgroundColor: "#F0FFFF",
      },
    ],
    comprehensionQuestions: [
      {
        id: "trip-shop-q1",
        question: "Where did they go?",
        options: ["The park", "The shop", "School", "The beach"],
        correctAnswerIndex: 1,
        explanation: "They went to the shop!",
      },
    ],
  },
  {
    id: "story-park-day",
    title: "A Day at the Park",
    author: "Little Learner Books",
    description: "Fun at the park!",
    coverImage: "/images/stories/park-day-cover.jpg",
    difficulty: "intermediate",
    category: "adventure",
    estimatedMinutes: 5,
    wordCount: 80,
    unlockLevel: 5,
    featured: true,
    tags: ["park", "play", "outdoor"],
    theme: {
      primary: "#32CD32",
      secondary: "#98FB98",
      background: "#F0FFF0",
    },
    pages: [
      {
        id: "park-day-p1",
        pageNumber: 1,
        text: "It is a sunny day.",
        words: parseTextToWords("It is a sunny day.", "park-day-p1"),
        imageAlt: "Sunny sky",
        backgroundColor: "#E6F3FF",
      },
      {
        id: "park-day-p2",
        pageNumber: 2,
        text: "Dad takes me to the park.",
        words: parseTextToWords("Dad takes me to the park.", "park-day-p2"),
        imageAlt: "Walking to park with dad",
        backgroundColor: "#F0FFF0",
      },
      {
        id: "park-day-p3",
        pageNumber: 3,
        text: "I swing on the swings.",
        words: parseTextToWords("I swing on the swings.", "park-day-p3"),
        imageAlt: "Child on swing",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "park-day-p4",
        pageNumber: 4,
        text: "I slide down the big slide.",
        words: parseTextToWords("I slide down the big slide.", "park-day-p4"),
        imageAlt: "Child on slide",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "park-day-p5",
        pageNumber: 5,
        text: "I climb up high.",
        words: parseTextToWords("I climb up high.", "park-day-p5"),
        imageAlt: "Child climbing",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "park-day-p6",
        pageNumber: 6,
        text: "What a fun day at the park!",
        words: parseTextToWords("What a fun day at the park!", "park-day-p6"),
        imageAlt: "Happy at park",
        backgroundColor: "#F0FFF0",
      },
    ],
    comprehensionQuestions: [
      {
        id: "park-day-q1",
        question: "Who took me to the park?",
        options: ["Mom", "Dad", "Grandma", "Sister"],
        correctAnswerIndex: 1,
        explanation: "Dad takes me to the park!",
      },
      {
        id: "park-day-q2",
        question: "What did I swing on?",
        options: ["The slide", "The swings", "The bench", "The tree"],
        correctAnswerIndex: 1,
        explanation: "I swing on the swings!",
      },
    ],
  },
  {
    id: "story-rainy-day",
    title: "The Rainy Day",
    author: "Little Learner Books",
    description: "Fun inside when it rains!",
    coverImage: "/images/stories/rainy-day-cover.jpg",
    difficulty: "intermediate",
    category: "nature",
    estimatedMinutes: 4,
    wordCount: 75,
    unlockLevel: 5,
    tags: ["weather", "indoor", "creativity"],
    theme: {
      primary: "#4682B4",
      secondary: "#87CEEB",
      background: "#F0F8FF",
    },
    pages: [
      {
        id: "rainy-day-p1",
        pageNumber: 1,
        text: "Drip, drop! It is raining.",
        words: parseTextToWords("Drip, drop! It is raining.", "rainy-day-p1"),
        imageAlt: "Rain on window",
        backgroundColor: "#E6F3FF",
      },
      {
        id: "rainy-day-p2",
        pageNumber: 2,
        text: "I cannot play outside today.",
        words: parseTextToWords("I cannot play outside today.", "rainy-day-p2"),
        imageAlt: "Child looking out window",
        backgroundColor: "#F0F8FF",
      },
      {
        id: "rainy-day-p3",
        pageNumber: 3,
        text: "But I can play inside!",
        words: parseTextToWords("But I can play inside!", "rainy-day-p3"),
        imageAlt: "Happy child inside",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "rainy-day-p4",
        pageNumber: 4,
        text: "I draw a big rainbow.",
        words: parseTextToWords("I draw a big rainbow.", "rainy-day-p4"),
        imageAlt: "Drawing a rainbow",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "rainy-day-p5",
        pageNumber: 5,
        text: "Rainy days can be fun too!",
        words: parseTextToWords("Rainy days can be fun too!", "rainy-day-p5"),
        imageAlt: "Child with art",
        backgroundColor: "#F0F8FF",
      },
    ],
    comprehensionQuestions: [
      {
        id: "rainy-day-q1",
        question: "What was the weather like?",
        options: ["Sunny", "Snowy", "Rainy", "Windy"],
        correctAnswerIndex: 2,
        explanation: "It was raining!",
      },
    ],
  },
  {
    id: "story-lost-kitten",
    title: "The Lost Kitten",
    author: "Little Learner Books",
    description: "Helping a lost kitten find home!",
    coverImage: "/images/stories/lost-kitten-cover.jpg",
    difficulty: "intermediate",
    category: "animals",
    estimatedMinutes: 5,
    wordCount: 85,
    unlockLevel: 5,
    tags: ["pets", "helping", "kindness"],
    theme: {
      primary: "#DDA0DD",
      secondary: "#EE82EE",
      background: "#FFF0FF",
    },
    pages: [
      {
        id: "lost-kitten-p1",
        pageNumber: 1,
        text: "I see a little kitten.",
        words: parseTextToWords("I see a little kitten.", "lost-kitten-p1"),
        imageAlt: "Small kitten alone",
        backgroundColor: "#FFF0FF",
      },
      {
        id: "lost-kitten-p2",
        pageNumber: 2,
        text: "The kitten looks lost and sad.",
        words: parseTextToWords("The kitten looks lost and sad.", "lost-kitten-p2"),
        imageAlt: "Sad kitten",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "lost-kitten-p3",
        pageNumber: 3,
        text: "I pick up the soft kitten.",
        words: parseTextToWords("I pick up the soft kitten.", "lost-kitten-p3"),
        imageAlt: "Child holding kitten",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "lost-kitten-p4",
        pageNumber: 4,
        text: "We look for its home.",
        words: parseTextToWords("We look for its home.", "lost-kitten-p4"),
        imageAlt: "Searching neighborhood",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "lost-kitten-p5",
        pageNumber: 5,
        text: "We find the kitten's family!",
        words: parseTextToWords("We find the kitten's family!", "lost-kitten-p5"),
        imageAlt: "Kitten with family",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "lost-kitten-p6",
        pageNumber: 6,
        text: "The kitten is happy now!",
        words: parseTextToWords("The kitten is happy now!", "lost-kitten-p6"),
        imageAlt: "Happy kitten",
        backgroundColor: "#FFF0FF",
      },
    ],
    comprehensionQuestions: [
      {
        id: "lost-kitten-q1",
        question: "How did the kitten feel at first?",
        options: ["Happy", "Lost and sad", "Sleepy", "Hungry"],
        correctAnswerIndex: 1,
        explanation: "The kitten looked lost and sad.",
      },
      {
        id: "lost-kitten-q2",
        question: "What did they find?",
        options: ["A ball", "Food", "The kitten's family", "A toy"],
        correctAnswerIndex: 2,
        explanation: "They found the kitten's family!",
      },
    ],
  },
  {
    id: "story-birthday-party",
    title: "The Birthday Party",
    author: "Little Learner Books",
    description: "A special birthday celebration!",
    coverImage: "/images/stories/birthday-party-cover.jpg",
    difficulty: "intermediate",
    category: "family",
    estimatedMinutes: 5,
    wordCount: 90,
    unlockLevel: 6,
    tags: ["birthday", "celebration", "family"],
    theme: {
      primary: "#FF1493",
      secondary: "#FF69B4",
      background: "#FFF0F5",
    },
    pages: [
      {
        id: "birthday-p1",
        pageNumber: 1,
        text: "Today is my birthday!",
        words: parseTextToWords("Today is my birthday!", "birthday-p1"),
        imageAlt: "Excited child",
        backgroundColor: "#FFF0F5",
      },
      {
        id: "birthday-p2",
        pageNumber: 2,
        text: "My friends come to my party.",
        words: parseTextToWords("My friends come to my party.", "birthday-p2"),
        imageAlt: "Friends arriving",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "birthday-p3",
        pageNumber: 3,
        text: "We play games and have fun.",
        words: parseTextToWords("We play games and have fun.", "birthday-p3"),
        imageAlt: "Playing party games",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "birthday-p4",
        pageNumber: 4,
        text: "Mom brings out the cake.",
        words: parseTextToWords("Mom brings out the cake.", "birthday-p4"),
        imageAlt: "Birthday cake",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "birthday-p5",
        pageNumber: 5,
        text: "I make a wish and blow!",
        words: parseTextToWords("I make a wish and blow!", "birthday-p5"),
        imageAlt: "Blowing candles",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "birthday-p6",
        pageNumber: 6,
        text: "This is the best day ever!",
        words: parseTextToWords("This is the best day ever!", "birthday-p6"),
        imageAlt: "Happy birthday child",
        backgroundColor: "#FFF0F5",
      },
    ],
    comprehensionQuestions: [
      {
        id: "birthday-q1",
        question: "What special day was it?",
        options: ["Christmas", "Birthday", "Halloween", "Easter"],
        correctAnswerIndex: 1,
        explanation: "It was their birthday!",
      },
    ],
  },

  // ============================================
  // ADVANCED STORIES (Levels 7-10)
  // ============================================
  {
    id: "story-camping-trip",
    title: "The Camping Trip",
    author: "Little Learner Books",
    description: "An adventure in the woods!",
    coverImage: "/images/stories/camping-trip-cover.jpg",
    difficulty: "advanced",
    category: "adventure",
    estimatedMinutes: 6,
    wordCount: 120,
    unlockLevel: 7,
    featured: true,
    tags: ["camping", "nature", "adventure"],
    theme: {
      primary: "#228B22",
      secondary: "#32CD32",
      background: "#F0FFF0",
    },
    pages: [
      {
        id: "camping-p1",
        pageNumber: 1,
        text: "My family went on a camping trip.",
        words: parseTextToWords("My family went on a camping trip.", "camping-p1"),
        imageAlt: "Family in car",
        backgroundColor: "#E6F3FF",
      },
      {
        id: "camping-p2",
        pageNumber: 2,
        text: "We drove to the woods and set up our tent.",
        words: parseTextToWords("We drove to the woods and set up our tent.", "camping-p2"),
        imageAlt: "Setting up tent",
        backgroundColor: "#F0FFF0",
      },
      {
        id: "camping-p3",
        pageNumber: 3,
        text: "Dad and I went fishing by the lake.",
        words: parseTextToWords("Dad and I went fishing by the lake.", "camping-p3"),
        imageAlt: "Fishing at lake",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "camping-p4",
        pageNumber: 4,
        text: "I caught a big fish! I was so proud.",
        words: parseTextToWords("I caught a big fish! I was so proud.", "camping-p4"),
        imageAlt: "Caught fish",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "camping-p5",
        pageNumber: 5,
        text: "At night, we made a campfire.",
        words: parseTextToWords("At night, we made a campfire.", "camping-p5"),
        imageAlt: "Campfire at night",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "camping-p6",
        pageNumber: 6,
        text: "We roasted marshmallows and told stories.",
        words: parseTextToWords("We roasted marshmallows and told stories.", "camping-p6"),
        imageAlt: "Roasting marshmallows",
        backgroundColor: "#FFF5E6",
      },
      {
        id: "camping-p7",
        pageNumber: 7,
        text: "I looked up and saw so many stars!",
        words: parseTextToWords("I looked up and saw so many stars!", "camping-p7"),
        imageAlt: "Starry night sky",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "camping-p8",
        pageNumber: 8,
        text: "Camping with my family was amazing!",
        words: parseTextToWords("Camping with my family was amazing!", "camping-p8"),
        imageAlt: "Happy family camping",
        backgroundColor: "#F0FFF0",
      },
    ],
    comprehensionQuestions: [
      {
        id: "camping-q1",
        question: "Where did they go fishing?",
        options: ["In the ocean", "By the lake", "In a pool", "At the river"],
        correctAnswerIndex: 1,
        explanation: "Dad and I went fishing by the lake.",
      },
      {
        id: "camping-q2",
        question: "What did they roast at the campfire?",
        options: ["Hot dogs", "Marshmallows", "Corn", "Fish"],
        correctAnswerIndex: 1,
        explanation: "They roasted marshmallows and told stories.",
      },
    ],
  },
  {
    id: "story-school-play",
    title: "The School Play",
    author: "Little Learner Books",
    description: "Performing on stage!",
    coverImage: "/images/stories/school-play-cover.jpg",
    difficulty: "advanced",
    category: "learning",
    estimatedMinutes: 6,
    wordCount: 115,
    unlockLevel: 7,
    tags: ["school", "performance", "courage"],
    theme: {
      primary: "#8B0000",
      secondary: "#DC143C",
      background: "#FFF5F5",
    },
    pages: [
      {
        id: "play-p1",
        pageNumber: 1,
        text: "Today is the day of the school play.",
        words: parseTextToWords("Today is the day of the school play.", "play-p1"),
        imageAlt: "School stage",
        backgroundColor: "#FFF5F5",
      },
      {
        id: "play-p2",
        pageNumber: 2,
        text: "I am going to be a brave knight.",
        words: parseTextToWords("I am going to be a brave knight.", "play-p2"),
        imageAlt: "Knight costume",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "play-p3",
        pageNumber: 3,
        text: "I feel a little bit nervous.",
        words: parseTextToWords("I feel a little bit nervous.", "play-p3"),
        imageAlt: "Nervous child",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "play-p4",
        pageNumber: 4,
        text: "My teacher says, 'You can do it!'",
        words: parseTextToWords("My teacher says, 'You can do it!'", "play-p4"),
        imageAlt: "Encouraging teacher",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "play-p5",
        pageNumber: 5,
        text: "I walk on stage and say my lines.",
        words: parseTextToWords("I walk on stage and say my lines.", "play-p5"),
        imageAlt: "On stage performing",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "play-p6",
        pageNumber: 6,
        text: "Everyone claps when the play is done!",
        words: parseTextToWords("Everyone claps when the play is done!", "play-p6"),
        imageAlt: "Audience clapping",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "play-p7",
        pageNumber: 7,
        text: "I feel so happy and proud!",
        words: parseTextToWords("I feel so happy and proud!", "play-p7"),
        imageAlt: "Proud performer",
        backgroundColor: "#FFF5F5",
      },
    ],
    comprehensionQuestions: [
      {
        id: "play-q1",
        question: "What was the character in the play?",
        options: ["A princess", "A brave knight", "A wizard", "A dragon"],
        correctAnswerIndex: 1,
        explanation: "They were going to be a brave knight!",
      },
      {
        id: "play-q2",
        question: "How did they feel at first?",
        options: ["Angry", "Sleepy", "Nervous", "Bored"],
        correctAnswerIndex: 2,
        explanation: "They felt a little bit nervous.",
      },
    ],
  },
  {
    id: "story-ocean-adventure",
    title: "Ocean Adventure",
    author: "Little Learner Books",
    description: "Exploring the beach and ocean!",
    coverImage: "/images/stories/ocean-adventure-cover.jpg",
    difficulty: "advanced",
    category: "nature",
    estimatedMinutes: 6,
    wordCount: 125,
    unlockLevel: 8,
    tags: ["ocean", "beach", "discovery"],
    theme: {
      primary: "#00CED1",
      secondary: "#48D1CC",
      background: "#E0FFFF",
    },
    pages: [
      {
        id: "ocean-p1",
        pageNumber: 1,
        text: "We went to the beach today!",
        words: parseTextToWords("We went to the beach today!", "ocean-p1"),
        imageAlt: "Beach scene",
        backgroundColor: "#E0FFFF",
      },
      {
        id: "ocean-p2",
        pageNumber: 2,
        text: "The sand was warm under my feet.",
        words: parseTextToWords("The sand was warm under my feet.", "ocean-p2"),
        imageAlt: "Walking on sand",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "ocean-p3",
        pageNumber: 3,
        text: "I found pretty shells on the shore.",
        words: parseTextToWords("I found pretty shells on the shore.", "ocean-p3"),
        imageAlt: "Collecting shells",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "ocean-p4",
        pageNumber: 4,
        text: "The waves splashed against my legs.",
        words: parseTextToWords("The waves splashed against my legs.", "ocean-p4"),
        imageAlt: "Waves at feet",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "ocean-p5",
        pageNumber: 5,
        text: "I saw a crab hiding in the rocks.",
        words: parseTextToWords("I saw a crab hiding in the rocks.", "ocean-p5"),
        imageAlt: "Crab in rocks",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "ocean-p6",
        pageNumber: 6,
        text: "We built a big sand castle together.",
        words: parseTextToWords("We built a big sand castle together.", "ocean-p6"),
        imageAlt: "Building sandcastle",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "ocean-p7",
        pageNumber: 7,
        text: "The sunset made the sky orange and pink.",
        words: parseTextToWords("The sunset made the sky orange and pink.", "ocean-p7"),
        imageAlt: "Beach sunset",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "ocean-p8",
        pageNumber: 8,
        text: "I love the ocean so much!",
        words: parseTextToWords("I love the ocean so much!", "ocean-p8"),
        imageAlt: "Child at ocean",
        backgroundColor: "#E0FFFF",
      },
    ],
    comprehensionQuestions: [
      {
        id: "ocean-q1",
        question: "What did they find on the shore?",
        options: ["Rocks", "Shells", "Fish", "Boats"],
        correctAnswerIndex: 1,
        explanation: "They found pretty shells on the shore.",
      },
      {
        id: "ocean-q2",
        question: "What was hiding in the rocks?",
        options: ["A fish", "A starfish", "A crab", "A snail"],
        correctAnswerIndex: 2,
        explanation: "They saw a crab hiding in the rocks.",
      },
    ],
  },
  {
    id: "story-helping-grandma",
    title: "Helping Grandma",
    author: "Little Learner Books",
    description: "Baking cookies with Grandma!",
    coverImage: "/images/stories/helping-grandma-cover.jpg",
    difficulty: "advanced",
    category: "family",
    estimatedMinutes: 5,
    wordCount: 100,
    unlockLevel: 8,
    tags: ["family", "baking", "grandparents"],
    theme: {
      primary: "#DEB887",
      secondary: "#F5DEB3",
      background: "#FFF8DC",
    },
    pages: [
      {
        id: "grandma-p1",
        pageNumber: 1,
        text: "I visit Grandma's house today.",
        words: parseTextToWords("I visit Grandma's house today.", "grandma-p1"),
        imageAlt: "Grandma's house",
        backgroundColor: "#FFF8DC",
      },
      {
        id: "grandma-p2",
        pageNumber: 2,
        text: "Grandma wants to bake cookies.",
        words: parseTextToWords("Grandma wants to bake cookies.", "grandma-p2"),
        imageAlt: "Grandma in kitchen",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "grandma-p3",
        pageNumber: 3,
        text: "I help her mix the dough.",
        words: parseTextToWords("I help her mix the dough.", "grandma-p3"),
        imageAlt: "Mixing dough",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "grandma-p4",
        pageNumber: 4,
        text: "We use cookie cutters to make shapes.",
        words: parseTextToWords("We use cookie cutters to make shapes.", "grandma-p4"),
        imageAlt: "Cookie shapes",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "grandma-p5",
        pageNumber: 5,
        text: "The cookies smell so good in the oven!",
        words: parseTextToWords("The cookies smell so good in the oven!", "grandma-p5"),
        imageAlt: "Cookies baking",
        backgroundColor: "#FFF5E6",
      },
      {
        id: "grandma-p6",
        pageNumber: 6,
        text: "We eat warm cookies together.",
        words: parseTextToWords("We eat warm cookies together.", "grandma-p6"),
        imageAlt: "Eating cookies",
        backgroundColor: "#FFF8DC",
      },
      {
        id: "grandma-p7",
        pageNumber: 7,
        text: "I love spending time with Grandma!",
        words: parseTextToWords("I love spending time with Grandma!", "grandma-p7"),
        imageAlt: "Hugging grandma",
        backgroundColor: "#FFE6E6",
      },
    ],
    comprehensionQuestions: [
      {
        id: "grandma-q1",
        question: "What did they bake?",
        options: ["A cake", "Bread", "Cookies", "Muffins"],
        correctAnswerIndex: 2,
        explanation: "Grandma wants to bake cookies!",
      },
    ],
  },
  {
    id: "story-new-baby",
    title: "The New Baby",
    author: "Little Learner Books",
    description: "Becoming a big brother or sister!",
    coverImage: "/images/stories/new-baby-cover.jpg",
    difficulty: "advanced",
    category: "family",
    estimatedMinutes: 6,
    wordCount: 110,
    unlockLevel: 9,
    tags: ["family", "siblings", "growing up"],
    theme: {
      primary: "#FFB6C1",
      secondary: "#FFC0CB",
      background: "#FFF0F5",
    },
    pages: [
      {
        id: "baby-p1",
        pageNumber: 1,
        text: "Mom and Dad brought home a new baby!",
        words: parseTextToWords("Mom and Dad brought home a new baby!", "baby-p1"),
        imageAlt: "Parents with baby",
        backgroundColor: "#FFF0F5",
      },
      {
        id: "baby-p2",
        pageNumber: 2,
        text: "The baby is so tiny and small.",
        words: parseTextToWords("The baby is so tiny and small.", "baby-p2"),
        imageAlt: "Tiny baby",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "baby-p3",
        pageNumber: 3,
        text: "I am now a big brother!",
        words: parseTextToWords("I am now a big brother!", "baby-p3"),
        imageAlt: "Proud sibling",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "baby-p4",
        pageNumber: 4,
        text: "The baby cries when she is hungry.",
        words: parseTextToWords("The baby cries when she is hungry.", "baby-p4"),
        imageAlt: "Crying baby",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "baby-p5",
        pageNumber: 5,
        text: "I can help give her a bottle.",
        words: parseTextToWords("I can help give her a bottle.", "baby-p5"),
        imageAlt: "Helping with bottle",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "baby-p6",
        pageNumber: 6,
        text: "I sing songs to make her smile.",
        words: parseTextToWords("I sing songs to make her smile.", "baby-p6"),
        imageAlt: "Singing to baby",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "baby-p7",
        pageNumber: 7,
        text: "I love my new baby sister!",
        words: parseTextToWords("I love my new baby sister!", "baby-p7"),
        imageAlt: "Loving siblings",
        backgroundColor: "#FFF0F5",
      },
    ],
    comprehensionQuestions: [
      {
        id: "baby-q1",
        question: "What makes the baby cry?",
        options: ["Being tired", "Being hungry", "Being cold", "Being bored"],
        correctAnswerIndex: 1,
        explanation: "The baby cries when she is hungry.",
      },
    ],
  },
  {
    id: "story-winter-snow",
    title: "Winter Snow Day",
    author: "Little Learner Books",
    description: "Fun in the snow!",
    coverImage: "/images/stories/winter-snow-cover.jpg",
    difficulty: "advanced",
    category: "nature",
    estimatedMinutes: 6,
    wordCount: 130,
    unlockLevel: 9,
    tags: ["winter", "snow", "outdoor"],
    theme: {
      primary: "#87CEEB",
      secondary: "#B0E0E6",
      background: "#F0F8FF",
    },
    pages: [
      {
        id: "snow-p1",
        pageNumber: 1,
        text: "I wake up and look outside.",
        words: parseTextToWords("I wake up and look outside.", "snow-p1"),
        imageAlt: "Looking out window",
        backgroundColor: "#F0F8FF",
      },
      {
        id: "snow-p2",
        pageNumber: 2,
        text: "Everything is covered in white snow!",
        words: parseTextToWords("Everything is covered in white snow!", "snow-p2"),
        imageAlt: "Snowy scene",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "snow-p3",
        pageNumber: 3,
        text: "I put on my coat, hat, and mittens.",
        words: parseTextToWords("I put on my coat, hat, and mittens.", "snow-p3"),
        imageAlt: "Getting dressed warmly",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "snow-p4",
        pageNumber: 4,
        text: "My friends and I build a big snowman.",
        words: parseTextToWords("My friends and I build a big snowman.", "snow-p4"),
        imageAlt: "Building snowman",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "snow-p5",
        pageNumber: 5,
        text: "We give him a carrot nose and button eyes.",
        words: parseTextToWords("We give him a carrot nose and button eyes.", "snow-p5"),
        imageAlt: "Decorating snowman",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "snow-p6",
        pageNumber: 6,
        text: "Then we have a fun snowball fight!",
        words: parseTextToWords("Then we have a fun snowball fight!", "snow-p6"),
        imageAlt: "Snowball fight",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "snow-p7",
        pageNumber: 7,
        text: "We sled down the big hill again and again.",
        words: parseTextToWords("We sled down the big hill again and again.", "snow-p7"),
        imageAlt: "Sledding",
        backgroundColor: "#F0F8FF",
      },
      {
        id: "snow-p8",
        pageNumber: 8,
        text: "Mom makes us hot chocolate to warm up.",
        words: parseTextToWords("Mom makes us hot chocolate to warm up.", "snow-p8"),
        imageAlt: "Hot chocolate",
        backgroundColor: "#FFF5E6",
      },
      {
        id: "snow-p9",
        pageNumber: 9,
        text: "Snow days are the best days!",
        words: parseTextToWords("Snow days are the best days!", "snow-p9"),
        imageAlt: "Happy in snow",
        backgroundColor: "#F0F8FF",
      },
    ],
    comprehensionQuestions: [
      {
        id: "snow-q1",
        question: "What did the snowman have for a nose?",
        options: ["A stick", "A carrot", "A rock", "A leaf"],
        correctAnswerIndex: 1,
        explanation: "They gave him a carrot nose!",
      },
      {
        id: "snow-q2",
        question: "What did Mom make to warm them up?",
        options: ["Tea", "Soup", "Hot chocolate", "Coffee"],
        correctAnswerIndex: 2,
        explanation: "Mom makes us hot chocolate to warm up.",
      },
    ],
  },
  {
    id: "story-garden-grow",
    title: "Our Garden",
    author: "Little Learner Books",
    description: "Growing plants in the garden!",
    coverImage: "/images/stories/garden-grow-cover.jpg",
    difficulty: "advanced",
    category: "nature",
    estimatedMinutes: 5,
    wordCount: 105,
    unlockLevel: 10,
    featured: true,
    tags: ["garden", "plants", "patience"],
    theme: {
      primary: "#228B22",
      secondary: "#90EE90",
      background: "#F0FFF0",
    },
    pages: [
      {
        id: "garden-p1",
        pageNumber: 1,
        text: "Dad and I planted seeds in our garden.",
        words: parseTextToWords("Dad and I planted seeds in our garden.", "garden-p1"),
        imageAlt: "Planting seeds",
        backgroundColor: "#F0FFF0",
      },
      {
        id: "garden-p2",
        pageNumber: 2,
        text: "We water them every single day.",
        words: parseTextToWords("We water them every single day.", "garden-p2"),
        imageAlt: "Watering plants",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "garden-p3",
        pageNumber: 3,
        text: "The sun shines down on our plants.",
        words: parseTextToWords("The sun shines down on our plants.", "garden-p3"),
        imageAlt: "Sun on garden",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "garden-p4",
        pageNumber: 4,
        text: "Little green sprouts start to grow!",
        words: parseTextToWords("Little green sprouts start to grow!", "garden-p4"),
        imageAlt: "Sprouts growing",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "garden-p5",
        pageNumber: 5,
        text: "The plants grow taller and taller.",
        words: parseTextToWords("The plants grow taller and taller.", "garden-p5"),
        imageAlt: "Tall plants",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "garden-p6",
        pageNumber: 6,
        text: "Now we have red tomatoes to eat!",
        words: parseTextToWords("Now we have red tomatoes to eat!", "garden-p6"),
        imageAlt: "Ripe tomatoes",
        backgroundColor: "#FFE6E6",
      },
      {
        id: "garden-p7",
        pageNumber: 7,
        text: "Growing a garden takes patience!",
        words: parseTextToWords("Growing a garden takes patience!", "garden-p7"),
        imageAlt: "Happy gardeners",
        backgroundColor: "#F0FFF0",
      },
    ],
    comprehensionQuestions: [
      {
        id: "garden-q1",
        question: "What did they plant?",
        options: ["Flowers", "Seeds", "Trees", "Grass"],
        correctAnswerIndex: 1,
        explanation: "Dad and I planted seeds in our garden.",
      },
      {
        id: "garden-q2",
        question: "What grew in the garden?",
        options: ["Carrots", "Apples", "Tomatoes", "Corn"],
        correctAnswerIndex: 2,
        explanation: "Now we have red tomatoes to eat!",
      },
    ],
  },
  {
    id: "story-space-dream",
    title: "My Space Dream",
    author: "Little Learner Books",
    description: "Dreaming of exploring space!",
    coverImage: "/images/stories/space-dream-cover.jpg",
    difficulty: "advanced",
    category: "adventure",
    estimatedMinutes: 6,
    wordCount: 120,
    unlockLevel: 10,
    tags: ["space", "dreams", "imagination"],
    theme: {
      primary: "#191970",
      secondary: "#4169E1",
      background: "#E6E6FA",
    },
    pages: [
      {
        id: "space-p1",
        pageNumber: 1,
        text: "When I grow up, I want to be an astronaut.",
        words: parseTextToWords("When I grow up, I want to be an astronaut.", "space-p1"),
        imageAlt: "Child dreaming",
        backgroundColor: "#E6E6FA",
      },
      {
        id: "space-p2",
        pageNumber: 2,
        text: "I will fly in a rocket to the stars!",
        words: parseTextToWords("I will fly in a rocket to the stars!", "space-p2"),
        imageAlt: "Rocket ship",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "space-p3",
        pageNumber: 3,
        text: "I will float in space without gravity.",
        words: parseTextToWords("I will float in space without gravity.", "space-p3"),
        imageAlt: "Floating in space",
        backgroundColor: "#F0F0FF",
      },
      {
        id: "space-p4",
        pageNumber: 4,
        text: "I will see Earth from far, far away.",
        words: parseTextToWords("I will see Earth from far, far away.", "space-p4"),
        imageAlt: "Earth from space",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "space-p5",
        pageNumber: 5,
        text: "Maybe I will walk on the moon!",
        words: parseTextToWords("Maybe I will walk on the moon!", "space-p5"),
        imageAlt: "Moon walking",
        backgroundColor: "#F0F0F0",
      },
      {
        id: "space-p6",
        pageNumber: 6,
        text: "I will discover new planets to explore.",
        words: parseTextToWords("I will discover new planets to explore.", "space-p6"),
        imageAlt: "New planets",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "space-p7",
        pageNumber: 7,
        text: "Space is full of amazing things!",
        words: parseTextToWords("Space is full of amazing things!", "space-p7"),
        imageAlt: "Space wonders",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "space-p8",
        pageNumber: 8,
        text: "I will study hard to make my dream come true!",
        words: parseTextToWords("I will study hard to make my dream come true!", "space-p8"),
        imageAlt: "Studying",
        backgroundColor: "#E6E6FA",
      },
    ],
    comprehensionQuestions: [
      {
        id: "space-q1",
        question: "What does the child want to be?",
        options: ["A doctor", "A teacher", "An astronaut", "A pilot"],
        correctAnswerIndex: 2,
        explanation: "They want to be an astronaut!",
      },
      {
        id: "space-q2",
        question: "Where might they walk?",
        options: ["On Mars", "On the moon", "On the sun", "On a star"],
        correctAnswerIndex: 1,
        explanation: "Maybe they will walk on the moon!",
      },
    ],
  },
  {
    id: "story-library-adventure",
    title: "The Library Adventure",
    author: "Little Learner Books",
    description: "Discovering the joy of reading!",
    coverImage: "/images/stories/library-adventure-cover.jpg",
    difficulty: "advanced",
    category: "learning",
    estimatedMinutes: 5,
    wordCount: 95,
    unlockLevel: 10,
    tags: ["library", "books", "reading"],
    theme: {
      primary: "#8B4513",
      secondary: "#D2691E",
      background: "#FFF8DC",
    },
    pages: [
      {
        id: "library-p1",
        pageNumber: 1,
        text: "Mom takes me to the library.",
        words: parseTextToWords("Mom takes me to the library.", "library-p1"),
        imageAlt: "Library building",
        backgroundColor: "#FFF8DC",
      },
      {
        id: "library-p2",
        pageNumber: 2,
        text: "There are so many books to choose!",
        words: parseTextToWords("There are so many books to choose!", "library-p2"),
        imageAlt: "Bookshelves",
        backgroundColor: "#E6F9FF",
      },
      {
        id: "library-p3",
        pageNumber: 3,
        text: "I find a book about dinosaurs.",
        words: parseTextToWords("I find a book about dinosaurs.", "library-p3"),
        imageAlt: "Dinosaur book",
        backgroundColor: "#E6FFE6",
      },
      {
        id: "library-p4",
        pageNumber: 4,
        text: "I sit in a cozy corner and read.",
        words: parseTextToWords("I sit in a cozy corner and read.", "library-p4"),
        imageAlt: "Reading corner",
        backgroundColor: "#FFF9E6",
      },
      {
        id: "library-p5",
        pageNumber: 5,
        text: "Books take me to exciting places!",
        words: parseTextToWords("Books take me to exciting places!", "library-p5"),
        imageAlt: "Imagination",
        backgroundColor: "#FFE6F0",
      },
      {
        id: "library-p6",
        pageNumber: 6,
        text: "I check out three books to take home.",
        words: parseTextToWords("I check out three books to take home.", "library-p6"),
        imageAlt: "Checking out books",
        backgroundColor: "#E6E6FF",
      },
      {
        id: "library-p7",
        pageNumber: 7,
        text: "Reading is my favorite thing to do!",
        words: parseTextToWords("Reading is my favorite thing to do!", "library-p7"),
        imageAlt: "Happy reader",
        backgroundColor: "#FFF8DC",
      },
    ],
    comprehensionQuestions: [
      {
        id: "library-q1",
        question: "What book did they find?",
        options: ["About cars", "About dinosaurs", "About animals", "About space"],
        correctAnswerIndex: 1,
        explanation: "They found a book about dinosaurs.",
      },
      {
        id: "library-q2",
        question: "How many books did they take home?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswerIndex: 2,
        explanation: "They checked out three books to take home.",
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
