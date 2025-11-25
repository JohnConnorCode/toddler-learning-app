"use client";

import { motion } from "framer-motion";
import { Map, BookOpen, Calculator, Book, Target, Flame, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLevelProgress } from "@/hooks/use-level-progress";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { useStoryProgress } from "@/hooks/use-story-progress";
import { useMathProgress, useGlobalProgress } from "@/lib/framework/progress-store";
import { useDailyGoals } from "@/hooks/use-daily-goals";
import { STORIES } from "@/lib/stories-data";

export function UnifiedProgress() {
  const { getTotalProgress, currentLevel } = useLevelProgress();
  const { getOverallProgress } = usePhonicsProgress();
  const storyProgress = useStoryProgress();
  const mathProgress = useMathProgress();
  const { totalXP, currentLevel: xpLevel, streak } = useGlobalProgress();
  const { getTodayProgress, isGoalComplete, dailyGoalMinutes, todayMinutes, currentStreak } = useDailyGoals();

  // Calculate stats
  const levelProgressData = getTotalProgress();
  const levelProgress = typeof levelProgressData === 'number' ? levelProgressData : levelProgressData.percentComplete;
  const phonicsProgress = getOverallProgress();
  const storiesRead = Object.values(storyProgress.stories).filter((s) => s.completed).length;
  const totalStories = STORIES.length;
  const mathLessonsCompleted = Object.values(mathProgress.progress?.lessonProgress || {}).filter(
    (l) => l.completed
  ).length;

  const dailyProgress = getTodayProgress();
  const goalComplete = isGoalComplete();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-4xl mb-6 relative z-10"
    >
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Progress
          </h2>
          <Link
            href="/parent-dashboard"
            className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1"
          >
            Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Daily Goal */}
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${goalComplete ? "text-green-600" : "text-green-500"}`} />
              <span className="font-semibold text-gray-800">Daily Goal</span>
              {goalComplete && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                  COMPLETE!
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(todayMinutes)} / {dailyGoalMinutes} min
            </span>
          </div>
          <div className="h-2 bg-green-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                goalComplete
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-green-400 to-green-500"
              }`}
            />
          </div>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Levels */}
          <Link href="/levels" className="group">
            <ProgressCard
              icon={<Map className="w-5 h-5" />}
              label="Levels"
              value={`${levelProgress}%`}
              subtext={`Level ${currentLevel || 1}`}
              color="blue"
              progress={levelProgress}
            />
          </Link>

          {/* Phonics */}
          <Link href="/phonics" className="group">
            <ProgressCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Phonics"
              value={`${phonicsProgress}%`}
              subtext="mastered"
              color="yellow"
              progress={phonicsProgress}
            />
          </Link>

          {/* Math */}
          <Link href="/math" className="group">
            <ProgressCard
              icon={<Calculator className="w-5 h-5" />}
              label="Math"
              value={String(mathLessonsCompleted)}
              subtext="lessons"
              color="green"
              progress={(mathLessonsCompleted / 15) * 100} // Assuming 15 total lessons
            />
          </Link>

          {/* Stories */}
          <Link href="/stories" className="group">
            <ProgressCard
              icon={<Book className="w-5 h-5" />}
              label="Stories"
              value={`${storiesRead}/${totalStories}`}
              subtext="read"
              color="orange"
              progress={(storiesRead / totalStories) * 100}
            />
          </Link>
        </div>

        {/* Streak & XP */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5">
              <Flame className={`w-5 h-5 ${currentStreak > 0 ? "text-orange-500" : "text-gray-300"}`} />
              <span className="font-bold text-gray-800">{currentStreak || streak}</span>
              <span className="text-xs text-gray-500">day streak</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">{totalXP}</span>
              <span className="text-xs text-gray-500">XP</span>
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5 bg-purple-100 px-3 py-1 rounded-full">
            <span className="text-xs text-purple-600 font-medium">Level</span>
            <span className="font-bold text-purple-700">{xpLevel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ProgressCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: "blue" | "yellow" | "green" | "orange" | "purple";
  progress: number;
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50 group-hover:bg-blue-100",
    icon: "text-blue-500",
    progress: "bg-blue-500",
  },
  yellow: {
    bg: "bg-yellow-50 group-hover:bg-yellow-100",
    icon: "text-yellow-500",
    progress: "bg-yellow-500",
  },
  green: {
    bg: "bg-green-50 group-hover:bg-green-100",
    icon: "text-green-500",
    progress: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-50 group-hover:bg-orange-100",
    icon: "text-orange-500",
    progress: "bg-orange-500",
  },
  purple: {
    bg: "bg-purple-50 group-hover:bg-purple-100",
    icon: "text-purple-500",
    progress: "bg-purple-500",
  },
};

function ProgressCard({ icon, label, value, subtext, color, progress }: ProgressCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={`${styles.bg} rounded-xl p-3 transition-all group-hover:scale-[1.02]`}
    >
      <div className={`${styles.icon} mb-2`}>{icon}</div>
      <div className="font-bold text-gray-800 text-lg leading-tight">{value}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${styles.progress} rounded-full transition-all`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
