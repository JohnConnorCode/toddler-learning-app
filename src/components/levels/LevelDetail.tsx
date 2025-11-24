"use client";

import { motion } from "framer-motion";
import { Lock, Star, Clock, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { type Level, type Lesson, isLessonUnlocked } from "@/lib/levels-data";
import { useLevelProgress } from "@/hooks/use-level-progress";

interface LevelDetailProps {
  level: Level;
}

export function LevelDetail({ level }: LevelDetailProps) {
  const userProgress = useLevelProgress();
  const levelProgress = userProgress.getLevelProgress(level.id);

  if (!levelProgress) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
        <p className="text-gray-600">Level not found</p>
      </div>
    );
  }

  const isLevelUnlocked = levelProgress.unlockedAt !== undefined;
  const isComplete = levelProgress.percentComplete === 100;

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8"
      style={{
        background: `linear-gradient(to bottom, ${level.color.background} 0%, ${level.color.primary}10 100%)`,
      }}
    >
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          href="/levels"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">All Levels</span>
        </Link>
      </div>

      {/* Level Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div
          className="rounded-3xl overflow-hidden shadow-2xl p-8 relative"
          style={{
            background: `linear-gradient(135deg, ${level.color.primary}20 0%, ${level.color.secondary}40 100%)`,
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

          <div className="relative">
            <div className="flex items-start gap-6 mb-6">
              {/* Icon */}
              <div
                className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-5xl bg-white shadow-lg"
              >
                {isComplete ? (
                  <div className="bg-green-500 w-full h-full rounded-2xl flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                ) : (
                  <span>{level.icon}</span>
                )}
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Level {level.levelNumber}
                  </span>
                  {isComplete && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                      Complete!
                    </span>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-2">
                  {level.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{level.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md">
                    <span className="font-medium text-gray-600">Lessons:</span>
                    <span className="font-bold text-gray-800">
                      {levelProgress.lessonsCompleted.length} / {level.lessons.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-800">
                      {levelProgress.starsEarned} / {levelProgress.totalStars}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md">
                    <span className="font-medium text-gray-600">Progress:</span>
                    <span className="font-bold text-gray-800">
                      {Math.round(levelProgress.percentComplete)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.percentComplete}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${level.color.primary} 0%, ${level.color.secondary} 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-gray-800 mb-6">Lessons</h2>

        {level.lessons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <p className="text-gray-500 text-lg mb-2">Coming Soon!</p>
            <p className="text-gray-400">Lessons for this level are being prepared.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {level.lessons.map((lesson, index) => {
              const isUnlocked = isLessonUnlocked(lesson.id, userProgress);
              const isLessonComplete = levelProgress.lessonsCompleted.includes(lesson.id);
              const isCurrent = levelProgress.currentLesson === lesson.id;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LessonCard
                    level={level}
                    lesson={lesson}
                    isUnlocked={isUnlocked}
                    isComplete={isLessonComplete}
                    isCurrent={isCurrent}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reward Story Banner */}
      {isComplete && level.rewardStoryId && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-1">
                  Level Complete!
                </h3>
                <p className="text-white/90">
                  You've unlocked a new story! Check your library.
                </p>
              </div>
              <Link
                href="/stories"
                className="px-6 py-3 bg-white rounded-full font-bold text-gray-800 hover:scale-105 transition-transform shadow-lg"
              >
                View Story
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface LessonCardProps {
  level: Level;
  lesson: Lesson;
  isUnlocked: boolean;
  isComplete: boolean;
  isCurrent: boolean;
}

function LessonCard({
  level,
  lesson,
  isUnlocked,
  isComplete,
  isCurrent,
}: LessonCardProps) {
  const content = (
    <div
      className={`
        group relative rounded-2xl overflow-hidden transition-all duration-300
        ${isUnlocked ? "shadow-lg hover:shadow-xl hover:scale-[1.02]" : "opacity-50"}
        ${isCurrent ? "ring-4 ring-offset-2" : ""}
        ${isComplete ? "bg-green-50" : "bg-white"}
      `}
      style={isCurrent ? {
        boxShadow: `0 0 0 4px ${level.color.primary}40, 0 0 0 6px ${level.color.primary}`,
      } : undefined}
    >
      <div className="p-6 flex items-center gap-4">
        {/* Lesson Number */}
        <div
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg
            ${isComplete ? "bg-green-500 text-white" : isUnlocked ? "text-white" : "bg-gray-200 text-gray-400"}
          `}
          style={{
            background: isComplete ? undefined : isUnlocked ? level.color.primary : undefined,
          }}
        >
          {isComplete ? "✓" : !isUnlocked ? <Lock className="w-5 h-5" /> : lesson.lessonNumber}
        </div>

        {/* Lesson Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-black text-gray-800">{lesson.title}</h3>
            {isCurrent && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: level.color.primary }}>
                Current
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>

          {isUnlocked && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{lesson.estimatedMinutes} min</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{lesson.activities.length} activities</span>
              </div>
            </div>
          )}

          {!isUnlocked && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-3 h-3" />
              <span>Complete previous lessons to unlock</span>
            </div>
          )}
        </div>

        {/* CTA */}
        {isUnlocked && (
          <div className="flex-shrink-0">
            <div
              className="px-6 py-2 rounded-full font-bold text-white shadow-md group-hover:scale-105 transition-transform"
              style={{ backgroundColor: level.color.primary }}
            >
              {isComplete ? "Replay" : "Start"}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isUnlocked) {
    return (
      <Link href={`/levels/${level.id}/lessons/${lesson.id}`}>
        {content}
      </Link>
    );
  }

  return content;
}
