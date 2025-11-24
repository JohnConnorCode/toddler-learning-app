/**
 * Systematic Phonics Data Structure
 *
 * Based on synthetic phonics research, letters are introduced in a specific order
 * that allows children to blend and read words as early as possible.
 *
 * Teaching sequence: s,a,t,p,i,n,m,d,g,o,c,k,e,r,h,b,f,l,u,w,j,v,x,y,z,q
 *
 * This order:
 * - Teaches most common letters first
 * - Allows early word building (sat, pat, tap after just 4 letters!)
 * - Separates visually similar letters (b/d, p/q)
 * - Includes at least one vowel early
 */

import { PhonicsItem, PHONICS_DATA } from "./phonics-data";

export interface PhonicsUnit {
  id: number;
  title: string;
  description: string;
  letters: string[]; // Letter IDs in teaching order
  blendableWords: string[]; // CVC words that can be made with taught letters
  trickWords?: string[]; // High-frequency words to memorize
  prerequisites: number[]; // IDs of units that must be completed first
  color: string; // Tailwind gradient class
}

export interface LetterProgress {
  letterId: string;
  practiced: boolean;
  mastered: boolean; // 80%+ accuracy on mastery check
  lastPracticed?: string;
  accuracy?: number;
}

export interface UnitProgress {
  unitId: number;
  unlocked: boolean;
  completed: boolean;
  lettersCompleted: number;
  totalLetters: number;
  masteryScore?: number;
  startedAt?: string;
  completedAt?: string;
}

// Phonics-first letter teaching order
const TEACHING_ORDER = [
  "S", "A", "T", "P",  // Unit 1
  "I", "N", "M", "D",  // Unit 2
  "G", "O", "C", "K",  // Unit 3
  "E", "R", "H", "B",  // Unit 4
  "F", "L", "U", "W",  // Unit 5
  "J", "V", "X", "Y", "Z", "Q"  // Unit 6
];

export const PHONICS_UNITS: PhonicsUnit[] = [
  {
    id: 1,
    title: "First Letters",
    description: "Learn your first 4 letters and start reading words!",
    letters: ["S", "A", "T", "P"],
    blendableWords: [
      "sat", "pat", "tap", "sap",
      "at", "as"
    ],
    trickWords: ["a", "I"],
    prerequisites: [],
    color: "from-blue-400 to-purple-500",
  },
  {
    id: 2,
    title: "Building More Words",
    description: "Add 4 more letters to make even more words!",
    letters: ["I", "N", "M", "D"],
    blendableWords: [
      "sit", "pin", "din", "dim",
      "man", "mat", "nap", "nit",
      "tin", "tam", "sad", "sip",
      "pit", "pan", "mad", "map",
      "in", "it", "is", "an", "am"
    ],
    trickWords: ["the", "to", "no"],
    prerequisites: [1],
    color: "from-green-400 to-blue-500",
  },
  {
    id: 3,
    title: "Getting Better",
    description: "Learn letters that make hard sounds like /k/ and /g/",
    letters: ["G", "O", "C", "K"],
    blendableWords: [
      "got", "cog", "dog", "cod",
      "pot", "top", "cop", "mop",
      "dot", "not", "cot", "sog",
      "gap", "cap", "kit", "kid",
      "on", "go"
    ],
    trickWords: ["go", "so", "do"],
    prerequisites: [2],
    color: "from-orange-400 to-pink-500",
  },
  {
    id: 4,
    title: "More Sounds",
    description: "Add /e/, /r/, /h/, and /b/ to your collection",
    letters: ["E", "R", "H", "B"],
    blendableWords: [
      "red", "bed", "her", "rob",
      "rib", "rip", "hem", "hen",
      "hot", "hog", "hop", "hat",
      "bat", "bag", "big", "bit",
      "bet", "beg", "ben", "he"
    ],
    trickWords: ["he", "she", "me", "be", "we"],
    prerequisites: [3],
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 5,
    title: "Almost There!",
    description: "Learn /f/, /l/, /u/, and /w/ sounds",
    letters: ["F", "L", "U", "W"],
    blendableWords: [
      "fun", "run", "sun", "bun",
      "cup", "cut", "but", "bug",
      "hug", "dug", "rug", "tug",
      "log", "fog", "lap", "lip",
      "let", "leg", "led", "lit",
      "web", "wet", "win", "wig",
      "wag", "up", "us"
    ],
    trickWords: ["was", "of", "all"],
    prerequisites: [4],
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 6,
    title: "Complete the Alphabet",
    description: "Finish learning all the letters!",
    letters: ["J", "V", "X", "Y", "Z", "Q"],
    blendableWords: [
      "jam", "jet", "jog", "job",
      "van", "vet", "yes", "yet",
      "yak", "yam", "zip", "zap",
      "zit", "quiz"
    ],
    trickWords: ["you", "yes", "they", "are"],
    prerequisites: [5],
    color: "from-pink-400 to-purple-600",
  },
];

// Helper function to get phonics item by letter
export function getPhonicsItemByLetter(letter: string): PhonicsItem | undefined {
  return PHONICS_DATA.find((item) => item.letter === letter.toUpperCase());
}

// Helper function to get all phonics items for a unit
export function getPhonicsItemsForUnit(unitId: number): PhonicsItem[] {
  const unit = PHONICS_UNITS.find((u) => u.id === unitId);
  if (!unit) return [];

  return unit.letters
    .map((letter) => getPhonicsItemByLetter(letter))
    .filter((item): item is PhonicsItem => item !== undefined);
}

// Helper function to get unit by ID
export function getUnitById(unitId: number): PhonicsUnit | undefined {
  return PHONICS_UNITS.find((u) => u.id === unitId);
}

// Helper function to check if unit is unlocked based on prerequisites
export function isUnitUnlocked(
  unitId: number,
  completedUnits: number[]
): boolean {
  const unit = PHONICS_UNITS.find((u) => u.id === unitId);
  if (!unit) return false;

  // Unit 1 is always unlocked
  if (unit.prerequisites.length === 0) return true;

  // Check if all prerequisites are completed
  return unit.prerequisites.every((prereqId) => completedUnits.includes(prereqId));
}

// Helper function to get next unit to study
export function getNextUnit(completedUnits: number[]): PhonicsUnit | null {
  for (const unit of PHONICS_UNITS) {
    if (!completedUnits.includes(unit.id) && isUnitUnlocked(unit.id, completedUnits)) {
      return unit;
    }
  }
  return null; // All units completed
}

// Calculate overall progress percentage
export function calculateOverallProgress(completedUnits: number[]): number {
  return Math.round((completedUnits.length / PHONICS_UNITS.length) * 100);
}

// Get teaching order index for a letter
export function getTeachingOrderIndex(letter: string): number {
  return TEACHING_ORDER.indexOf(letter.toUpperCase());
}

// Sort letters by teaching order
export function sortByTeachingOrder(letters: string[]): string[] {
  return [...letters].sort((a, b) => {
    return getTeachingOrderIndex(a) - getTeachingOrderIndex(b);
  });
}
