/**
 * Session Flow Manager
 *
 * Manages learning sessions with two modes:
 * - Auto-flow: Guided sessions for beginners (system chooses sequence)
 * - Menu mode: Free choice for advanced learners
 */

export type SessionMode = "auto" | "menu";

export type ActivityType = "tap" | "segment" | "slider" | "sentence";

export type SessionStep = {
  activityType: ActivityType;
  word?: string;
  sentence?: string;
  difficulty?: 1 | 2 | 3;
};

export type SessionPlan = {
  mode: SessionMode;
  currentUnit: number;
  totalSteps: number;
  currentStep: number;
  steps: SessionStep[];
};

/**
 * Create an auto-flow session plan
 * Optimal for beginners - system guides through varied activities
 */
export function createAutoFlowSession(
  currentUnit: number,
  words: string[]
): SessionPlan {
  const steps: SessionStep[] = [];

  // Session structure for auto-flow (10-12 minutes):
  // 1. Warm-up: 2 tap-to-blend words (easiest)
  // 2. Practice: 3 sound segmenting words
  // 3. Challenge: 2 blending slider words
  // 4. Application: 1 sentence (if unit >= 2)
  // 5. Cool-down: 2 tap-to-blend words (review)

  // Warm-up (2 words)
  for (let i = 0; i < 2 && i < words.length; i++) {
    steps.push({
      activityType: "tap",
      word: words[i],
      difficulty: 1,
    });
  }

  // Practice (3 words)
  for (let i = 2; i < 5 && i < words.length; i++) {
    steps.push({
      activityType: "segment",
      word: words[i],
      difficulty: 1,
    });
  }

  // Challenge (2 words)
  for (let i = 5; i < 7 && i < words.length; i++) {
    steps.push({
      activityType: "slider",
      word: words[i],
      difficulty: 2,
    });
  }

  // Application (1 sentence, if available)
  if (currentUnit >= 2) {
    steps.push({
      activityType: "sentence",
      difficulty: 1,
    });
  }

  // Cool-down (2 words)
  for (let i = 7; i < 9 && i < words.length; i++) {
    steps.push({
      activityType: "tap",
      word: words[i],
      difficulty: 1,
    });
  }

  return {
    mode: "auto",
    currentUnit,
    totalSteps: steps.length,
    currentStep: 0,
    steps,
  };
}

/**
 * Create a menu mode session
 * User has full control - can choose any activity
 */
export function createMenuModeSession(currentUnit: number): SessionPlan {
  return {
    mode: "menu",
    currentUnit,
    totalSteps: 0, // No predetermined steps
    currentStep: 0,
    steps: [],
  };
}

/**
 * Get next step in auto-flow session
 */
export function getNextStep(session: SessionPlan): SessionStep | null {
  if (session.mode !== "auto") {
    return null; // Menu mode doesn't have steps
  }

  if (session.currentStep >= session.steps.length) {
    return null; // Session complete
  }

  return session.steps[session.currentStep];
}

/**
 * Advance to next step
 */
export function advanceStep(session: SessionPlan): SessionPlan {
  return {
    ...session,
    currentStep: session.currentStep + 1,
  };
}

/**
 * Get session progress
 */
export function getSessionProgress(session: SessionPlan): {
  completed: number;
  total: number;
  percentage: number;
} {
  if (session.mode === "menu") {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const percentage =
    session.totalSteps > 0
      ? Math.round((session.currentStep / session.totalSteps) * 100)
      : 0;

  return {
    completed: session.currentStep,
    total: session.totalSteps,
    percentage,
  };
}

/**
 * Check if session is complete
 */
export function isSessionComplete(session: SessionPlan): boolean {
  if (session.mode === "menu") {
    return false; // Menu sessions don't auto-complete
  }

  return session.currentStep >= session.totalSteps;
}

/**
 * Get recommended session mode based on user progress
 */
export function getRecommendedMode(
  completedUnits: number[],
  totalReviews: number
): SessionMode {
  // Beginners (< 2 units or < 20 reviews) use auto-flow
  if (completedUnits.length < 2 || totalReviews < 20) {
    return "auto";
  }

  // Advanced learners can use menu mode
  return "menu";
}

/**
 * Save session to localStorage
 */
export function saveSession(session: SessionPlan): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("current-session", JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

/**
 * Load session from localStorage
 */
export function loadSession(): SessionPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("current-session");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
}

/**
 * Clear current session
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("current-session");
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

/**
 * Get activity name for display
 */
export function getActivityName(activityType: ActivityType): string {
  const names: Record<ActivityType, string> = {
    tap: "Tap to Blend",
    segment: "Sound Builder",
    slider: "Blending Slider",
    sentence: "Read Sentence",
  };
  return names[activityType];
}

/**
 * Get activity icon emoji
 */
export function getActivityIcon(activityType: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    tap: "👆",
    segment: "🧩",
    slider: "🎚️",
    sentence: "📖",
  };
  return icons[activityType];
}
