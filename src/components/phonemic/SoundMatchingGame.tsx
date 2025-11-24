"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, ArrowRight, Award } from "lucide-react";
import { Howl } from "howler";
import {
  SoundMatchingQuestion,
  SOUND_MATCHING_QUESTIONS,
  PhonemeItem,
} from "@/lib/phonemic-data";
import { cn } from "@/lib/utils";

interface SoundMatchingGameProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

interface ItemSelection {
  itemId: string;
  correct: boolean;
}

export function SoundMatchingGame({ onComplete, onExit }: SoundMatchingGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [results, setResults] = useState<ItemSelection[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuestion = SOUND_MATCHING_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === SOUND_MATCHING_QUESTIONS.length - 1;

  // Play target sound
  const playTargetSound = useCallback(() => {
    const sound = new Howl({
      src: [`/audio/phonemes/${currentQuestion.targetSound.replace(/\//g, "")}.mp3`],
      volume: 1.0,
    });
    sound.play();
  }, [currentQuestion]);

  // Play word audio
  const playWordAudio = useCallback((item: PhonemeItem) => {
    const sound = new Howl({
      src: [item.audioPath],
      volume: 1.0,
    });
    sound.play();
  }, []);

  // Auto-play target sound on question load
  useEffect(() => {
    const timer = setTimeout(() => {
      playTargetSound();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, playTargetSound]);

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    if (checkedAnswer) return;

    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Check answer
  const handleCheckAnswer = () => {
    if (selectedItems.length === 0) return;

    const itemResults: ItemSelection[] = selectedItems.map((itemId) => ({
      itemId,
      correct: currentQuestion.correctItems.includes(itemId),
    }));

    setResults(itemResults);
    setCheckedAnswer(true);

    const correctCount = itemResults.filter((r) => r.correct).length;
    const missedCount = currentQuestion.correctItems.filter(
      (id) => !selectedItems.includes(id)
    ).length;

    if (correctCount > 0 && missedCount === 0) {
      setTotalCorrect((prev) => prev + 1);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowCelebration(true);
      const finalScore = Math.round(
        (totalCorrect / SOUND_MATCHING_QUESTIONS.length) * 100
      );
      setTimeout(() => {
        onComplete?.(finalScore);
      }, 3000);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedItems([]);
      setCheckedAnswer(false);
      setResults([]);
    }
  };

  // Celebration screen
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            className="inline-flex items-center justify-center w-32 h-32 bg-yellow-400 rounded-full mb-6"
          >
            <Award className="w-20 h-20 text-yellow-900" />
          </motion.div>

          <h1 className="text-5xl font-black text-gray-800 mb-4">Amazing Job!</h1>
          <p className="text-2xl text-gray-600 mb-2">
            You matched {totalCorrect} out of {SOUND_MATCHING_QUESTIONS.length} sounds!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-600">
            Question {currentQuestionIndex + 1} of {SOUND_MATCHING_QUESTIONS.length}
          </div>
          <button
            onClick={onExit}
            className="text-sm font-bold text-gray-500 hover:text-gray-700"
          >
            Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestionIndex + 1) / SOUND_MATCHING_QUESTIONS.length) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-primary to-purple-600"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10"
          >
            {/* Sound Button */}
            <div className="text-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playTargetSound}
                className="inline-flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg text-2xl font-black mb-4"
              >
                <Volume2 className="w-8 h-8" />
                <span>{currentQuestion.targetSound}</span>
              </motion.button>
              <p className="text-lg sm:text-xl font-bold text-gray-700">
                {currentQuestion.prompt}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tap the pictures, then check your answer
              </p>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
              {currentQuestion.items.map((item, index) => {
                const isSelected = selectedItems.includes(item.id);
                const result = results.find((r) => r.itemId === item.id);
                const showCorrect = checkedAnswer && result?.correct;
                const showIncorrect = checkedAnswer && result && !result.correct;
                const showMissed =
                  checkedAnswer &&
                  !selectedItems.includes(item.id) &&
                  currentQuestion.correctItems.includes(item.id);

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      toggleItemSelection(item.id);
                      playWordAudio(item);
                    }}
                    disabled={checkedAnswer}
                    className={cn(
                      "relative rounded-2xl overflow-hidden shadow-lg transition-all aspect-square",
                      isSelected && !checkedAnswer && "ring-4 ring-blue-500 scale-95",
                      showCorrect && "ring-4 ring-green-500",
                      showIncorrect && "ring-4 ring-red-500",
                      showMissed && "ring-4 ring-yellow-500",
                      !checkedAnswer && "hover:scale-105 active:scale-95"
                    )}
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.word}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    {isSelected && !checkedAnswer && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}

                    {showCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-green-500/80 flex items-center justify-center"
                      >
                        <CheckCircle className="w-16 h-16 text-white" />
                      </motion.div>
                    )}

                    {showIncorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-red-500/80 flex items-center justify-center"
                      >
                        <XCircle className="w-16 h-16 text-white" />
                      </motion.div>
                    )}

                    {showMissed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-yellow-500/80 flex items-center justify-center"
                      >
                        <CheckCircle className="w-16 h-16 text-white" />
                      </motion.div>
                    )}

                    {/* Word Label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white font-black text-lg sm:text-xl text-center">
                        {item.word}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {!checkedAnswer ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckAnswer}
                  disabled={selectedItems.length === 0}
                  className={cn(
                    "px-10 py-4 rounded-full text-lg font-black shadow-lg transition-all",
                    selectedItems.length > 0
                      ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  Check Answer
                </motion.button>
              ) : (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-lg font-black shadow-lg"
                >
                  <span>{isLastQuestion ? "Finish" : "Next Question"}</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>

            {/* Feedback Message */}
            {checkedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                {results.every((r) => r.correct) &&
                results.length === currentQuestion.correctItems.length ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full text-lg font-bold">
                    <CheckCircle className="w-6 h-6" />
                    <span>Perfect! All correct!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-100 text-yellow-800 rounded-full text-lg font-bold">
                    <span>Good try! Yellow shows what you missed.</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
