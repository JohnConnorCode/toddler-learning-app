/**
 * Word Scheduler with Spaced Repetition System (SRS)
 *
 * Manages when words should be reviewed based on performance.
 * Implements a simplified SM-2 algorithm optimized for young children.
 */

export type WordReviewData = {
  word: string;
  unitId: number;
  lastReviewedAt: string | null;
  nextDueAt: string;
  interval: number; // Days until next review
  easeFactor: number; // Multiplier for interval (0.5 - 3.0)
  reviewCount: number;
  successCount: number;
  failureCount: number;
  lastSmoothnessScore: number | null;
  avgSmoothnessScore: number;
  blendingMastered: boolean;
};

const STORAGE_KEY = "word-review-schedule";

// SRS Configuration (adjusted for toddlers)
const INITIAL_INTERVAL = 1; // Show again tomorrow after first success
const INITIAL_EASE_FACTOR = 1.3;
const MIN_EASE_FACTOR = 0.5; // Don't let it get too hard to review
const MAX_EASE_FACTOR = 3.0;
const SMOOTH_THRESHOLD = 0.7; // Smoothness score needed for "success"
const MASTERY_THRESHOLD = 10; // Successful smooth reviews needed for mastery

/**
 * Get all word review data from storage
 */
export function getAllWordReviews(): Record<string, WordReviewData> {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse word reviews:", error);
    return {};
  }
}

/**
 * Save word review data to storage
 */
function saveWordReviews(reviews: Record<string, WordReviewData>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to save word reviews:", error);
  }
}

/**
 * Initialize or get review data for a word
 */
export function getWordReview(word: string, unitId: number): WordReviewData {
  const reviews = getAllWordReviews();

  if (reviews[word]) {
    return reviews[word];
  }

  // Initialize new word
  return {
    word,
    unitId,
    lastReviewedAt: null,
    nextDueAt: new Date().toISOString(), // Due now
    interval: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    reviewCount: 0,
    successCount: 0,
    failureCount: 0,
    lastSmoothnessScore: null,
    avgSmoothnessScore: 0,
    blendingMastered: false,
  };
}

/**
 * Record a review attempt and update scheduling
 */
export function recordReview(
  word: string,
  unitId: number,
  smoothnessScore: number,
  wasIndependent: boolean = true
): WordReviewData {
  const reviews = getAllWordReviews();
  const reviewData = getWordReview(word, unitId);

  const now = new Date();
  const isSuccess = smoothnessScore >= SMOOTH_THRESHOLD && wasIndependent;

  // Update review counts
  reviewData.reviewCount++;
  if (isSuccess) {
    reviewData.successCount++;
  } else {
    reviewData.failureCount++;
  }

  // Update smoothness scores
  reviewData.lastSmoothnessScore = smoothnessScore;
  reviewData.avgSmoothnessScore =
    (reviewData.avgSmoothnessScore * (reviewData.reviewCount - 1) +
      smoothnessScore) /
    reviewData.reviewCount;

  // Update last reviewed time
  reviewData.lastReviewedAt = now.toISOString();

  // Calculate new interval and ease factor
  if (isSuccess) {
    // Success: increase interval
    if (reviewData.interval === 0) {
      reviewData.interval = INITIAL_INTERVAL;
    } else {
      reviewData.interval = Math.round(
        reviewData.interval * reviewData.easeFactor
      );
    }

    // Adjust ease factor based on how smooth it was
    if (smoothnessScore >= 0.9) {
      // Very smooth: make it easier (longer intervals)
      reviewData.easeFactor = Math.min(
        MAX_EASE_FACTOR,
        reviewData.easeFactor + 0.15
      );
    } else if (smoothnessScore >= SMOOTH_THRESHOLD) {
      // Smooth: slight increase
      reviewData.easeFactor = Math.min(
        MAX_EASE_FACTOR,
        reviewData.easeFactor + 0.05
      );
    }
  } else {
    // Failure: reset to short interval and decrease ease factor
    reviewData.interval = 0; // Review again in same session or tomorrow
    reviewData.easeFactor = Math.max(
      MIN_EASE_FACTOR,
      reviewData.easeFactor - 0.2
    );
  }

  // Cap maximum interval at 7 days for young children
  reviewData.interval = Math.min(7, reviewData.interval);

  // Calculate next due date
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + reviewData.interval);
  reviewData.nextDueAt = nextDue.toISOString();

  // Check for mastery
  const recentReviews = Math.min(reviewData.reviewCount, MASTERY_THRESHOLD);
  const recentSuccesses = reviewData.successCount;
  reviewData.blendingMastered =
    recentSuccesses >= MASTERY_THRESHOLD && reviewData.avgSmoothnessScore >= 0.8;

  // Save to storage
  reviews[word] = reviewData;
  saveWordReviews(reviews);

  return reviewData;
}

/**
 * Get words that are due for review
 */
export function getDueWords(maxUnitId?: number): WordReviewData[] {
  const reviews = getAllWordReviews();
  const now = new Date();

  return Object.values(reviews)
    .filter((review) => {
      // Filter by unit if specified
      if (maxUnitId !== undefined && review.unitId > maxUnitId) {
        return false;
      }

      // Include if due now or overdue
      const dueDate = new Date(review.nextDueAt);
      return dueDate <= now;
    })
    .sort((a, b) => {
      // Sort by due date (most overdue first)
      return (
        new Date(a.nextDueAt).getTime() - new Date(b.nextDueAt).getTime()
      );
    });
}

/**
 * Get words to practice in a session
 * Returns mix of: review (60%), in-progress (30%), new (10%)
 */
export function getSessionWords(
  availableWords: string[],
  currentUnitId: number,
  count: number = 10
): string[] {
  const reviews = getAllWordReviews();

  // Categorize available words
  const reviewWords: string[] = []; // Mastered or high success rate
  const inProgressWords: string[] = []; // Some practice, not mastered
  const newWords: string[] = []; // Never practiced

  availableWords.forEach((word) => {
    const review = reviews[word];

    if (!review || review.reviewCount === 0) {
      newWords.push(word);
    } else if (review.blendingMastered || review.successCount >= 5) {
      reviewWords.push(word);
    } else {
      inProgressWords.push(word);
    }
  });

  // Calculate target counts (60% review, 30% progress, 10% new)
  const targetReview = Math.ceil(count * 0.6);
  const targetProgress = Math.ceil(count * 0.3);
  const targetNew = Math.max(1, count - targetReview - targetProgress);

  const selected: string[] = [];

  // Select from each category (with fallback if category is empty)
  const selectedReview = reviewWords.slice(0, targetReview);
  const selectedProgress = inProgressWords.slice(0, targetProgress);
  const selectedNew = newWords.slice(0, targetNew);

  selected.push(...selectedReview);
  selected.push(...selectedProgress);
  selected.push(...selectedNew);

  // Fill remaining slots if we don't have enough
  const remaining = count - selected.length;
  if (remaining > 0) {
    const allRemaining = availableWords.filter((w) => !selected.includes(w));
    selected.push(...allRemaining.slice(0, remaining));
  }

  // Shuffle to mix categories
  return selected.sort(() => Math.random() - 0.5);
}

/**
 * Get statistics for a word
 */
export function getWordStats(word: string): {
  totalReviews: number;
  successRate: number;
  avgSmoothness: number;
  isMastered: boolean;
  daysUntilDue: number;
} | null {
  const reviews = getAllWordReviews();
  const review = reviews[word];

  if (!review || review.reviewCount === 0) {
    return null;
  }

  const now = new Date();
  const dueDate = new Date(review.nextDueAt);
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    totalReviews: review.reviewCount,
    successRate: review.successCount / review.reviewCount,
    avgSmoothness: review.avgSmoothnessScore,
    isMastered: review.blendingMastered,
    daysUntilDue,
  };
}

/**
 * Get overall blending statistics
 */
export function getOverallBlendingStats(maxUnitId?: number): {
  totalWords: number;
  masteredWords: number;
  inProgressWords: number;
  avgSmoothness: number;
  totalReviews: number;
} {
  const reviews = getAllWordReviews();
  const filtered = Object.values(reviews).filter(
    (r) => maxUnitId === undefined || r.unitId <= maxUnitId
  );

  const totalWords = filtered.length;
  const masteredWords = filtered.filter((r) => r.blendingMastered).length;
  const inProgressWords = filtered.filter(
    (r) => r.reviewCount > 0 && !r.blendingMastered
  ).length;

  const totalReviews = filtered.reduce((sum, r) => sum + r.reviewCount, 0);
  const avgSmoothness =
    totalReviews > 0
      ? filtered.reduce(
          (sum, r) => sum + r.avgSmoothnessScore * r.reviewCount,
          0
        ) / totalReviews
      : 0;

  return {
    totalWords,
    masteredWords,
    inProgressWords,
    avgSmoothness,
    totalReviews,
  };
}

/**
 * Reset all review data (for testing or starting over)
 */
export function resetAllReviews(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export review data (for parent dashboard)
 */
export function exportReviewData(): string {
  const reviews = getAllWordReviews();
  return JSON.stringify(reviews, null, 2);
}
