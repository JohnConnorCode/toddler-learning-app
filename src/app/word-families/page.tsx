"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, BookOpen, Check, X, Trophy, Star } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { WORD_FAMILIES_DATA, WordFamily, getWordFamiliesByDifficulty } from "@/lib/word-families-data";
import { triggerConfetti } from "@/lib/confetti";

type LessonPhase = "intro" | "learn" | "quiz" | "complete";
type Difficulty = 1 | 2 | 3;

export default function WordFamiliesPage() {
  const { shouldReduceMotion } = useAccessibility();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<WordFamily | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lessonPhase, setLessonPhase] = useState<LessonPhase>("intro");
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<{correctWord: string; options: string[]; family: WordFamily}[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const families = useMemo(() => {
    if (!difficulty) return [];
    return getWordFamiliesByDifficulty(difficulty);
  }, [difficulty]);

  const currentWords = selectedFamily?.words.slice(0, 6) || [];
  const allWordsRevealed = revealedWords.size >= currentWords.length;

  const handlePlaySound = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.toLowerCase());
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const selectFamily = (family: WordFamily) => {
    setSelectedFamily(family);
    setCurrentWordIndex(0);
    setLessonPhase("intro");
    setRevealedWords(new Set());
    setQuizScore(0);
  };

  const startLearn = () => {
    setLessonPhase("learn");
    setCurrentWordIndex(0);
  };

  // Auto-play pattern sound on intro
  useEffect(() => {
    if (selectedFamily && lessonPhase === "intro") {
      const timer = setTimeout(() => {
        handlePlaySound(selectedFamily.pattern.replace("-", ""));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedFamily, lessonPhase, handlePlaySound]);

  const revealWord = (index: number) => {
    setRevealedWords(prev => new Set([...prev, index]));
    handlePlaySound(currentWords[index]);
  };

  const generateQuiz = useCallback(() => {
    if (!selectedFamily) return;

    // Create quiz questions - for each word in the family, ask which family it belongs to
    const questions = currentWords.slice(0, 5).map(word => {
      // Get 3 other families as distractors
      const otherFamilies = WORD_FAMILIES_DATA.filter(f => f.pattern !== selectedFamily.pattern);
      const shuffledOthers = [...otherFamilies].sort(() => Math.random() - 0.5).slice(0, 3);

      // Mix correct word with words from other families
      const distractorWords = shuffledOthers.map(f => f.words[Math.floor(Math.random() * f.words.length)]);
      const options = [...distractorWords, word].sort(() => Math.random() - 0.5);

      return {
        correctWord: word,
        options,
        family: selectedFamily
      };
    });

    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setLessonPhase("quiz");
  }, [selectedFamily, currentWords]);

  const handleQuizAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    const currentQuestion = quizQuestions[currentQuizIndex];
    const correct = answer === currentQuestion.correctWord;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setQuizScore(prev => prev + 1);
      handlePlaySound("correct");
    } else {
      handlePlaySound(currentQuestion.correctWord);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Quiz complete
      const percentage = Math.round((quizScore / quizQuestions.length) * 100);
      if (percentage >= 75) {
        setLessonPhase("complete");
        triggerConfetti();
      } else {
        // Retry quiz
        setCurrentQuizIndex(0);
        setQuizScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }
  };

  // Main selection view - choose difficulty
  if (!difficulty) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
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
              <h1 className="text-3xl sm:text-4xl font-black text-gray-800">Word Families</h1>
              <p className="text-gray-500">Words that rhyme together!</p>
            </div>
          </div>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-6 mb-8 text-white shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                <BookOpen className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-black mb-1">What are Word Families?</h2>
                <p className="text-white/90">
                  Word families are groups of words that share the same ending pattern.
                  Like "cat", "hat", "bat" - they all end in "-at" and rhyme!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          <h2 className="text-xl font-bold text-gray-700 mb-4">Choose a Level:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty(1)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Easy</h3>
              </div>
              <p className="text-gray-500">Simple patterns like -at, -an, -ig</p>
              <p className="text-sm text-green-600 font-medium mt-2">15 families</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty(2)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-blue-500 fill-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Medium</h3>
              </div>
              <p className="text-gray-500">Longer patterns like -ack, -ing, -unk</p>
              <p className="text-sm text-blue-600 font-medium mt-2">7 families</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty(3)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-purple-500 fill-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Hard</h3>
              </div>
              <p className="text-gray-500">Complex patterns like -ame, -ake, -all</p>
              <p className="text-sm text-purple-600 font-medium mt-2">5 families</p>
            </motion.button>
          </div>
        </div>
      </main>
    );
  }

  // Family selection view
  if (!selectedFamily) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
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
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-800">Choose a Family</h1>
              <p className="text-gray-500">{families.length} word families to learn</p>
            </div>
          </div>

          {/* Family Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {families.map((family, index) => (
              <motion.button
                key={family.pattern}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectFamily(family)}
                className={`${family.color} p-6 rounded-2xl shadow-lg text-white text-center`}
              >
                <span className="text-4xl font-black block mb-2">{family.pattern}</span>
                <span className="text-white/80 text-sm">{family.words.length} words</span>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Completion screen
  if (lessonPhase === "complete") {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
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
              🎉
            </motion.div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Word Family Master!</h2>
            <p className="text-xl text-gray-600 mb-4">
              You mastered the "{selectedFamily.pattern}" family!
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800">{percentage}% Correct</span>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedFamily(null)}
                className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                More Families
              </button>
              <button
                onClick={() => selectFamily(selectedFamily)}
                className="px-6 py-3 bg-cyan-500 rounded-xl font-bold text-white hover:bg-cyan-600 transition-colors"
              >
                Practice Again
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Quiz phase
  if (lessonPhase === "quiz" && quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentQuizIndex];

    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => setSelectedFamily(null)}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-800">Quiz Time!</h1>
              <p className="text-gray-500">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow">
              <span className="font-bold text-cyan-600">{quizScore}/{currentQuizIndex + (selectedAnswer ? 1 : 0)}</span>
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
              <p className="text-lg text-gray-600 mb-2">Which word is in the</p>
              <div className={`${currentQuestion.family.color} inline-block px-6 py-3 rounded-2xl mb-4`}>
                <span className="text-white text-3xl font-black">{currentQuestion.family.pattern}</span>
              </div>
              <p className="text-lg text-gray-600">family?</p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuestion.correctWord;
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
                      p-5 rounded-2xl font-black text-2xl
                      shadow-lg transition-all relative
                      ${selectedAnswer === null ? "hover:shadow-xl cursor-pointer hover:border-cyan-300" : "cursor-default"}
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
                  <p className={`text-xl font-bold mb-4 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {isCorrect ? "Correct! 🎉" : `"${currentQuestion.correctWord}" rhymes with "${currentQuestion.family.pattern}"`}
                  </p>
                  <button
                    onClick={nextQuizQuestion}
                    className="px-8 py-3 bg-cyan-500 rounded-xl font-bold text-white hover:bg-cyan-600 transition-colors"
                  >
                    {currentQuizIndex < quizQuestions.length - 1 ? "Next Question" :
                      (quizScore / quizQuestions.length >= 0.75 ? "See Results" : "Try Quiz Again")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    );
  }

  // Intro phase
  if (lessonPhase === "intro") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => setSelectedFamily(null)}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
                The "{selectedFamily.pattern}" Family
              </h1>
              <p className="text-gray-500">{selectedFamily.name}</p>
            </div>
          </div>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`${selectedFamily.color} w-40 h-40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
            >
              <span className="text-white text-5xl font-black">
                {selectedFamily.pattern}
              </span>
            </motion.div>

            <p className="text-xl text-gray-600 mb-4">
              Words in this family all end with <span className="font-bold">{selectedFamily.pattern}</span> and rhyme!
            </p>

            <button
              onClick={() => handlePlaySound(selectedFamily.pattern.replace("-", ""))}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-100 rounded-full hover:bg-cyan-200 transition-colors mb-8"
            >
              <Volume2 className="w-5 h-5 text-cyan-600" />
              <span className="font-bold text-cyan-700">Hear the Pattern</span>
            </button>

            <button
              onClick={startLearn}
              className="px-8 py-4 bg-cyan-500 rounded-xl font-bold text-white text-xl hover:bg-cyan-600 transition-colors shadow-lg"
            >
              Learn the Words
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Learn phase
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => setSelectedFamily(null)}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
              {selectedFamily.name}
            </h1>
            <p className="text-gray-500">
              {revealedWords.size}/{currentWords.length} words revealed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-full p-1 mb-6 shadow">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(revealedWords.size / currentWords.length) * 100}%` }}
              className="h-full bg-cyan-500 rounded-full"
            />
          </div>
        </div>

        {/* Pattern Display */}
        <div className="text-center mb-6">
          <motion.div
            className={`${selectedFamily.color} inline-block px-8 py-4 rounded-2xl shadow-lg`}
          >
            <span className="text-white text-4xl font-black">{selectedFamily.pattern}</span>
          </motion.div>
          <button
            onClick={() => handlePlaySound(selectedFamily.pattern.replace("-", ""))}
            className="flex items-center gap-1 mx-auto mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <Volume2 className="w-4 h-4" />
            Hear pattern
          </button>
        </div>

        {/* Words Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentWords.map((word, index) => (
              <motion.button
                key={word}
                whileHover={!revealedWords.has(index) ? { scale: 1.05 } : {}}
                whileTap={!revealedWords.has(index) ? { scale: 0.95 } : {}}
                onClick={() => !revealedWords.has(index) && revealWord(index)}
                className={`
                  p-4 rounded-xl text-center transition-all
                  ${revealedWords.has(index)
                    ? `${selectedFamily.color} text-white shadow-md`
                    : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  }
                `}
              >
                {revealedWords.has(index) ? (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black mb-1">{word}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySound(word);
                      }}
                      className="flex items-center gap-1 text-white/80 hover:text-white text-xs"
                    >
                      <Volume2 className="w-3 h-3" />
                      Hear
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl">?</span>
                    <p className="text-xs text-gray-500 mt-1">Tap to reveal</p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Take Quiz Button */}
        <div className="text-center">
          <button
            onClick={generateQuiz}
            disabled={!allWordsRevealed}
            className={`px-8 py-4 rounded-xl font-bold text-white text-lg transition-colors ${
              allWordsRevealed
                ? "bg-purple-500 hover:bg-purple-600 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {allWordsRevealed ? "Take Quiz" : `Reveal ${currentWords.length - revealedWords.size} More Words`}
          </button>
        </div>
      </div>
    </main>
  );
}
