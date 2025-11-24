/**
 * Phonemic Awareness Activities Data
 *
 * Pre-reading skills that focus on SOUNDS, not letters.
 * These activities build the foundational skill of hearing and manipulating sounds in words.
 */

export type PhonemeActivityType =
  | "sound-matching"
  | "rhyme-recognition"
  | "rhyme-generation"
  | "first-sound"
  | "last-sound"
  | "sound-counting"
  | "syllable-clapping"
  | "sound-blending"
  | "sound-segmenting";

export interface PhonemeItem {
  id: string;
  word: string;
  image: string;
  audioPath: string; // Path to spoken word
  firstSound: string; // e.g., "/s/"
  lastSound: string; // e.g., "/n/"
  soundCount: number; // Number of phonemes
  syllableCount: number;
  rhymeFamily?: string; // e.g., "-at" for cat, hat, mat
}

export interface SoundMatchingQuestion {
  id: string;
  targetSound: string; // e.g., "/s/"
  prompt: string; // "Find things that start with /s/"
  items: PhonemeItem[];
  correctItems: string[]; // IDs of items that match
  difficulty: 1 | 2 | 3;
}

export interface RhymeQuestion {
  id: string;
  word1: PhonemeItem;
  word2: PhonemeItem;
  doTheyRhyme: boolean;
  difficulty: 1 | 2 | 3;
}

export interface FirstSoundQuestion {
  id: string;
  item: PhonemeItem;
  prompt: string; // "What sound do you hear at the beginning?"
  options: string[]; // Array of sounds like ["/s/", "/m/", "/t/"]
  correctSound: string;
  difficulty: 1 | 2 | 3;
}

export interface SoundCountingQuestion {
  id: string;
  item: PhonemeItem;
  prompt: string; // "How many sounds in 'cat'?"
  options: number[]; // [2, 3, 4, 5]
  correctCount: number;
  difficulty: 1 | 2 | 3;
}

// Sample Phoneme Items Database
export const PHONEME_ITEMS: PhonemeItem[] = [
  // /s/ words
  {
    id: "sun",
    word: "sun",
    image: "https://images.unsplash.com/photo-1506218115683-c8c39496dfba?w=400&h=400&fit=crop",
    audioPath: "/audio/words/sun.mp3",
    firstSound: "/s/",
    lastSound: "/n/",
    soundCount: 3,
    syllableCount: 1,
  },
  {
    id: "sock",
    word: "sock",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop",
    audioPath: "/audio/words/sock.mp3",
    firstSound: "/s/",
    lastSound: "/k/",
    soundCount: 3,
    syllableCount: 1,
  },
  {
    id: "snake",
    word: "snake",
    image: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=400&fit=crop",
    audioPath: "/audio/words/snake.mp3",
    firstSound: "/s/",
    lastSound: "/k/",
    soundCount: 4,
    syllableCount: 1,
  },

  // /m/ words
  {
    id: "moon",
    word: "moon",
    image: "https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=400&h=400&fit=crop",
    audioPath: "/audio/words/moon.mp3",
    firstSound: "/m/",
    lastSound: "/n/",
    soundCount: 3,
    syllableCount: 1,
  },
  {
    id: "mouse",
    word: "mouse",
    image: "https://images.unsplash.com/photo-1585594587085-a03bd1e27763?w=400&h=400&fit=crop",
    audioPath: "/audio/words/mouse.mp3",
    firstSound: "/m/",
    lastSound: "/s/",
    soundCount: 3,
    syllableCount: 1,
  },
  {
    id: "milk",
    word: "milk",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    audioPath: "/audio/words/milk.mp3",
    firstSound: "/m/",
    lastSound: "/k/",
    soundCount: 4,
    syllableCount: 1,
  },

  // Rhyming pairs - -at family
  {
    id: "cat",
    word: "cat",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    audioPath: "/audio/words/cat.mp3",
    firstSound: "/k/",
    lastSound: "/t/",
    soundCount: 3,
    syllableCount: 1,
    rhymeFamily: "-at",
  },
  {
    id: "hat",
    word: "hat",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop",
    audioPath: "/audio/words/hat.mp3",
    firstSound: "/h/",
    lastSound: "/t/",
    soundCount: 3,
    syllableCount: 1,
    rhymeFamily: "-at",
  },
  {
    id: "bat",
    word: "bat",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop",
    audioPath: "/audio/words/bat.mp3",
    firstSound: "/b/",
    lastSound: "/t/",
    soundCount: 3,
    syllableCount: 1,
    rhymeFamily: "-at",
  },

  // Rhyming pairs - -og family
  {
    id: "dog",
    word: "dog",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
    audioPath: "/audio/words/dog.mp3",
    firstSound: "/d/",
    lastSound: "/g/",
    soundCount: 3,
    syllableCount: 1,
    rhymeFamily: "-og",
  },
  {
    id: "frog",
    word: "frog",
    image: "https://images.unsplash.com/photo-1564604554959-500185fdab3b?w=400&h=400&fit=crop",
    audioPath: "/audio/words/frog.mp3",
    firstSound: "/f/",
    lastSound: "/g/",
    soundCount: 4,
    syllableCount: 1,
    rhymeFamily: "-og",
  },
  {
    id: "log",
    word: "log",
    image: "https://images.unsplash.com/photo-1600086755547-8dc276b5f44d?w=400&h=400&fit=crop",
    audioPath: "/audio/words/log.mp3",
    firstSound: "/l/",
    lastSound: "/g/",
    soundCount: 3,
    syllableCount: 1,
    rhymeFamily: "-og",
  },

  // Non-rhyming items for contrast
  {
    id: "car",
    word: "car",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=400&fit=crop",
    audioPath: "/audio/words/car.mp3",
    firstSound: "/k/",
    lastSound: "/r/",
    soundCount: 3,
    syllableCount: 1,
  },
  {
    id: "tree",
    word: "tree",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=400&fit=crop",
    audioPath: "/audio/words/tree.mp3",
    firstSound: "/t/",
    lastSound: "/ee/",
    soundCount: 3,
    syllableCount: 1,
  },
  {
    id: "fish",
    word: "fish",
    image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop",
    audioPath: "/audio/words/fish.mp3",
    firstSound: "/f/",
    lastSound: "/sh/",
    soundCount: 3,
    syllableCount: 1,
  },
];

// Sound Matching Questions
export const SOUND_MATCHING_QUESTIONS: SoundMatchingQuestion[] = [
  {
    id: "sm-01",
    targetSound: "/s/",
    prompt: "Find all the things that start with the /s/ sound",
    items: [
      PHONEME_ITEMS.find((i) => i.id === "sun")!,
      PHONEME_ITEMS.find((i) => i.id === "sock")!,
      PHONEME_ITEMS.find((i) => i.id === "moon")!,
      PHONEME_ITEMS.find((i) => i.id === "cat")!,
    ],
    correctItems: ["sun", "sock"],
    difficulty: 1,
  },
  {
    id: "sm-02",
    targetSound: "/m/",
    prompt: "Find all the things that start with the /m/ sound",
    items: [
      PHONEME_ITEMS.find((i) => i.id === "moon")!,
      PHONEME_ITEMS.find((i) => i.id === "mouse")!,
      PHONEME_ITEMS.find((i) => i.id === "dog")!,
      PHONEME_ITEMS.find((i) => i.id === "hat")!,
    ],
    correctItems: ["moon", "mouse"],
    difficulty: 1,
  },
  {
    id: "sm-03",
    targetSound: "/f/",
    prompt: "Find all the things that start with the /f/ sound",
    items: [
      PHONEME_ITEMS.find((i) => i.id === "frog")!,
      PHONEME_ITEMS.find((i) => i.id === "fish")!,
      PHONEME_ITEMS.find((i) => i.id === "cat")!,
      PHONEME_ITEMS.find((i) => i.id === "sun")!,
    ],
    correctItems: ["frog", "fish"],
    difficulty: 2,
  },
];

// Rhyme Recognition Questions
export const RHYME_QUESTIONS: RhymeQuestion[] = [
  {
    id: "rh-01",
    word1: PHONEME_ITEMS.find((i) => i.id === "cat")!,
    word2: PHONEME_ITEMS.find((i) => i.id === "hat")!,
    doTheyRhyme: true,
    difficulty: 1,
  },
  {
    id: "rh-02",
    word1: PHONEME_ITEMS.find((i) => i.id === "dog")!,
    word2: PHONEME_ITEMS.find((i) => i.id === "frog")!,
    doTheyRhyme: true,
    difficulty: 1,
  },
  {
    id: "rh-03",
    word1: PHONEME_ITEMS.find((i) => i.id === "cat")!,
    word2: PHONEME_ITEMS.find((i) => i.id === "dog")!,
    doTheyRhyme: false,
    difficulty: 1,
  },
  {
    id: "rh-04",
    word1: PHONEME_ITEMS.find((i) => i.id === "sun")!,
    word2: PHONEME_ITEMS.find((i) => i.id === "moon")!,
    doTheyRhyme: false,
    difficulty: 2,
  },
  {
    id: "rh-05",
    word1: PHONEME_ITEMS.find((i) => i.id === "bat")!,
    word2: PHONEME_ITEMS.find((i) => i.id === "hat")!,
    doTheyRhyme: true,
    difficulty: 2,
  },
];

// First Sound Questions
export const FIRST_SOUND_QUESTIONS: FirstSoundQuestion[] = [
  {
    id: "fs-01",
    item: PHONEME_ITEMS.find((i) => i.id === "sun")!,
    prompt: "What sound do you hear at the beginning of 'sun'?",
    options: ["/s/", "/m/", "/t/", "/d/"],
    correctSound: "/s/",
    difficulty: 1,
  },
  {
    id: "fs-02",
    item: PHONEME_ITEMS.find((i) => i.id === "moon")!,
    prompt: "What sound do you hear at the beginning of 'moon'?",
    options: ["/m/", "/n/", "/s/", "/b/"],
    correctSound: "/m/",
    difficulty: 1,
  },
  {
    id: "fs-03",
    item: PHONEME_ITEMS.find((i) => i.id === "cat")!,
    prompt: "What sound do you hear at the beginning of 'cat'?",
    options: ["/k/", "/t/", "/s/", "/g/"],
    correctSound: "/k/",
    difficulty: 2,
  },
  {
    id: "fs-04",
    item: PHONEME_ITEMS.find((i) => i.id === "frog")!,
    prompt: "What sound do you hear at the beginning of 'frog'?",
    options: ["/f/", "/r/", "/g/", "/b/"],
    correctSound: "/f/",
    difficulty: 2,
  },
  {
    id: "fs-05",
    item: PHONEME_ITEMS.find((i) => i.id === "dog")!,
    prompt: "What sound do you hear at the beginning of 'dog'?",
    options: ["/d/", "/g/", "/b/", "/t/"],
    correctSound: "/d/",
    difficulty: 3,
  },
];

// Sound Counting Questions
export const SOUND_COUNTING_QUESTIONS: SoundCountingQuestion[] = [
  {
    id: "sc-01",
    item: PHONEME_ITEMS.find((i) => i.id === "cat")!,
    prompt: "How many sounds do you hear in 'cat'?",
    options: [2, 3, 4, 5],
    correctCount: 3,
    difficulty: 2,
  },
  {
    id: "sc-02",
    item: PHONEME_ITEMS.find((i) => i.id === "dog")!,
    prompt: "How many sounds do you hear in 'dog'?",
    options: [2, 3, 4, 5],
    correctCount: 3,
    difficulty: 2,
  },
  {
    id: "sc-03",
    item: PHONEME_ITEMS.find((i) => i.id === "sun")!,
    prompt: "How many sounds do you hear in 'sun'?",
    options: [2, 3, 4, 5],
    correctCount: 3,
    difficulty: 2,
  },
  {
    id: "sc-04",
    item: PHONEME_ITEMS.find((i) => i.id === "frog")!,
    prompt: "How many sounds do you hear in 'frog'?",
    options: [3, 4, 5, 6],
    correctCount: 4,
    difficulty: 3,
  },
  {
    id: "sc-05",
    item: PHONEME_ITEMS.find((i) => i.id === "snake")!,
    prompt: "How many sounds do you hear in 'snake'?",
    options: [3, 4, 5, 6],
    correctCount: 4,
    difficulty: 3,
  },
];

// Helper function to get items by first sound
export function getItemsByFirstSound(sound: string): PhonemeItem[] {
  return PHONEME_ITEMS.filter((item) => item.firstSound === sound);
}

// Helper function to get rhyming pairs
export function getRhymingPairs(rhymeFamily: string): PhonemeItem[] {
  return PHONEME_ITEMS.filter((item) => item.rhymeFamily === rhymeFamily);
}

// Helper function to get items by sound count
export function getItemsBySoundCount(count: number): PhonemeItem[] {
  return PHONEME_ITEMS.filter((item) => item.soundCount === count);
}
