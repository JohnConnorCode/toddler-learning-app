"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, Star, RefreshCw, CheckCircle, Trophy, Home } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { useAudio } from "@/hooks/use-audio";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";
import { getPhonicsItemByLetter } from "@/lib/systematic-phonics-data";

export default function DailyReviewPage() {
  const {
    getReviewItems,
    recordLetterPractice,
    getLearningStats,
  } = useLearningProgress();
  const { playLetterSound } = useAudio();

  const [reviewItems, setReviewItems] = useState<ReturnType<typeof getReviewItems>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "sound" | "quiz" | "feedback">("intro");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load review items on mount
  useEffect(() => {
    const items = getReviewItems();
    setReviewItems(items);
    if (items.length === 0) {
      setIsComplete(true);
    }
  }, [getReviewItems]);

  const currentItem = reviewItems[currentIndex];
  const phonicsItem = currentItem ? getPhonicsItemByLetter(currentItem.item) : null;

  // Generate quiz options
  const generateQuizOptions = useCallback(() => {
    if (!currentItem) return [];
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractors = allLetters
      .filter((l) => l !== currentItem.item)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...distractors, currentItem.item].sort(() => Math.random() - 0.5);
  }, [currentItem]);

  // Play letter sound
  const playSound = useCallback(async () => {
    if (!currentItem || isPlaying) return;
    setIsPlaying(true);
    await playLetterSound(currentItem.item, "phonics");
    setIsPlaying(false);
  }, [currentItem, playLetterSound, isPlaying]);

  // Start quiz for current letter
  const startQuiz = useCallback(() => {
    setQuizOptions(generateQuizOptions());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPhase("quiz");
    // Play the sound to identify
    if (currentItem) {
      playLetterSound(currentItem.item, "phonics");
    }
  }, [generateQuizOptions, currentItem, playLetterSound]);

  // Handle answer selection
  const handleAnswer = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null || !currentItem) return;

      playFeedback("pop", "light");
      setSelectedAnswer(answer);
      const correct = answer === currentItem.item;
      setIsCorrect(correct);

      // Record practice
      recordLetterPractice(currentItem.item, correct);

      // Track session results
      setSessionResults((prev) => ({
        ...prev,
        [currentItem.item]: correct,
      }));

      if (correct) {
        playFeedback("success", "medium");
        playLetterSound(currentItem.item, "name");
      } else {
        playFeedback("snap", "light");
      }

      setPhase("feedback");
    },
    [selectedAnswer, currentItem, recordLetterPractice, playLetterSound]
  );

  // Move to next letter or complete
  const handleNext = useCallback(() => {
    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase("intro");
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, reviewItems.length]);

  // Auto-play sound on intro
  useEffect(() => {
    if (phase === "intro" && currentItem) {
      const timer = setTimeout(() => {
        playSound();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, currentItem, playSound]);

  // Completion screen
  if (isComplete) {
    const stats = getLearningStats();
    const correctCount = Object.values(sessionResults).filter(Boolean).length;
    const totalCount = reviewItems.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center"
        >
          {totalCount === 0 ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                🌟
              </motion.div>
              <h1 className="text-3xl font-black text-gray-800 mb-4">
                All Caught Up!
              </h1>
              <p className="text-gray-600 mb-6">
                No letters need review right now. Great job keeping up with your practice!
              </p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                {correctCount === totalCount ? "🏆" : correctCount >= totalCount / 2 ? "⭐" : "💪"}
              </motion.div>
              <h1 className="text-3xl font-black text-gray-800 mb-2">
                Review Complete!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {correctCount}/{totalCount} correct
              </p>

              {/* Results */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {reviewItems.map((item) => {
                  const correct = sessionResults[item.item];
                  return (
                    <div
                      key={item.item}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl",
                        correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {item.item}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Progress stats */}
          {stats && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span className="font-bold">{stats.mastered}/26 mastered</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  style={{ width: `${(stats.mastered / 26) * 100}%` }}
                />
              </div>
              {stats.nextMilestone && (
                <p className="text-xs text-gray-500 mt-2">{stats.nextMilestone}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/phonics"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-black text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              Continue Learning
            </Link>
            <Link
              href="/"
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-bold text-base flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentItem || !phonicsItem) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between">
        <Link
          href="/"
          className="bg-white p-4 rounded-full shadow-md hover:shadow-lg transition-all min-w-[60px] min-h-[60px] flex items-center justify-center"
        >
          <ArrowLeft className="w-8 h-8 text-gray-600" />
        </Link>

        <div className="text-center">
          <span className="text-sm font-bold text-gray-500">Daily Review</span>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm mt-1">
            <span className="font-black text-primary text-lg">
              {currentIndex + 1} / {reviewItems.length}
            </span>
          </div>
        </div>

        <div className="w-16" />
      </header>

      {/* Progress bar */}
      <div className="px-6 mb-4">
        <div className="max-w-lg mx-auto w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / reviewItems.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="w-full max-w-lg"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center">
              {/* Priority indicator */}
              <div className="flex justify-center mb-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    currentItem.priority >= 5
                      ? "bg-red-100 text-red-700"
                      : currentItem.priority >= 4
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {currentItem.reason}
                </span>
              </div>

              {/* Letter display */}
              <motion.div
                animate={phase === "intro" ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: phase === "intro" ? Infinity : 0 }}
                className={cn(
                  "w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl flex items-center justify-center mb-6",
                  phonicsItem?.color || "bg-blue-500"
                )}
              >
                <span className="text-7xl sm:text-8xl font-black text-white">
                  {currentItem.item}
                </span>
              </motion.div>

              {/* Phase content */}
              {phase === "intro" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xl font-bold text-gray-600 mb-4">
                    Remember this letter?
                  </p>
                  <button
                    onClick={playSound}
                    disabled={isPlaying}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all mb-4"
                  >
                    <Volume2 className="w-5 h-5" />
                    {isPlaying ? "Playing..." : "Hear Sound"}
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={startQuiz}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-black text-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Test Me!
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === "quiz" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <button
                      onClick={playSound}
                      className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Volume2 className="w-6 h-6 text-blue-600" />
                    </button>
                    <p className="text-xl font-black text-gray-800">
                      Which letter makes this sound?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {quizOptions.map((letter) => {
                      const letterItem = getPhonicsItemByLetter(letter);
                      return (
                        <button
                          key={letter}
                          onClick={() => handleAnswer(letter)}
                          className={cn(
                            "p-6 rounded-2xl font-black text-5xl transition-all min-h-[100px]",
                            letterItem?.color || "bg-gray-200",
                            "text-white hover:scale-105 active:scale-95"
                          )}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {phase === "feedback" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {isCorrect ? (
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl mb-4"
                      >
                        ⭐
                      </motion.div>
                      <p className="text-2xl font-black text-green-600 mb-2">
                        Excellent!
                      </p>
                      <p className="text-gray-600 mb-4">
                        You remembered "{currentItem.item}" makes the{" "}
                        <span className="font-bold text-purple-600">
                          /{phonicsItem?.sound || currentItem.item.toLowerCase()}/
                        </span>{" "}
                        sound!
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">💪</div>
                      <p className="text-xl font-bold text-orange-600 mb-2">
                        Keep practicing!
                      </p>
                      <p className="text-gray-600 mb-4">
                        "{currentItem.item}" makes the{" "}
                        <span className="font-bold text-purple-600">
                          /{phonicsItem?.sound || currentItem.item.toLowerCase()}/
                        </span>{" "}
                        sound, like in "{phonicsItem?.word}"
                      </p>
                      <button
                        onClick={playSound}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold"
                      >
                        <Volume2 className="w-4 h-4" />
                        Hear it again
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-black text-xl shadow-lg"
                  >
                    {currentIndex < reviewItems.length - 1 ? "Next Letter" : "Finish"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
