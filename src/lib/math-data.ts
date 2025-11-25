/**
 * Math Learning Data
 *
 * Comprehensive math content for toddlers and early learners.
 * Covers numbers 0-20, counting, addition, and subtraction.
 */

// ============================================
// EMOJI THEMES FOR VISUAL LEARNING
// ============================================

export const MATH_EMOJI_THEMES = {
  fruits: ['🍎', '🍊', '🍋', '🍇', '🍓'],
  animals: ['🐶', '🐱', '🐰', '🐻', '🦊'],
  stars: ['⭐', '🌟', '✨', '💫', '⚡'],
  shapes: ['🔴', '🟠', '🟡', '🟢', '🔵'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹'],
} as const;

export type EmojiTheme = keyof typeof MATH_EMOJI_THEMES;

/**
 * Get a random emoji from a theme
 */
export function getRandomEmoji(theme: EmojiTheme): string {
  const emojis = MATH_EMOJI_THEMES[theme];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Get a consistent emoji for a problem (seeded by problem ID)
 */
export function getEmojiForProblem(problemId: string, theme?: EmojiTheme): string {
  // Simple hash from problem ID
  let hash = 0;
  for (let i = 0; i < problemId.length; i++) {
    hash = ((hash << 5) - hash) + problemId.charCodeAt(i);
    hash = hash & hash;
  }

  // Pick theme based on hash if not specified
  const themes = Object.keys(MATH_EMOJI_THEMES) as EmojiTheme[];
  const selectedTheme = theme || themes[Math.abs(hash) % themes.length];

  // Pick emoji from theme
  const emojis = MATH_EMOJI_THEMES[selectedTheme];
  return emojis[Math.abs(hash) % emojis.length];
}

// ============================================
// TYPES
// ============================================

export type MathDifficulty = 1 | 2 | 3 | 4 | 5;

export type OperationType = "addition" | "subtraction" | "mixed";

export interface NumberItem {
  id: string;
  number: number;
  word: string;
  color: string;
  image?: string;
  fingers?: string; // Finger representation
  dots?: number; // Dot pattern
}

export interface MathProblem {
  id: string;
  type: OperationType;
  operands: number[];
  operator: "+" | "-";
  answer: number;
  difficulty: MathDifficulty;
  hint?: string;
  visualHint?: "fingers" | "objects" | "numberline";
}

export interface MathLesson {
  id: string;
  title: string;
  description: string;
  type: "counting" | "number-recognition" | "addition" | "subtraction" | "mixed";
  difficulty: MathDifficulty;
  problems: MathProblem[];
  objectives: string[];
  estimatedMinutes: number;
}

export interface MathUnit {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: MathLesson[];
  prerequisites?: string[];
  order: number;
}

// ============================================
// NUMBER DATA (0-20)
// ============================================

export const NUMBERS: NumberItem[] = [
  { id: "num-0", number: 0, word: "zero", color: "bg-gray-400", dots: 0 },
  { id: "num-1", number: 1, word: "one", color: "bg-red-500", fingers: "☝️", dots: 1 },
  { id: "num-2", number: 2, word: "two", color: "bg-orange-500", fingers: "✌️", dots: 2 },
  { id: "num-3", number: 3, word: "three", color: "bg-yellow-500", fingers: "🤟", dots: 3 },
  { id: "num-4", number: 4, word: "four", color: "bg-green-500", fingers: "🖖", dots: 4 },
  { id: "num-5", number: 5, word: "five", color: "bg-teal-500", fingers: "🖐️", dots: 5 },
  { id: "num-6", number: 6, word: "six", color: "bg-blue-500", dots: 6 },
  { id: "num-7", number: 7, word: "seven", color: "bg-indigo-500", dots: 7 },
  { id: "num-8", number: 8, word: "eight", color: "bg-purple-500", dots: 8 },
  { id: "num-9", number: 9, word: "nine", color: "bg-pink-500", dots: 9 },
  { id: "num-10", number: 10, word: "ten", color: "bg-red-600", fingers: "🖐️🖐️", dots: 10 },
  { id: "num-11", number: 11, word: "eleven", color: "bg-orange-600", dots: 11 },
  { id: "num-12", number: 12, word: "twelve", color: "bg-yellow-600", dots: 12 },
  { id: "num-13", number: 13, word: "thirteen", color: "bg-green-600", dots: 13 },
  { id: "num-14", number: 14, word: "fourteen", color: "bg-teal-600", dots: 14 },
  { id: "num-15", number: 15, word: "fifteen", color: "bg-blue-600", dots: 15 },
  { id: "num-16", number: 16, word: "sixteen", color: "bg-indigo-600", dots: 16 },
  { id: "num-17", number: 17, word: "seventeen", color: "bg-purple-600", dots: 17 },
  { id: "num-18", number: 18, word: "eighteen", color: "bg-pink-600", dots: 18 },
  { id: "num-19", number: 19, word: "nineteen", color: "bg-red-700", dots: 19 },
  { id: "num-20", number: 20, word: "twenty", color: "bg-orange-700", dots: 20 },
];

// ============================================
// PROBLEM GENERATORS
// ============================================

function generateAdditionProblems(
  maxSum: number,
  count: number,
  difficulty: MathDifficulty,
  allowThreeNumbers: boolean = false
): MathProblem[] {
  const problems: MathProblem[] = [];
  const usedCombos = new Set<string>();

  while (problems.length < count) {
    let operands: number[];
    let answer: number;

    if (allowThreeNumbers && Math.random() > 0.5) {
      // Three number addition
      const a = Math.floor(Math.random() * Math.min(maxSum / 3, 10));
      const b = Math.floor(Math.random() * Math.min(maxSum / 3, 10));
      const maxC = maxSum - a - b;
      const c = Math.floor(Math.random() * Math.max(1, maxC));
      operands = [a, b, c];
      answer = a + b + c;
    } else {
      // Two number addition
      const a = Math.floor(Math.random() * maxSum);
      const maxB = maxSum - a;
      const b = Math.floor(Math.random() * (maxB + 1));
      operands = [a, b];
      answer = a + b;
    }

    const combo = operands.sort((x, y) => x - y).join("+");
    if (!usedCombos.has(combo) && answer <= maxSum) {
      usedCombos.add(combo);
      problems.push({
        id: `add-${difficulty}-${problems.length}`,
        type: "addition",
        operands,
        operator: "+",
        answer,
        difficulty,
        visualHint: answer <= 10 ? "fingers" : "objects",
      });
    }
  }

  return problems;
}

function generateSubtractionProblems(
  maxNumber: number,
  count: number,
  difficulty: MathDifficulty,
  allowThreeNumbers: boolean = false
): MathProblem[] {
  const problems: MathProblem[] = [];
  const usedCombos = new Set<string>();

  while (problems.length < count) {
    let operands: number[];
    let answer: number;

    if (allowThreeNumbers && Math.random() > 0.5) {
      // Three number subtraction (always positive result)
      const total = Math.floor(Math.random() * maxNumber) + 3;
      const a = Math.floor(Math.random() * (total - 2)) + 1;
      const b = Math.floor(Math.random() * (total - a - 1)) + 1;
      answer = total - a - b;
      if (answer < 0) continue;
      operands = [total, a, b];
    } else {
      // Two number subtraction
      const a = Math.floor(Math.random() * maxNumber) + 1;
      const b = Math.floor(Math.random() * a);
      operands = [a, b];
      answer = a - b;
    }

    const combo = operands.join("-");
    if (!usedCombos.has(combo) && answer >= 0) {
      usedCombos.add(combo);
      problems.push({
        id: `sub-${difficulty}-${problems.length}`,
        type: "subtraction",
        operands,
        operator: "-",
        answer,
        difficulty,
        visualHint: operands[0] <= 10 ? "fingers" : "objects",
      });
    }
  }

  return problems;
}

// ============================================
// MATH UNITS & LESSONS
// ============================================

export const MATH_UNITS: MathUnit[] = [
  // ============================================
  // UNIT 1: Numbers 1-5
  // ============================================
  {
    id: "unit-numbers-1-5",
    title: "Numbers 1-5",
    description: "Learn to recognize and count numbers 1 through 5",
    color: "bg-green-500",
    icon: "🔢",
    order: 1,
    lessons: [
      {
        id: "lesson-count-1-5",
        title: "Counting 1 to 5",
        description: "Learn to count objects from 1 to 5",
        type: "counting",
        difficulty: 1,
        objectives: ["Count objects up to 5", "Recognize numbers 1-5"],
        estimatedMinutes: 5,
        problems: [
          { id: "count-1", type: "addition", operands: [1], operator: "+", answer: 1, difficulty: 1, hint: "Count: one!" },
          { id: "count-2", type: "addition", operands: [2], operator: "+", answer: 2, difficulty: 1, hint: "Count: one, two!" },
          { id: "count-3", type: "addition", operands: [3], operator: "+", answer: 3, difficulty: 1, hint: "Count: one, two, three!" },
          { id: "count-4", type: "addition", operands: [4], operator: "+", answer: 4, difficulty: 1, hint: "Count: one, two, three, four!" },
          { id: "count-5", type: "addition", operands: [5], operator: "+", answer: 5, difficulty: 1, hint: "Count: one, two, three, four, five!" },
        ],
      },
      {
        id: "lesson-add-to-5",
        title: "Adding to 5",
        description: "Simple addition with sums up to 5",
        type: "addition",
        difficulty: 1,
        objectives: ["Add two numbers with sum up to 5", "Use fingers to count"],
        estimatedMinutes: 5,
        problems: [
          { id: "add5-1", type: "addition", operands: [1, 1], operator: "+", answer: 2, difficulty: 1, visualHint: "fingers" },
          { id: "add5-2", type: "addition", operands: [1, 2], operator: "+", answer: 3, difficulty: 1, visualHint: "fingers" },
          { id: "add5-3", type: "addition", operands: [2, 2], operator: "+", answer: 4, difficulty: 1, visualHint: "fingers" },
          { id: "add5-4", type: "addition", operands: [2, 3], operator: "+", answer: 5, difficulty: 1, visualHint: "fingers" },
          { id: "add5-5", type: "addition", operands: [1, 4], operator: "+", answer: 5, difficulty: 1, visualHint: "fingers" },
          { id: "add5-6", type: "addition", operands: [3, 1], operator: "+", answer: 4, difficulty: 1, visualHint: "fingers" },
          { id: "add5-7", type: "addition", operands: [0, 5], operator: "+", answer: 5, difficulty: 1, visualHint: "fingers" },
          { id: "add5-8", type: "addition", operands: [4, 1], operator: "+", answer: 5, difficulty: 1, visualHint: "fingers" },
        ],
      },
      {
        id: "lesson-sub-from-5",
        title: "Subtracting from 5",
        description: "Simple subtraction starting from numbers up to 5",
        type: "subtraction",
        difficulty: 1,
        objectives: ["Subtract from numbers up to 5", "Understand taking away"],
        estimatedMinutes: 5,
        problems: [
          { id: "sub5-1", type: "subtraction", operands: [2, 1], operator: "-", answer: 1, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-2", type: "subtraction", operands: [3, 1], operator: "-", answer: 2, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-3", type: "subtraction", operands: [3, 2], operator: "-", answer: 1, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-4", type: "subtraction", operands: [4, 1], operator: "-", answer: 3, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-5", type: "subtraction", operands: [4, 2], operator: "-", answer: 2, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-6", type: "subtraction", operands: [5, 1], operator: "-", answer: 4, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-7", type: "subtraction", operands: [5, 2], operator: "-", answer: 3, difficulty: 1, visualHint: "fingers" },
          { id: "sub5-8", type: "subtraction", operands: [5, 3], operator: "-", answer: 2, difficulty: 1, visualHint: "fingers" },
        ],
      },
    ],
  },

  // ============================================
  // UNIT 2: Numbers 6-10
  // ============================================
  {
    id: "unit-numbers-6-10",
    title: "Numbers 6-10",
    description: "Learn numbers 6 through 10 and practice addition/subtraction",
    color: "bg-blue-500",
    icon: "🔟",
    order: 2,
    prerequisites: ["unit-numbers-1-5"],
    lessons: [
      {
        id: "lesson-count-6-10",
        title: "Counting 6 to 10",
        description: "Learn to count objects from 6 to 10",
        type: "counting",
        difficulty: 2,
        objectives: ["Count objects up to 10", "Recognize numbers 6-10"],
        estimatedMinutes: 5,
        problems: [
          { id: "count-6", type: "addition", operands: [6], operator: "+", answer: 6, difficulty: 2, hint: "Count to six!" },
          { id: "count-7", type: "addition", operands: [7], operator: "+", answer: 7, difficulty: 2, hint: "Count to seven!" },
          { id: "count-8", type: "addition", operands: [8], operator: "+", answer: 8, difficulty: 2, hint: "Count to eight!" },
          { id: "count-9", type: "addition", operands: [9], operator: "+", answer: 9, difficulty: 2, hint: "Count to nine!" },
          { id: "count-10", type: "addition", operands: [10], operator: "+", answer: 10, difficulty: 2, hint: "Count to ten!" },
        ],
      },
      {
        id: "lesson-add-to-10",
        title: "Adding to 10",
        description: "Addition with sums up to 10",
        type: "addition",
        difficulty: 2,
        objectives: ["Add two numbers with sum up to 10", "Use two hands to count"],
        estimatedMinutes: 6,
        problems: [
          { id: "add10-1", type: "addition", operands: [3, 3], operator: "+", answer: 6, difficulty: 2, visualHint: "fingers" },
          { id: "add10-2", type: "addition", operands: [4, 3], operator: "+", answer: 7, difficulty: 2, visualHint: "fingers" },
          { id: "add10-3", type: "addition", operands: [4, 4], operator: "+", answer: 8, difficulty: 2, visualHint: "fingers" },
          { id: "add10-4", type: "addition", operands: [5, 4], operator: "+", answer: 9, difficulty: 2, visualHint: "fingers" },
          { id: "add10-5", type: "addition", operands: [5, 5], operator: "+", answer: 10, difficulty: 2, visualHint: "fingers" },
          { id: "add10-6", type: "addition", operands: [6, 4], operator: "+", answer: 10, difficulty: 2, visualHint: "fingers" },
          { id: "add10-7", type: "addition", operands: [7, 3], operator: "+", answer: 10, difficulty: 2, visualHint: "fingers" },
          { id: "add10-8", type: "addition", operands: [8, 2], operator: "+", answer: 10, difficulty: 2, visualHint: "fingers" },
          { id: "add10-9", type: "addition", operands: [6, 3], operator: "+", answer: 9, difficulty: 2, visualHint: "fingers" },
          { id: "add10-10", type: "addition", operands: [7, 2], operator: "+", answer: 9, difficulty: 2, visualHint: "fingers" },
        ],
      },
      {
        id: "lesson-sub-from-10",
        title: "Subtracting from 10",
        description: "Subtraction starting from numbers up to 10",
        type: "subtraction",
        difficulty: 2,
        objectives: ["Subtract from numbers up to 10", "Count backwards"],
        estimatedMinutes: 6,
        problems: [
          { id: "sub10-1", type: "subtraction", operands: [6, 2], operator: "-", answer: 4, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-2", type: "subtraction", operands: [7, 3], operator: "-", answer: 4, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-3", type: "subtraction", operands: [8, 4], operator: "-", answer: 4, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-4", type: "subtraction", operands: [9, 5], operator: "-", answer: 4, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-5", type: "subtraction", operands: [10, 5], operator: "-", answer: 5, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-6", type: "subtraction", operands: [10, 3], operator: "-", answer: 7, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-7", type: "subtraction", operands: [8, 2], operator: "-", answer: 6, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-8", type: "subtraction", operands: [9, 4], operator: "-", answer: 5, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-9", type: "subtraction", operands: [7, 4], operator: "-", answer: 3, difficulty: 2, visualHint: "fingers" },
          { id: "sub10-10", type: "subtraction", operands: [10, 7], operator: "-", answer: 3, difficulty: 2, visualHint: "fingers" },
        ],
      },
    ],
  },

  // ============================================
  // UNIT 3: Three Number Addition
  // ============================================
  {
    id: "unit-three-number-add",
    title: "Adding Three Numbers",
    description: "Learn to add three numbers together",
    color: "bg-purple-500",
    icon: "➕",
    order: 3,
    prerequisites: ["unit-numbers-6-10"],
    lessons: [
      {
        id: "lesson-three-add-easy",
        title: "Adding Three Small Numbers",
        description: "Add three numbers with sum up to 10",
        type: "addition",
        difficulty: 2,
        objectives: ["Add three numbers together", "Group numbers to make adding easier"],
        estimatedMinutes: 6,
        problems: [
          { id: "3add-1", type: "addition", operands: [1, 1, 1], operator: "+", answer: 3, difficulty: 2, hint: "1 + 1 = 2, then 2 + 1 = 3" },
          { id: "3add-2", type: "addition", operands: [1, 2, 1], operator: "+", answer: 4, difficulty: 2, hint: "1 + 2 = 3, then 3 + 1 = 4" },
          { id: "3add-3", type: "addition", operands: [2, 2, 1], operator: "+", answer: 5, difficulty: 2, hint: "2 + 2 = 4, then 4 + 1 = 5" },
          { id: "3add-4", type: "addition", operands: [2, 2, 2], operator: "+", answer: 6, difficulty: 2, hint: "2 + 2 = 4, then 4 + 2 = 6" },
          { id: "3add-5", type: "addition", operands: [1, 3, 2], operator: "+", answer: 6, difficulty: 2, hint: "1 + 3 = 4, then 4 + 2 = 6" },
          { id: "3add-6", type: "addition", operands: [2, 3, 2], operator: "+", answer: 7, difficulty: 2, hint: "2 + 3 = 5, then 5 + 2 = 7" },
          { id: "3add-7", type: "addition", operands: [3, 3, 2], operator: "+", answer: 8, difficulty: 2, hint: "3 + 3 = 6, then 6 + 2 = 8" },
          { id: "3add-8", type: "addition", operands: [2, 4, 3], operator: "+", answer: 9, difficulty: 2, hint: "2 + 4 = 6, then 6 + 3 = 9" },
          { id: "3add-9", type: "addition", operands: [3, 3, 4], operator: "+", answer: 10, difficulty: 2, hint: "3 + 3 = 6, then 6 + 4 = 10" },
          { id: "3add-10", type: "addition", operands: [2, 5, 3], operator: "+", answer: 10, difficulty: 2, hint: "2 + 5 = 7, then 7 + 3 = 10" },
        ],
      },
      {
        id: "lesson-three-add-medium",
        title: "Three Numbers to 15",
        description: "Add three numbers with sum up to 15",
        type: "addition",
        difficulty: 3,
        objectives: ["Add three numbers with larger sums", "Use mental math strategies"],
        estimatedMinutes: 7,
        problems: [
          { id: "3addm-1", type: "addition", operands: [3, 4, 4], operator: "+", answer: 11, difficulty: 3 },
          { id: "3addm-2", type: "addition", operands: [4, 4, 4], operator: "+", answer: 12, difficulty: 3 },
          { id: "3addm-3", type: "addition", operands: [3, 5, 4], operator: "+", answer: 12, difficulty: 3 },
          { id: "3addm-4", type: "addition", operands: [4, 5, 4], operator: "+", answer: 13, difficulty: 3 },
          { id: "3addm-5", type: "addition", operands: [5, 5, 3], operator: "+", answer: 13, difficulty: 3 },
          { id: "3addm-6", type: "addition", operands: [4, 5, 5], operator: "+", answer: 14, difficulty: 3 },
          { id: "3addm-7", type: "addition", operands: [5, 5, 4], operator: "+", answer: 14, difficulty: 3 },
          { id: "3addm-8", type: "addition", operands: [5, 5, 5], operator: "+", answer: 15, difficulty: 3 },
          { id: "3addm-9", type: "addition", operands: [6, 4, 5], operator: "+", answer: 15, difficulty: 3 },
          { id: "3addm-10", type: "addition", operands: [3, 6, 6], operator: "+", answer: 15, difficulty: 3 },
        ],
      },
    ],
  },

  // ============================================
  // UNIT 4: Three Number Subtraction
  // ============================================
  {
    id: "unit-three-number-sub",
    title: "Subtracting Multiple Numbers",
    description: "Learn to subtract two numbers from a starting number",
    color: "bg-orange-500",
    icon: "➖",
    order: 4,
    prerequisites: ["unit-numbers-6-10"],
    lessons: [
      {
        id: "lesson-three-sub-easy",
        title: "Subtracting Twice",
        description: "Subtract two small numbers from a starting number",
        type: "subtraction",
        difficulty: 3,
        objectives: ["Subtract twice in a row", "Keep track of the running total"],
        estimatedMinutes: 7,
        problems: [
          { id: "3sub-1", type: "subtraction", operands: [5, 1, 1], operator: "-", answer: 3, difficulty: 3, hint: "5 - 1 = 4, then 4 - 1 = 3" },
          { id: "3sub-2", type: "subtraction", operands: [6, 2, 1], operator: "-", answer: 3, difficulty: 3, hint: "6 - 2 = 4, then 4 - 1 = 3" },
          { id: "3sub-3", type: "subtraction", operands: [7, 2, 2], operator: "-", answer: 3, difficulty: 3, hint: "7 - 2 = 5, then 5 - 2 = 3" },
          { id: "3sub-4", type: "subtraction", operands: [8, 3, 2], operator: "-", answer: 3, difficulty: 3, hint: "8 - 3 = 5, then 5 - 2 = 3" },
          { id: "3sub-5", type: "subtraction", operands: [9, 4, 2], operator: "-", answer: 3, difficulty: 3, hint: "9 - 4 = 5, then 5 - 2 = 3" },
          { id: "3sub-6", type: "subtraction", operands: [10, 3, 3], operator: "-", answer: 4, difficulty: 3, hint: "10 - 3 = 7, then 7 - 3 = 4" },
          { id: "3sub-7", type: "subtraction", operands: [10, 4, 2], operator: "-", answer: 4, difficulty: 3, hint: "10 - 4 = 6, then 6 - 2 = 4" },
          { id: "3sub-8", type: "subtraction", operands: [10, 5, 3], operator: "-", answer: 2, difficulty: 3, hint: "10 - 5 = 5, then 5 - 3 = 2" },
          { id: "3sub-9", type: "subtraction", operands: [9, 3, 4], operator: "-", answer: 2, difficulty: 3, hint: "9 - 3 = 6, then 6 - 4 = 2" },
          { id: "3sub-10", type: "subtraction", operands: [8, 2, 4], operator: "-", answer: 2, difficulty: 3, hint: "8 - 2 = 6, then 6 - 4 = 2" },
        ],
      },
      {
        id: "lesson-three-sub-larger",
        title: "Larger Subtractions",
        description: "Subtract from numbers up to 15",
        type: "subtraction",
        difficulty: 3,
        objectives: ["Handle larger starting numbers", "Practice mental subtraction"],
        estimatedMinutes: 7,
        problems: [
          { id: "3subl-1", type: "subtraction", operands: [12, 3, 4], operator: "-", answer: 5, difficulty: 3 },
          { id: "3subl-2", type: "subtraction", operands: [13, 4, 3], operator: "-", answer: 6, difficulty: 3 },
          { id: "3subl-3", type: "subtraction", operands: [14, 5, 4], operator: "-", answer: 5, difficulty: 3 },
          { id: "3subl-4", type: "subtraction", operands: [15, 5, 5], operator: "-", answer: 5, difficulty: 3 },
          { id: "3subl-5", type: "subtraction", operands: [15, 6, 4], operator: "-", answer: 5, difficulty: 3 },
          { id: "3subl-6", type: "subtraction", operands: [14, 4, 6], operator: "-", answer: 4, difficulty: 3 },
          { id: "3subl-7", type: "subtraction", operands: [13, 3, 6], operator: "-", answer: 4, difficulty: 3 },
          { id: "3subl-8", type: "subtraction", operands: [15, 7, 3], operator: "-", answer: 5, difficulty: 3 },
          { id: "3subl-9", type: "subtraction", operands: [12, 4, 5], operator: "-", answer: 3, difficulty: 3 },
          { id: "3subl-10", type: "subtraction", operands: [11, 3, 5], operator: "-", answer: 3, difficulty: 3 },
        ],
      },
    ],
  },

  // ============================================
  // UNIT 5: Numbers 11-20
  // ============================================
  {
    id: "unit-numbers-11-20",
    title: "Numbers 11-20",
    description: "Master teen numbers with addition and subtraction",
    color: "bg-pink-500",
    icon: "🔢",
    order: 5,
    prerequisites: ["unit-three-number-add", "unit-three-number-sub"],
    lessons: [
      {
        id: "lesson-count-11-20",
        title: "Counting 11 to 20",
        description: "Learn the teen numbers",
        type: "counting",
        difficulty: 3,
        objectives: ["Count to 20", "Recognize teen numbers"],
        estimatedMinutes: 5,
        problems: [
          { id: "count-11", type: "addition", operands: [11], operator: "+", answer: 11, difficulty: 3 },
          { id: "count-12", type: "addition", operands: [12], operator: "+", answer: 12, difficulty: 3 },
          { id: "count-13", type: "addition", operands: [13], operator: "+", answer: 13, difficulty: 3 },
          { id: "count-14", type: "addition", operands: [14], operator: "+", answer: 14, difficulty: 3 },
          { id: "count-15", type: "addition", operands: [15], operator: "+", answer: 15, difficulty: 3 },
          { id: "count-16", type: "addition", operands: [16], operator: "+", answer: 16, difficulty: 3 },
          { id: "count-17", type: "addition", operands: [17], operator: "+", answer: 17, difficulty: 3 },
          { id: "count-18", type: "addition", operands: [18], operator: "+", answer: 18, difficulty: 3 },
          { id: "count-19", type: "addition", operands: [19], operator: "+", answer: 19, difficulty: 3 },
          { id: "count-20", type: "addition", operands: [20], operator: "+", answer: 20, difficulty: 3 },
        ],
      },
      {
        id: "lesson-add-to-20",
        title: "Adding to 20",
        description: "Addition with sums up to 20",
        type: "addition",
        difficulty: 3,
        objectives: ["Add numbers with sums to 20", "Bridge through 10"],
        estimatedMinutes: 8,
        problems: [
          { id: "add20-1", type: "addition", operands: [7, 5], operator: "+", answer: 12, difficulty: 3 },
          { id: "add20-2", type: "addition", operands: [8, 5], operator: "+", answer: 13, difficulty: 3 },
          { id: "add20-3", type: "addition", operands: [9, 5], operator: "+", answer: 14, difficulty: 3 },
          { id: "add20-4", type: "addition", operands: [8, 7], operator: "+", answer: 15, difficulty: 3 },
          { id: "add20-5", type: "addition", operands: [9, 7], operator: "+", answer: 16, difficulty: 3 },
          { id: "add20-6", type: "addition", operands: [9, 8], operator: "+", answer: 17, difficulty: 3 },
          { id: "add20-7", type: "addition", operands: [9, 9], operator: "+", answer: 18, difficulty: 3 },
          { id: "add20-8", type: "addition", operands: [10, 9], operator: "+", answer: 19, difficulty: 3 },
          { id: "add20-9", type: "addition", operands: [10, 10], operator: "+", answer: 20, difficulty: 3 },
          { id: "add20-10", type: "addition", operands: [12, 8], operator: "+", answer: 20, difficulty: 3 },
        ],
      },
      {
        id: "lesson-sub-from-20",
        title: "Subtracting from Teen Numbers",
        description: "Subtract from numbers 11-20",
        type: "subtraction",
        difficulty: 3,
        objectives: ["Subtract from teen numbers", "Cross back through 10"],
        estimatedMinutes: 8,
        problems: [
          { id: "sub20-1", type: "subtraction", operands: [12, 5], operator: "-", answer: 7, difficulty: 3 },
          { id: "sub20-2", type: "subtraction", operands: [13, 6], operator: "-", answer: 7, difficulty: 3 },
          { id: "sub20-3", type: "subtraction", operands: [14, 7], operator: "-", answer: 7, difficulty: 3 },
          { id: "sub20-4", type: "subtraction", operands: [15, 8], operator: "-", answer: 7, difficulty: 3 },
          { id: "sub20-5", type: "subtraction", operands: [16, 9], operator: "-", answer: 7, difficulty: 3 },
          { id: "sub20-6", type: "subtraction", operands: [17, 8], operator: "-", answer: 9, difficulty: 3 },
          { id: "sub20-7", type: "subtraction", operands: [18, 9], operator: "-", answer: 9, difficulty: 3 },
          { id: "sub20-8", type: "subtraction", operands: [19, 10], operator: "-", answer: 9, difficulty: 3 },
          { id: "sub20-9", type: "subtraction", operands: [20, 8], operator: "-", answer: 12, difficulty: 3 },
          { id: "sub20-10", type: "subtraction", operands: [20, 12], operator: "-", answer: 8, difficulty: 3 },
        ],
      },
    ],
  },

  // ============================================
  // UNIT 6: Mixed Practice
  // ============================================
  {
    id: "unit-mixed-practice",
    title: "Mixed Practice",
    description: "Practice both addition and subtraction together",
    color: "bg-indigo-500",
    icon: "🎯",
    order: 6,
    prerequisites: ["unit-numbers-11-20"],
    lessons: [
      {
        id: "lesson-mixed-easy",
        title: "Mixed Problems: Easy",
        description: "Addition and subtraction mixed together",
        type: "mixed",
        difficulty: 2,
        objectives: ["Switch between addition and subtraction", "Read the operator carefully"],
        estimatedMinutes: 6,
        problems: [
          { id: "mix-1", type: "addition", operands: [3, 4], operator: "+", answer: 7, difficulty: 2 },
          { id: "mix-2", type: "subtraction", operands: [8, 3], operator: "-", answer: 5, difficulty: 2 },
          { id: "mix-3", type: "addition", operands: [5, 4], operator: "+", answer: 9, difficulty: 2 },
          { id: "mix-4", type: "subtraction", operands: [10, 4], operator: "-", answer: 6, difficulty: 2 },
          { id: "mix-5", type: "addition", operands: [6, 3], operator: "+", answer: 9, difficulty: 2 },
          { id: "mix-6", type: "subtraction", operands: [9, 5], operator: "-", answer: 4, difficulty: 2 },
          { id: "mix-7", type: "addition", operands: [4, 5], operator: "+", answer: 9, difficulty: 2 },
          { id: "mix-8", type: "subtraction", operands: [7, 4], operator: "-", answer: 3, difficulty: 2 },
          { id: "mix-9", type: "addition", operands: [5, 5], operator: "+", answer: 10, difficulty: 2 },
          { id: "mix-10", type: "subtraction", operands: [10, 6], operator: "-", answer: 4, difficulty: 2 },
        ],
      },
      {
        id: "lesson-mixed-hard",
        title: "Mixed Problems: Challenge",
        description: "Harder mixed problems including three numbers",
        type: "mixed",
        difficulty: 4,
        objectives: ["Handle complex mixed operations", "Master math fundamentals"],
        estimatedMinutes: 8,
        problems: [
          { id: "mixh-1", type: "addition", operands: [7, 8], operator: "+", answer: 15, difficulty: 4 },
          { id: "mixh-2", type: "subtraction", operands: [16, 9], operator: "-", answer: 7, difficulty: 4 },
          { id: "mixh-3", type: "addition", operands: [4, 5, 6], operator: "+", answer: 15, difficulty: 4 },
          { id: "mixh-4", type: "subtraction", operands: [15, 6, 4], operator: "-", answer: 5, difficulty: 4 },
          { id: "mixh-5", type: "addition", operands: [9, 9], operator: "+", answer: 18, difficulty: 4 },
          { id: "mixh-6", type: "subtraction", operands: [18, 9], operator: "-", answer: 9, difficulty: 4 },
          { id: "mixh-7", type: "addition", operands: [5, 7, 3], operator: "+", answer: 15, difficulty: 4 },
          { id: "mixh-8", type: "subtraction", operands: [20, 8, 5], operator: "-", answer: 7, difficulty: 4 },
          { id: "mixh-9", type: "addition", operands: [10, 10], operator: "+", answer: 20, difficulty: 4 },
          { id: "mixh-10", type: "subtraction", operands: [20, 10], operator: "-", answer: 10, difficulty: 4 },
        ],
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all math units
 */
export function getMathUnits(): MathUnit[] {
  return MATH_UNITS.sort((a, b) => a.order - b.order);
}

/**
 * Get unit by ID
 */
export function getMathUnitById(id: string): MathUnit | undefined {
  return MATH_UNITS.find((u) => u.id === id);
}

/**
 * Get lesson by ID
 */
export function getMathLessonById(lessonId: string): MathLesson | undefined {
  for (const unit of MATH_UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

/**
 * Get number data by value
 */
export function getNumberData(num: number): NumberItem | undefined {
  return NUMBERS.find((n) => n.number === num);
}

/**
 * Format a math problem as a string
 */
export function formatProblem(problem: MathProblem): string {
  if (problem.operands.length === 1) {
    return `${problem.operands[0]}`;
  }
  return problem.operands.join(` ${problem.operator} `);
}

/**
 * Check if answer is correct
 */
export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
  return userAnswer === problem.answer;
}

/**
 * Get unlocked units based on completed units
 */
export function getUnlockedMathUnits(completedUnitIds: string[]): MathUnit[] {
  return MATH_UNITS.filter((unit) => {
    if (!unit.prerequisites || unit.prerequisites.length === 0) {
      return true;
    }
    return unit.prerequisites.every((prereq) => completedUnitIds.includes(prereq));
  });
}

/**
 * Get total problem count across all lessons
 */
export function getTotalMathProblems(): number {
  return MATH_UNITS.reduce((total, unit) => {
    return total + unit.lessons.reduce((lessonTotal, lesson) => {
      return lessonTotal + lesson.problems.length;
    }, 0);
  }, 0);
}
