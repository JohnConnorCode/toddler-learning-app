/**
 * Achievements and Badges System
 * Inspired by Duolingo ABC's gamification
 */

export type BadgeCategory =
  | "streak"
  | "completion"
  | "mastery"
  | "explorer"
  | "reader"
  | "learner";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  /** Unique badge identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of how to earn it */
  description: string;
  /** Category type */
  category: BadgeCategory;
  /** Rarity level */
  rarity: BadgeRarity;
  /** Icon/emoji */
  icon: string;
  /** XP reward for earning */
  xpReward: number;
  /** Progress required (e.g., days for streak, lessons for completion) */
  requirement: number;
  /** Color theme */
  color: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface UserBadge {
  /** Badge ID */
  badgeId: string;
  /** Date earned */
  earnedAt: Date;
  /** Progress towards next level (if applicable) */
  progress?: number;
}

export interface XPLevel {
  /** Level number */
  level: number;
  /** Total XP needed to reach this level */
  xpRequired: number;
  /** Reward for reaching this level */
  reward: string;
  /** Icon for this level */
  icon: string;
}

/**
 * XP Levels - Gamified progression
 */
export const XP_LEVELS: XPLevel[] = [
  { level: 1, xpRequired: 0, reward: "Welcome!", icon: "🌱" },
  { level: 2, xpRequired: 100, reward: "First Steps Badge", icon: "🚶" },
  { level: 3, xpRequired: 250, reward: "Explorer Badge", icon: "🔍" },
  { level: 4, xpRequired: 500, reward: "Reader Badge", icon: "📖" },
  { level: 5, xpRequired: 1000, reward: "Scholar Badge", icon: "🎓" },
  { level: 6, xpRequired: 1500, reward: "Star Student Badge", icon: "⭐" },
  { level: 7, xpRequired: 2500, reward: "Champion Badge", icon: "🏆" },
  { level: 8, xpRequired: 4000, reward: "Master Badge", icon: "👑" },
  { level: 9, xpRequired: 6000, reward: "Legend Badge", icon: "🌟" },
  { level: 10, xpRequired: 10000, reward: "Super Learner!", icon: "🚀" },
];

/**
 * All available badges
 */
export const BADGES: Badge[] = [
  // Streak Badges
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Learn 3 days in a row",
    category: "streak",
    rarity: "common",
    icon: "🔥",
    xpReward: 50,
    requirement: 3,
    color: {
      primary: "#FF6B35",
      secondary: "#FF8E53",
      background: "#FFF3E0",
    },
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Learn 7 days in a row",
    category: "streak",
    rarity: "rare",
    icon: "🔥🔥",
    xpReward: 150,
    requirement: 7,
    color: {
      primary: "#FF4500",
      secondary: "#FF6347",
      background: "#FFEBE6",
    },
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Learn 30 days in a row",
    category: "streak",
    rarity: "epic",
    icon: "🔥🔥🔥",
    xpReward: 500,
    requirement: 30,
    color: {
      primary: "#DC143C",
      secondary: "#FF1493",
      background: "#FFE6F0",
    },
  },
  {
    id: "streak-100",
    name: "Unstoppable",
    description: "Learn 100 days in a row",
    category: "streak",
    rarity: "legendary",
    icon: "🔥👑",
    xpReward: 2000,
    requirement: 100,
    color: {
      primary: "#8B0000",
      secondary: "#B22222",
      background: "#FFF0F5",
    },
  },

  // Completion Badges
  {
    id: "complete-level-1",
    name: "First Steps",
    description: "Complete Level 1",
    category: "completion",
    rarity: "common",
    icon: "🌟",
    xpReward: 100,
    requirement: 1,
    color: {
      primary: "#FFD700",
      secondary: "#FFA500",
      background: "#FFFACD",
    },
  },
  {
    id: "complete-level-5",
    name: "Halfway Hero",
    description: "Complete Level 5",
    category: "completion",
    rarity: "rare",
    icon: "⭐⭐",
    xpReward: 300,
    requirement: 5,
    color: {
      primary: "#4169E1",
      secondary: "#1E90FF",
      background: "#E6F3FF",
    },
  },
  {
    id: "complete-level-10",
    name: "Champion Reader",
    description: "Complete all 10 levels",
    category: "completion",
    rarity: "legendary",
    icon: "👑",
    xpReward: 1000,
    requirement: 10,
    color: {
      primary: "#9370DB",
      secondary: "#BA55D3",
      background: "#F3E6FF",
    },
  },

  // Mastery Badges
  {
    id: "perfect-lessons-10",
    name: "Perfect Ten",
    description: "Get 3 stars on 10 lessons",
    category: "mastery",
    rarity: "common",
    icon: "✨",
    xpReward: 100,
    requirement: 10,
    color: {
      primary: "#FF1493",
      secondary: "#FF69B4",
      background: "#FFF0F8",
    },
  },
  {
    id: "perfect-lessons-50",
    name: "Star Student",
    description: "Get 3 stars on 50 lessons",
    category: "mastery",
    rarity: "epic",
    icon: "🌟✨",
    xpReward: 500,
    requirement: 50,
    color: {
      primary: "#FFD700",
      secondary: "#FFA500",
      background: "#FFFACD",
    },
  },

  // Explorer Badges
  {
    id: "try-all-activities",
    name: "Explorer",
    description: "Try all activity types",
    category: "explorer",
    rarity: "rare",
    icon: "🗺️",
    xpReward: 200,
    requirement: 6, // phonics, words, sight words, blending, stories, etc.
    color: {
      primary: "#32CD32",
      secondary: "#90EE90",
      background: "#F0FFF0",
    },
  },
  {
    id: "visit-all-levels",
    name: "World Traveler",
    description: "Visit all 10 levels",
    category: "explorer",
    rarity: "rare",
    icon: "🌍",
    xpReward: 250,
    requirement: 10,
    color: {
      primary: "#1E90FF",
      secondary: "#87CEEB",
      background: "#F0F8FF",
    },
  },

  // Reader Badges
  {
    id: "read-stories-5",
    name: "Bookworm",
    description: "Read 5 stories",
    category: "reader",
    rarity: "common",
    icon: "📚",
    xpReward: 100,
    requirement: 5,
    color: {
      primary: "#8B4513",
      secondary: "#D2691E",
      background: "#FFF8DC",
    },
  },
  {
    id: "read-stories-20",
    name: "Story Master",
    description: "Read 20 stories",
    category: "reader",
    rarity: "epic",
    icon: "📖✨",
    xpReward: 400,
    requirement: 20,
    color: {
      primary: "#4B0082",
      secondary: "#9370DB",
      background: "#F3E6FF",
    },
  },

  // Learner Badges
  {
    id: "earn-xp-1000",
    name: "Rising Star",
    description: "Earn 1,000 XP",
    category: "learner",
    rarity: "rare",
    icon: "⭐",
    xpReward: 200,
    requirement: 1000,
    color: {
      primary: "#FFD700",
      secondary: "#FFA500",
      background: "#FFFACD",
    },
  },
  {
    id: "earn-xp-5000",
    name: "Super Learner",
    description: "Earn 5,000 XP",
    category: "learner",
    rarity: "epic",
    icon: "🚀",
    xpReward: 500,
    requirement: 5000,
    color: {
      primary: "#FF4500",
      secondary: "#FF6347",
      background: "#FFF5EE",
    },
  },
  {
    id: "earn-xp-10000",
    name: "Legendary Scholar",
    description: "Earn 10,000 XP",
    category: "learner",
    rarity: "legendary",
    icon: "👑🚀",
    xpReward: 1000,
    requirement: 10000,
    color: {
      primary: "#8B008B",
      secondary: "#DA70D6",
      background: "#FFF0FF",
    },
  },
];

/**
 * XP rewards for different activities
 */
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  LESSON_PERFECT: 100, // All 3 stars
  STORY_READ: 30,
  STORY_COMPLETE: 50,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 20, // Bonus per day of streak
  PHONICS_PRACTICE: 15,
  WORD_SPELLED: 10,
  COMPREHENSION_CORRECT: 25,
};

/**
 * Helper functions
 */

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(badge => badge.id === id);
}

export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return BADGES.filter(badge => badge.category === category);
}

export function getBadgesByRarity(rarity: BadgeRarity): Badge[] {
  return BADGES.filter(badge => badge.rarity === rarity);
}

export function calculateLevel(totalXP: number): number {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].xpRequired) {
      return XP_LEVELS[i].level;
    }
  }
  return 1;
}

export function getNextLevel(currentLevel: number): XPLevel | undefined {
  return XP_LEVELS.find(level => level.level === currentLevel + 1);
}

export function getXPForNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const nextLevel = getNextLevel(currentLevel);

  if (!nextLevel) return 0;

  return nextLevel.xpRequired - totalXP;
}

export function getLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelData = XP_LEVELS.find(l => l.level === currentLevel);
  const nextLevelData = getNextLevel(currentLevel);

  if (!currentLevelData || !nextLevelData) return 100;

  const xpInCurrentLevel = totalXP - currentLevelData.xpRequired;
  const xpNeededForNext = nextLevelData.xpRequired - currentLevelData.xpRequired;

  return Math.round((xpInCurrentLevel / xpNeededForNext) * 100);
}
