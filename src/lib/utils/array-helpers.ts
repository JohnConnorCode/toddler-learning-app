/**
 * Array Utility Functions
 * Centralized helpers for array manipulation across the app
 */

/**
 * Fisher-Yates shuffle algorithm - creates a new shuffled array
 * Does not mutate the original array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random items from an array without replacement
 * Returns a new array with up to `count` unique random items
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return shuffleArray(array);
  }
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

/**
 * Pick a single random item from an array
 * Returns undefined if array is empty
 */
export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick a single random item from an array (non-null version)
 * Throws if array is empty
 */
export function pickRandomOrThrow<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Remove duplicates from an array based on a key function
 */
export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Chunk an array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Group array items by a key function
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}
