/**
 * Child Profile Management
 * Multi-child profile system with analytics and parental controls
 */

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // emoji avatar
  age: number;
  grade?: string;
  createdAt: string; // ISO date string
  settings: ProfileSettings;
  theme: ProfileTheme;
}

export interface ProfileSettings {
  /** Daily time limit in minutes (0 = unlimited) */
  dailyTimeLimit: number;
  /** Maximum accessible level (0 = all levels) */
  contentLevel: number;
  /** Sound effects enabled */
  soundEnabled: boolean;
  /** Auto-play lessons */
  autoplay: boolean;
  /** Parental PIN required for settings */
  parentalControlsEnabled: boolean;
}

export interface ProfileTheme {
  primary: string;
  secondary: string;
  background: string;
}

export interface ActivityLog {
  id: string;
  profileId: string;
  activityType: ActivityType;
  activityId: string;
  lessonId?: string;
  levelId?: string;
  timestamp: string; // ISO date string
  duration: number; // seconds
  completed: boolean;
  score?: number; // stars or percentage
  xpEarned?: number;
}

export type ActivityType =
  | "lesson"
  | "phonics"
  | "word-building"
  | "story"
  | "sight-words"
  | "mini-game"
  | "assessment";

export interface DailyStats {
  date: string; // YYYY-MM-DD
  profileId: string;
  timeSpent: number; // minutes
  lessonsCompleted: number;
  storiesRead: number;
  xpEarned: number;
  activitiesCompleted: number;
}

export interface WeeklyReport {
  weekStart: string; // YYYY-MM-DD
  profileId: string;
  totalTimeSpent: number; // minutes
  lessonsCompleted: number;
  storiesRead: number;
  xpEarned: number;
  streak: number;
  topActivities: Array<{ type: ActivityType; count: number }>;
  progressSummary: string;
}

// Avatar options (emoji)
export const AVATAR_OPTIONS = [
  // Classic animals
  "🦁", // Lion
  "🐼", // Panda
  "🦊", // Fox
  "🐻", // Bear
  "🐰", // Rabbit
  "🐨", // Koala
  "🐸", // Frog
  "🐷", // Pig
  "🐶", // Dog
  "🐱", // Cat
  "🦉", // Owl
  "🐙", // Octopus
  "🦄", // Unicorn
  "🦋", // Butterfly
  "🐝", // Bee
  "🦆", // Duck
  // Robots & Tech
  "🤖", // Robot
  "🦾", // Robot Arm
  // Dinosaurs
  "🦕", // Brontosaurus
  "🦖", // T-Rex
  // Lizards & Reptiles
  "🦎", // Lizard
  "🐊", // Crocodile
  "🐢", // Turtle
  // Vehicles
  "🚗", // Car
  "🏎️", // Race Car
  // Space
  "🚀", // Rocket
  "🛸", // UFO
  "👽", // Alien
];

// Theme presets
export const PROFILE_THEMES: ProfileTheme[] = [
  {
    primary: "#FF6B6B",
    secondary: "#FFB6B6",
    background: "#FFF5F5",
  },
  {
    primary: "#4ECDC4",
    secondary: "#95E1D3",
    background: "#F0FFFF",
  },
  {
    primary: "#FFD93D",
    secondary: "#FFE485",
    background: "#FFFEF0",
  },
  {
    primary: "#A8E6CF",
    secondary: "#DCEDC8",
    background: "#F1F8E9",
  },
  {
    primary: "#95B8D1",
    secondary: "#B8D0EB",
    background: "#E8F4F8",
  },
  {
    primary: "#D4A5A5",
    secondary: "#E8C4B0",
    background: "#FFF0E6",
  },
];

// Helper functions
export function createDefaultProfile(
  name: string,
  age: number,
  avatar: string
): ChildProfile {
  const themeIndex = Math.floor(Math.random() * PROFILE_THEMES.length);

  return {
    id: generateProfileId(),
    name,
    avatar,
    age,
    createdAt: new Date().toISOString(),
    settings: {
      dailyTimeLimit: 0, // unlimited by default
      contentLevel: 0, // all levels accessible
      soundEnabled: true,
      autoplay: false,
      parentalControlsEnabled: false,
    },
    theme: PROFILE_THEMES[themeIndex],
  };
}

export function generateProfileId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateActivityLogId(): string {
  return `activity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday as start of week
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split("T")[0];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Analytics helpers
export function getActivityTypeLabel(type: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    lesson: "Lesson",
    phonics: "Phonics Practice",
    "word-building": "Word Building",
    story: "Story Reading",
    "sight-words": "Sight Words",
    "mini-game": "Mini Game",
    assessment: "Assessment",
  };
  return labels[type] || type;
}

export function calculateCompletionRate(
  completed: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getProgressLevel(
  lessonsCompleted: number
): "beginner" | "intermediate" | "advanced" {
  if (lessonsCompleted < 10) return "beginner";
  if (lessonsCompleted < 30) return "intermediate";
  return "advanced";
}
