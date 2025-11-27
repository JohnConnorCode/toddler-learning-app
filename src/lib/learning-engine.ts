/**
 * Learning Engine
 *
 * A comprehensive system for tracking learning progress, calculating readiness,
 * implementing spaced repetition, and providing smart recommendations.
 *
 * Based on reading science research:
 * - Letters need 20-30 exposures before mastery
 * - Spaced repetition intervals: Day 1, 3, 7, 14, 30
 * - 90% accuracy on 10+ trials = mastery
 * - Phonemic awareness should precede phonics
 */

import { PHONICS_UNITS, getTeachingOrderIndex } from "./systematic-phonics-data";

// ============ TYPES ============

export interface LetterMasteryData {
  letter: string;
  exposures: number;           // Total times seen
  correctAnswers: number;      // Total correct responses
  lastPracticed: string | null; // ISO date
  lastAccuracy: number;        // Most recent accuracy
  masteryLevel: MasteryLevel;
  nextReviewDate: string | null; // ISO date for spaced repetition
  practiceHistory: PracticeSession[];
}

export interface PracticeSession {
  date: string;
  correct: number;
  total: number;
  accuracy: number;
}

export type MasteryLevel =
  | "not-started"    // Never practiced
  | "introduced"     // 1-5 exposures
  | "practicing"     // 6-15 exposures, <80% accuracy
  | "developing"     // 16-25 exposures, 80-89% accuracy
  | "mastered"       // 20+ exposures, 90%+ accuracy on recent sessions
  | "needs-review";  // Was mastered but review is overdue

export interface ActivityReadiness {
  activity: string;
  ready: boolean;
  readinessScore: number;  // 0-100
  reason: string;
  prerequisites: string[];
  missingPrerequisites: string[];
}

export interface DailyReviewItem {
  type: "letter" | "word" | "blend";
  item: string;
  reason: string;
  priority: number; // 1-5, higher = more urgent
  lastPracticed: string | null;
  accuracy: number;
}

export interface LearningRecommendation {
  type: "continue" | "review" | "new" | "celebrate";
  title: string;
  description: string;
  action: string;
  href: string;
  priority: number;
  icon: string;
}

// ============ CONSTANTS ============

// Spaced repetition intervals in days
const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60];

// Exposures needed for each mastery level
const MASTERY_THRESHOLDS = {
  introduced: 1,
  practicing: 6,
  developing: 16,
  mastered: 20,
};

// Accuracy thresholds
const ACCURACY_THRESHOLDS = {
  developing: 0.80,
  mastered: 0.90,
};

// Minimum trials for mastery check
const MIN_TRIALS_FOR_MASTERY = 10;

// ============ CORE FUNCTIONS ============

/**
 * Calculate mastery level for a letter based on exposures and accuracy
 */
export function calculateMasteryLevel(data: LetterMasteryData): MasteryLevel {
  if (data.exposures === 0) return "not-started";

  // Check if review is overdue
  if (data.masteryLevel === "mastered" && data.nextReviewDate) {
    const now = new Date();
    const reviewDate = new Date(data.nextReviewDate);
    if (now > reviewDate) {
      return "needs-review";
    }
  }

  const accuracy = data.exposures > 0
    ? data.correctAnswers / data.exposures
    : 0;

  if (data.exposures >= MASTERY_THRESHOLDS.mastered &&
      accuracy >= ACCURACY_THRESHOLDS.mastered) {
    return "mastered";
  }

  if (data.exposures >= MASTERY_THRESHOLDS.developing &&
      accuracy >= ACCURACY_THRESHOLDS.developing) {
    return "developing";
  }

  if (data.exposures >= MASTERY_THRESHOLDS.practicing) {
    return "practicing";
  }

  return "introduced";
}

/**
 * Calculate next review date based on spaced repetition
 */
export function calculateNextReviewDate(
  masteryLevel: MasteryLevel,
  consecutiveCorrect: number
): Date {
  const now = new Date();

  // Determine interval based on mastery and streak
  let intervalIndex = Math.min(
    consecutiveCorrect,
    SPACED_REPETITION_INTERVALS.length - 1
  );

  // Reduce interval if not mastered
  if (masteryLevel !== "mastered" && masteryLevel !== "developing") {
    intervalIndex = Math.max(0, intervalIndex - 2);
  }

  const daysUntilReview = SPACED_REPETITION_INTERVALS[intervalIndex];
  now.setDate(now.getDate() + daysUntilReview);

  return now;
}

/**
 * Get all letters that are due for review
 */
export function getLettersDueForReview(
  letterProgress: Record<string, LetterMasteryData>
): DailyReviewItem[] {
  const now = new Date();
  const items: DailyReviewItem[] = [];

  Object.entries(letterProgress).forEach(([letter, data]) => {
    if (!data.lastPracticed) return;

    // Check if review is due
    const reviewDue = data.nextReviewDate
      ? new Date(data.nextReviewDate) <= now
      : false;

    // Check if accuracy is low (needs more practice)
    const accuracy = data.exposures > 0
      ? data.correctAnswers / data.exposures
      : 0;
    const needsWork = accuracy < ACCURACY_THRESHOLDS.developing;

    // Check if not enough exposures
    const needsMoreExposures = data.exposures < MASTERY_THRESHOLDS.mastered;

    if (reviewDue || needsWork || needsMoreExposures) {
      let priority = 3;
      let reason = "Regular review";

      if (needsWork) {
        priority = 5;
        reason = `Accuracy at ${Math.round(accuracy * 100)}% - needs practice`;
      } else if (needsMoreExposures) {
        priority = 4;
        reason = `Only ${data.exposures}/${MASTERY_THRESHOLDS.mastered} exposures`;
      } else if (reviewDue) {
        priority = 3;
        reason = "Scheduled review";
      }

      items.push({
        type: "letter",
        item: letter,
        reason,
        priority,
        lastPracticed: data.lastPracticed,
        accuracy: Math.round(accuracy * 100),
      });
    }
  });

  // Sort by priority (highest first)
  return items.sort((a, b) => b.priority - a.priority);
}

/**
 * Calculate readiness for an activity
 */
export function calculateActivityReadiness(
  activity: string,
  letterProgress: Record<string, LetterMasteryData>,
  completedUnits: number[]
): ActivityReadiness {
  switch (activity) {
    case "phonics":
      return {
        activity: "phonics",
        ready: true,
        readinessScore: 100,
        reason: "Always available - start learning letters!",
        prerequisites: [],
        missingPrerequisites: [],
      };

    case "words":
    case "first-words": {
      // Need at least 3 letters mastered to build words
      const masteredLetters = Object.values(letterProgress)
        .filter(l => l.masteryLevel === "mastered" || l.masteryLevel === "developing")
        .map(l => l.letter);

      const unit1Letters = ["S", "A", "T", "P"];
      const hasEnoughLetters = masteredLetters.length >= 3;
      const hasVowel = masteredLetters.some(l => ["A", "E", "I", "O", "U"].includes(l));

      const ready = hasEnoughLetters && hasVowel;
      const missing = unit1Letters.filter(l => !masteredLetters.includes(l));

      return {
        activity: "words",
        ready,
        readinessScore: Math.min(100, (masteredLetters.length / 4) * 100),
        reason: ready
          ? `Ready! You know ${masteredLetters.length} letters`
          : `Learn ${missing.length} more letter${missing.length > 1 ? 's' : ''}: ${missing.join(", ")}`,
        prerequisites: unit1Letters,
        missingPrerequisites: missing,
      };
    }

    case "blending": {
      // Need at least Unit 1 completed
      const hasUnit1 = completedUnits.includes(1);
      const masteredCount = Object.values(letterProgress)
        .filter(l => l.masteryLevel === "mastered").length;

      return {
        activity: "blending",
        ready: hasUnit1 || masteredCount >= 4,
        readinessScore: hasUnit1 ? 100 : (masteredCount / 4) * 100,
        reason: hasUnit1
          ? "Ready to blend sounds into words!"
          : `Master ${4 - masteredCount} more letters first`,
        prerequisites: ["Unit 1 letters: S, A, T, P"],
        missingPrerequisites: hasUnit1 ? [] : ["Complete Unit 1"],
      };
    }

    case "sight-words": {
      // Sight words can be started early but recommend some letter knowledge
      const masteredCount = Object.values(letterProgress)
        .filter(l => l.masteryLevel === "mastered" || l.masteryLevel === "developing").length;

      return {
        activity: "sight-words",
        ready: true, // Always available
        readinessScore: Math.min(100, 50 + masteredCount * 5),
        reason: masteredCount >= 4
          ? "Great time to learn sight words!"
          : "Available now - best with some letter knowledge",
        prerequisites: [],
        missingPrerequisites: [],
      };
    }

    case "stories": {
      // Stories need blending ability
      const hasBlendingReady = completedUnits.length >= 1;
      const masteredCount = Object.values(letterProgress)
        .filter(l => l.masteryLevel === "mastered").length;

      return {
        activity: "stories",
        ready: hasBlendingReady || masteredCount >= 8,
        readinessScore: hasBlendingReady ? 100 : (masteredCount / 8) * 100,
        reason: hasBlendingReady
          ? "Ready to read simple stories!"
          : "Learn more letters to unlock stories",
        prerequisites: ["Blending practice"],
        missingPrerequisites: hasBlendingReady ? [] : ["Complete Unit 1 & blending"],
      };
    }

    case "word-families": {
      // Need good vowel knowledge
      const vowelsMastered = ["A", "E", "I", "O", "U"].filter(
        v => letterProgress[v]?.masteryLevel === "mastered" ||
             letterProgress[v]?.masteryLevel === "developing"
      );

      return {
        activity: "word-families",
        ready: vowelsMastered.length >= 2,
        readinessScore: (vowelsMastered.length / 3) * 100,
        reason: vowelsMastered.length >= 2
          ? "Ready for rhyming patterns!"
          : `Learn ${2 - vowelsMastered.length} more vowels first`,
        prerequisites: ["A", "E", "I"],
        missingPrerequisites: ["A", "E", "I"].filter(v => !vowelsMastered.includes(v)),
      };
    }

    case "math":
      return {
        activity: "math",
        ready: true,
        readinessScore: 100,
        reason: "Math is always available!",
        prerequisites: [],
        missingPrerequisites: [],
      };

    default:
      return {
        activity,
        ready: true,
        readinessScore: 50,
        reason: "Available",
        prerequisites: [],
        missingPrerequisites: [],
      };
  }
}

/**
 * Get smart learning recommendations
 */
export function getLearningRecommendations(
  letterProgress: Record<string, LetterMasteryData>,
  completedUnits: number[],
  currentUnitId: number | null
): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = [];

  // 1. Check for items needing review
  const reviewItems = getLettersDueForReview(letterProgress);
  if (reviewItems.length > 0) {
    recommendations.push({
      type: "review",
      title: "Daily Review",
      description: `${reviewItems.length} letter${reviewItems.length > 1 ? 's' : ''} need${reviewItems.length === 1 ? 's' : ''} practice`,
      action: "Start Review",
      href: "/phonics?mode=review",
      priority: 5,
      icon: "refresh",
    });
  }

  // 2. Continue current learning
  if (currentUnitId) {
    const currentUnit = PHONICS_UNITS.find(u => u.id === currentUnitId);
    if (currentUnit) {
      // Find first non-mastered letter in unit
      const nextLetter = currentUnit.letters.find(
        letter => {
          const progress = letterProgress[letter];
          return !progress || progress.masteryLevel !== "mastered";
        }
      );

      if (nextLetter) {
        const progress = letterProgress[nextLetter];
        const exposures = progress?.exposures || 0;

        recommendations.push({
          type: "continue",
          title: `Learn Letter ${nextLetter}`,
          description: exposures > 0
            ? `${exposures}/${MASTERY_THRESHOLDS.mastered} practice sessions`
            : "Start learning this letter!",
          action: "Continue",
          href: `/phonics?unit=${currentUnitId}&letter=${nextLetter}`,
          priority: 4,
          icon: "book",
        });
      }
    }
  }

  // 3. Check if ready for new activities
  const wordsReadiness = calculateActivityReadiness("words", letterProgress, completedUnits);
  if (wordsReadiness.ready && wordsReadiness.readinessScore >= 75) {
    recommendations.push({
      type: "new",
      title: "Try Word Building",
      description: "You know enough letters to build words!",
      action: "Build Words",
      href: "/words",
      priority: 3,
      icon: "puzzle",
    });
  }

  const blendingReadiness = calculateActivityReadiness("blending", letterProgress, completedUnits);
  if (blendingReadiness.ready && blendingReadiness.readinessScore >= 75) {
    recommendations.push({
      type: "new",
      title: "Practice Blending",
      description: "Ready to blend sounds into words!",
      action: "Start Blending",
      href: "/blending",
      priority: 3,
      icon: "merge",
    });
  }

  // 4. Celebrate milestones
  const masteredCount = Object.values(letterProgress)
    .filter(l => l.masteryLevel === "mastered").length;

  if (masteredCount === 4 || masteredCount === 8 || masteredCount === 13 || masteredCount === 26) {
    recommendations.push({
      type: "celebrate",
      title: `${masteredCount} Letters Mastered!`,
      description: "Amazing progress - keep it up!",
      action: "See Progress",
      href: "/achievements",
      priority: 2,
      icon: "trophy",
    });
  }

  // Sort by priority
  return recommendations.sort((a, b) => b.priority - a.priority);
}

/**
 * Get decodable words based on mastered letters
 */
export function getDecodableWords(
  masteredLetters: string[]
): string[] {
  const letterSet = new Set(masteredLetters.map(l => l.toUpperCase()));
  const allDecodableWords: string[] = [];

  // Collect words from all units where child knows the letters
  PHONICS_UNITS.forEach(unit => {
    unit.blendableWords.forEach(word => {
      const wordLetters = word.toUpperCase().split("");
      const canDecode = wordLetters.every(letter => letterSet.has(letter));
      if (canDecode && !allDecodableWords.includes(word)) {
        allDecodableWords.push(word);
      }
    });
  });

  return allDecodableWords;
}

/**
 * Sort words by decodability - decodable words first
 */
export function sortWordsByDecodability<T extends { word: string }>(
  words: T[],
  masteredLetters: string[]
): T[] {
  const letterSet = new Set(masteredLetters.map(l => l.toUpperCase()));

  return [...words].sort((a, b) => {
    const aLetters = a.word.toUpperCase().split("");
    const bLetters = b.word.toUpperCase().split("");

    const aDecodable = aLetters.every(l => letterSet.has(l));
    const bDecodable = bLetters.every(l => letterSet.has(l));

    // Decodable words come first
    if (aDecodable && !bDecodable) return -1;
    if (!aDecodable && bDecodable) return 1;

    // Among decodable, shorter words first
    if (aDecodable && bDecodable) {
      return a.word.length - b.word.length;
    }

    // Among non-decodable, sort by how many letters they know
    const aKnown = aLetters.filter(l => letterSet.has(l)).length;
    const bKnown = bLetters.filter(l => letterSet.has(l)).length;
    return bKnown - aKnown;
  });
}

/**
 * Calculate overall learning progress
 */
export function calculateLearningProgress(
  letterProgress: Record<string, LetterMasteryData>
): {
  totalLetters: number;
  introduced: number;
  practicing: number;
  developing: number;
  mastered: number;
  needsReview: number;
  overallScore: number;
  nextMilestone: string;
} {
  const stats = {
    totalLetters: 26,
    introduced: 0,
    practicing: 0,
    developing: 0,
    mastered: 0,
    needsReview: 0,
    overallScore: 0,
    nextMilestone: "",
  };

  Object.values(letterProgress).forEach(data => {
    switch (data.masteryLevel) {
      case "introduced": stats.introduced++; break;
      case "practicing": stats.practicing++; break;
      case "developing": stats.developing++; break;
      case "mastered": stats.mastered++; break;
      case "needs-review": stats.needsReview++; break;
    }
  });

  // Calculate overall score (mastered letters weighted most)
  stats.overallScore = Math.round(
    ((stats.mastered * 100) +
     (stats.developing * 75) +
     (stats.practicing * 50) +
     (stats.introduced * 25)) / 26
  );

  // Determine next milestone
  if (stats.mastered < 4) {
    stats.nextMilestone = `Master ${4 - stats.mastered} more letters to start reading words!`;
  } else if (stats.mastered < 8) {
    stats.nextMilestone = `${8 - stats.mastered} more letters until Unit 2 complete!`;
  } else if (stats.mastered < 13) {
    stats.nextMilestone = `Halfway there! ${13 - stats.mastered} letters to go.`;
  } else if (stats.mastered < 26) {
    stats.nextMilestone = `Almost done! ${26 - stats.mastered} letters left!`;
  } else {
    stats.nextMilestone = "All letters mastered! Amazing!";
  }

  return stats;
}

/**
 * Generate practice session for a letter
 */
export function generateLetterPracticeSession(
  letter: string,
  currentMastery: LetterMasteryData | undefined,
  allLettersProgress: Record<string, LetterMasteryData>
): {
  targetLetter: string;
  totalTrials: number;
  includeReview: boolean;
  reviewLetters: string[];
} {
  const exposures = currentMastery?.exposures || 0;

  // More trials for newer letters
  let totalTrials = 10;
  if (exposures < 5) totalTrials = 12;
  if (exposures < 10) totalTrials = 10;
  if (exposures >= 20) totalTrials = 8;

  // Include review of previous letters
  const reviewLetters: string[] = [];
  const teachingIndex = getTeachingOrderIndex(letter);

  // Get 2-3 previously learned letters for interleaved practice
  Object.entries(allLettersProgress)
    .filter(([l, data]) => {
      const lIndex = getTeachingOrderIndex(l);
      return lIndex < teachingIndex && data.masteryLevel !== "not-started";
    })
    .sort((a, b) => (a[1].lastPracticed || "").localeCompare(b[1].lastPracticed || ""))
    .slice(0, 3)
    .forEach(([l]) => reviewLetters.push(l));

  return {
    targetLetter: letter,
    totalTrials,
    includeReview: reviewLetters.length > 0,
    reviewLetters,
  };
}
