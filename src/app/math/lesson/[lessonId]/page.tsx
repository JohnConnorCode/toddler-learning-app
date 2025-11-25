"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Trophy,
  Home,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useAdaptiveDifficulty, type DifficultyLevel } from "@/hooks/use-adaptive-difficulty";
import {
  getMathLessonById,
  type MathLesson,
  type MathProblem,
} from "@/lib/math-data";
import { MathProblemCard } from "@/components/math/MathProblemCard";
import { useSubjectProgress, useGlobalProgress } from "@/lib/framework";
import { calculateStars } from "@/lib/framework";
import { playSound, playFeedback } from "@/lib/sound-effects";
import {
  triggerSmallConfetti,
  triggerMediumConfetti,
  triggerBigConfetti,
  triggerMegaConfetti,
  triggerStarShower,
} from "@/lib/confetti";

type LessonPhase = "intro" | "active" | "complete";

export default function MathLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const { shouldReduceMotion } = useAccessibility();

  const [lesson, setLesson] = useState<MathLesson | null>(null);
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const { completeLesson, recordAttempt } = useSubjectProgress("math");
  const { completeActivity } = useGlobalProgress();
  const {
    showHints: adaptiveShowHints,
    streak,
    recordAttempt: recordAdaptiveAttempt,
    getPerformanceSummary,
  } = useAdaptiveDifficulty("math");

  useEffect(() => {
    const foundLesson = getMathLessonById(lessonId);
    if (foundLesson) {
      setLesson(foundLesson);
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <p className="text-gray-500">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const currentProblem = lesson.problems[currentIndex];
  const progress = ((currentIndex + 1) / lesson.problems.length) * 100;

  const handleAnswer = (isCorrect: boolean, attempts: number) => {
    setTotalAttempts((prev) => prev + attempts);

    // Record to adaptive difficulty system
    recordAdaptiveAttempt(
      currentProblem.id,
      isCorrect,
      attempts,
      (currentProblem.difficulty || 1) as DifficultyLevel
    );

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      // Score based on attempts (fewer attempts = higher score)
      const problemScore = Math.max(100 - (attempts - 1) * 25, 25);
      setScore((prev) => prev + problemScore);

      // Record progress
      recordAttempt(currentProblem.id, true);
    }

    // Move to next problem or complete
    setTimeout(() => {
      if (currentIndex < lesson.problems.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleComplete();
      }
    }, 500);
  };

  const handleComplete = () => {
    const finalScore = Math.round(
      (correctCount / lesson.problems.length) * 100
    );
    const stars = calculateStars(finalScore);

    // Record lesson completion
    completeLesson(lessonId, finalScore);

    // Record activity for XP
    completeActivity({
      activityId: lessonId,
      subjectId: "math",
      activityType: lesson.type,
      isCorrect: finalScore >= 70,
      score: finalScore,
      xpEarned: Math.round(finalScore / 10) + stars * 5,
      duration: 0, // We could track this
      attempts: totalAttempts,
      timestamp: new Date().toISOString(),
    });

    // Difficulty-based celebration with sound
    if (!shouldReduceMotion) {
      if (stars === 3) {
        // Perfect score - mega celebration
        playFeedback('celebrate', 'heavy');
        triggerMegaConfetti();
        triggerStarShower();
      } else if (stars === 2) {
        // Good job - big celebration
        playFeedback('fanfare', 'medium');
        triggerBigConfetti();
      } else if (stars === 1) {
        // Completed - medium celebration
        playSound('success');
        triggerMediumConfetti();
      } else {
        // Keep trying - small encouragement
        playSound('chime');
        triggerSmallConfetti();
      }
    } else {
      // Reduced motion - just play sound
      playSound(stars >= 2 ? 'celebrate' : 'success');
    }

    setPhase("complete");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setTotalAttempts(0);
    setCorrectCount(0);
    setPhase("active");
  };

  // Intro Phase
  if (phase === "intro") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/math">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.div>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">{lesson.title}</h1>
          </div>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔢</span>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mb-2">
              {lesson.title}
            </h2>
            <p className="text-gray-500 mb-6">{lesson.description}</p>

            {/* Objectives */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="font-semibold text-gray-700 mb-2">You will learn:</p>
              <ul className="space-y-1">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {lesson.problems.length}
                </p>
                <p className="text-gray-400">Problems</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {lesson.estimatedMinutes}
                </p>
                <p className="text-gray-400">Minutes</p>
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => {
                playSound('whoosh');
                setPhase("active");
              }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Lesson
            </motion.button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Complete Phase
  if (phase === "complete") {
    const finalScore = Math.round((correctCount / lesson.problems.length) * 100);
    const stars = calculateStars(finalScore);
    const performance = getPerformanceSummary();

    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md w-full"
        >
          {/* Trophy */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-black text-gray-800 mb-2">
            {stars >= 3
              ? "Perfect!"
              : stars >= 2
              ? "Great Job!"
              : stars >= 1
              ? "Good Try!"
              : "Keep Practicing!"}
          </h2>
          <p className="text-gray-500 mb-6">You completed {lesson.title}</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: star * 0.2 }}
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= stars
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-black text-emerald-600">
                  {correctCount}/{lesson.problems.length}
                </p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-purple-600">
                  {finalScore}%
                </p>
                <p className="text-sm text-gray-400">Score</p>
              </div>
            </div>
          </div>

          {/* Performance feedback */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-purple-700 text-center">
              {performance.recommendation}
            </p>
            {performance.difficultyTrend === "increasing" && (
              <p className="text-xs text-purple-500 text-center mt-1">
                📈 You're getting better!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/math" className="flex-1">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back
              </motion.button>
            </Link>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => {
                playSound('whoosh');
                handleRestart();
              }}
              className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retry
            </motion.button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Active Phase
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/math">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="p-2 bg-white rounded-full shadow-md"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.div>
          </Link>

          {/* Progress */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">
              {currentIndex + 1} of {lesson.problems.length}
            </p>
          </div>

          {/* Score + Streak */}
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-100 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <span className="text-sm">🔥</span>
                <span className="text-xs font-bold text-orange-600">{streak}</span>
              </motion.div>
            )}
            <div className="bg-white px-3 py-1 rounded-full shadow-md">
              <span className="font-bold text-emerald-600">{correctCount}</span>
              <span className="text-gray-400"> / {lesson.problems.length}</span>
            </div>
          </div>
        </div>

        {/* Problem Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProblem.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <MathProblemCard
              problem={currentProblem}
              onAnswer={handleAnswer}
              showHint={adaptiveShowHints || true}
              autoSpeak={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
