"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, RotateCcw, Sparkles, ChevronLeft } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useSpeech } from "@/hooks/use-audio";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";
import {
  BLENDS,
  BLEND_WORDS,
  getWordsByBlend,
  type BlendItem,
  type BlendWord,
} from "@/lib/blends-data";

// ============================================
// BLEND INTRODUCTION CARD
// ============================================

interface BlendCardProps {
  blend: BlendItem;
  onNext?: () => void;
  autoSpeak?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: { text: "text-4xl", desc: "text-sm", button: "px-3 py-1.5 text-sm" },
  md: { text: "text-6xl", desc: "text-base", button: "px-4 py-2 text-base" },
  lg: { text: "text-8xl", desc: "text-lg", button: "px-5 py-3 text-lg" },
};

export function BlendCard({
  blend,
  onNext,
  autoSpeak = true,
  size = "md",
}: BlendCardProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const sizeClasses = SIZE_CLASSES[size];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (autoSpeak) {
      handleSpeak();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blend.id]);

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const letters = blend.blend.split("").join(" and ");
    speak(
      `${letters} together make ${blend.blend}. ${blend.description}. Like in ${blend.exampleWord}.`,
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
      {/* Blend Display - Show letters coming together */}
      <div className="flex items-center gap-2">
        {blend.blend.split("").map((letter, i) => (
          <motion.span
            key={i}
            initial={!shouldReduceMotion ? { x: i === 0 ? -30 : 30, opacity: 0 } : {}}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.2 }}
            className={cn(
              "px-4 py-2 rounded-xl text-white font-black shadow-md",
              sizeClasses.text,
              blend.color
            )}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
        <motion.span
          initial={!shouldReduceMotion ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-4xl"
        >
          =
        </motion.span>
        <motion.span
          initial={!shouldReduceMotion ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          className={cn(
            "px-6 py-3 rounded-2xl text-white font-black shadow-lg",
            sizeClasses.text,
            blend.color
          )}
        >
          {blend.blend}
        </motion.span>
      </div>

      {/* Description */}
      <p className={cn(sizeClasses.desc, "text-gray-600 text-center mt-2")}>
        {blend.description}
      </p>

      {/* Category Badge */}
      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
        {blend.category.replace("-", " ")}
      </span>

      {/* Example Word */}
      <div className="flex items-center gap-2">
        <span className={cn(sizeClasses.desc, "text-gray-600")}>Example:</span>
        <span className="text-xl font-bold text-gray-800">{blend.exampleWord}</span>
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
// BLEND WORD BUILDER
// ============================================

interface BlendWordBuilderProps {
  word: BlendWord;
  onComplete?: (correct: boolean) => void;
}

export function BlendWordBuilder({ word, onComplete }: BlendWordBuilderProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const [selectedPhonemes, setSelectedPhonemes] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const blend = BLENDS.find((b) => b.id === word.blendId);
  const phonemes = word.phonemes;

  // Shuffle phonemes for options
  const [shuffledPhonemes] = useState(() =>
    [...phonemes].sort(() => Math.random() - 0.5)
  );

  const handlePhonemeClick = (phoneme: string) => {
    if (showResult) return;

    const newSelected = [...selectedPhonemes, phoneme];
    setSelectedPhonemes(newSelected);

    speak(phoneme, { rate: 0.8 });
    playFeedback("pop", "light");

    // Check if complete
    if (newSelected.length === phonemes.length) {
      setShowResult(true);
      const isCorrect = newSelected.join("") === phonemes.join("");

      if (isCorrect) {
        playFeedback("success", "medium");
        speak(`${word.word}! Great job!`, { rate: 0.9 });
      } else {
        playFeedback("snap", "light");
        speak(`The word is ${word.word}`, { rate: 0.9 });
      }

      setTimeout(() => {
        onComplete?.(isCorrect);
      }, 1500);
    }
  };

  const handleReset = () => {
    setSelectedPhonemes([]);
    setShowResult(false);
  };

  const handleSpeakWord = () => {
    speak(word.word, { rate: 0.8 });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Target Word with Audio */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSpeakWord}
          className="p-3 bg-purple-100 rounded-full hover:bg-purple-200"
        >
          <Volume2 className="w-6 h-6 text-purple-600" />
        </button>
        <span className="text-2xl font-black text-gray-800">{word.word}</span>
      </div>

      {/* Selected Phonemes Display */}
      <motion.div
        className="flex items-center gap-2 p-4 bg-gray-100 rounded-2xl min-h-20 w-full justify-center"
        layout
      >
        {selectedPhonemes.length === 0 ? (
          <span className="text-gray-400">Tap sounds to build the word</span>
        ) : (
          selectedPhonemes.map((phoneme, i) => {
            const isBlendPart = blend?.blend.includes(phoneme);
            return (
              <motion.span
                key={i}
                initial={!shouldReduceMotion ? { scale: 0 } : {}}
                animate={{ scale: 1 }}
                className={cn(
                  "px-3 py-2 rounded-lg text-xl font-bold",
                  isBlendPart
                    ? cn(blend?.color, "text-white")
                    : "bg-white text-gray-800 border-2 border-gray-300"
                )}
              >
                {phoneme}
              </motion.span>
            );
          })
        )}
      </motion.div>

      {/* Phoneme Options */}
      <div className="flex flex-wrap justify-center gap-3">
        {shuffledPhonemes.map((phoneme, i) => {
          const isUsed = selectedPhonemes.filter((p) => p === phoneme).length >=
            phonemes.filter((p) => p === phoneme).length;
          const isBlendPart = blend?.blend.includes(phoneme);

          return (
            <motion.button
              key={`${phoneme}-${i}`}
              initial={!shouldReduceMotion ? { scale: 0 } : {}}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handlePhonemeClick(phoneme)}
              disabled={isUsed || showResult}
              className={cn(
                "px-4 py-3 rounded-xl text-xl font-bold transition-all",
                isUsed && "opacity-30 cursor-not-allowed",
                !isUsed && isBlendPart && cn(blend?.color, "text-white shadow-md"),
                !isUsed && !isBlendPart && "bg-white text-gray-800 border-2 border-gray-300 hover:border-purple-400"
              )}
            >
              {phoneme}
            </motion.button>
          );
        })}
      </div>

      {/* Reset Button */}
      {selectedPhonemes.length > 0 && !showResult && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </motion.button>
      )}

      {/* Result Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "px-6 py-3 rounded-full font-bold text-lg",
              selectedPhonemes.join("") === phonemes.join("")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {selectedPhonemes.join("") === phonemes.join("") ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Correct!
              </span>
            ) : (
              "Try again!"
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// BLEND CATEGORY SELECTOR
// ============================================

interface BlendCategorySelectorProps {
  onSelect: (category: BlendItem["category"]) => void;
}

export function BlendCategorySelector({ onSelect }: BlendCategorySelectorProps) {
  const { shouldReduceMotion } = useAccessibility();

  const categories: { id: BlendItem["category"]; label: string; color: string; examples: string }[] = [
    { id: "l-blend", label: "L-Blends", color: "bg-blue-500", examples: "bl, cl, fl, gl, pl, sl" },
    { id: "r-blend", label: "R-Blends", color: "bg-red-500", examples: "br, cr, dr, fr, gr, pr, tr" },
    { id: "s-blend", label: "S-Blends", color: "bg-green-500", examples: "sc, sk, sm, sn, sp, st, sw" },
    { id: "final-blend", label: "Final Blends", color: "bg-purple-500", examples: "ft, lt, nt, mp, nd, nk" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800">Choose a Blend Type</h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "p-4 rounded-2xl text-white text-left shadow-lg",
              cat.color
            )}
          >
            <p className="text-xl font-black">{cat.label}</p>
            <p className="text-sm opacity-80 mt-1">{cat.examples}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// BLEND WORD QUIZ
// ============================================

interface BlendWordQuizProps {
  blendId: string;
  onComplete?: (correct: number, total: number) => void;
  questionCount?: number;
}

export function BlendWordQuiz({
  blendId,
  onComplete,
  questionCount = 5,
}: BlendWordQuizProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [optionsSeed, setOptionsSeed] = useState(0);

  const blend = BLENDS.find((b) => b.id === blendId);

  // Generate questions using useMemo
  const questions = useMemo(() => {
    const words = getWordsByBlend(blendId);
    const shuffled = [...words]
      .filter((w) => w.difficulty <= 2)
      .sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [blendId, questionCount]);

  const currentQuestion = questions[currentIndex];

  // Generate options using useMemo
  const options = useMemo(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return [];

    const currentWord = questions[currentIndex];
    const otherWords = BLEND_WORDS.filter(
      (w) => w.blendId !== blendId && w.difficulty <= 2
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return [currentWord, ...otherWords].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, blendId, optionsSeed]);

  const handleSpeak = () => {
    if (currentQuestion) {
      speak(`Which word starts with ${blend?.blend}?`, { rate: 0.9 });
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
    } else {
      playFeedback("snap", "light");
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
    return <div className="text-center text-gray-500 p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-purple-500 h-2 rounded-full"
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
          <span className={cn("px-2 py-1 rounded text-white", blend?.color)}>
            {blend?.blend}
          </span>{" "}
          blend?
        </p>
        <button onClick={handleSpeak} className="mt-2 text-sm text-blue-600 hover:underline">
          <Volume2 className="w-4 h-4 inline mr-1" />
          Read question
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 w-full">
        {options.map((word, i) => {
          const isSelected = word.id === selectedAnswer;
          const isCorrect = word.id === currentQuestion.id;

          let optionClass = "bg-white border-gray-300 hover:border-purple-400";
          if (showResult) {
            if (isCorrect) optionClass = "bg-green-100 border-green-500";
            else if (isSelected) optionClass = "bg-red-100 border-red-500";
            else optionClass = "bg-gray-100 border-gray-200 opacity-50";
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
// FULL BLEND LESSON
// ============================================

interface BlendLessonProps {
  blendId: string;
  onComplete?: (score: number) => void;
  onBack?: () => void;
}

export function BlendLesson({ blendId, onComplete, onBack }: BlendLessonProps) {
  const [stage, setStage] = useState<"intro" | "quiz" | "complete">("intro");
  const [score, setScore] = useState(0);

  const blend = BLENDS.find((b) => b.id === blendId);

  if (!blend) {
    return <div className="text-center text-gray-500 p-8">Blend not found</div>;
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
      {/* Back Button */}
      {onBack && stage === "intro" && (
        <button
          onClick={onBack}
          className="self-start flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      )}

      {stage === "intro" && (
        <BlendCard blend={blend} onNext={() => setStage("quiz")} autoSpeak />
      )}

      {stage === "quiz" && (
        <BlendWordQuiz
          blendId={blendId}
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
