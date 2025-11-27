"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, HelpCircle } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useSpeech } from "@/hooks/use-audio";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";
import type { WordProblemContext } from "@/lib/math-data";

interface WordProblemProps {
  /** The word problem context */
  context: WordProblemContext;
  /** The correct answer */
  answer: number;
  /** Answer options to choose from */
  options: number[];
  /** Callback when answer is selected */
  onAnswer: (isCorrect: boolean) => void;
  /** Auto-speak the story on mount */
  autoSpeak?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show visual hint */
  showVisual?: boolean;
}

const SIZE_CLASSES = {
  sm: {
    text: "text-lg",
    question: "text-base",
    emoji: "text-2xl",
    button: "w-12 h-12 text-lg",
    gap: "gap-1",
  },
  md: {
    text: "text-xl",
    question: "text-lg",
    emoji: "text-3xl",
    button: "w-16 h-16 text-2xl",
    gap: "gap-2",
  },
  lg: {
    text: "text-2xl",
    question: "text-xl",
    emoji: "text-4xl",
    button: "w-20 h-20 text-3xl",
    gap: "gap-3",
  },
};

export function WordProblem({
  context,
  answer,
  options,
  onAnswer,
  autoSpeak = true,
  size = "md",
  showVisual = true,
}: WordProblemProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const sizeClasses = SIZE_CLASSES[size];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Parse numbers from the story for visualization
  const storyNumbers = context.story.match(/\d+/g)?.map(Number) || [];
  const firstNumber = storyNumbers[0] || 0;
  const secondNumber = storyNumbers[1] || 0;

  // Speak the story on mount - speak function excluded to prevent re-triggers on rerender
  useEffect(() => {
    if (autoSpeak) {
      const fullText = `${context.story} ${context.question}`;
      setIsSpeaking(true);
      speak(fullText, { onEnd: () => setIsSpeaking(false) });
    }
    // Note: speak excluded - stable from useSpeech hook, would cause re-triggers if included
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpeak, context.story, context.question]);

  const handleSpeak = () => {
    if (isSpeaking) return;
    const fullText = `${context.story} ${context.question}`;
    setIsSpeaking(true);
    speak(fullText, { onEnd: () => setIsSpeaking(false) });
  };

  const handleOptionClick = (option: number) => {
    if (showResult) return;

    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option === answer;
    if (isCorrect) {
      playFeedback("success", "medium");
    } else {
      playFeedback("snap", "light");
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {/* Story Card */}
      <motion.div
        initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
      >
        {/* Story Text */}
        <p className={cn(sizeClasses.text, "text-gray-700 leading-relaxed mb-4")}>
          {context.story}
        </p>

        {/* Question */}
        <p className={cn(sizeClasses.question, "text-purple-700 font-bold")}>
          {context.question}
        </p>

        {/* Read Aloud Button */}
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={cn(
            "mt-4 flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-purple-100 text-purple-700 font-bold text-sm",
            "hover:bg-purple-200 transition-colors",
            isSpeaking && "opacity-50 cursor-not-allowed"
          )}
        >
          <Volume2 className="w-4 h-4" />
          {isSpeaking ? "Reading..." : "Read to me"}
        </button>
      </motion.div>

      {/* Visual Representation */}
      {showVisual && (
        <motion.div
          initial={!shouldReduceMotion ? { opacity: 0, scale: 0.9 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4"
        >
          {/* First group of objects */}
          <div className="flex flex-col items-center">
            <div className={cn("flex flex-wrap justify-center max-w-32", sizeClasses.gap)}>
              {Array.from({ length: Math.min(firstNumber, 10) }).map((_, i) => (
                <motion.span
                  key={`first-${i}`}
                  initial={!shouldReduceMotion ? { scale: 0 } : {}}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={sizeClasses.emoji}
                >
                  {context.emoji}
                </motion.span>
              ))}
            </div>
            <span className="text-sm text-gray-500 mt-1">{firstNumber}</span>
          </div>

          {/* Operator */}
          <motion.span
            initial={!shouldReduceMotion ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-gray-400"
          >
            {context.action === "join" ? "+" : "-"}
          </motion.span>

          {/* Second group of objects */}
          <div className="flex flex-col items-center">
            <div className={cn("flex flex-wrap justify-center max-w-32", sizeClasses.gap)}>
              {Array.from({ length: Math.min(secondNumber, 10) }).map((_, i) => (
                <motion.span
                  key={`second-${i}`}
                  initial={!shouldReduceMotion ? { scale: 0 } : {}}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className={cn(
                    sizeClasses.emoji,
                    context.action === "separate" && "opacity-50"
                  )}
                >
                  {context.emoji}
                </motion.span>
              ))}
            </div>
            <span className="text-sm text-gray-500 mt-1">{secondNumber}</span>
          </div>

          {/* Equals and result */}
          <motion.span
            initial={!shouldReduceMotion ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl font-bold text-gray-400"
          >
            =
          </motion.span>

          <motion.span
            initial={!shouldReduceMotion ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
            className="text-3xl font-black text-purple-600"
          >
            ?
          </motion.span>
        </motion.div>
      )}

      {/* Hint Button */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <HelpCircle className="w-4 h-4" />
        {showHint ? "Hide hint" : "Need a hint?"}
      </button>

      {/* Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg"
          >
            {context.action === "join"
              ? `Count all the ${context.objects} together!`
              : `Take away ${secondNumber} ${context.objects} from ${firstNumber}.`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Answer Options */}
      <motion.div
        initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {options.map((option, i) => {
          const isSelected = option === selectedAnswer;
          const isCorrectOption = option === answer;

          let optionColor =
            "bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50";

          if (showResult) {
            if (isSelected && isCorrectOption) {
              optionColor = "bg-green-100 border-green-500 text-green-700";
            } else if (isSelected && !isCorrectOption) {
              optionColor = "bg-red-100 border-red-500 text-red-700";
            } else if (!isSelected && isCorrectOption) {
              optionColor =
                "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200";
            } else {
              optionColor = "bg-gray-100 border-gray-200 text-gray-400";
            }
          }

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={showResult}
              initial={!shouldReduceMotion ? { scale: 0 } : {}}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileTap={!showResult ? { scale: 0.95 } : undefined}
              className={cn(
                sizeClasses.button,
                "rounded-xl border-4 font-black",
                "transition-all duration-200 shadow-md",
                optionColor
              )}
            >
              {option}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

// ============================================
// SIMPLE WORD PROBLEM DISPLAY (Non-interactive)
// ============================================

interface WordProblemDisplayProps {
  context: WordProblemContext;
  showAnswer?: boolean;
  answer?: number;
  size?: "sm" | "md" | "lg";
}

export function WordProblemDisplay({
  context,
  showAnswer = false,
  answer,
  size = "md",
}: WordProblemDisplayProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak } = useSpeech();
  const sizeClasses = SIZE_CLASSES[size];
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    speak(`${context.story} ${context.question}`, { onEnd: () => setIsSpeaking(false) });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="w-full bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-100">
        <p className={cn(sizeClasses.text, "text-gray-700 leading-relaxed mb-3")}>
          {context.story}
        </p>
        <p className={cn(sizeClasses.question, "text-purple-700 font-bold")}>
          {context.question}
        </p>

        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs"
        >
          <Volume2 className="w-3 h-3" />
          {isSpeaking ? "Reading..." : "Read"}
        </button>
      </div>

      {showAnswer && answer !== undefined && (
        <motion.div
          initial={!shouldReduceMotion ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-lg text-gray-500">Answer:</span>
          <span className="text-2xl font-black text-green-600">{answer}</span>
        </motion.div>
      )}
    </div>
  );
}
