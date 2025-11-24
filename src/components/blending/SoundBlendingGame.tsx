"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, ArrowRight, Award, Repeat } from "lucide-react";
import { Howl } from "howler";
import { CVCWord, generateBlendingQuestions, BlendingQuestion } from "@/lib/blending-data";
import { cn } from "@/lib/utils";

interface SoundBlendingGameProps {
  completedUnits: number[];
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

export function SoundBlendingGame({
  completedUnits,
  onComplete,
  onExit,
}: SoundBlendingGameProps) {
  const [questions, setQuestions] = useState<BlendingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  // Generate questions on mount
  useEffect(() => {
    const generatedQuestions = generateBlendingQuestions(completedUnits, 10).filter(
      (q) => q.type === "blend-sounds"
    );

    if (generatedQuestions.length === 0) {
      // No words available yet
      return;
    }

    setQuestions(generatedQuestions.slice(0, 10));
  }, [completedUnits]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion?.word.word;

  // Play individual sound
  const playSound = useCallback((sound: string) => {
    const phoneme = new Howl({
      src: [`/audio/phonemes/${sound}.mp3`],
      volume: 1.0,
    });
    phoneme.play();
  }, []);

  // Play all sounds in sequence
  const playAllSounds = useCallback(() => {
    if (!currentQuestion) return;

    const sounds = currentQuestion.word.sounds;
    let delay = 0;

    sounds.forEach((sound, index) => {
      setTimeout(() => {
        playSound(sound);
      }, delay);
      delay += 600; // 600ms between sounds
    });
  }, [currentQuestion, playSound]);

  // Play word audio
  const playWordAudio = useCallback((audioPath: string) => {
    const sound = new Howl({
      src: [audioPath],
      volume: 1.0,
    });
    sound.play();
  }, []);

  // Auto-play sounds on question load
  useEffect(() => {
    if (currentQuestion) {
      const timer = setTimeout(() => {
        playAllSounds();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, currentQuestion, playAllSounds]);

  // Generate wrong answer options
  const generateOptions = useCallback((correctWord: CVCWord): string[] => {
    const allWords = questions.map((q) => q.word.word);
    const wrongOptions = allWords.filter((w) => w !== correctWord.word);

    // Shuffle and take 3 wrong answers
    const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
    const wrong = shuffled.slice(0, 3);

    // Combine with correct answer and shuffle
    const options = [correctWord.word, ...wrong].sort(() => Math.random() - 0.5);

    return options;
  }, [questions]);

  // Handle answer
  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === currentQuestion.word.word) {
      setTotalCorrect((prev) => prev + 1);
      playWordAudio(currentQuestion.word.audioPath);
    } else {
      setWrongAnswers((prev) => [...prev, currentQuestion.word.word]);
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
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  // No questions available
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-black text-gray-800 mb-4">Not Ready Yet!</h2>
          <p className="text-gray-600 mb-6">
            Complete at least one phonics unit to unlock blending practice.
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

          <h1 className="text-5xl font-black text-gray-800 mb-4">Awesome Blending!</h1>
          <p className="text-2xl text-gray-600 mb-2">
            You blended {totalCorrect} out of {questions.length} words correctly!
          </p>

          {wrongAnswers.length > 0 && (
            <div className="mt-6 bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">Words to practice:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {[...new Set(wrongAnswers)].map((word) => (
                  <span
                    key={word}
                    className="px-4 py-2 bg-white text-blue-700 rounded-full font-bold shadow"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const options = generateOptions(currentQuestion.word);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
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
            className="h-full bg-gradient-to-r from-green-500 to-blue-600"
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
              <p className="text-sm text-gray-500">Listen and blend the sounds together</p>
            </div>

            {/* Sound Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              {currentQuestion.word.sounds.map((sound, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playSound(sound)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white font-black text-3xl sm:text-4xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                  {sound}
                </motion.button>
              ))}
            </div>

            {/* Replay All Button */}
            <div className="text-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playAllSounds}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                <Repeat className="w-5 h-5" />
                <span>Play Sounds Again</span>
              </motion.button>
            </div>

            {/* Answer Options */}
            {!showFeedback ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto"
              >
                {options.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(option)}
                    className="py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 text-white font-black text-2xl sm:text-3xl shadow-lg hover:shadow-xl transition-all"
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
                      {isCorrect ? "Perfect!" : "Not quite!"}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-700">
                    The sounds blend to make: <span className="text-primary text-2xl">{currentQuestion.word.word}</span>
                  </p>
                </motion.div>

                {/* Show image */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={currentQuestion.word.image}
                      alt={currentQuestion.word.word}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
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
