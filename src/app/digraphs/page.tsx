"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, BookOpen, Check, X, Trophy } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { DIGRAPHS, getWordsByDigraph, DigraphItem, DigraphWord } from "@/lib/digraphs-data";
import { PhonicsActivityCard } from "@/components/phonics/PhonicsActivityCard";
import { triggerConfetti } from "@/lib/confetti";

type LessonPhase = "intro" | "practice" | "quiz" | "complete";

export default function DigraphsPage() {
  const { shouldReduceMotion } = useAccessibility();
  const [selectedDigraph, setSelectedDigraph] = useState<DigraphItem | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Lesson state
  const [lessonPhase, setLessonPhase] = useState<LessonPhase>("intro");
  const [practicedWords, setPracticedWords] = useState<Set<number>>(new Set());

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<{word: DigraphWord; options: DigraphItem[]; correct: DigraphItem}[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(0);

  const handleSelectDigraph = (digraph: DigraphItem) => {
    setSelectedDigraph(digraph);
    setCurrentWordIndex(0);
    setLessonPhase("intro");
    setPracticedWords(new Set());
    setQuizQuestions([]);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handlePlaySound = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Auto-play digraph sound on intro
  useEffect(() => {
    if (selectedDigraph && lessonPhase === "intro") {
      const timer = setTimeout(() => {
        handlePlaySound(selectedDigraph.phonemeSpelling);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDigraph, lessonPhase, handlePlaySound]);

  const startPractice = () => {
    setLessonPhase("practice");
    setCurrentWordIndex(0);
  };

  const markWordPracticed = (index: number) => {
    setPracticedWords(prev => new Set([...prev, index]));
  };

  const generateQuiz = useCallback(() => {
    if (!selectedDigraph) return;

    const words = getWordsByDigraph(selectedDigraph.id).slice(0, 6);
    const otherDigraphs = DIGRAPHS.filter(d => d.id !== selectedDigraph.id);

    const questions = words.map(word => {
      // Get 3 random other digraphs as distractors
      const shuffledOthers = [...otherDigraphs].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffledOthers, selectedDigraph].sort(() => Math.random() - 0.5);

      return {
        word,
        options,
        correct: selectedDigraph
      };
    });

    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setLessonPhase("quiz");
  }, [selectedDigraph]);

  const handleQuizAnswer = (digraphId: string) => {
    if (selectedAnswer !== null) return; // Already answered

    const currentQuestion = quizQuestions[currentQuizIndex];
    const correct = digraphId === currentQuestion.correct.id;

    setSelectedAnswer(digraphId);
    setIsCorrect(correct);
    setQuizAnswered(prev => prev + 1);

    if (correct) {
      setQuizScore(prev => prev + 1);
      handlePlaySound("correct");
    } else {
      handlePlaySound("try again");
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
        setQuizAnswered(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }
  };

  // Digraph practice/quiz view
  if (selectedDigraph) {
    const words = getWordsByDigraph(selectedDigraph.id).slice(0, 10);
    const currentWord = words[currentWordIndex];
    const allWordsPracticed = practicedWords.size >= Math.min(5, words.length);

    // Completion screen
    if (lessonPhase === "complete") {
      const percentage = Math.round((quizScore / quizQuestions.length) * 100);
      return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
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
              <h2 className="text-3xl font-black text-gray-800 mb-2">Amazing Job!</h2>
              <p className="text-xl text-gray-600 mb-4">
                You mastered the "{selectedDigraph.digraph}" sound!
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-800">{percentage}% Correct</span>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedDigraph(null)}
                  className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Back to Digraphs
                </button>
                <button
                  onClick={() => handleSelectDigraph(selectedDigraph)}
                  className="px-6 py-3 bg-blue-500 rounded-xl font-bold text-white hover:bg-blue-600 transition-colors"
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
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => setSelectedDigraph(null)}
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-gray-800">Quiz Time!</h1>
                <p className="text-gray-500">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow">
                <span className="font-bold text-blue-600">{quizScore}/{quizAnswered}</span>
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
                <p className="text-lg text-gray-600 mb-4">Which digraph sound is in this word?</p>
                <motion.div
                  className="bg-gray-50 rounded-2xl p-6 mb-4 inline-block"
                  animate={isCorrect === false ? { x: [-10, 10, -10, 10, 0] } : {}}
                >
                  <h2 className="text-5xl font-black text-gray-800">
                    {currentQuestion.word.word}
                  </h2>
                </motion.div>
                <button
                  onClick={() => handlePlaySound(currentQuestion.word.word)}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-700">Hear Word</span>
                </button>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentQuestion.options.map((digraph) => {
                  const isSelected = selectedAnswer === digraph.id;
                  const isCorrectAnswer = digraph.id === currentQuestion.correct.id;
                  const showResult = selectedAnswer !== null;

                  let bgColor = digraph.color;
                  if (showResult) {
                    if (isCorrectAnswer) bgColor = "bg-green-500";
                    else if (isSelected) bgColor = "bg-red-500";
                  }

                  return (
                    <motion.button
                      key={digraph.id}
                      whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                      onClick={() => handleQuizAnswer(digraph.id)}
                      disabled={selectedAnswer !== null}
                      className={`
                        ${bgColor} p-6 rounded-2xl text-white font-black text-3xl
                        shadow-lg transition-all relative
                        ${selectedAnswer === null ? "hover:shadow-xl cursor-pointer" : "cursor-default"}
                      `}
                    >
                      {digraph.digraph}
                      {showResult && isCorrectAnswer && (
                        <Check className="absolute top-2 right-2 w-6 h-6" />
                      )}
                      {showResult && isSelected && !isCorrectAnswer && (
                        <X className="absolute top-2 right-2 w-6 h-6" />
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
                      {isCorrect ? "Correct! 🎉" : `The answer is "${currentQuestion.correct.digraph}"`}
                    </p>
                    <button
                      onClick={nextQuizQuestion}
                      className="px-8 py-3 bg-blue-500 rounded-xl font-bold text-white hover:bg-blue-600 transition-colors"
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
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => setSelectedDigraph(null)}
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
                  Learn the "{selectedDigraph.digraph}" Sound
                </h1>
                <p className="text-gray-500">{selectedDigraph.description}</p>
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
                className={`${selectedDigraph.color} w-40 h-40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
              >
                <span className="text-white text-6xl font-black">
                  {selectedDigraph.digraph}
                </span>
              </motion.div>

              <p className="text-xl text-gray-600 mb-2">
                Two letters that make ONE sound!
              </p>

              <p className="text-lg text-gray-500 mb-6">
                Say "{selectedDigraph.phonemeSpelling}" like in <span className="font-bold text-gray-800">{selectedDigraph.exampleWord}</span>
              </p>

              <button
                onClick={() => handlePlaySound(selectedDigraph.phonemeSpelling)}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors mb-8"
              >
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-700">Hear the Sound: "{selectedDigraph.phonemeSpelling}"</span>
              </button>

              <button
                onClick={startPractice}
                className="px-8 py-4 bg-blue-500 rounded-xl font-bold text-white text-xl hover:bg-blue-600 transition-colors shadow-lg"
              >
                Start Practice
              </button>
            </motion.div>
          </div>
        </main>
      );
    }

    // Practice phase
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => setSelectedDigraph(null)}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
                Practice "{selectedDigraph.digraph}" Words
              </h1>
              <p className="text-gray-500">
                {practicedWords.size}/{Math.min(5, words.length)} words practiced
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-full p-1 mb-6 shadow">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(practicedWords.size / Math.min(5, words.length)) * 100}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Main Practice Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6"
          >
            {/* Digraph Display */}
            <div className="text-center mb-6">
              <motion.div
                className={`${selectedDigraph.color} w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
              >
                <span className="text-white text-4xl font-black">
                  {selectedDigraph.digraph}
                </span>
              </motion.div>
              <button
                onClick={() => handlePlaySound(selectedDigraph.phonemeSpelling)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
              >
                <Volume2 className="w-4 h-4" />
                Hear sound: "{selectedDigraph.phonemeSpelling}"
              </button>
            </div>

            {/* Current Word */}
            {currentWord && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Word {currentWordIndex + 1} of {words.length}
                </p>
                <motion.div
                  key={currentWord.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded-2xl p-6 mb-4"
                >
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-800 mb-4">
                    {currentWord.word.split("").map((letter, i) => {
                      // Highlight the digraph
                      const wordLower = currentWord.word.toLowerCase();
                      const digraphLower = selectedDigraph.digraph.toLowerCase();
                      const digraphStart = wordLower.indexOf(digraphLower);
                      const isInDigraph =
                        digraphStart !== -1 &&
                        i >= digraphStart && i < digraphStart + digraphLower.length;

                      return (
                        <span
                          key={i}
                          className={isInDigraph ? "text-blue-500" : "text-gray-800"}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </h2>
                  <button
                    onClick={() => {
                      handlePlaySound(currentWord.word);
                      markWordPracticed(currentWordIndex);
                    }}
                    className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-blue-700">Hear Word</span>
                  </button>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                    disabled={currentWordIndex === 0}
                    className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    Previous
                  </button>
                  {currentWordIndex < words.length - 1 ? (
                    <button
                      onClick={() => {
                        markWordPracticed(currentWordIndex);
                        setCurrentWordIndex(currentWordIndex + 1);
                      }}
                      className="px-6 py-3 bg-blue-500 rounded-xl font-bold text-white hover:bg-blue-600 transition-colors"
                    >
                      Next Word
                    </button>
                  ) : (
                    <button
                      onClick={generateQuiz}
                      disabled={!allWordsPracticed}
                      className={`px-6 py-3 rounded-xl font-bold text-white transition-colors ${
                        allWordsPracticed
                          ? "bg-purple-500 hover:bg-purple-600"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {allWordsPracticed ? "Take Quiz" : `Practice ${Math.min(5, words.length) - practicedWords.size} More`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Word Progress */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="font-bold text-gray-700 mb-3">Words to Practice:</h3>
            <div className="flex flex-wrap gap-2">
              {words.slice(0, Math.min(5, words.length)).map((word, index) => (
                <button
                  key={word.id}
                  onClick={() => setCurrentWordIndex(index)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    practicedWords.has(index)
                      ? "bg-blue-500 text-white"
                      : index === currentWordIndex
                      ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {practicedWords.has(index) && <Check className="w-3 h-3" />}
                  {word.word}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main digraphs selection view
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
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
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800">Digraphs</h1>
            <p className="text-gray-500">Two letters that make one sound!</p>
          </div>
        </div>

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 mb-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black mb-1">What are Digraphs?</h2>
              <p className="text-white/90">
                Digraphs are two letters that come together to make one special sound.
                For example, "sh" makes the "shh" sound like in "ship"!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Digraph Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {DIGRAPHS.map((digraph, index) => (
            <PhonicsActivityCard
              key={digraph.id}
              id={digraph.id}
              pattern={digraph.digraph}
              description={digraph.description}
              exampleWord={digraph.exampleWord}
              color={digraph.color}
              index={index}
              onClick={() => handleSelectDigraph(digraph)}
              onPlaySound={() => handlePlaySound(digraph.phonemeSpelling)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
