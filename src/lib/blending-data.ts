/**
 * Blending & Segmenting Data
 *
 * Teaches synthetic phonics: blending individual sounds into words
 * and segmenting words into individual sounds.
 *
 * Words are organized by phonics unit to ensure children only practice
 * with letters they've already learned.
 */

export interface CVCWord {
  id: string;
  word: string;
  sounds: string[]; // Individual phonemes, e.g., ["c", "a", "t"]
  image: string;
  audioPath: string;
  unitUnlocked: number; // Which phonics unit unlocks this word
  difficulty: 1 | 2 | 3;
}

export interface BlendingQuestion {
  id: string;
  word: CVCWord;
  type: "blend-sounds" | "build-word" | "segment-word";
  prompt: string;
  difficulty: 1 | 2 | 3;
}

// CVC Words organized by phonics units
// Unit 1: S, A, T, P
export const UNIT_1_WORDS: CVCWord[] = [
  {
    id: "sat",
    word: "sat",
    sounds: ["s", "a", "t"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
    audioPath: "/audio/words/sat.mp3",
    unitUnlocked: 1,
    difficulty: 1,
  },
  {
    id: "pat",
    word: "pat",
    sounds: ["p", "a", "t"],
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=400&fit=crop",
    audioPath: "/audio/words/pat.mp3",
    unitUnlocked: 1,
    difficulty: 1,
  },
  {
    id: "tap",
    word: "tap",
    sounds: ["t", "a", "p"],
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop",
    audioPath: "/audio/words/tap.mp3",
    unitUnlocked: 1,
    difficulty: 1,
  },
  {
    id: "sap",
    word: "sap",
    sounds: ["s", "a", "p"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=400&fit=crop",
    audioPath: "/audio/words/sap.mp3",
    unitUnlocked: 1,
    difficulty: 1,
  },
];

// Unit 2: I, N, M, D (plus Unit 1 letters)
export const UNIT_2_WORDS: CVCWord[] = [
  {
    id: "sit",
    word: "sit",
    sounds: ["s", "i", "t"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
    audioPath: "/audio/words/sit.mp3",
    unitUnlocked: 2,
    difficulty: 1,
  },
  {
    id: "pin",
    word: "pin",
    sounds: ["p", "i", "n"],
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop",
    audioPath: "/audio/words/pin.mp3",
    unitUnlocked: 2,
    difficulty: 1,
  },
  {
    id: "tin",
    word: "tin",
    sounds: ["t", "i", "n"],
    image: "https://images.unsplash.com/photo-1608484676627-6f7c4cbf9158?w=400&h=400&fit=crop",
    audioPath: "/audio/words/tin.mp3",
    unitUnlocked: 2,
    difficulty: 1,
  },
  {
    id: "man",
    word: "man",
    sounds: ["m", "a", "n"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    audioPath: "/audio/words/man.mp3",
    unitUnlocked: 2,
    difficulty: 1,
  },
  {
    id: "mat",
    word: "mat",
    sounds: ["m", "a", "t"],
    image: "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?w=400&h=400&fit=crop",
    audioPath: "/audio/words/mat.mp3",
    unitUnlocked: 2,
    difficulty: 1,
  },
  {
    id: "nap",
    word: "nap",
    sounds: ["n", "a", "p"],
    image: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&h=400&fit=crop",
    audioPath: "/audio/words/nap.mp3",
    unitUnlocked: 2,
    difficulty: 1,
  },
  {
    id: "sad",
    word: "sad",
    sounds: ["s", "a", "d"],
    image: "https://images.unsplash.com/photo-1542909192-2f2241a99c9d?w=400&h=400&fit=crop",
    audioPath: "/audio/words/sad.mp3",
    unitUnlocked: 2,
    difficulty: 2,
  },
  {
    id: "mad",
    word: "mad",
    sounds: ["m", "a", "d"],
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660?w=400&h=400&fit=crop",
    audioPath: "/audio/words/mad.mp3",
    unitUnlocked: 2,
    difficulty: 2,
  },
];

// Unit 3: G, O, C, K
export const UNIT_3_WORDS: CVCWord[] = [
  {
    id: "dog",
    word: "dog",
    sounds: ["d", "o", "g"],
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
    audioPath: "/audio/words/dog.mp3",
    unitUnlocked: 3,
    difficulty: 1,
  },
  {
    id: "pot",
    word: "pot",
    sounds: ["p", "o", "t"],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    audioPath: "/audio/words/pot.mp3",
    unitUnlocked: 3,
    difficulty: 1,
  },
  {
    id: "top",
    word: "top",
    sounds: ["t", "o", "p"],
    image: "https://images.unsplash.com/photo-1515630278258-407f66498911?w=400&h=400&fit=crop",
    audioPath: "/audio/words/top.mp3",
    unitUnlocked: 3,
    difficulty: 1,
  },
  {
    id: "mop",
    word: "mop",
    sounds: ["m", "o", "p"],
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    audioPath: "/audio/words/mop.mp3",
    unitUnlocked: 3,
    difficulty: 1,
  },
  {
    id: "cap",
    word: "cap",
    sounds: ["c", "a", "p"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
    audioPath: "/audio/words/cap.mp3",
    unitUnlocked: 3,
    difficulty: 1,
  },
  {
    id: "cat",
    word: "cat",
    sounds: ["c", "a", "t"],
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    audioPath: "/audio/words/cat.mp3",
    unitUnlocked: 3,
    difficulty: 1,
  },
  {
    id: "kit",
    word: "kit",
    sounds: ["k", "i", "t"],
    image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop",
    audioPath: "/audio/words/kit.mp3",
    unitUnlocked: 3,
    difficulty: 2,
  },
  {
    id: "kid",
    word: "kid",
    sounds: ["k", "i", "d"],
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
    audioPath: "/audio/words/kid.mp3",
    unitUnlocked: 3,
    difficulty: 2,
  },
];

// All CVC words combined
export const ALL_CVC_WORDS: CVCWord[] = [
  ...UNIT_1_WORDS,
  ...UNIT_2_WORDS,
  ...UNIT_3_WORDS,
];

// Helper functions

// Get words available for a given completed units list
export function getAvailableWords(completedUnits: number[]): CVCWord[] {
  const maxUnit = Math.max(...completedUnits, 0);
  return ALL_CVC_WORDS.filter((word) => word.unitUnlocked <= maxUnit);
}

// Get words for specific unit
export function getWordsForUnit(unitId: number): CVCWord[] {
  return ALL_CVC_WORDS.filter((word) => word.unitUnlocked === unitId);
}

// Get word by ID
export function getWordById(wordId: string): CVCWord | undefined {
  return ALL_CVC_WORDS.find((word) => word.id === wordId);
}

// Generate blending questions from available words
export function generateBlendingQuestions(
  completedUnits: number[],
  count: number = 10
): BlendingQuestion[] {
  const availableWords = getAvailableWords(completedUnits);
  if (availableWords.length === 0) return [];

  const questions: BlendingQuestion[] = [];
  const usedWords = new Set<string>();

  // Mix of question types
  const types: Array<"blend-sounds" | "build-word" | "segment-word"> = [
    "blend-sounds",
    "blend-sounds",
    "build-word",
    "build-word",
    "segment-word",
  ];

  for (let i = 0; i < count && availableWords.length > usedWords.size; i++) {
    // Get random unused word
    let word: CVCWord;
    do {
      word = availableWords[Math.floor(Math.random() * availableWords.length)];
    } while (usedWords.has(word.id) && usedWords.size < availableWords.length);

    usedWords.add(word.id);

    const type = types[i % types.length];
    let prompt = "";

    switch (type) {
      case "blend-sounds":
        prompt = "Blend these sounds together. What word do you hear?";
        break;
      case "build-word":
        prompt = `Build the word: ${word.word}`;
        break;
      case "segment-word":
        prompt = "Break this word into sounds";
        break;
    }

    questions.push({
      id: `blend-${type}-${word.id}`,
      word,
      type,
      prompt,
      difficulty: word.difficulty,
    });
  }

  return questions;
}

// Get random CVC word for practice
export function getRandomWord(completedUnits: number[]): CVCWord | null {
  const available = getAvailableWords(completedUnits);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}
