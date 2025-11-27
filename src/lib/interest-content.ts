/**
 * Interest-Based Content Personalization
 *
 * Maps user interests to content categories for personalized learning experiences.
 * A dinosaur-loving kid should see dinosaur words and stories first!
 */

import { InterestThemeId } from "./theme-data";
import { WordCategory, WordItem, WORDS_DATA } from "./words-data";
import { StoryCategory, Story, STORIES } from "./stories-data";

// ============ INTEREST TO CATEGORY MAPPINGS ============

/**
 * Maps user interests to word categories
 */
export const INTEREST_TO_WORD_CATEGORIES: Record<InterestThemeId, WordCategory[]> = {
  robots: ["Technology"],
  dinosaurs: ["Dinosaurs"],
  lizards: ["Reptiles", "Animals"],
  cars: ["Vehicles"],
  rockets: ["Space"],
  spaceships: ["Space"],
  animals: ["Animals"],
  bugs: ["Animals"], // Bugs are in Animals category
  princesses: ["Objects", "Places"], // Castles, crowns, etc.
  ocean: ["Animals", "Nature"], // Sea creatures
  construction: ["Objects", "Vehicles"], // Tools, trucks
};

/**
 * Maps user interests to story categories
 */
export const INTEREST_TO_STORY_CATEGORIES: Record<InterestThemeId, StoryCategory[]> = {
  robots: ["robots", "learning"],
  dinosaurs: ["dinosaurs", "adventure"],
  lizards: ["lizards", "animals", "nature"],
  cars: ["cars", "adventure"],
  rockets: ["rockets", "adventure"],
  spaceships: ["spaceships", "adventure"],
  animals: ["animals", "nature", "family"],
  bugs: ["animals", "nature"],
  princesses: ["adventure", "family", "friendship"],
  ocean: ["animals", "nature", "adventure"],
  construction: ["adventure", "learning"],
};

// ============ WORD FILTERING & SORTING ============

/**
 * Get words prioritized by user interests
 * Interest-matching words come first, then others
 */
export function getWordsPrioritizedByInterests(
  interests: InterestThemeId[],
  difficulty?: 1 | 2 | 3
): WordItem[] {
  // Get all words, optionally filtered by difficulty
  let words = difficulty
    ? WORDS_DATA.filter(w => w.difficulty === difficulty)
    : [...WORDS_DATA];

  // Get categories matching user interests
  const interestCategories = new Set<WordCategory>();
  interests.forEach(interest => {
    const categories = INTEREST_TO_WORD_CATEGORIES[interest];
    categories.forEach(cat => interestCategories.add(cat));
  });

  // Separate into matched and non-matched
  const matchedWords = words.filter(w => interestCategories.has(w.category));
  const otherWords = words.filter(w => !interestCategories.has(w.category));

  // Shuffle each group
  const shuffledMatched = shuffleArray(matchedWords);
  const shuffledOther = shuffleArray(otherWords);

  // Return matched words first, then others
  return [...shuffledMatched, ...shuffledOther];
}

/**
 * Get words that match user interests only
 */
export function getWordsForInterests(
  interests: InterestThemeId[],
  difficulty?: 1 | 2 | 3
): WordItem[] {
  // Get categories matching user interests
  const interestCategories = new Set<WordCategory>();
  interests.forEach(interest => {
    const categories = INTEREST_TO_WORD_CATEGORIES[interest];
    categories.forEach(cat => interestCategories.add(cat));
  });

  // Filter words by interest categories
  let words = WORDS_DATA.filter(w => interestCategories.has(w.category));

  // Optionally filter by difficulty
  if (difficulty) {
    words = words.filter(w => w.difficulty === difficulty);
  }

  return shuffleArray(words);
}

/**
 * Check if a word matches user interests
 */
export function wordMatchesInterests(
  word: WordItem,
  interests: InterestThemeId[]
): boolean {
  const interestCategories = new Set<WordCategory>();
  interests.forEach(interest => {
    const categories = INTEREST_TO_WORD_CATEGORIES[interest];
    categories.forEach(cat => interestCategories.add(cat));
  });

  return interestCategories.has(word.category);
}

// ============ STORY FILTERING & SORTING ============

/**
 * Get stories prioritized by user interests
 * Interest-matching stories come first, then others
 */
export function getStoriesPrioritizedByInterests(
  interests: InterestThemeId[],
  difficulty?: "beginner" | "intermediate" | "advanced"
): Story[] {
  // Get all stories, optionally filtered by difficulty
  let stories = difficulty
    ? STORIES.filter(s => s.difficulty === difficulty)
    : [...STORIES];

  // Get categories matching user interests
  const interestCategories = new Set<StoryCategory>();
  interests.forEach(interest => {
    const categories = INTEREST_TO_STORY_CATEGORIES[interest];
    categories.forEach(cat => interestCategories.add(cat));
  });

  // Separate into matched and non-matched
  const matchedStories = stories.filter(s => interestCategories.has(s.category));
  const otherStories = stories.filter(s => !interestCategories.has(s.category));

  // Return matched stories first (keeping some order), then others
  return [...matchedStories, ...otherStories];
}

/**
 * Get stories that match user interests only
 */
export function getStoriesForInterests(
  interests: InterestThemeId[],
  difficulty?: "beginner" | "intermediate" | "advanced"
): Story[] {
  // Get categories matching user interests
  const interestCategories = new Set<StoryCategory>();
  interests.forEach(interest => {
    const categories = INTEREST_TO_STORY_CATEGORIES[interest];
    categories.forEach(cat => interestCategories.add(cat));
  });

  // Filter stories by interest categories
  let stories = STORIES.filter(s => interestCategories.has(s.category));

  // Optionally filter by difficulty
  if (difficulty) {
    stories = stories.filter(s => s.difficulty === difficulty);
  }

  return stories;
}

/**
 * Check if a story matches user interests
 */
export function storyMatchesInterests(
  story: Story,
  interests: InterestThemeId[]
): boolean {
  const interestCategories = new Set<StoryCategory>();
  interests.forEach(interest => {
    const categories = INTEREST_TO_STORY_CATEGORIES[interest];
    categories.forEach(cat => interestCategories.add(cat));
  });

  return interestCategories.has(story.category);
}

// ============ "FOR YOU" RECOMMENDATIONS ============

/**
 * Get personalized recommendations based on interests
 */
export function getPersonalizedRecommendations(
  interests: InterestThemeId[],
  options?: {
    maxWords?: number;
    maxStories?: number;
    wordDifficulty?: 1 | 2 | 3;
    storyDifficulty?: "beginner" | "intermediate" | "advanced";
  }
): {
  words: WordItem[];
  stories: Story[];
  hasInterestContent: boolean;
} {
  const {
    maxWords = 10,
    maxStories = 5,
    wordDifficulty,
    storyDifficulty,
  } = options || {};

  // If no interests, return random selection
  if (interests.length === 0) {
    return {
      words: shuffleArray(WORDS_DATA).slice(0, maxWords),
      stories: shuffleArray([...STORIES]).slice(0, maxStories),
      hasInterestContent: false,
    };
  }

  // Get interest-matched content
  const matchedWords = getWordsForInterests(interests, wordDifficulty);
  const matchedStories = getStoriesForInterests(interests, storyDifficulty);

  // If not enough matched content, supplement with other content
  let words = matchedWords.slice(0, maxWords);
  let stories = matchedStories.slice(0, maxStories);

  // Fill remaining slots if needed
  if (words.length < maxWords) {
    const otherWords = shuffleArray(
      WORDS_DATA.filter(w =>
        !matchedWords.includes(w) &&
        (!wordDifficulty || w.difficulty === wordDifficulty)
      )
    );
    words = [...words, ...otherWords.slice(0, maxWords - words.length)];
  }

  if (stories.length < maxStories) {
    const otherStories = shuffleArray(
      STORIES.filter(s =>
        !matchedStories.includes(s) &&
        (!storyDifficulty || s.difficulty === storyDifficulty)
      )
    );
    stories = [...stories, ...otherStories.slice(0, maxStories - stories.length)];
  }

  return {
    words,
    stories,
    hasInterestContent: matchedWords.length > 0 || matchedStories.length > 0,
  };
}

/**
 * Get interest label for display (e.g., "Because you like dinosaurs")
 */
export function getInterestLabel(interests: InterestThemeId[]): string {
  if (interests.length === 0) return "";
  if (interests.length === 1) {
    return `Because you like ${interests[0]}`;
  }
  return `Because you like ${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}`;
}

// ============ HELPERS ============

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
