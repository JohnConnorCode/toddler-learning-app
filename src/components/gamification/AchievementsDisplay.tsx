"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAchievements } from "@/hooks/use-achievements";
import {
  BADGES,
  XP_LEVELS,
  getBadgeById,
  BadgeCategory,
} from "@/lib/achievements-data";
import {
  ArrowLeft,
  Award,
  Flame,
  Star,
  Trophy,
  TrendingUp,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_INFO: Record<
  BadgeCategory,
  { icon: string; title: string; color: string }
> = {
  streak: { icon: "🔥", title: "Streaks", color: "#FF4500" },
  completion: { icon: "🌟", title: "Completion", color: "#FFD700" },
  mastery: { icon: "✨", title: "Mastery", color: "#FF1493" },
  explorer: { icon: "🗺️", title: "Explorer", color: "#32CD32" },
  reader: { icon: "📚", title: "Reader", color: "#8B4513" },
  learner: { icon: "🚀", title: "Learner", color: "#FF6347" },
};

export function AchievementsDisplay() {
  const {
    totalXP,
    level,
    badges,
    currentStreak,
    longestStreak,
    stats,
    getLevelProgressPercent,
    getXPToNextLevel,
  } = useAchievements();

  const progressPercent = getLevelProgressPercent();
  const xpToNext = getXPToNextLevel();
  const currentLevelData = XP_LEVELS.find((l) => l.level === level);
  const nextLevelData = XP_LEVELS.find((l) => l.level === level + 1);

  const categories: BadgeCategory[] = [
    "streak",
    "completion",
    "mastery",
    "explorer",
    "reader",
    "learner",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Achievements
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Your learning journey rewards!
          </p>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{currentLevelData?.icon || "🌟"}</div>
            <div>
              <p className="text-sm font-bold text-gray-500">XP Level</p>
              <p className="text-3xl font-black text-gray-800">{level}</p>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>{totalXP} XP</span>
              {nextLevelData && <span>{nextLevelData.xpRequired} XP</span>}
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              />
            </div>
          </div>

          {nextLevelData && (
            <p className="text-xs text-gray-500 text-center mt-2">
              {xpToNext} XP to level {level + 1}
            </p>
          )}
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🔥</div>
            <div>
              <p className="text-sm font-bold text-gray-500">Current Streak</p>
              <p className="text-3xl font-black text-orange-500">
                {currentStreak}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Longest: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Badges Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🏆</div>
            <div>
              <p className="text-sm font-bold text-gray-500">Badges Earned</p>
              <p className="text-3xl font-black text-purple-500">
                {badges.length}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {BADGES.length - badges.length} more to collect
          </p>
        </motion.div>

        {/* Lessons Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">📚</div>
            <div>
              <p className="text-sm font-bold text-gray-500">Lessons Done</p>
              <p className="text-3xl font-black text-blue-500">
                {stats.lessonsCompleted}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {stats.lessonsPerfect} perfect (3 stars)
          </p>
        </motion.div>
      </div>

      {/* Badges by Category */}
      <div className="max-w-6xl mx-auto space-y-8">
        {categories.map((category) => {
          const categoryBadges = BADGES.filter((b) => b.category === category);
          const earnedBadges = badges.filter((ub) => {
            const badge = getBadgeById(ub.badgeId);
            return badge?.category === category;
          });
          const categoryInfo = CATEGORY_INFO[category];

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">{categoryInfo.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-gray-800">
                    {categoryInfo.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {earnedBadges.length} of {categoryBadges.length} earned
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryBadges.map((badge) => {
                  const isEarned = badges.some((ub) => ub.badgeId === badge.id);
                  return (
                    <BadgeCard key={badge.id} badge={badge} earned={isEarned} />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface BadgeCardProps {
  badge: any;
  earned: boolean;
}

function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : undefined}
      className={cn(
        "relative rounded-xl p-4 transition-all",
        earned
          ? "bg-gradient-to-br shadow-lg cursor-pointer"
          : "bg-gray-100 opacity-60"
      )}
      style={
        earned
          ? {
              backgroundImage: `linear-gradient(to bottom right, ${badge.color.background}, ${badge.color.secondary}20)`,
            }
          : undefined
      }
    >
      {!earned && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <div className="text-center">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="font-black text-sm text-gray-800 mb-1">{badge.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>

        {earned ? (
          <div className="inline-flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-700">
              +{badge.xpReward} XP
            </span>
          </div>
        ) : (
          <div className="text-xs font-bold text-gray-500">
            {badge.rarity}
          </div>
        )}
      </div>
    </motion.div>
  );
}
