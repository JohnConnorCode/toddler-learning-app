"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useStoryProgress } from "@/hooks/use-story-progress";
import { useGlobalProgress, useMathProgress } from "@/lib/framework/progress-store";
import { useProgress } from "@/hooks/use-progress";
import { STORIES } from "@/lib/stories-data";
import {
  getOverallBlendingStats,
  getAllWordReviews,
  exportReviewData,
} from "@/lib/word-scheduler";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  Calendar,
  Download,
  Star,
  Target,
  AlertCircle,
  CheckCircle2,
  User,
  Flame,
  BookOpen,
  Calculator,
  Sparkles,
  Trophy,
} from "lucide-react";

export default function ParentDashboardPage() {
  const { state, getOverallProgress } = usePhonicsProgress();
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Child profile
  const { childProfile } = useOnboarding();

  // Global progress (XP, level, streak)
  const { totalXP, currentLevel, streak } = useGlobalProgress();

  // Story progress
  const storyProgress = useStoryProgress();
  const storiesRead = Object.values(storyProgress.stories).filter(s => s.completed).length;
  const totalStories = STORIES.length;
  const favoriteStories = storyProgress.favorites.length;

  // Math progress
  const mathProgress = useMathProgress();
  const mathLessonsCompleted = Object.values(mathProgress.progress?.lessonProgress || {}).filter(l => l.completed).length;

  // Word progress
  const { getStats } = useProgress();
  const wordStats = getStats();

  const completedUnits = state.completedUnits;
  const maxUnit = completedUnits.length > 0 ? Math.max(...completedUnits) : 1;
  const phonicsProgress = getOverallProgress();

  // Get blending statistics
  const blendingStats = getOverallBlendingStats(maxUnit);
  const allReviews = getAllWordReviews();
  const reviewsArray = Object.values(allReviews);

  // Categorize words
  const masteredWords = reviewsArray.filter((r) => r.blendingMastered);
  const inProgressWords = reviewsArray.filter(
    (r) => r.reviewCount > 0 && !r.blendingMastered
  );
  const needsPracticeWords = reviewsArray.filter(
    (r) => r.reviewCount > 0 && r.failureCount > r.successCount
  );

  // Get due words
  const now = new Date();
  const dueWords = reviewsArray.filter((r) => {
    const dueDate = new Date(r.nextDueAt);
    return dueDate <= now && !r.blendingMastered;
  });

  // Top performing words
  const topWords = [...reviewsArray]
    .filter((r) => r.reviewCount >= 3)
    .sort((a, b) => b.avgSmoothnessScore - a.avgSmoothnessScore)
    .slice(0, 5);

  // Recent activity
  const recentWords = [...reviewsArray]
    .filter((r) => r.lastReviewedAt)
    .sort((a, b) => {
      const dateA = new Date(a.lastReviewedAt!).getTime();
      const dateB = new Date(b.lastReviewedAt!).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const handleExport = () => {
    const data = exportReviewData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blending-progress-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl md:text-3xl font-black text-gray-800">
                Parent Dashboard
              </h1>
            </div>
          </Link>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export Data</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Export Success Message */}
        {showExportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border-2 border-green-400 rounded-xl px-6 py-3 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Progress data exported successfully!
            </span>
          </motion.div>
        )}

        {/* Child Profile & Global Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Child Profile Card */}
          {childProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{childProfile.avatarEmoji}</div>
                <div>
                  <h2 className="text-2xl font-black">{childProfile.name}</h2>
                  <p className="opacity-90">{childProfile.age} years old</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{currentLevel}</p>
                  <p className="text-xs opacity-75">Level</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{totalXP}</p>
                  <p className="text-xs opacity-75">Total XP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Flame className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{streak || wordStats.streakDays}</p>
                  <p className="text-xs opacity-75">Day Streak</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stories Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-indigo-400"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-700">Story Reading</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stories Read</span>
                <span className="font-bold text-gray-800">{storiesRead} / {totalStories}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${(storiesRead / totalStories) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Favorites</span>
                <span className="text-pink-600 font-bold">{favoriteStories}</span>
              </div>
            </div>
          </motion.div>

          {/* Math Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-emerald-400"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Calculator className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-700">Math Learning</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lessons Completed</span>
                <span className="font-bold text-gray-800">{mathLessonsCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words Practiced</span>
                <span className="font-bold text-gray-800">{wordStats.totalWords}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Letters Learned</span>
                <span className="font-bold text-gray-800">{wordStats.totalLetters}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Avg. Mastery</span>
                <span className="text-emerald-600 font-bold">{wordStats.averageMastery}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reading & Blending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Phonics Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-blue-400"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-700">Phonics Progress</h3>
            </div>
            <p className="text-4xl font-black text-gray-800">
              {Math.round(phonicsProgress)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {completedUnits.length} units completed
            </p>
          </motion.div>

          {/* Mastered Words */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-green-400"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-700">Mastered Words</h3>
            </div>
            <p className="text-4xl font-black text-gray-800">
              {blendingStats.masteredWords}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {blendingStats.totalWords > 0
                ? Math.round(
                    (blendingStats.masteredWords / blendingStats.totalWords) *
                      100
                  )
                : 0}
              % of practiced
            </p>
          </motion.div>

          {/* In Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-yellow-400"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-700">In Progress</h3>
            </div>
            <p className="text-4xl font-black text-gray-800">
              {blendingStats.inProgressWords}
            </p>
            <p className="text-sm text-gray-500 mt-1">words being learned</p>
          </motion.div>

          {/* Due for Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-purple-400"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-700">Due Today</h3>
            </div>
            <p className="text-4xl font-black text-gray-800">{dueWords.length}</p>
            <p className="text-sm text-gray-500 mt-1">words need practice</p>
          </motion.div>
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Overall Blending Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-800">
                {blendingStats.totalReviews}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Smoothness</p>
              <p className="text-3xl font-bold text-gray-800">
                {Math.round(blendingStats.avgSmoothness * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Words Practiced</p>
              <p className="text-3xl font-bold text-gray-800">
                {blendingStats.totalWords}
              </p>
            </div>
          </div>

          {/* Smoothness Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Blending Smoothness
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round(blendingStats.avgSmoothness * 100)}%
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${blendingStats.avgSmoothness * 100}%`,
                }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Words */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-green-500 fill-green-500" />
              Top Performing Words
            </h2>

            {topWords.length > 0 ? (
              <div className="space-y-3">
                {topWords.map((word, index) => (
                  <div
                    key={word.word}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-gray-400">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 uppercase">
                          {word.word}
                        </p>
                        <p className="text-sm text-gray-500">
                          {word.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {Math.round(word.avgSmoothnessScore * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">smoothness</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No words practiced yet. Start blending activities to see progress!
              </p>
            )}
          </motion.div>

          {/* Words Needing Practice */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Needs More Practice
            </h2>

            {needsPracticeWords.length > 0 ? (
              <div className="space-y-3">
                {needsPracticeWords.slice(0, 5).map((word) => (
                  <div
                    key={word.word}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-gray-800 uppercase">
                        {word.word}
                      </p>
                      <p className="text-sm text-gray-600">
                        {word.failureCount} mistakes · {word.successCount}{" "}
                        successes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {Math.round(
                          (word.successCount /
                            (word.successCount + word.failureCount)) *
                            100
                        )}
                        %
                      </p>
                      <p className="text-xs text-gray-500">success rate</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Great! No words need extra practice right now.
              </p>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-black text-gray-800 mb-4">
            Recent Activity
          </h2>

          {recentWords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 text-gray-600 font-bold">
                      Word
                    </th>
                    <th className="text-left p-3 text-gray-600 font-bold">
                      Reviews
                    </th>
                    <th className="text-left p-3 text-gray-600 font-bold">
                      Smoothness
                    </th>
                    <th className="text-left p-3 text-gray-600 font-bold">
                      Last Reviewed
                    </th>
                    <th className="text-left p-3 text-gray-600 font-bold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentWords.map((word) => {
                    const lastReviewed = word.lastReviewedAt
                      ? new Date(word.lastReviewedAt)
                      : null;
                    const daysAgo = lastReviewed
                      ? Math.floor(
                          (Date.now() - lastReviewed.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : null;

                    return (
                      <tr key={word.word} className="border-b border-gray-100">
                        <td className="p-3 font-bold text-gray-800 uppercase">
                          {word.word}
                        </td>
                        <td className="p-3 text-gray-600">{word.reviewCount}</td>
                        <td className="p-3">
                          <span
                            className={`font-bold ${
                              word.avgSmoothnessScore >= 0.7
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}
                          >
                            {Math.round(word.avgSmoothnessScore * 100)}%
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {daysAgo === 0
                            ? "Today"
                            : daysAgo === 1
                            ? "Yesterday"
                            : `${daysAgo} days ago`}
                        </td>
                        <td className="p-3">
                          {word.blendingMastered ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              Mastered
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                              Learning
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No activity yet. Start practicing to see progress!
            </p>
          )}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200"
        >
          <h2 className="text-xl font-black text-gray-800 mb-3">
            💡 Tips for Success
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Short sessions:</strong> 10-15 minutes daily is better
                than long occasional sessions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Consistency matters:</strong> Regular practice helps
                build strong reading foundations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Review due words:</strong> {dueWords.length} words are
                ready for review today
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Celebrate progress:</strong> {masteredWords.length}{" "}
                words mastered so far!
              </span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
