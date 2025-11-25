/**
 * Decodable Stories Data
 * Simple phonics-aligned stories for early readers
 * Each story focuses on specific letter patterns and CVC words
 */

export type PhonicsUnit =
  | "unit-1-2" // s, a, t, p, i, n, m, d
  | "unit-3-4" // g, o, c, k, e, u, r, h, b
  | "unit-5-6" // f, l, j, w, v, x, y, z, q
  | "digraph-sh" // sh words
  | "digraph-ch" // ch words
  | "digraph-th" // th words
  | "blend-fr-fl" // fr, fl blends
  | "blend-br-bl" // br, bl blends
  | "blend-st-sp" // st, sp blends;

export interface DecodablePage {
  /** Page number */
  pageNumber: number;
  /** Simple sentence text */
  text: string;
  /** Featured words to highlight */
  featuredWords: string[];
  /** Background emoji or illustration hint */
  emoji: string;
  /** Background color class */
  bgColor: string;
}

export interface DecodableStory {
  /** Unique story ID */
  id: string;
  /** Story title */
  title: string;
  /** Which phonics unit this story reinforces */
  phonicsUnit: PhonicsUnit;
  /** Target sounds/patterns being practiced */
  targetSounds: string[];
  /** Simple description */
  description: string;
  /** Cover emoji */
  coverEmoji: string;
  /** Difficulty (1-3) */
  difficulty: 1 | 2 | 3;
  /** Story pages */
  pages: DecodablePage[];
  /** Theme colors */
  theme: {
    primary: string;
    secondary: string;
  };
}

export const DECODABLE_STORIES: DecodableStory[] = [
  // ============================================
  // UNIT 1-2: s, a, t, p, i, n, m, d
  // ============================================
  {
    id: "pat-sat",
    title: "Pat Sat",
    phonicsUnit: "unit-1-2",
    targetSounds: ["a", "t", "s", "p"],
    description: "Pat the cat sits and naps.",
    coverEmoji: "🐱",
    difficulty: 1,
    theme: { primary: "#f97316", secondary: "#fed7aa" },
    pages: [
      {
        pageNumber: 1,
        text: "Pat sat.",
        featuredWords: ["pat", "sat"],
        emoji: "🐱",
        bgColor: "bg-orange-50",
      },
      {
        pageNumber: 2,
        text: "Pat is a cat.",
        featuredWords: ["pat", "cat"],
        emoji: "🐱",
        bgColor: "bg-orange-100",
      },
      {
        pageNumber: 3,
        text: "Pat sat on a mat.",
        featuredWords: ["sat", "mat"],
        emoji: "🧶",
        bgColor: "bg-orange-50",
      },
      {
        pageNumber: 4,
        text: "Pat naps!",
        featuredWords: ["pat", "naps"],
        emoji: "😴",
        bgColor: "bg-orange-100",
      },
    ],
  },
  {
    id: "sam-and-dad",
    title: "Sam and Dad",
    phonicsUnit: "unit-1-2",
    targetSounds: ["a", "m", "d", "s"],
    description: "Sam and Dad have fun together.",
    coverEmoji: "👨‍👦",
    difficulty: 1,
    theme: { primary: "#3b82f6", secondary: "#bfdbfe" },
    pages: [
      {
        pageNumber: 1,
        text: "Sam is sad.",
        featuredWords: ["sam", "sad"],
        emoji: "😢",
        bgColor: "bg-blue-50",
      },
      {
        pageNumber: 2,
        text: "Dad sat with Sam.",
        featuredWords: ["dad", "sat", "sam"],
        emoji: "👨‍👦",
        bgColor: "bg-blue-100",
      },
      {
        pageNumber: 3,
        text: "Dad and Sam ran.",
        featuredWords: ["dad", "sam", "ran"],
        emoji: "🏃",
        bgColor: "bg-blue-50",
      },
      {
        pageNumber: 4,
        text: "Sam is not sad!",
        featuredWords: ["sam", "sad"],
        emoji: "😊",
        bgColor: "bg-blue-100",
      },
    ],
  },
  {
    id: "tim-and-pip",
    title: "Tim and Pip",
    phonicsUnit: "unit-1-2",
    targetSounds: ["i", "t", "p", "n"],
    description: "Tim plays with his pet Pip.",
    coverEmoji: "🐶",
    difficulty: 1,
    theme: { primary: "#10b981", secondary: "#a7f3d0" },
    pages: [
      {
        pageNumber: 1,
        text: "Tim has a pet.",
        featuredWords: ["tim", "pet"],
        emoji: "🐕",
        bgColor: "bg-green-50",
      },
      {
        pageNumber: 2,
        text: "Pip is the pet.",
        featuredWords: ["pip", "pet"],
        emoji: "🐶",
        bgColor: "bg-green-100",
      },
      {
        pageNumber: 3,
        text: "Pip can sit.",
        featuredWords: ["pip", "sit"],
        emoji: "🐕‍🦺",
        bgColor: "bg-green-50",
      },
      {
        pageNumber: 4,
        text: "Tim pats Pip!",
        featuredWords: ["tim", "pats", "pip"],
        emoji: "🤗",
        bgColor: "bg-green-100",
      },
    ],
  },

  // ============================================
  // UNIT 3-4: g, o, c, k, e, u, r, h, b
  // ============================================
  {
    id: "the-big-dog",
    title: "The Big Dog",
    phonicsUnit: "unit-3-4",
    targetSounds: ["o", "g", "b", "d"],
    description: "A big dog goes on an adventure.",
    coverEmoji: "🐕",
    difficulty: 1,
    theme: { primary: "#8b5cf6", secondary: "#ddd6fe" },
    pages: [
      {
        pageNumber: 1,
        text: "Bob is a dog.",
        featuredWords: ["bob", "dog"],
        emoji: "🐕",
        bgColor: "bg-purple-50",
      },
      {
        pageNumber: 2,
        text: "Bob is a big dog.",
        featuredWords: ["bob", "big", "dog"],
        emoji: "🐕",
        bgColor: "bg-purple-100",
      },
      {
        pageNumber: 3,
        text: "Bob can run and hop.",
        featuredWords: ["bob", "run", "hop"],
        emoji: "🐕‍🦺",
        bgColor: "bg-purple-50",
      },
      {
        pageNumber: 4,
        text: "Bob got a hug!",
        featuredWords: ["bob", "got", "hug"],
        emoji: "🤗",
        bgColor: "bg-purple-100",
      },
    ],
  },
  {
    id: "the-red-hen",
    title: "The Red Hen",
    phonicsUnit: "unit-3-4",
    targetSounds: ["e", "h", "r"],
    description: "A red hen pecks and eats.",
    coverEmoji: "🐔",
    difficulty: 1,
    theme: { primary: "#ef4444", secondary: "#fecaca" },
    pages: [
      {
        pageNumber: 1,
        text: "Hen is red.",
        featuredWords: ["hen", "red"],
        emoji: "🐔",
        bgColor: "bg-red-50",
      },
      {
        pageNumber: 2,
        text: "Hen can peck.",
        featuredWords: ["hen", "peck"],
        emoji: "🐔",
        bgColor: "bg-red-100",
      },
      {
        pageNumber: 3,
        text: "Hen gets a bug.",
        featuredWords: ["hen", "gets", "bug"],
        emoji: "🐛",
        bgColor: "bg-red-50",
      },
      {
        pageNumber: 4,
        text: "Red hen is fed!",
        featuredWords: ["red", "hen", "fed"],
        emoji: "😋",
        bgColor: "bg-red-100",
      },
    ],
  },
  {
    id: "the-hot-sun",
    title: "The Hot Sun",
    phonicsUnit: "unit-3-4",
    targetSounds: ["u", "o", "h"],
    description: "It's a hot day in the sun.",
    coverEmoji: "☀️",
    difficulty: 1,
    theme: { primary: "#eab308", secondary: "#fef08a" },
    pages: [
      {
        pageNumber: 1,
        text: "The sun is up.",
        featuredWords: ["sun", "up"],
        emoji: "☀️",
        bgColor: "bg-yellow-50",
      },
      {
        pageNumber: 2,
        text: "It is hot.",
        featuredWords: ["hot"],
        emoji: "🥵",
        bgColor: "bg-yellow-100",
      },
      {
        pageNumber: 3,
        text: "Gus hops in the tub.",
        featuredWords: ["gus", "hops", "tub"],
        emoji: "🛁",
        bgColor: "bg-yellow-50",
      },
      {
        pageNumber: 4,
        text: "Gus is not hot!",
        featuredWords: ["gus", "hot"],
        emoji: "😊",
        bgColor: "bg-yellow-100",
      },
    ],
  },

  // ============================================
  // UNIT 5-6: f, l, j, w, v, x, y, z, q
  // ============================================
  {
    id: "fox-in-a-box",
    title: "Fox in a Box",
    phonicsUnit: "unit-5-6",
    targetSounds: ["f", "x", "o"],
    description: "A fox finds a fun box.",
    coverEmoji: "🦊",
    difficulty: 2,
    theme: { primary: "#f97316", secondary: "#fed7aa" },
    pages: [
      {
        pageNumber: 1,
        text: "Fox has a box.",
        featuredWords: ["fox", "box"],
        emoji: "📦",
        bgColor: "bg-orange-50",
      },
      {
        pageNumber: 2,
        text: "Fox can fit in the box.",
        featuredWords: ["fox", "fit", "box"],
        emoji: "🦊",
        bgColor: "bg-orange-100",
      },
      {
        pageNumber: 3,
        text: "Fox hops in and out.",
        featuredWords: ["fox", "hops"],
        emoji: "📦",
        bgColor: "bg-orange-50",
      },
      {
        pageNumber: 4,
        text: "Fun fox in a box!",
        featuredWords: ["fun", "fox", "box"],
        emoji: "🎉",
        bgColor: "bg-orange-100",
      },
    ],
  },
  {
    id: "will-the-vet",
    title: "Will the Vet",
    phonicsUnit: "unit-5-6",
    targetSounds: ["v", "w", "e"],
    description: "Will helps animals as a vet.",
    coverEmoji: "👨‍⚕️",
    difficulty: 2,
    theme: { primary: "#14b8a6", secondary: "#99f6e4" },
    pages: [
      {
        pageNumber: 1,
        text: "Will is a vet.",
        featuredWords: ["will", "vet"],
        emoji: "👨‍⚕️",
        bgColor: "bg-teal-50",
      },
      {
        pageNumber: 2,
        text: "A wet pup met Will.",
        featuredWords: ["wet", "pup", "will"],
        emoji: "🐶",
        bgColor: "bg-teal-100",
      },
      {
        pageNumber: 3,
        text: "Will can fix the pup.",
        featuredWords: ["will", "fix", "pup"],
        emoji: "🩺",
        bgColor: "bg-teal-50",
      },
      {
        pageNumber: 4,
        text: "The vet is the best!",
        featuredWords: ["vet", "best"],
        emoji: "⭐",
        bgColor: "bg-teal-100",
      },
    ],
  },
  {
    id: "yak-and-yam",
    title: "Yak and Yam",
    phonicsUnit: "unit-5-6",
    targetSounds: ["y", "a", "m"],
    description: "A yak finds a yummy yam.",
    coverEmoji: "🦬",
    difficulty: 2,
    theme: { primary: "#a855f7", secondary: "#e9d5ff" },
    pages: [
      {
        pageNumber: 1,
        text: "Yak is big.",
        featuredWords: ["yak", "big"],
        emoji: "🦬",
        bgColor: "bg-purple-50",
      },
      {
        pageNumber: 2,
        text: "Yak digs in mud.",
        featuredWords: ["yak", "digs", "mud"],
        emoji: "🦬",
        bgColor: "bg-purple-100",
      },
      {
        pageNumber: 3,
        text: "Yak got a yam!",
        featuredWords: ["yak", "yam"],
        emoji: "🍠",
        bgColor: "bg-purple-50",
      },
      {
        pageNumber: 4,
        text: "Yum yum yam!",
        featuredWords: ["yum", "yam"],
        emoji: "😋",
        bgColor: "bg-purple-100",
      },
    ],
  },

  // ============================================
  // DIGRAPH STORIES: sh, ch, th
  // ============================================
  {
    id: "a-ship-trip",
    title: "A Ship Trip",
    phonicsUnit: "digraph-sh",
    targetSounds: ["sh"],
    description: "Shelly goes on a ship adventure.",
    coverEmoji: "🚢",
    difficulty: 2,
    theme: { primary: "#0ea5e9", secondary: "#bae6fd" },
    pages: [
      {
        pageNumber: 1,
        text: "Shelly got on a ship.",
        featuredWords: ["shelly", "ship"],
        emoji: "🚢",
        bgColor: "bg-sky-50",
      },
      {
        pageNumber: 2,
        text: "The ship is big.",
        featuredWords: ["ship", "big"],
        emoji: "🚢",
        bgColor: "bg-sky-100",
      },
      {
        pageNumber: 3,
        text: "Shelly can see a fish!",
        featuredWords: ["shelly", "fish"],
        emoji: "🐟",
        bgColor: "bg-sky-50",
      },
      {
        pageNumber: 4,
        text: "Shelly had a fun ship trip!",
        featuredWords: ["shelly", "ship"],
        emoji: "🎉",
        bgColor: "bg-sky-100",
      },
    ],
  },
  {
    id: "chip-the-chick",
    title: "Chip the Chick",
    phonicsUnit: "digraph-ch",
    targetSounds: ["ch"],
    description: "Chip the chick plays and chatters.",
    coverEmoji: "🐤",
    difficulty: 2,
    theme: { primary: "#facc15", secondary: "#fef9c3" },
    pages: [
      {
        pageNumber: 1,
        text: "Chip is a chick.",
        featuredWords: ["chip", "chick"],
        emoji: "🐤",
        bgColor: "bg-yellow-50",
      },
      {
        pageNumber: 2,
        text: "Chip can chat.",
        featuredWords: ["chip", "chat"],
        emoji: "🐤",
        bgColor: "bg-yellow-100",
      },
      {
        pageNumber: 3,
        text: "Chip chops at a bug.",
        featuredWords: ["chip", "chops", "bug"],
        emoji: "🐛",
        bgColor: "bg-yellow-50",
      },
      {
        pageNumber: 4,
        text: "Chomp! Much fun for Chip!",
        featuredWords: ["chomp", "much", "chip"],
        emoji: "😊",
        bgColor: "bg-yellow-100",
      },
    ],
  },
  {
    id: "this-and-that",
    title: "This and That",
    phonicsUnit: "digraph-th",
    targetSounds: ["th"],
    description: "Learn about this and that!",
    coverEmoji: "👆",
    difficulty: 2,
    theme: { primary: "#ec4899", secondary: "#fbcfe8" },
    pages: [
      {
        pageNumber: 1,
        text: "This is a cat.",
        featuredWords: ["this", "cat"],
        emoji: "🐱",
        bgColor: "bg-pink-50",
      },
      {
        pageNumber: 2,
        text: "That is a bat.",
        featuredWords: ["that", "bat"],
        emoji: "🦇",
        bgColor: "bg-pink-100",
      },
      {
        pageNumber: 3,
        text: "This cat is thin.",
        featuredWords: ["this", "thin"],
        emoji: "🐱",
        bgColor: "bg-pink-50",
      },
      {
        pageNumber: 4,
        text: "I like this and that!",
        featuredWords: ["this", "that"],
        emoji: "❤️",
        bgColor: "bg-pink-100",
      },
    ],
  },

  // ============================================
  // BLEND STORIES: fr/fl, br/bl, st/sp
  // ============================================
  {
    id: "frog-on-a-log",
    title: "Frog on a Log",
    phonicsUnit: "blend-fr-fl",
    targetSounds: ["fr", "fl"],
    description: "A frog and a fly have fun.",
    coverEmoji: "🐸",
    difficulty: 3,
    theme: { primary: "#22c55e", secondary: "#bbf7d0" },
    pages: [
      {
        pageNumber: 1,
        text: "Frog sat on a log.",
        featuredWords: ["frog", "log"],
        emoji: "🐸",
        bgColor: "bg-green-50",
      },
      {
        pageNumber: 2,
        text: "A fly flew by.",
        featuredWords: ["fly", "flew"],
        emoji: "🪰",
        bgColor: "bg-green-100",
      },
      {
        pageNumber: 3,
        text: "Frog flips at the fly.",
        featuredWords: ["frog", "flips", "fly"],
        emoji: "🐸",
        bgColor: "bg-green-50",
      },
      {
        pageNumber: 4,
        text: "The fly is too fast for Frog!",
        featuredWords: ["fly", "fast", "frog"],
        emoji: "💨",
        bgColor: "bg-green-100",
      },
    ],
  },
  {
    id: "brad-and-the-bricks",
    title: "Brad and the Bricks",
    phonicsUnit: "blend-br-bl",
    targetSounds: ["br", "bl"],
    description: "Brad builds with bricks.",
    coverEmoji: "🧱",
    difficulty: 3,
    theme: { primary: "#ef4444", secondary: "#fecaca" },
    pages: [
      {
        pageNumber: 1,
        text: "Brad has bricks.",
        featuredWords: ["brad", "bricks"],
        emoji: "🧱",
        bgColor: "bg-red-50",
      },
      {
        pageNumber: 2,
        text: "Brad built a block.",
        featuredWords: ["brad", "built", "block"],
        emoji: "🏗️",
        bgColor: "bg-red-100",
      },
      {
        pageNumber: 3,
        text: "The blocks are blue and brown.",
        featuredWords: ["blocks", "blue", "brown"],
        emoji: "🟦",
        bgColor: "bg-red-50",
      },
      {
        pageNumber: 4,
        text: "Brad is a bright builder!",
        featuredWords: ["brad", "bright", "builder"],
        emoji: "⭐",
        bgColor: "bg-red-100",
      },
    ],
  },
  {
    id: "stan-can-spin",
    title: "Stan Can Spin",
    phonicsUnit: "blend-st-sp",
    targetSounds: ["st", "sp"],
    description: "Stan loves to spin and stop.",
    coverEmoji: "🌀",
    difficulty: 3,
    theme: { primary: "#6366f1", secondary: "#c7d2fe" },
    pages: [
      {
        pageNumber: 1,
        text: "Stan can stand.",
        featuredWords: ["stan", "stand"],
        emoji: "🧍",
        bgColor: "bg-indigo-50",
      },
      {
        pageNumber: 2,
        text: "Stan can spin!",
        featuredWords: ["stan", "spin"],
        emoji: "🌀",
        bgColor: "bg-indigo-100",
      },
      {
        pageNumber: 3,
        text: "Spin, spin, spot the star!",
        featuredWords: ["spin", "spot", "star"],
        emoji: "⭐",
        bgColor: "bg-indigo-50",
      },
      {
        pageNumber: 4,
        text: "Stan stops. Stan is still.",
        featuredWords: ["stan", "stops", "still"],
        emoji: "😊",
        bgColor: "bg-indigo-100",
      },
    ],
  },
];

// Get stories by phonics unit
export function getStoriesByUnit(unit: PhonicsUnit): DecodableStory[] {
  return DECODABLE_STORIES.filter((story) => story.phonicsUnit === unit);
}

// Get stories by difficulty
export function getStoriesByDifficulty(difficulty: 1 | 2 | 3): DecodableStory[] {
  return DECODABLE_STORIES.filter((story) => story.difficulty === difficulty);
}

// Get story by ID
export function getDecodableStoryById(id: string): DecodableStory | undefined {
  return DECODABLE_STORIES.find((story) => story.id === id);
}

// Get all target sounds for practice
export function getAllTargetSounds(): string[] {
  const sounds = new Set<string>();
  DECODABLE_STORIES.forEach((story) => {
    story.targetSounds.forEach((sound) => sounds.add(sound));
  });
  return Array.from(sounds);
}

// Get word list from a story
export function getStoryWordList(storyId: string): string[] {
  const story = getDecodableStoryById(storyId);
  if (!story) return [];

  const words = new Set<string>();
  story.pages.forEach((page) => {
    page.featuredWords.forEach((word) => words.add(word));
  });
  return Array.from(words);
}
