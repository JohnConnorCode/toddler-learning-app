/**
 * Decodable Sentences Data
 *
 * Short sentences (2-4 words) using only letters from completed phonics units.
 * Organized by unit so only appropriate sentences are shown.
 */

export type DecodableSentence = {
  id: string;
  sentence: string;
  unit: number; // Minimum unit required to read this sentence
  words: string[]; // Words in the sentence
  image?: string; // Optional illustration
  difficulty: 1 | 2 | 3; // 1=Very easy, 2=Easy, 3=Moderate
};

export const DECODABLE_SENTENCES: DecodableSentence[] = [
  // Unit 1: S, A, T, P (very limited vocabulary)
  {
    id: "s1",
    sentence: "Pat sat.",
    unit: 1,
    words: ["Pat", "sat"],
    difficulty: 1,
  },
  {
    id: "s2",
    sentence: "Sat at a tap.",
    unit: 1,
    words: ["Sat", "at", "a", "tap"],
    difficulty: 1,
  },

  // Unit 2: I, N, M, D (more words available)
  {
    id: "s3",
    sentence: "Dan sat.",
    unit: 2,
    words: ["Dan", "sat"],
    difficulty: 1,
  },
  {
    id: "s4",
    sentence: "Sam is mad.",
    unit: 2,
    words: ["Sam", "is", "mad"],
    difficulty: 1,
  },
  {
    id: "s5",
    sentence: "Tim and Pam sat.",
    unit: 2,
    words: ["Tim", "and", "Pam", "sat"],
    difficulty: 2,
  },
  {
    id: "s6",
    sentence: "Dan can nap.",
    unit: 2,
    words: ["Dan", "can", "nap"],
    difficulty: 1,
  },
  {
    id: "s7",
    sentence: "Sam and Tim nap.",
    unit: 2,
    words: ["Sam", "and", "Tim", "nap"],
    difficulty: 2,
  },
  {
    id: "s8",
    sentence: "A man sat.",
    unit: 2,
    words: ["A", "man", "sat"],
    difficulty: 1,
  },

  // Unit 3: G, O, C, K (adding more complex words)
  {
    id: "s9",
    sentence: "Tom got a cat.",
    unit: 3,
    words: ["Tom", "got", "a", "cat"],
    difficulty: 2,
  },
  {
    id: "s10",
    sentence: "The dog can dig.",
    unit: 3,
    words: ["The", "dog", "can", "dig"],
    difficulty: 2,
  },
  {
    id: "s11",
    sentence: "Mom got a mop.",
    unit: 3,
    words: ["Mom", "got", "a", "mop"],
    difficulty: 2,
  },
  {
    id: "s12",
    sentence: "Tim and Tom kick.",
    unit: 3,
    words: ["Tim", "and", "Tom", "kick"],
    difficulty: 2,
  },
  {
    id: "s13",
    sentence: "A cat sat on a mat.",
    unit: 3,
    words: ["A", "cat", "sat", "on", "a", "mat"],
    difficulty: 3,
  },
  {
    id: "s14",
    sentence: "The kid got a sock.",
    unit: 3,
    words: ["The", "kid", "got", "a", "sock"],
    difficulty: 2,
  },

  // Unit 4: E, R, H, B (more sophisticated sentences)
  {
    id: "s15",
    sentence: "Ben has a red hat.",
    unit: 4,
    words: ["Ben", "has", "a", "red", "hat"],
    difficulty: 2,
  },
  {
    id: "s16",
    sentence: "The hen is in her pen.",
    unit: 4,
    words: ["The", "hen", "is", "in", "her", "pen"],
    difficulty: 3,
  },
  {
    id: "s17",
    sentence: "Mom can bake a cake.",
    unit: 4,
    words: ["Mom", "can", "bake", "a", "cake"],
    difficulty: 3,
  },
  {
    id: "s18",
    sentence: "The bed is big.",
    unit: 4,
    words: ["The", "bed", "is", "big"],
    difficulty: 2,
  },
  {
    id: "s19",
    sentence: "Dad hit the ball.",
    unit: 4,
    words: ["Dad", "hit", "the", "ball"],
    difficulty: 2,
  },
  {
    id: "s20",
    sentence: "Rob can hop and skip.",
    unit: 4,
    words: ["Rob", "can", "hop", "and", "skip"],
    difficulty: 3,
  },

  // Unit 5: F, L, U, W (fuller vocabulary)
  {
    id: "s21",
    sentence: "The bug is on a leaf.",
    unit: 5,
    words: ["The", "bug", "is", "on", "a", "leaf"],
    difficulty: 3,
  },
  {
    id: "s22",
    sentence: "Will fell in the mud.",
    unit: 5,
    words: ["Will", "fell", "in", "the", "mud"],
    difficulty: 3,
  },
  {
    id: "s23",
    sentence: "The pup is full.",
    unit: 5,
    words: ["The", "pup", "is", "full"],
    difficulty: 2,
  },
  {
    id: "s24",
    sentence: "Lil can run fast.",
    unit: 5,
    words: ["Lil", "can", "run", "fast"],
    difficulty: 2,
  },
  {
    id: "s25",
    sentence: "The wolf went to the den.",
    unit: 5,
    words: ["The", "wolf", "went", "to", "the", "den"],
    difficulty: 3,
  },
  {
    id: "s26",
    sentence: "A fish swims in the water.",
    unit: 5,
    words: ["A", "fish", "swims", "in", "the", "water"],
    difficulty: 3,
  },

  // Unit 6: J, V, X, Y, Z, Q (complete alphabet)
  {
    id: "s27",
    sentence: "The fox jumps over the log.",
    unit: 6,
    words: ["The", "fox", "jumps", "over", "the", "log"],
    difficulty: 3,
  },
  {
    id: "s28",
    sentence: "Jen has a yellow vest.",
    unit: 6,
    words: ["Jen", "has", "a", "yellow", "vest"],
    difficulty: 3,
  },
  {
    id: "s29",
    sentence: "The queen is very quick.",
    unit: 6,
    words: ["The", "queen", "is", "very", "quick"],
    difficulty: 3,
  },
  {
    id: "s30",
    sentence: "Max can fix the box.",
    unit: 6,
    words: ["Max", "can", "fix", "the", "box"],
    difficulty: 3,
  },
];

/**
 * Helper Functions
 */

export function getSentencesForUnit(unit: number): DecodableSentence[] {
  return DECODABLE_SENTENCES.filter(s => s.unit <= unit);
}

export function getSentencesByDifficulty(
  difficulty: 1 | 2 | 3,
  maxUnit: number
): DecodableSentence[] {
  return DECODABLE_SENTENCES.filter(
    s => s.difficulty === difficulty && s.unit <= maxUnit
  );
}

export function getRandomSentence(maxUnit: number): DecodableSentence | null {
  const available = getSentencesForUnit(maxUnit);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function getTotalSentencesAvailable(maxUnit: number): number {
  return getSentencesForUnit(maxUnit).length;
}
