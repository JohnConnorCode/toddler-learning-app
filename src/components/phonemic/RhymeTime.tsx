"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, ArrowRight, Award } from "lucide-react";
import { Howl } from "howler";
import { RhymeQuestion, RHYME_QUESTIONS } from "@/lib/phonemic-data";
import { cn } from "@/lib/utils";

interface RhymeTimeProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

export function RhymeTime({ onComplete, onExit }: RhymeTimeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuestion = RHYME_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === RHYME_QUESTIONS.length - 1;
  const isCorrect = selectedAnswer === currentQuestion.doTheyRhyme;

  // Play word audio
  const playWordAudio = useCallback((audioPath: string) => {
    const sound = new Howl({
      src: [audioPath],
      volume: 1.0,
    });
    sound.play();
  }, []);

  // Play both words in sequence
  const playBothWords = useCallback(() => {
    playWordAudio(currentQuestion.word1.audioPath);
    setTimeout(() => {
      playWordAudio(currentQuestion.word2.audioPath);
    }, 800);
  }, [currentQuestion, playWordAudio]);

  // Auto-play words on question load
  useEffect(() => {
    const timer = setTimeout(() => {
      playBothWords();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, playBothWords]);

  // Handle answer
  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === currentQuestion.doTheyRhyme) {
      setTotalCorrect((prev) => prev + 1);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowCelebration(true);
      const finalScore = Math.round((totalCorrect / RHYME_QUESTIONS.length) * 100);
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

          <h1 className="text-5xl font-black text-gray-800 mb-4">Fantastic!</h1>
          <p className="text-2xl text-gray-600 mb-2">
            You found {totalCorrect} out of {RHYME_QUESTIONS.length} rhymes!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-600">
            Question {currentQuestionIndex + 1} of {RHYME_QUESTIONS.length}
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
              width: `${((currentQuestionIndex + 1) / RHYME_QUESTIONS.length) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
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
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">
                Do these rhyme?
              </h2>
              <p className="text-sm text-gray-500">
                Listen carefully and choose Yes or No
              </p>
            </div>

            {/* Word Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Word 1 */}
              <motion.button
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => playWordAudio(currentQuestion.word1.audioPath)}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all aspect-square sm:aspect-auto"
              >
                <img
                  src={currentQuestion.word1.image}
                  alt={currentQuestion.word1.word}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6">
                  <Volume2 className="w-8 h-8 text-white mb-2" />
                  <p className="text-white font-black text-3xl sm:text-4xl">
                    {currentQuestion.word1.word}
                  </p>
                </div>
              </motion.button>

              {/* Word 2 */}
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => playWordAudio(currentQuestion.word2.audioPath)}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all aspect-square sm:aspect-auto"
              >
                <img
                  src={currentQuestion.word2.image}
                  alt={currentQuestion.word2.word}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6">
                  <Volume2 className="w-8 h-8 text-white mb-2" />
                  <p className="text-white font-black text-3xl sm:text-4xl">
                    {currentQuestion.word2.word}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Replay Button */}
            <div className="text-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playBothWords}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                <span>Listen Again</span>
              </motion.button>
            </div>

            {/* Answer Buttons */}
            {!showFeedback ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(true)}
                  className="py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white font-black text-2xl sm:text-3xl shadow-lg"
                >
                  YES
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(false)}
                  className="py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-red-400 to-pink-500 text-white font-black text-2xl sm:text-3xl shadow-lg"
                >
                  NO
                </motion.button>
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
                  <div className="flex items-center justify-center gap-3 mb-2">
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
                      {isCorrect ? "Correct!" : "Not quite!"}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-700">
                    {currentQuestion.doTheyRhyme
                      ? `${currentQuestion.word1.word} and ${currentQuestion.word2.word} DO rhyme!`
                      : `${currentQuestion.word1.word} and ${currentQuestion.word2.word} DON'T rhyme.`}
                  </p>
                </motion.div>

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
