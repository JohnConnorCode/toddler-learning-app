/**
 * Blending Words Data
 *
 * Manages word selection for blending activities based on completed phonics units.
 * Only includes words using letters from completed units.
 */

// Phonics units progression (Mentava-style)
const UNIT_LETTERS: Record<number, string[]> = {
  1: ["s", "a", "t", "p"],
  2: ["i", "n", "m", "d"],
  3: ["g", "o", "c", "k"],
  4: ["e", "r", "h", "b"],
  5: ["f", "l", "u", "w"],
  6: ["j", "v", "x", "y", "z", "q"],
};

/**
 * Get all letters available up to a specific unit
 */
export function getAvailableLetters(maxUnit: number): Set<string> {
  const letters = new Set<string>();
  for (let unit = 1; unit <= Math.min(maxUnit, 6); unit++) {
    UNIT_LETTERS[unit]?.forEach((letter) => letters.add(letter.toLowerCase()));
  }
  return letters;
}

/**
 * Check if a word can be made with available letters
 */
export function canBlendWord(word: string, maxUnit: number): boolean {
  const available = getAvailableLetters(maxUnit);
  const wordLetters = word.toLowerCase().split("");

  return wordLetters.every((letter) => available.has(letter));
}

/**
 * Simple CVC words for blending practice
 * Organized by the minimum unit required
 */
export type BlendingWord = {
  word: string;
  minUnit: number; // Minimum unit to unlock this word
  difficulty: 1 | 2 | 3; // 1=CVC, 2=CVCC/CCVC, 3=CCVCC/longer
};

export const BLENDING_WORDS: BlendingWord[] = [
  // Unit 1: S, A, T, P
  { word: "sat", minUnit: 1, difficulty: 1 },
  { word: "pat", minUnit: 1, difficulty: 1 },
  { word: "tap", minUnit: 1, difficulty: 1 },
  { word: "sap", minUnit: 1, difficulty: 1 },
  { word: "apt", minUnit: 1, difficulty: 1 },
  { word: "pas", minUnit: 1, difficulty: 1 },

  // Unit 2: + I, N, M, D
  { word: "sit", minUnit: 2, difficulty: 1 },
  { word: "sat", minUnit: 2, difficulty: 1 },
  { word: "mat", minUnit: 2, difficulty: 1 },
  { word: "man", minUnit: 2, difficulty: 1 },
  { word: "pan", minUnit: 2, difficulty: 1 },
  { word: "pin", minUnit: 2, difficulty: 1 },
  { word: "pit", minUnit: 2, difficulty: 1 },
  { word: "tin", minUnit: 2, difficulty: 1 },
  { word: "tan", minUnit: 2, difficulty: 1 },
  { word: "nap", minUnit: 2, difficulty: 1 },
  { word: "nit", minUnit: 2, difficulty: 1 },
  { word: "din", minUnit: 2, difficulty: 1 },
  { word: "dim", minUnit: 2, difficulty: 1 },
  { word: "dam", minUnit: 2, difficulty: 1 },
  { word: "dip", minUnit: 2, difficulty: 1 },
  { word: "mad", minUnit: 2, difficulty: 1 },
  { word: "sad", minUnit: 2, difficulty: 1 },
  { word: "dad", minUnit: 2, difficulty: 1 },

  // Unit 3: + G, O, C, K
  { word: "cat", minUnit: 3, difficulty: 1 },
  { word: "dog", minUnit: 3, difficulty: 1 },
  { word: "god", minUnit: 3, difficulty: 1 },
  { word: "got", minUnit: 3, difficulty: 1 },
  { word: "cot", minUnit: 3, difficulty: 1 },
  { word: "cop", minUnit: 3, difficulty: 1 },
  { word: "mop", minUnit: 3, difficulty: 1 },
  { word: "top", minUnit: 3, difficulty: 1 },
  { word: "pot", minUnit: 3, difficulty: 1 },
  { word: "dot", minUnit: 3, difficulty: 1 },
  { word: "not", minUnit: 3, difficulty: 1 },
  { word: "cog", minUnit: 3, difficulty: 1 },
  { word: "gag", minUnit: 3, difficulty: 1 },
  { word: "tag", minUnit: 3, difficulty: 1 },
  { word: "can", minUnit: 3, difficulty: 1 },
  { word: "cap", minUnit: 3, difficulty: 1 },
  { word: "gap", minUnit: 3, difficulty: 1 },
  { word: "sac", minUnit: 3, difficulty: 1 },
  { word: "cod", minUnit: 3, difficulty: 1 },

  // Unit 4: + E, R, H, B
  { word: "bed", minUnit: 4, difficulty: 1 },
  { word: "red", minUnit: 4, difficulty: 1 },
  { word: "hen", minUnit: 4, difficulty: 1 },
  { word: "pen", minUnit: 4, difficulty: 1 },
  { word: "men", minUnit: 4, difficulty: 1 },
  { word: "ten", minUnit: 4, difficulty: 1 },
  { word: "net", minUnit: 4, difficulty: 1 },
  { word: "bet", minUnit: 4, difficulty: 1 },
  { word: "get", minUnit: 4, difficulty: 1 },
  { word: "met", minUnit: 4, difficulty: 1 },
  { word: "set", minUnit: 4, difficulty: 1 },
  { word: "bat", minUnit: 4, difficulty: 1 },
  { word: "bit", minUnit: 4, difficulty: 1 },
  { word: "bot", minUnit: 4, difficulty: 1 },
  { word: "bin", minUnit: 4, difficulty: 1 },
  { word: "ban", minUnit: 4, difficulty: 1 },
  { word: "bag", minUnit: 4, difficulty: 1 },
  { word: "big", minUnit: 4, difficulty: 1 },
  { word: "bog", minUnit: 4, difficulty: 1 },
  { word: "bad", minUnit: 4, difficulty: 1 },
  { word: "beg", minUnit: 4, difficulty: 1 },
  { word: "hit", minUnit: 4, difficulty: 1 },
  { word: "hot", minUnit: 4, difficulty: 1 },
  { word: "hat", minUnit: 4, difficulty: 1 },
  { word: "had", minUnit: 4, difficulty: 1 },
  { word: "hog", minUnit: 4, difficulty: 1 },
  { word: "hid", minUnit: 4, difficulty: 1 },
  { word: "him", minUnit: 4, difficulty: 1 },
  { word: "her", minUnit: 4, difficulty: 1 },
  { word: "rib", minUnit: 4, difficulty: 1 },
  { word: "rob", minUnit: 4, difficulty: 1 },
  { word: "rat", minUnit: 4, difficulty: 1 },
  { word: "ran", minUnit: 4, difficulty: 1 },
  { word: "ram", minUnit: 4, difficulty: 1 },
  { word: "rag", minUnit: 4, difficulty: 1 },
  { word: "rip", minUnit: 4, difficulty: 1 },
  { word: "rim", minUnit: 4, difficulty: 1 },
  { word: "rod", minUnit: 4, difficulty: 1 },

  // Unit 5: + F, L, U, W
  { word: "fun", minUnit: 5, difficulty: 1 },
  { word: "sun", minUnit: 5, difficulty: 1 },
  { word: "run", minUnit: 5, difficulty: 1 },
  { word: "bun", minUnit: 5, difficulty: 1 },
  { word: "bug", minUnit: 5, difficulty: 1 },
  { word: "hug", minUnit: 5, difficulty: 1 },
  { word: "mug", minUnit: 5, difficulty: 1 },
  { word: "rug", minUnit: 5, difficulty: 1 },
  { word: "tug", minUnit: 5, difficulty: 1 },
  { word: "dug", minUnit: 5, difficulty: 1 },
  { word: "cup", minUnit: 5, difficulty: 1 },
  { word: "pup", minUnit: 5, difficulty: 1 },
  { word: "sup", minUnit: 5, difficulty: 1 },
  { word: "cut", minUnit: 5, difficulty: 1 },
  { word: "but", minUnit: 5, difficulty: 1 },
  { word: "nut", minUnit: 5, difficulty: 1 },
  { word: "hut", minUnit: 5, difficulty: 1 },
  { word: "gut", minUnit: 5, difficulty: 1 },
  { word: "bus", minUnit: 5, difficulty: 1 },
  { word: "fad", minUnit: 5, difficulty: 1 },
  { word: "fan", minUnit: 5, difficulty: 1 },
  { word: "fat", minUnit: 5, difficulty: 1 },
  { word: "fit", minUnit: 5, difficulty: 1 },
  { word: "fin", minUnit: 5, difficulty: 1 },
  { word: "fig", minUnit: 5, difficulty: 1 },
  { word: "fog", minUnit: 5, difficulty: 1 },
  { word: "fur", minUnit: 5, difficulty: 1 },
  { word: "let", minUnit: 5, difficulty: 1 },
  { word: "led", minUnit: 5, difficulty: 1 },
  { word: "leg", minUnit: 5, difficulty: 1 },
  { word: "lit", minUnit: 5, difficulty: 1 },
  { word: "lot", minUnit: 5, difficulty: 1 },
  { word: "log", minUnit: 5, difficulty: 1 },
  { word: "lap", minUnit: 5, difficulty: 1 },
  { word: "lad", minUnit: 5, difficulty: 1 },
  { word: "lid", minUnit: 5, difficulty: 1 },
  { word: "wet", minUnit: 5, difficulty: 1 },
  { word: "web", minUnit: 5, difficulty: 1 },
  { word: "wed", minUnit: 5, difficulty: 1 },
  { word: "wig", minUnit: 5, difficulty: 1 },
  { word: "wit", minUnit: 5, difficulty: 1 },
  { word: "win", minUnit: 5, difficulty: 1 },
  { word: "wag", minUnit: 5, difficulty: 1 },

  // Unit 6: + J, V, X, Y, Z, Q
  { word: "jab", minUnit: 6, difficulty: 1 },
  { word: "jag", minUnit: 6, difficulty: 1 },
  { word: "jam", minUnit: 6, difficulty: 1 },
  { word: "jet", minUnit: 6, difficulty: 1 },
  { word: "jig", minUnit: 6, difficulty: 1 },
  { word: "jog", minUnit: 6, difficulty: 1 },
  { word: "jot", minUnit: 6, difficulty: 1 },
  { word: "jug", minUnit: 6, difficulty: 1 },
  { word: "van", minUnit: 6, difficulty: 1 },
  { word: "vat", minUnit: 6, difficulty: 1 },
  { word: "vet", minUnit: 6, difficulty: 1 },
  { word: "yet", minUnit: 6, difficulty: 1 },
  { word: "yam", minUnit: 6, difficulty: 1 },
  { word: "yap", minUnit: 6, difficulty: 1 },
  { word: "yes", minUnit: 6, difficulty: 1 },
  { word: "zap", minUnit: 6, difficulty: 1 },
  { word: "zen", minUnit: 6, difficulty: 1 },
  { word: "zip", minUnit: 6, difficulty: 1 },
  { word: "zit", minUnit: 6, difficulty: 1 },
  { word: "zoo", minUnit: 6, difficulty: 1 },

  // Additional CVC words for expanded practice
  // Unit 2 additions
  { word: "mid", minUnit: 2, difficulty: 1 },
  { word: "min", minUnit: 2, difficulty: 1 },

  // Unit 3 additions
  { word: "gig", minUnit: 3, difficulty: 1 },
  { word: "tog", minUnit: 3, difficulty: 1 },
  { word: "mod", minUnit: 3, difficulty: 1 },
  { word: "nod", minUnit: 3, difficulty: 1 },
  { word: "kit", minUnit: 3, difficulty: 1 },
  { word: "kid", minUnit: 3, difficulty: 1 },

  // Unit 4 additions
  { word: "bob", minUnit: 4, difficulty: 1 },
  { word: "mob", minUnit: 4, difficulty: 1 },
  { word: "sob", minUnit: 4, difficulty: 1 },
  { word: "cob", minUnit: 4, difficulty: 1 },
  { word: "peg", minUnit: 4, difficulty: 1 },
  { word: "keg", minUnit: 4, difficulty: 1 },
  { word: "hem", minUnit: 4, difficulty: 1 },
  { word: "rep", minUnit: 4, difficulty: 1 },
  { word: "ref", minUnit: 5, difficulty: 1 },
  { word: "reb", minUnit: 4, difficulty: 1 },

  // Unit 5 additions
  { word: "cub", minUnit: 5, difficulty: 1 },
  { word: "dub", minUnit: 5, difficulty: 1 },
  { word: "hub", minUnit: 5, difficulty: 1 },
  { word: "pub", minUnit: 5, difficulty: 1 },
  { word: "rub", minUnit: 5, difficulty: 1 },
  { word: "sub", minUnit: 5, difficulty: 1 },
  { word: "bud", minUnit: 5, difficulty: 1 },
  { word: "cud", minUnit: 5, difficulty: 1 },
  { word: "dud", minUnit: 5, difficulty: 1 },
  { word: "mud", minUnit: 5, difficulty: 1 },
  { word: "fib", minUnit: 5, difficulty: 1 },
  { word: "lug", minUnit: 5, difficulty: 1 },
  { word: "gum", minUnit: 5, difficulty: 1 },
  { word: "sum", minUnit: 5, difficulty: 1 },
  { word: "hum", minUnit: 5, difficulty: 1 },

  // Unit 6 additions
  { word: "vim", minUnit: 6, difficulty: 1 },
  { word: "yip", minUnit: 6, difficulty: 1 },
  { word: "zed", minUnit: 6, difficulty: 1 },
  { word: "yak", minUnit: 6, difficulty: 1 },
  { word: "yum", minUnit: 6, difficulty: 1 },

  // CVCC and CCVC words (difficulty 2)
  { word: "fast", minUnit: 5, difficulty: 2 },
  { word: "last", minUnit: 5, difficulty: 2 },
  { word: "past", minUnit: 5, difficulty: 2 },
  { word: "cast", minUnit: 5, difficulty: 2 },
  { word: "best", minUnit: 4, difficulty: 2 },
  { word: "west", minUnit: 5, difficulty: 2 },
  { word: "rest", minUnit: 4, difficulty: 2 },
  { word: "test", minUnit: 4, difficulty: 2 },
  { word: "nest", minUnit: 4, difficulty: 2 },
  { word: "pest", minUnit: 4, difficulty: 2 },
  { word: "must", minUnit: 5, difficulty: 2 },
  { word: "dust", minUnit: 5, difficulty: 2 },
  { word: "rust", minUnit: 5, difficulty: 2 },
  { word: "just", minUnit: 6, difficulty: 2 },
  { word: "stop", minUnit: 3, difficulty: 2 },
  { word: "step", minUnit: 4, difficulty: 2 },
  { word: "stem", minUnit: 4, difficulty: 2 },
  { word: "spot", minUnit: 3, difficulty: 2 },
  { word: "slip", minUnit: 5, difficulty: 2 },
  { word: "slap", minUnit: 5, difficulty: 2 },
  { word: "slam", minUnit: 5, difficulty: 2 },
  { word: "slat", minUnit: 5, difficulty: 2 },
  { word: "sled", minUnit: 5, difficulty: 2 },
  { word: "slim", minUnit: 5, difficulty: 2 },
  { word: "slob", minUnit: 5, difficulty: 2 },
  { word: "slot", minUnit: 5, difficulty: 2 },
  { word: "slug", minUnit: 5, difficulty: 2 },
  { word: "slum", minUnit: 5, difficulty: 2 },
  { word: "drag", minUnit: 4, difficulty: 2 },
  { word: "drip", minUnit: 4, difficulty: 2 },
  { word: "drop", minUnit: 4, difficulty: 2 },
  { word: "drum", minUnit: 4, difficulty: 2 },
  { word: "flat", minUnit: 5, difficulty: 2 },
  { word: "flip", minUnit: 5, difficulty: 2 },
  { word: "flap", minUnit: 5, difficulty: 2 },
  { word: "flag", minUnit: 5, difficulty: 2 },
  { word: "fled", minUnit: 5, difficulty: 2 },
  { word: "flog", minUnit: 5, difficulty: 2 },
  { word: "flop", minUnit: 5, difficulty: 2 },
  { word: "grin", minUnit: 4, difficulty: 2 },
  { word: "grip", minUnit: 4, difficulty: 2 },
  { word: "grit", minUnit: 4, difficulty: 2 },
  { word: "gran", minUnit: 4, difficulty: 2 },
  { word: "grab", minUnit: 4, difficulty: 2 },
  { word: "glad", minUnit: 5, difficulty: 2 },
  { word: "glen", minUnit: 5, difficulty: 2 },
  { word: "glob", minUnit: 5, difficulty: 2 },
  { word: "glum", minUnit: 5, difficulty: 2 },
  { word: "trim", minUnit: 4, difficulty: 2 },
  { word: "trip", minUnit: 4, difficulty: 2 },
  { word: "trap", minUnit: 4, difficulty: 2 },
  { word: "trot", minUnit: 4, difficulty: 2 },
  { word: "clap", minUnit: 5, difficulty: 2 },
  { word: "clan", minUnit: 5, difficulty: 2 },
  { word: "clad", minUnit: 5, difficulty: 2 },
  { word: "clip", minUnit: 5, difficulty: 2 },
  { word: "clod", minUnit: 5, difficulty: 2 },
  { word: "clot", minUnit: 5, difficulty: 2 },
  { word: "clog", minUnit: 5, difficulty: 2 },
  { word: "clam", minUnit: 5, difficulty: 2 },
  { word: "plod", minUnit: 5, difficulty: 2 },
  { word: "plot", minUnit: 5, difficulty: 2 },
  { word: "plop", minUnit: 5, difficulty: 2 },
  { word: "plan", minUnit: 5, difficulty: 2 },
  { word: "plus", minUnit: 5, difficulty: 2 },
  { word: "plum", minUnit: 5, difficulty: 2 },
  { word: "plug", minUnit: 5, difficulty: 2 },
  { word: "bran", minUnit: 4, difficulty: 2 },
  { word: "brad", minUnit: 4, difficulty: 2 },
  { word: "brag", minUnit: 4, difficulty: 2 },
  { word: "bred", minUnit: 4, difficulty: 2 },
  { word: "brim", minUnit: 4, difficulty: 2 },
];

/**
 * Get words available for a specific unit
 */
export function getBlendingWordsForUnit(
  unitId: number,
  difficulty?: 1 | 2 | 3
): BlendingWord[] {
  let words = BLENDING_WORDS.filter((w) => w.minUnit <= unitId);

  if (difficulty) {
    words = words.filter((w) => w.difficulty === difficulty);
  }

  return words;
}

/**
 * Get random word for practice
 */
export function getRandomBlendingWord(
  maxUnit: number,
  difficulty?: 1 | 2 | 3
): string {
  const words = getBlendingWordsForUnit(maxUnit, difficulty);
  if (words.length === 0) return "cat"; // Fallback

  return words[Math.floor(Math.random() * words.length)].word;
}

/**
 * Get all word strings for scheduler
 */
export function getAllBlendingWordStrings(maxUnit: number): string[] {
  return getBlendingWordsForUnit(maxUnit).map((w) => w.word);
}
