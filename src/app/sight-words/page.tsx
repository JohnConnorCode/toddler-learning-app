"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, BookOpen, Check, X, Trophy, Star } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { SIGHT_WORDS_DATA, SightWord, getSightWordsByDifficulty } from "@/lib/sight-words-data";
import { triggerConfetti } from "@/lib/confetti";

type LessonPhase = "learn" | "quiz" | "complete";
type Difficulty = 1 | 2;

export default function SightWordsPage() {
  const { shouldReduceMotion } = useAccessibility();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lessonPhase, setLessonPhase] = useState<LessonPhase>("learn");
  const [learnedWords, setLearnedWords] = useState<Set<number>>(new Set());
  const [showWord, setShowWord] = useState(false);

  // Quiz state
  const [quizWords, setQuizWords] = useState<SightWord[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const currentWords = useMemo(() => {
    if (!difficulty) return [];
    return getSightWordsByDifficulty(difficulty).slice(0, 10);
  }, [difficulty]);

  const currentWord = currentWords[currentWordIndex];
  const allWordsLearned = learnedWords.size >= Math.min(6, currentWords.length);

  const handlePlaySound = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.toLowerCase());
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Auto-play word when revealed
  useEffect(() => {
    if (showWord && currentWord) {
      const timer = setTimeout(() => {
        handlePlaySound(currentWord.word);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showWord, currentWord, handlePlaySound]);

  const startLesson = (diff: Difficulty) => {
    setDifficulty(diff);
    setCurrentWordIndex(0);
    setLessonPhase("learn");
    setLearnedWords(new Set());
    setShowWord(false);
    setQuizScore(0);
  };

  const revealWord = () => {
    setShowWord(true);
    setLearnedWords(prev => new Set([...prev, currentWordIndex]));
  };

  const nextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowWord(false);
    }
  };

  const generateQuiz = useCallback(() => {
    const wordsToQuiz = currentWords.slice(0, Math.min(6, currentWords.length));
    setQuizWords(wordsToQuiz);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Generate options for first question
    generateQuizOptions(wordsToQuiz[0]);
    setLessonPhase("quiz");
  }, [currentWords]);

  const generateQuizOptions = useCallback((targetWord: SightWord) => {
    // Get 3 random other words as distractors
    const otherWords = SIGHT_WORDS_DATA.filter(w => w.word !== targetWord.word);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffledOthers.map(w => w.word), targetWord.word].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
  }, []);

  const handleQuizAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    const currentQuizWord = quizWords[currentQuizIndex];
    const correct = answer === currentQuizWord.word;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setQuizScore(prev => prev + 1);
      handlePlaySound("correct");
    } else {
      handlePlaySound(currentQuizWord.word);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizWords.length - 1) {
      const nextIndex = currentQuizIndex + 1;
      setCurrentQuizIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      generateQuizOptions(quizWords[nextIndex]);
    } else {
      // Quiz complete
      const percentage = Math.round((quizScore / quizWords.length) * 100);
      if (percentage >= 75) {
        setLessonPhase("complete");
        triggerConfetti();
      } else {
        // Retry quiz
        setCurrentQuizIndex(0);
        setQuizScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        generateQuizOptions(quizWords[0]);
      }
    }
  };

  // Main selection view
  if (!difficulty) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.div>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-800">Sight Words</h1>
              <p className="text-gray-500">Words to recognize by sight!</p>
            </div>
          </div>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 mb-8 text-white shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                <BookOpen className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-black mb-1">What are Sight Words?</h2>
                <p className="text-white/90">
                  Sight words are common words you should recognize instantly -
                  without sounding them out. Learning these words helps you read faster!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          <h2 className="text-xl font-bold text-gray-700 mb-4">Choose a Level:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startLesson(1)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Pre-K Words</h3>
              </div>
              <p className="text-gray-500">Basic sight words like "the", "and", "I", "see"</p>
              <p className="text-sm text-green-600 font-medium mt-2">40 words</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startLesson(2)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-blue-500 fill-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Kindergarten Words</h3>
              </div>
              <p className="text-gray-500">More advanced words like "have", "they", "was"</p>
              <p className="text-sm text-blue-600 font-medium mt-2">52 words</p>
            </motion.button>
          </div>
        </div>
      </main>
    );
  }

  // Completion screen
  if (lessonPhase === "complete") {
    const percentage = Math.round((quizScore / quizWords.length) * 100);
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-8xl mb-6"
            >
              🌟
            </motion.div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Amazing Reader!</h2>
            <p className="text-xl text-gray-600 mb-4">
              You learned {quizWords.length} new sight words!
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800">{percentage}% Correct</span>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDifficulty(null)}
                className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Choose Level
              </button>
              <button
                onClick={() => startLesson(difficulty)}
                className="px-6 py-3 bg-orange-500 rounded-xl font-bold text-white hover:bg-orange-600 transition-colors"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Quiz phase
  if (lessonPhase === "quiz" && quizWords.length > 0) {
    const currentQuizWord = quizWords[currentQuizIndex];

    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => setDifficulty(null)}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-800">Quiz Time!</h1>
              <p className="text-gray-500">Question {currentQuizIndex + 1} of {quizWords.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow">
              <span className="font-bold text-orange-600">{quizScore}/{currentQuizIndex + (selectedAnswer ? 1 : 0)}</span>
            </div>
          </div>

          {/* Quiz Card */}
          <motion.div
            key={currentQuizIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-4">Listen and find the word:</p>
              <button
                onClick={() => handlePlaySound(currentQuizWord.word)}
                className="flex items-center gap-3 mx-auto px-6 py-4 bg-orange-100 rounded-2xl hover:bg-orange-200 transition-colors"
              >
                <Volume2 className="w-8 h-8 text-orange-600" />
                <span className="font-bold text-orange-700 text-xl">Hear the Word</span>
              </button>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {quizOptions.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuizWord.word;
                const showResult = selectedAnswer !== null;

                let bgColor = "bg-gray-50";
                let textColor = "text-gray-800";
                let borderColor = "border-gray-200";

                if (showResult) {
                  if (isCorrectAnswer) {
                    bgColor = "bg-green-100";
                    textColor = "text-green-800";
                    borderColor = "border-green-500";
                  } else if (isSelected) {
                    bgColor = "bg-red-100";
                    textColor = "text-red-800";
                    borderColor = "border-red-500";
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`
                      ${bgColor} ${textColor} border-2 ${borderColor}
                      p-6 rounded-2xl font-black text-2xl
                      shadow-lg transition-all relative
                      ${selectedAnswer === null ? "hover:shadow-xl cursor-pointer hover:border-orange-300" : "cursor-default"}
                    `}
                  >
                    {option}
                    {showResult && isCorrectAnswer && (
                      <Check className="absolute top-2 right-2 w-6 h-6 text-green-600" />
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <X className="absolute top-2 right-2 w-6 h-6 text-red-600" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback & Next */}
            <AnimatePresence>
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className={`text-xl font-bold mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {isCorrect ? "Correct! 🎉" : `The word is "${currentQuizWord.word}"`}
                  </p>
                  <p className="text-gray-500 mb-4">{currentQuizWord.sentence}</p>
                  <button
                    onClick={nextQuizQuestion}
                    className="px-8 py-3 bg-orange-500 rounded-xl font-bold text-white hover:bg-orange-600 transition-colors"
                  >
                    {currentQuizIndex < quizWords.length - 1 ? "Next Question" :
                      (quizScore / quizWords.length >= 0.75 ? "See Results" : "Try Quiz Again")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    );
  }

  // Learn phase
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => setDifficulty(null)}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
              Learn Sight Words
            </h1>
            <p className="text-gray-500">
              {learnedWords.size}/{Math.min(6, currentWords.length)} words learned
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-full p-1 mb-6 shadow">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(learnedWords.size / Math.min(6, currentWords.length)) * 100}%` }}
              className="h-full bg-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* Main Card */}
        {currentWord && (
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6"
          >
            <p className="text-center text-sm text-gray-500 mb-4">
              Word {currentWordIndex + 1} of {currentWords.length}
            </p>

            {/* Word Card */}
            <div className="relative">
              <motion.button
                onClick={!showWord ? revealWord : undefined}
                className={`
                  w-full aspect-[4/3] rounded-2xl flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${showWord
                    ? "bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg"
                    : "bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                  }
                `}
              >
                {showWord ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-white text-6xl sm:text-7xl font-black"
                  >
                    {currentWord.word}
                  </motion.span>
                ) : (
                  <div className="text-center">
                    <span className="text-6xl mb-2 block">?</span>
                    <span className="text-gray-500 font-bold">Tap to reveal!</span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Word Info & Audio */}
            {showWord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => handlePlaySound(currentWord.word)}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors mb-4"
                >
                  <Volume2 className="w-5 h-5 text-orange-600" />
                  <span className="font-bold text-orange-700">Hear Again</span>
                </button>

                <p className="text-lg text-gray-600 italic">
                  "{currentWord.sentence}"
                </p>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setCurrentWordIndex(Math.max(0, currentWordIndex - 1));
                  setShowWord(false);
                }}
                disabled={currentWordIndex === 0}
                className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
              {currentWordIndex < Math.min(6, currentWords.length) - 1 ? (
                <button
                  onClick={nextWord}
                  disabled={!showWord}
                  className={`px-6 py-3 rounded-xl font-bold text-white transition-colors ${
                    showWord
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Next Word
                </button>
              ) : (
                <button
                  onClick={generateQuiz}
                  disabled={!allWordsLearned}
                  className={`px-6 py-3 rounded-xl font-bold text-white transition-colors ${
                    allWordsLearned
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {allWordsLearned ? "Take Quiz" : `Learn ${Math.min(6, currentWords.length) - learnedWords.size} More`}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Word Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-700 mb-3">Words to Learn:</h3>
          <div className="flex flex-wrap gap-2">
            {currentWords.slice(0, Math.min(6, currentWords.length)).map((word, index) => (
              <button
                key={word.word}
                onClick={() => {
                  setCurrentWordIndex(index);
                  setShowWord(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  learnedWords.has(index)
                    ? "bg-orange-500 text-white"
                    : index === currentWordIndex
                    ? "bg-orange-100 text-orange-700 ring-2 ring-orange-500"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {learnedWords.has(index) && <Check className="w-3 h-3" />}
                {learnedWords.has(index) ? word.word : "???"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
