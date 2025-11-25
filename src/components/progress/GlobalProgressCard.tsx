"use client";

import { motion } from "framer-motion";
import { Star, Zap, Flame, TrendingUp } from "lucide-react";
import { useGlobalProgress, useProgressStore } from "@/lib/framework";
import { useAccessibility } from "@/hooks/use-accessibility";

interface GlobalProgressCardProps {
  showDetails?: boolean;
}

export function GlobalProgressCard({ showDetails = true }: GlobalProgressCardProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { totalXP, currentLevel, streak, xpForNextLevel } = useGlobalProgress();

  // Calculate progress to next level
  const xpProgress = totalXP % xpForNextLevel;
  const progressPercent = Math.round((xpProgress / xpForNextLevel) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black">Your Progress</h2>
          <p className="text-white/80 text-sm">Keep learning every day!</p>
        </div>
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
        >
          <Star className="w-6 h-6 text-yellow-300" />
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatBox
          icon={<TrendingUp className="w-4 h-4" />}
          label="Level"
          value={currentLevel}
          color="bg-white/20"
        />
        <StatBox
          icon={<Zap className="w-4 h-4" />}
          label="XP"
          value={totalXP}
          color="bg-white/20"
        />
        <StatBox
          icon={<Flame className="w-4 h-4" />}
          label="Streak"
          value={`${streak} 🔥`}
          color="bg-white/20"
        />
      </div>

      {/* Level Progress Bar */}
      <div className="bg-white/10 rounded-full p-1">
        <div className="relative">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/70">
            <span>Level {currentLevel}</span>
            <span>{xpProgress} / {xpForNextLevel} XP</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      {showDetails && streak > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-white/20"
        >
          <div className="flex items-center gap-2 text-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>
              {streak === 1
                ? "You started a learning streak!"
                : `${streak} day streak! Keep it going!`}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatBox({ icon, label, value, color }: StatBoxProps) {
  return (
    <div className={`${color} rounded-xl p-3 text-center`}>
      <div className="flex items-center justify-center gap-1 text-white/70 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
}

/**
 * Compact progress indicator for headers/navigation
 */
export function ProgressIndicator() {
  const { totalXP, currentLevel, streak } = useGlobalProgress();

  return (
    <div className="flex items-center gap-3">
      {/* Level Badge */}
      <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-600">Lv.{currentLevel}</span>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
        <Zap className="w-3 h-3 text-purple-600" />
        <span className="text-xs font-bold text-purple-600">{totalXP}</span>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
          <Flame className="w-3 h-3 text-orange-600" />
          <span className="text-xs font-bold text-orange-600">{streak}</span>
        </div>
      )}
    </div>
  );
}
