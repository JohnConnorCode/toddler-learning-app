"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, ArrowRight, Award } from "lucide-react";
import { Howl } from "howler";
import { generateBlendingQuestions, BlendingQuestion } from "@/lib/blending-data";
import { cn } from "@/lib/utils";

interface WordSegmentingGameProps {
  completedUnits: number[];
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

export function WordSegmentingGame({
  completedUnits,
  onComplete,
  onExit,
}: WordSegmentingGameProps) {
  const [questions, setQuestions] = useState<BlendingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Generate questions on mount
  useEffect(() => {
    const generatedQuestions = generateBlendingQuestions(completedUnits, 10).filter(
      (q) => q.type === "segment-word"
    );

    if (generatedQuestions.length === 0) {
      return;
    }

    setQuestions(generatedQuestions.slice(0, 10));
  }, [completedUnits]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect =
    showFeedback &&
    selectedSounds.length === currentQuestion?.word.sounds.length &&
    selectedSounds.every((s, i) => s === currentQuestion.word.sounds[i]);

  // Play word audio
  const playWordAudio = useCallback(() => {
    if (!currentQuestion) return;
    const sound = new Howl({
      src: [currentQuestion.word.audioPath],
      volume: 1.0,
    });
    sound.play();
  }, [currentQuestion]);

  // Play individual sound
  const playSound = useCallback((sound: string) => {
    const phoneme = new Howl({
      src: [`/audio/phonemes/${sound}.mp3`],
      volume: 1.0,
    });
    phoneme.play();
  }, []);

  // Auto-play word on question load
  useEffect(() => {
    if (currentQuestion) {
      const timer = setTimeout(() => {
        playWordAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, currentQuestion, playWordAudio]);

  // Generate letter options (correct + some distractors)
  const generateLetterOptions = useCallback(() => {
    if (!currentQuestion) return [];

    const correctLetters = currentQuestion.word.sounds;
    const allLetters = "abcdefghijklmnopqrstuvwxyz".split("");

    // Get some wrong letters as distractors
    const wrongLetters = allLetters
      .filter((l) => !correctLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine and shuffle
    const options = [...correctLetters, ...wrongLetters].sort(() => Math.random() - 0.5);

    return options;
  }, [currentQuestion]);

  const [letterOptions] = useState(() => generateLetterOptions());

  // Handle letter selection
  const handleLetterSelect = (letter: string) => {
    if (showFeedback) return;

    // Add letter to selected sounds
    setSelectedSounds((prev) => [...prev, letter]);
    playSound(letter);
  };

  // Remove last selected letter
  const handleRemoveLast = () => {
    if (showFeedback) return;
    setSelectedSounds((prev) => prev.slice(0, -1));
  };

  // Check answer
  const handleCheckAnswer = () => {
    if (selectedSounds.length === 0) return;

    setShowFeedback(true);

    const correct =
      selectedSounds.length === currentQuestion.word.sounds.length &&
      selectedSounds.every((s, i) => s === currentQuestion.word.sounds[i]);

    if (correct) {
      setTotalCorrect((prev) => prev + 1);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowCelebration(true);
      const finalScore = Math.round((totalCorrect / questions.length) * 100);
      setTimeout(() => {
        onComplete?.(finalScore);
      }, 3000);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedSounds([]);
      setShowFeedback(false);
    }
  };

  // No questions available
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-black text-gray-800 mb-4">Not Ready Yet!</h2>
          <p className="text-gray-600 mb-6">
            Complete at least one phonics unit to unlock segmenting practice.
          </p>
          <button
            onClick={onExit}
            className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform"
          >
            Go to Phonics
          </button>
        </div>
      </div>
    );
  }

  // Celebration screen
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center max-w-2xl bg-white rounded-3xl p-8 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            className="inline-flex items-center justify-center w-32 h-32 bg-yellow-400 rounded-full mb-6"
          >
            <Award className="w-20 h-20 text-yellow-900" />
          </motion.div>

          <h1 className="text-5xl font-black text-gray-800 mb-4">Great Segmenting!</h1>
          <p className="text-2xl text-gray-600 mb-2">
            You segmented {totalCorrect} out of {questions.length} words correctly!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
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
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
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
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4">
                {currentQuestion.prompt}
              </h2>
              <p className="text-sm text-gray-500">Tap the letters in order</p>
            </div>

            {/* Word Display with Image */}
            <div className="flex flex-col items-center mb-8">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playWordAudio}
                className="relative rounded-2xl overflow-hidden shadow-lg mb-4 w-48 h-48"
              >
                <img
                  src={currentQuestion.word.image}
                  alt={currentQuestion.word.word}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end p-4">
                  <Volume2 className="w-10 h-10 text-white mb-2" />
                  <p className="text-white font-black text-3xl">{currentQuestion.word.word}</p>
                </div>
              </motion.button>
            </div>

            {/* Selected Sounds Display */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 min-h-24">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {selectedSounds.length === 0 ? (
                  <span className="text-gray-400 font-bold">Tap letters below...</span>
                ) : (
                  selectedSounds.map((sound, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 text-white font-black text-2xl flex items-center justify-center shadow-lg"
                    >
                      {sound}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Letter Options */}
            {!showFeedback ? (
              <div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-6">
                  {letterOptions.map((letter, index) => (
                    <motion.button
                      key={`${letter}-${index}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLetterSelect(letter)}
                      className="aspect-square rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 text-white font-black text-2xl sm:text-3xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {letter}
                    </motion.button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRemoveLast}
                    disabled={selectedSounds.length === 0}
                    className={cn(
                      "px-6 py-3 rounded-full font-bold transition-all",
                      selectedSounds.length > 0
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Remove Last
                  </button>

                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedSounds.length === 0}
                    className={cn(
                      "px-8 py-3 rounded-full font-bold shadow-lg transition-all",
                      selectedSounds.length > 0
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    Check Answer
                  </button>
                </div>
              </div>
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
                    The word <span className="text-primary text-2xl">{currentQuestion.word.word}</span> breaks into:
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    {currentQuestion.word.sounds.map((sound, index) => (
                      <div
                        key={index}
                        className="w-14 h-14 rounded-xl bg-green-500 text-white font-black text-2xl flex items-center justify-center shadow-lg"
                      >
                        {sound}
                      </div>
                    ))}
                  </div>
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
