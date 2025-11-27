/**
 * Word Repository
 *
 * Centralized word data for the learning app.
 * This is the single source of truth for word definitions.
 *
 * NOTE: This file provides a foundation for DRY word management.
 * Existing data files are NOT modified to maintain backward compatibility.
 * New features should import from this repository.
 */

// Word categories
export type WordCategory =
  | "cvc" // Consonant-Vowel-Consonant (cat, dog)
  | "cvcc" // Consonant-Vowel-Consonant-Consonant (lamp)
  | "ccvc" // Consonant-Consonant-Vowel-Consonant (stop)
  | "cvce" // Magic E words (cake, bike)
  | "digraph" // Contains digraph (ship, chat)
  | "blend" // Contains blend (frog, step)
  | "sight" // Sight words (the, and)
  | "other";

// Difficulty levels
export type Difficulty = 1 | 2 | 3;

// Core word definition
export interface Word {
  word: string;
  phonemes: string[]; // Sound breakdown ["c", "a", "t"]
  category: WordCategory;
  difficulty: Difficulty;
  image?: string; // Optional image URL
  sentence?: string; // Example sentence
  relatedWords?: string[]; // Word family members
  minUnit?: number; // Minimum phonics unit required
}

// Audio path helpers
export function getWordAudioPath(word: string): string {
  return `/audio/words/${word.toLowerCase()}.mp3`;
}

export function getPhonemeAudioPath(phoneme: string): string {
  return `/audio/phonemes/${phoneme.toLowerCase()}.mp3`;
}

export function getLetterAudioPath(
  letter: string,
  type: "phonics" | "name" | "example"
): string {
  return `/audio/letters/${letter.toLowerCase()}-${type}.mp3`;
}

/**
 * Master word repository
 * Organized by word for O(1) lookup
 */
export const WORD_REPOSITORY: Record<string, Word> = {
  // ===== UNIT 1: S, A, T, P =====
  sat: {
    word: "sat",
    phonemes: ["s", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 1,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
    sentence: "I sat on the chair.",
    relatedWords: ["cat", "bat", "mat", "hat"],
  },
  pat: {
    word: "pat",
    phonemes: ["p", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 1,
    sentence: "Pat the dog gently.",
    relatedWords: ["cat", "bat", "mat", "hat"],
  },
  tap: {
    word: "tap",
    phonemes: ["t", "a", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 1,
    sentence: "Tap on the door.",
    relatedWords: ["cap", "map", "nap"],
  },
  sap: {
    word: "sap",
    phonemes: ["s", "a", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 1,
    sentence: "Tree sap is sticky.",
    relatedWords: ["cap", "map", "nap"],
  },

  // ===== UNIT 2: I, N, M, D =====
  sit: {
    word: "sit",
    phonemes: ["s", "i", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
    sentence: "Please sit on the chair.",
    relatedWords: ["hit", "bit", "fit", "kit"],
  },
  mat: {
    word: "mat",
    phonemes: ["m", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?w=400&h=400&fit=crop",
    sentence: "Wipe your feet on the mat.",
    relatedWords: ["cat", "bat", "hat", "sat"],
  },
  man: {
    word: "man",
    phonemes: ["m", "a", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    sentence: "The man is tall.",
    relatedWords: ["can", "pan", "tan", "ran"],
  },
  pin: {
    word: "pin",
    phonemes: ["p", "i", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop",
    sentence: "Use a pin to hold it.",
    relatedWords: ["tin", "bin", "win", "fin"],
  },
  tin: {
    word: "tin",
    phonemes: ["t", "i", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1608484676627-6f7c4cbf9158?w=400&h=400&fit=crop",
    sentence: "The tin can is shiny.",
    relatedWords: ["pin", "bin", "win", "fin"],
  },
  nap: {
    word: "nap",
    phonemes: ["n", "a", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&h=400&fit=crop",
    sentence: "Take a short nap.",
    relatedWords: ["cap", "map", "tap", "sap"],
  },
  sad: {
    word: "sad",
    phonemes: ["s", "a", "d"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1542909192-2f2241a99c9d?w=400&h=400&fit=crop",
    sentence: "She felt sad today.",
    relatedWords: ["mad", "bad", "dad", "had"],
  },
  mad: {
    word: "mad",
    phonemes: ["m", "a", "d"],
    category: "cvc",
    difficulty: 1,
    minUnit: 2,
    image:
      "https://images.unsplash.com/photo-1621252179027-94459d278660?w=400&h=400&fit=crop",
    sentence: "Don't get mad.",
    relatedWords: ["sad", "bad", "dad", "had"],
  },

  // ===== UNIT 3: G, O, C, K =====
  cat: {
    word: "cat",
    phonemes: ["c", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    sentence: "The cat drinks milk.",
    relatedWords: ["bat", "hat", "mat", "sat"],
  },
  dog: {
    word: "dog",
    phonemes: ["d", "o", "g"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
    sentence: "The dog wags its tail.",
    relatedWords: ["log", "fog", "hog"],
  },
  pot: {
    word: "pot",
    phonemes: ["p", "o", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    sentence: "Cook in the pot.",
    relatedWords: ["hot", "dot", "got", "not"],
  },
  top: {
    word: "top",
    phonemes: ["t", "o", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1515630278258-407f66498911?w=400&h=400&fit=crop",
    sentence: "Reach the top.",
    relatedWords: ["hop", "mop", "pop", "stop"],
  },
  mop: {
    word: "mop",
    phonemes: ["m", "o", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    sentence: "Mop the floor clean.",
    relatedWords: ["top", "hop", "pop", "stop"],
  },
  cap: {
    word: "cap",
    phonemes: ["c", "a", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
    sentence: "Wear a cap.",
    relatedWords: ["tap", "map", "nap", "gap"],
  },
  kit: {
    word: "kit",
    phonemes: ["k", "i", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop",
    sentence: "The first aid kit helps.",
    relatedWords: ["sit", "hit", "bit", "fit"],
  },
  kid: {
    word: "kid",
    phonemes: ["k", "i", "d"],
    category: "cvc",
    difficulty: 1,
    minUnit: 3,
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
    sentence: "The kid plays outside.",
    relatedWords: ["did", "hid", "lid"],
  },

  // ===== UNIT 4: E, R, H, B =====
  bed: {
    word: "bed",
    phonemes: ["b", "e", "d"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    sentence: "I sleep in my bed.",
    relatedWords: ["red", "fed", "led"],
  },
  red: {
    word: "red",
    phonemes: ["r", "e", "d"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    image:
      "https://images.unsplash.com/photo-1562886889-52de2ad94c73?w=400&h=400&fit=crop",
    sentence: "The apple is red.",
    relatedWords: ["bed", "fed", "led"],
  },
  hen: {
    word: "hen",
    phonemes: ["h", "e", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=400&fit=crop",
    sentence: "The hen lays eggs.",
    relatedWords: ["pen", "ten", "men", "den"],
  },
  pen: {
    word: "pen",
    phonemes: ["p", "e", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    image:
      "https://images.unsplash.com/photo-1527305585912-bc87bf2f5ebd?w=400&h=400&fit=crop",
    sentence: "I write with a pen.",
    relatedWords: ["hen", "ten", "men", "den"],
  },
  bat: {
    word: "bat",
    phonemes: ["b", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    image:
      "https://images.unsplash.com/photo-1594403853023-26f7de92bdcf?w=400&h=400&fit=crop",
    sentence: "The bat flies at night.",
    relatedWords: ["cat", "hat", "mat", "sat"],
  },
  hat: {
    word: "hat",
    phonemes: ["h", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    image:
      "https://images.unsplash.com/photo-1588731257617-521ff1fbf08c?w=400&h=400&fit=crop",
    sentence: "I wear a hat in the sun.",
    relatedWords: ["cat", "bat", "mat", "sat"],
  },
  hot: {
    word: "hot",
    phonemes: ["h", "o", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    sentence: "The soup is hot.",
    relatedWords: ["pot", "dot", "got", "not"],
  },
  rat: {
    word: "rat",
    phonemes: ["r", "a", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 4,
    sentence: "A rat is a rodent.",
    relatedWords: ["cat", "bat", "mat", "sat"],
  },

  // ===== UNIT 5: F, L, U, W =====
  sun: {
    word: "sun",
    phonemes: ["s", "u", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    image:
      "https://images.unsplash.com/photo-1523464862212-d6631d073194?w=400&h=400&fit=crop",
    sentence: "The sun is bright and warm.",
    relatedWords: ["run", "bun", "fun"],
  },
  run: {
    word: "run",
    phonemes: ["r", "u", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop",
    sentence: "I can run very fast.",
    relatedWords: ["sun", "bun", "fun"],
  },
  fun: {
    word: "fun",
    phonemes: ["f", "u", "n"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    sentence: "We had fun at the park.",
    relatedWords: ["sun", "run", "bun"],
  },
  cup: {
    word: "cup",
    phonemes: ["c", "u", "p"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&h=400&fit=crop",
    sentence: "I drink from a cup.",
    relatedWords: ["pup"],
  },
  bug: {
    word: "bug",
    phonemes: ["b", "u", "g"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    image:
      "https://images.unsplash.com/photo-1563485881241-e62b1a5a27fb?w=400&h=400&fit=crop",
    sentence: "I saw a bug on the leaf.",
    relatedWords: ["hug", "mug", "rug"],
  },
  rug: {
    word: "rug",
    phonemes: ["r", "u", "g"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    sentence: "The rug is soft.",
    relatedWords: ["bug", "hug", "mug"],
  },
  wet: {
    word: "wet",
    phonemes: ["w", "e", "t"],
    category: "cvc",
    difficulty: 1,
    minUnit: 5,
    sentence: "The grass is wet.",
    relatedWords: ["pet", "set", "get"],
  },

  // ===== 4-LETTER WORDS (Difficulty 2) =====
  duck: {
    word: "duck",
    phonemes: ["d", "u", "ck"],
    category: "cvcc",
    difficulty: 2,
    image:
      "https://images.unsplash.com/photo-1558842841-6ed29e39b5c7?w=400&h=400&fit=crop",
    sentence: "The duck swims in the pond.",
    relatedWords: ["luck", "truck", "stuck"],
  },
  frog: {
    word: "frog",
    phonemes: ["f", "r", "o", "g"],
    category: "ccvc",
    difficulty: 2,
    image:
      "https://images.unsplash.com/photo-1603941218120-6992a8e6d7f5?w=400&h=400&fit=crop",
    sentence: "The frog jumps in the pond.",
  },
  fish: {
    word: "fish",
    phonemes: ["f", "i", "sh"],
    category: "digraph",
    difficulty: 2,
    image:
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop",
    sentence: "The fish swims in water.",
  },
  ball: {
    word: "ball",
    phonemes: ["b", "a", "ll"],
    category: "cvcc",
    difficulty: 2,
    image:
      "https://images.unsplash.com/photo-1519819255700-33b88a3abc8c?w=400&h=400&fit=crop",
    sentence: "I kick the ball.",
    relatedWords: ["call", "fall", "tall", "wall"],
  },
  tree: {
    word: "tree",
    phonemes: ["t", "r", "ee"],
    category: "ccvc",
    difficulty: 2,
    image:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=400&fit=crop",
    sentence: "Birds live in the tree.",
  },
  star: {
    word: "star",
    phonemes: ["s", "t", "a", "r"],
    category: "ccvc",
    difficulty: 2,
    image:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=400&fit=crop",
    sentence: "Stars twinkle in the sky.",
  },

  // ===== 5+ LETTER WORDS (Difficulty 3) =====
  snake: {
    word: "snake",
    phonemes: ["s", "n", "a", "k", "e"],
    category: "cvce",
    difficulty: 3,
    image:
      "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=400&fit=crop",
    sentence: "The snake slithers on the ground.",
    relatedWords: ["cake", "make", "take", "lake"],
  },
  house: {
    word: "house",
    phonemes: ["h", "ou", "s", "e"],
    category: "other",
    difficulty: 3,
    image:
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=400&h=400&fit=crop",
    sentence: "I live in a house.",
  },
  apple: {
    word: "apple",
    phonemes: ["a", "pp", "l", "e"],
    category: "other",
    difficulty: 3,
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop",
    sentence: "I eat a red apple.",
  },
};

// ===== HELPER FUNCTIONS =====

/**
 * Get a word from the repository
 */
export function getWord(word: string): Word | undefined {
  return WORD_REPOSITORY[word.toLowerCase()];
}

/**
 * Check if a word exists in the repository
 */
export function hasWord(word: string): boolean {
  return word.toLowerCase() in WORD_REPOSITORY;
}

/**
 * Get all words as an array
 */
export function getAllWords(): Word[] {
  return Object.values(WORD_REPOSITORY);
}

/**
 * Get words by category
 */
export function getWordsByCategory(category: WordCategory): Word[] {
  return getAllWords().filter((w) => w.category === category);
}

/**
 * Get words by difficulty
 */
export function getWordsByDifficulty(difficulty: Difficulty): Word[] {
  return getAllWords().filter((w) => w.difficulty === difficulty);
}

/**
 * Get words available for a phonics unit
 */
export function getWordsForUnit(maxUnit: number): Word[] {
  return getAllWords().filter((w) => (w.minUnit ?? 1) <= maxUnit);
}

/**
 * Get CVC words only
 */
export function getCVCWords(): Word[] {
  return getWordsByCategory("cvc");
}

/**
 * Get words with images
 */
export function getWordsWithImages(): Word[] {
  return getAllWords().filter((w) => w.image);
}

/**
 * Get related words (word family)
 */
export function getRelatedWords(word: string): string[] {
  const w = getWord(word);
  return w?.relatedWords ?? [];
}

/**
 * Search words by pattern (supports * wildcard)
 * e.g., "*at" matches cat, bat, hat
 */
export function searchWords(pattern: string): Word[] {
  const regex = new RegExp(
    "^" + pattern.toLowerCase().replace(/\*/g, ".*") + "$"
  );
  return getAllWords().filter((w) => regex.test(w.word));
}
