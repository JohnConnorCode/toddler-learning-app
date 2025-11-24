"use client";

import { motion } from "framer-motion";
import { Lock, Star, Check } from "lucide-react";
import Link from "next/link";
import { LEVELS, isLessonUnlocked, type LevelProgress } from "@/lib/levels-data";
import { useLevelProgress } from "@/hooks/use-level-progress";

export function LevelMap() {
  const { levels, currentLevel, getTotalProgress } = useLevelProgress();
  const { completedLevels, percentComplete } = getTotalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F0] via-[#FFF5E1] to-[#FFE4B5] p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-2">
            Your Learning Journey
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {completedLevels} of {LEVELS.length} levels complete
          </p>

          {/* Overall Progress Bar */}
          <div className="max-w-md mx-auto bg-white rounded-full h-4 shadow-inner overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentComplete}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-green-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Level Path - Display in reverse order (10 to 1, top to bottom) */}
      <div className="max-w-3xl mx-auto space-y-6">
        {[...LEVELS].reverse().map((level, index) => {
          const levelProgress = levels[level.id];
          const isUnlocked = levelProgress?.unlockedAt !== undefined;
          const isComplete = levelProgress?.percentComplete === 100;
          const isCurrent = currentLevel === level.id;
          const reverseIndex = LEVELS.length - 1 - index;

          return (
            <motion.div
              key={level.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: reverseIndex * 0.1 }}
            >
              <LevelCard
                level={level}
                progress={levelProgress}
                isUnlocked={isUnlocked}
                isComplete={isComplete}
                isCurrent={isCurrent}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-2xl mx-auto mt-12 text-center text-gray-500 text-sm"
      >
        <p>🌟 Complete lessons to unlock new levels and stories!</p>
      </motion.div>
    </div>
  );
}

interface LevelCardProps {
  level: typeof LEVELS[number];
  progress: LevelProgress | undefined;
  isUnlocked: boolean;
  isComplete: boolean;
  isCurrent: boolean;
}

function LevelCard({
  level,
  progress,
  isUnlocked,
  isComplete,
  isCurrent,
}: LevelCardProps) {
  const content = (
    <div
      className={`
        relative group rounded-3xl overflow-hidden transition-all duration-300
        ${isUnlocked ? "shadow-xl hover:shadow-2xl hover:scale-[1.02]" : "opacity-50"}
        ${isCurrent ? "ring-4 ring-primary ring-offset-4" : ""}
      `}
      style={{
        background: isUnlocked
          ? `linear-gradient(135deg, ${level.color.primary}20 0%, ${level.color.secondary}40 100%)`
          : "#F0F0F0",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, ${level.color.primary} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
        {/* Level Icon */}
        <div
          className={`
            flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl
            ${isUnlocked ? "bg-white shadow-lg" : "bg-gray-200"}
          `}
        >
          {isComplete ? (
            <div className="bg-green-500 w-full h-full rounded-2xl flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
          ) : !isUnlocked ? (
            <Lock className="w-8 h-8 text-gray-400" />
          ) : (
            <span>{level.icon}</span>
          )}
        </div>

        {/* Level Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Level {level.levelNumber}
            </span>
            {isCurrent && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                Current
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-1">
            {level.title}
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-3">
            {level.description}
          </p>

          {/* Progress Bar */}
          {isUnlocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{progress?.lessonsCompleted.length || 0} / {level.lessons.length} lessons</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {progress?.starsEarned || 0}
                </span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress?.percentComplete || 0}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${level.color.primary} 0%, ${level.color.secondary} 100%)`,
                  }}
                />
              </div>
            </div>
          )}

          {!isUnlocked && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Complete previous levels to unlock</span>
            </div>
          )}
        </div>

        {/* Arrow/CTA */}
        {isUnlocked && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Unlock Badge */}
      {isComplete && level.rewardStoryId && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Story Unlocked!
        </div>
      )}
    </div>
  );

  // Wrap in Link if unlocked
  if (isUnlocked) {
    return (
      <Link href={`/levels/${level.id}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
