"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useSpeech } from "@/hooks/use-audio";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";
import {
  DIGRAPHS,
  DIGRAPH_WORDS,
  getWordsByDigraph,
  type DigraphItem,
} from "@/lib/digraphs-data";

// ============================================
// DIGRAPH INTRODUCTION CARD
// ============================================

interface DigraphCardProps {
  digraph: DigraphItem;
  onNext?: () => void;
  autoSpeak?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: { text: "text-4xl", desc: "text-sm", button: "px-3 py-1.5 text-sm" },
  md: { text: "text-6xl", desc: "text-base", button: "px-4 py-2 text-base" },
  lg: { text: "text-8xl", desc: "text-lg", button: "px-5 py-3 text-lg" },
};

export function DigraphCard({
  digraph,
  onNext,
  autoSpeak = true,
  size = "md",
}: DigraphCardProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const sizeClasses = SIZE_CLASSES[size];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (autoSpeak) {
      handleSpeak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digraph.id]);

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    speak(
      `${digraph.digraph.split("").join(" ")} makes the sound ${digraph.phonemeSpelling}. ${digraph.description}. Like in ${digraph.exampleWord}.`,
      { rate: 0.85, onEnd: () => setIsSpeaking(false) }
    );
    playFeedback("pop", "light");
  };

  return (
    <motion.div
      initial={!shouldReduceMotion ? { opacity: 0, scale: 0.9 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 p-6 bg-white rounded-3xl shadow-lg max-w-sm"
    >
      {/* Digraph Display */}
      <motion.div
        initial={!shouldReduceMotion ? { y: -20 } : {}}
        animate={{ y: 0 }}
        className={cn(
          "px-8 py-4 rounded-2xl font-black",
          digraph.color,
          "text-white shadow-md",
          sizeClasses.text
        )}
      >
        {digraph.digraph}
      </motion.div>

      {/* Sound */}
      <p className={cn(sizeClasses.desc, "text-gray-600 text-center")}>
        makes the sound{" "}
        <span className="font-bold text-purple-600">/{digraph.phonemeSpelling}/</span>
      </p>

      {/* Description */}
      <p className={cn(sizeClasses.desc, "text-gray-500 text-center italic")}>
        {digraph.description}
      </p>

      {/* Example Word */}
      <div className="flex items-center gap-2">
        <span className={cn(sizeClasses.desc, "text-gray-600")}>Example:</span>
        <span className="text-xl font-bold text-gray-800">{digraph.exampleWord}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={cn(
            sizeClasses.button,
            "flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full font-bold",
            isSpeaking && "opacity-50 cursor-not-allowed"
          )}
        >
          <Volume2 className="w-4 h-4" />
          {isSpeaking ? "Speaking..." : "Listen"}
        </motion.button>

        {onNext && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className={cn(
              sizeClasses.button,
              "flex items-center gap-2 bg-green-500 text-white rounded-full font-bold"
            )}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// DIGRAPH WORD MATCHING QUIZ
// ============================================

interface DigraphWordQuizProps {
  digraphId: string;
  onComplete?: (correct: number, total: number) => void;
  questionCount?: number;
}

export function DigraphWordQuiz({
  digraphId,
  onComplete,
  questionCount = 5,
}: DigraphWordQuizProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [optionsSeed, setOptionsSeed] = useState(0);

  const digraph = DIGRAPHS.find((d) => d.id === digraphId);

  // Generate questions once using useMemo
  const questions = useMemo(() => {
    const words = getWordsByDigraph(digraphId);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [digraphId, questionCount]);

  const currentQuestion = questions[currentIndex];

  // Generate options using useMemo
  const options = useMemo(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return [];

    const currentWord = questions[currentIndex];
    const otherWords = DIGRAPH_WORDS.filter(
      (w) => w.digraphId !== digraphId && w.difficulty <= 2
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return [currentWord, ...otherWords].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, digraphId, optionsSeed]);

  const handleSpeak = () => {
    if (currentQuestion) {
      speak(`Which word has the ${digraph?.digraph} sound?`, { rate: 0.9 });
    }
  };

  const handleAnswer = (wordId: string) => {
    if (showResult) return;

    setSelectedAnswer(wordId);
    setShowResult(true);

    const isCorrect = wordId === currentQuestion?.id;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      playFeedback("success", "medium");
      speak("Correct!", { rate: 1 });
    } else {
      playFeedback("snap", "light");
      speak(`The answer was ${currentQuestion?.word}`, { rate: 0.9 });
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setOptionsSeed((prev) => prev + 1);
      } else {
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
        onComplete?.(finalCorrect, questions.length);
      }
    }, 1500);
  };

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="text-center text-gray-500 p-8">Loading questions...</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-purple-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-2">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <p className="text-xl font-bold text-gray-800">
          Which word has the{" "}
          <span className={cn("px-2 py-1 rounded text-white", digraph?.color)}>
            {digraph?.digraph}
          </span>{" "}
          sound?
        </p>
        <button
          onClick={handleSpeak}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          <Volume2 className="w-4 h-4 inline mr-1" />
          Read question
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 w-full">
        {options.map((word, i) => {
          const isSelected = word.id === selectedAnswer;
          const isCorrect = word.id === currentQuestion.id;

          let optionClass =
            "bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50";
          if (showResult) {
            if (isCorrect) {
              optionClass = "bg-green-100 border-green-500";
            } else if (isSelected && !isCorrect) {
              optionClass = "bg-red-100 border-red-500";
            } else {
              optionClass = "bg-gray-100 border-gray-200 opacity-50";
            }
          }

          return (
            <motion.button
              key={word.id}
              initial={!shouldReduceMotion ? { opacity: 0, x: -20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleAnswer(word.id)}
              disabled={showResult}
              className={cn(
                "w-full p-4 text-left text-xl font-bold rounded-xl border-4 transition-all",
                optionClass
              )}
            >
              {word.word}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// DIGRAPH SOUND SORT ACTIVITY
// ============================================

interface DigraphSortProps {
  digraphIds: [string, string]; // Two digraphs to sort between
  onComplete?: (correct: number, total: number) => void;
  wordCount?: number;
}

export function DigraphSort({
  digraphIds,
  onComplete,
  wordCount = 8,
}: DigraphSortProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const digraph1 = DIGRAPHS.find((d) => d.id === digraphIds[0]);
  const digraph2 = DIGRAPHS.find((d) => d.id === digraphIds[1]);

  // Generate word list using useState initializer (runs once on mount)
  const [words] = useState(() => {
    const words1 = getWordsByDigraph(digraphIds[0])
      .filter((w) => w.difficulty <= 2)
      .sort(() => Math.random() - 0.5)
      .slice(0, wordCount / 2);
    const words2 = getWordsByDigraph(digraphIds[1])
      .filter((w) => w.difficulty <= 2)
      .sort(() => Math.random() - 0.5)
      .slice(0, wordCount / 2);
    return [...words1, ...words2].sort(() => Math.random() - 0.5);
  });

  const currentWord = words[currentIndex];

  const handleSort = (selectedDigraphId: string) => {
    if (showFeedback || !currentWord) return;

    const isCorrect = currentWord.digraphId === selectedDigraphId;
    setLastCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      playFeedback("success", "light");
    } else {
      playFeedback("snap", "light");
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex + 1 < words.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete?.(
          isCorrect ? correctCount + 1 : correctCount,
          words.length
        );
      }
    }, 800);
  };

  const handleSpeak = () => {
    if (currentWord) {
      speak(currentWord.word, { rate: 0.8 });
    }
  };

  if (!digraph1 || !digraph2 || words.length === 0 || !currentWord) {
    return (
      <div className="text-center text-gray-500 p-8">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-purple-500 h-2 rounded-full"
          animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Instruction */}
      <p className="text-gray-600 text-center">
        Tap the sound you hear in the word!
      </p>

      {/* Current Word */}
      <motion.div
        key={currentWord.id}
        initial={!shouldReduceMotion ? { scale: 0.8, opacity: 0 } : {}}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={handleSpeak}
          className="p-4 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
        >
          <Volume2 className="w-8 h-8 text-purple-600" />
        </button>
        <p className="text-3xl font-black text-gray-800">{currentWord.word}</p>
      </motion.div>

      {/* Sort Buttons */}
      <div className="flex gap-4">
        {[digraph1, digraph2].map((digraph) => (
          <motion.button
            key={digraph.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort(digraph.id)}
            disabled={showFeedback}
            className={cn(
              "w-24 h-24 rounded-2xl text-3xl font-black text-white shadow-lg transition-all",
              digraph.color,
              showFeedback && "opacity-50"
            )}
          >
            {digraph.digraph}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "px-4 py-2 rounded-full font-bold",
              lastCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}
          >
            {lastCorrect ? "Correct!" : "Try again!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FULL DIGRAPH LESSON
// ============================================

interface DigraphLessonProps {
  digraphId: string;
  onComplete?: (score: number) => void;
}

export function DigraphLesson({ digraphId, onComplete }: DigraphLessonProps) {
  const [stage, setStage] = useState<"intro" | "quiz" | "complete">("intro");
  const [score, setScore] = useState(0);

  const digraph = DIGRAPHS.find((d) => d.id === digraphId);

  if (!digraph) {
    return <div className="text-center text-gray-500 p-8">Digraph not found</div>;
  }

  const handleQuizComplete = (correct: number, total: number) => {
    const finalScore = Math.round((correct / total) * 100);
    setScore(finalScore);
    setStage("complete");
  };

  const handleRestart = () => {
    setStage("intro");
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {stage === "intro" && (
        <DigraphCard
          digraph={digraph}
          onNext={() => setStage("quiz")}
          autoSpeak
        />
      )}

      {stage === "quiz" && (
        <DigraphWordQuiz
          digraphId={digraphId}
          onComplete={handleQuizComplete}
          questionCount={5}
        />
      )}

      {stage === "complete" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg"
        >
          <Sparkles className="w-16 h-16 text-yellow-400" />
          <h2 className="text-2xl font-black text-gray-800">Great Job!</h2>
          <p className="text-lg text-gray-600">
            You scored <span className="font-bold text-purple-600">{score}%</span>
          </p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete?.(score)}
              className="px-4 py-2 bg-green-500 text-white rounded-full font-bold flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
