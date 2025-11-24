"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, ArrowRight, Award } from "lucide-react";
import { Howl } from "howler";
import { SoundCountingQuestion, SOUND_COUNTING_QUESTIONS } from "@/lib/phonemic-data";
import { cn } from "@/lib/utils";

interface SoundCounterProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

export function SoundCounter({ onComplete, onExit }: SoundCounterProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuestion = SOUND_COUNTING_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === SOUND_COUNTING_QUESTIONS.length - 1;
  const isCorrect = selectedAnswer === currentQuestion.correctCount;

  // Play word audio
  const playWordAudio = useCallback(() => {
    const sound = new Howl({
      src: [currentQuestion.item.audioPath],
      volume: 1.0,
    });
    sound.play();
  }, [currentQuestion]);

  // Auto-play word on question load
  useEffect(() => {
    const timer = setTimeout(() => {
      playWordAudio();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, playWordAudio]);

  // Handle answer
  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === currentQuestion.correctCount) {
      setTotalCorrect((prev) => prev + 1);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowCelebration(true);
      const finalScore = Math.round((totalCorrect / SOUND_COUNTING_QUESTIONS.length) * 100);
      setTimeout(() => {
        onComplete?.(finalScore);
      }, 3000);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
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

          <h1 className="text-5xl font-black text-gray-800 mb-4">Amazing Counting!</h1>
          <p className="text-2xl text-gray-600 mb-2">
            You counted {totalCorrect} out of {SOUND_COUNTING_QUESTIONS.length} correctly!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-600">
            Question {currentQuestionIndex + 1} of {SOUND_COUNTING_QUESTIONS.length}
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
              width: `${((currentQuestionIndex + 1) / SOUND_COUNTING_QUESTIONS.length) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-orange-500 to-pink-600"
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
            {/* Word Display */}
            <div className="text-center mb-8">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playWordAudio}
                className="relative rounded-2xl overflow-hidden shadow-lg mb-6 max-w-md mx-auto"
              >
                <img
                  src={currentQuestion.item.image}
                  alt={currentQuestion.item.word}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6">
                  <Volume2 className="w-12 h-12 text-white mb-3" />
                  <p className="text-white font-black text-4xl sm:text-5xl">
                    {currentQuestion.item.word}
                  </p>
                </div>
              </motion.button>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                {currentQuestion.prompt}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Listen carefully to each sound
              </p>

              {/* Helper Text */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                <span>💡 Sounds, not letters!</span>
              </div>
            </div>

            {/* Number Options */}
            {!showFeedback ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto"
              >
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer(option)}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-white font-black text-4xl sm:text-5xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <div>
                {/* Feedback */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "text-center py-6 px-8 rounded-2xl mb-6",
                    isCorrect
                      ? "bg-green-100 border-4 border-green-500"
                      : "bg-red-100 border-4 border-red-500"
                  )}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "text-3xl font-black",
                        isCorrect ? "text-green-700" : "text-red-700"
                      )}
                    >
                      {isCorrect ? "Perfect!" : "Not quite!"}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-700 mb-3">
                    The word <span className="text-primary">{currentQuestion.item.word}</span> has{" "}
                    <span className="text-primary text-2xl">{currentQuestion.correctCount}</span> sounds.
                  </p>

                  {/* Visual breakdown of sounds */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {Array.from({ length: currentQuestion.correctCount }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary"
                      >
                        {idx + 1}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Show all options with correct/incorrect */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
                  {currentQuestion.options.map((option) => {
                    const isThisCorrect = option === currentQuestion.correctCount;
                    const wasSelected = option === selectedAnswer;

                    return (
                      <div
                        key={option}
                        className={cn(
                          "aspect-square rounded-2xl font-black text-4xl sm:text-5xl shadow-lg flex items-center justify-center",
                          isThisCorrect
                            ? "bg-green-100 border-4 border-green-500 text-green-700"
                            : wasSelected
                            ? "bg-red-100 border-4 border-red-500 text-red-700"
                            : "bg-gray-100 text-gray-400"
                        )}
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>

                {/* Next Button */}
                <div className="flex justify-center">
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
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
