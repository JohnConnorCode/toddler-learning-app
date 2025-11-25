"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccessibility } from "@/hooks/use-accessibility";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";

interface PatternSequenceProps {
  /** The complete sequence of numbers */
  sequence: number[];
  /** Which index is hidden (0-based) */
  missingIndex: number;
  /** Skip count increment (for display/hint) */
  skipBy?: number;
  /** Answer options to choose from */
  options?: number[];
  /** Callback when answer is selected */
  onAnswer?: (isCorrect: boolean) => void;
  /** Show the correct answer */
  showAnswer?: boolean;
  /** Emoji to show under each number */
  emoji?: string;
  /** Show arrows between numbers */
  showArrows?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Animation enabled */
  animateIn?: boolean;
}

const SIZE_CLASSES = {
  sm: {
    box: "w-12 h-12",
    text: "text-lg",
    arrow: "w-6",
    emoji: "text-sm",
    gap: "gap-1",
  },
  md: {
    box: "w-16 h-16",
    text: "text-2xl",
    arrow: "w-8",
    emoji: "text-lg",
    gap: "gap-2",
  },
  lg: {
    box: "w-20 h-20",
    text: "text-3xl",
    arrow: "w-10",
    emoji: "text-xl",
    gap: "gap-3",
  },
};

export function PatternSequence({
  sequence,
  missingIndex,
  skipBy,
  options,
  onAnswer,
  showAnswer = false,
  emoji,
  showArrows = true,
  size = "md",
  animateIn = true,
}: PatternSequenceProps) {
  const { shouldReduceMotion } = useAccessibility();
  const sizeClasses = SIZE_CLASSES[size];
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const correctAnswer = sequence[missingIndex];

  const handleOptionClick = (option: number) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === correctAnswer;
    if (isCorrect) {
      playFeedback("success", "medium");
    } else {
      playFeedback("snap", "light");
    }

    if (onAnswer) {
      setTimeout(() => onAnswer(isCorrect), 1000);
    }
  };

  const renderArrow = (index: number) => {
    if (!showArrows || index >= sequence.length - 1) return null;

    return (
      <motion.div
        initial={animateIn && !shouldReduceMotion ? { opacity: 0, x: -10 } : {}}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15 + 0.1 }}
        className={cn(sizeClasses.arrow, "flex flex-col items-center justify-center")}
      >
        <svg viewBox="0 0 24 24" className="w-full h-6 text-gray-400">
          <path
            d="M5 12h14m-4-4l4 4-4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {skipBy && (
          <span className="text-xs text-purple-500 font-bold">+{skipBy}</span>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Sequence display */}
      <div className={cn("flex items-center", sizeClasses.gap)}>
        {sequence.map((num, index) => {
          const isMissing = index === missingIndex;
          const shouldShowValue = !isMissing || showAnswer || isAnswered;
          const displayValue = shouldShowValue ? num : "?";

          // Determine color based on state
          let boxColor = "bg-white border-gray-300 text-gray-700";
          if (isMissing && !shouldShowValue) {
            boxColor = "bg-yellow-100 border-yellow-400 text-yellow-700 border-dashed";
          } else if (isMissing && isAnswered) {
            if (selectedAnswer === correctAnswer) {
              boxColor = "bg-green-100 border-green-500 text-green-700";
            } else {
              boxColor = "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-300";
            }
          }

          return (
            <div key={index} className="flex items-center">
              <motion.div
                initial={animateIn && !shouldReduceMotion ? { scale: 0, opacity: 0 } : {}}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 300,
                }}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    sizeClasses.box,
                    "rounded-xl border-4 flex items-center justify-center",
                    "shadow-md transition-all duration-200",
                    boxColor
                  )}
                >
                  <span className={cn(sizeClasses.text, "font-black")}>
                    {displayValue}
                  </span>
                </div>

                {/* Emoji counters below (optional) */}
                {emoji && !isMissing && (
                  <motion.div
                    initial={animateIn && !shouldReduceMotion ? { opacity: 0 } : {}}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                    className={cn("mt-1 flex flex-wrap justify-center max-w-16", sizeClasses.emoji)}
                  >
                    {Array.from({ length: Math.min(num, 5) }).map((_, i) => (
                      <span key={i}>{emoji}</span>
                    ))}
                    {num > 5 && <span className="text-xs">...</span>}
                  </motion.div>
                )}
              </motion.div>

              {renderArrow(index)}
            </div>
          );
        })}
      </div>

      {/* Answer options */}
      {options && options.length > 0 && (
        <motion.div
          initial={animateIn && !shouldReduceMotion ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {options.map((option, i) => {
            const isSelected = option === selectedAnswer;
            const isCorrectOption = option === correctAnswer;

            let optionColor = "bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50";
            if (isAnswered) {
              if (isSelected && isCorrectOption) {
                optionColor = "bg-green-100 border-green-500 text-green-700";
              } else if (isSelected && !isCorrectOption) {
                optionColor = "bg-red-100 border-red-500 text-red-700";
              } else if (!isSelected && isCorrectOption) {
                optionColor = "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200";
              } else {
                optionColor = "bg-gray-100 border-gray-200 text-gray-400";
              }
            }

            return (
              <motion.button
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                initial={animateIn && !shouldReduceMotion ? { scale: 0 } : {}}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileTap={!isAnswered ? { scale: 0.95 } : undefined}
                className={cn(
                  "w-14 h-14 rounded-xl border-4 text-xl font-black",
                  "transition-all duration-200 shadow-md",
                  optionColor
                )}
              >
                {option}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Skip count hint */}
      {skipBy && (
        <motion.p
          initial={animateIn && !shouldReduceMotion ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 font-medium"
        >
          Count by {skipBy}s!
        </motion.p>
      )}
    </div>
  );
}

// ============================================
// SKIP COUNTING DISPLAY (Non-interactive)
// ============================================

interface SkipCountDisplayProps {
  skipBy: 2 | 5 | 10;
  maxNumber?: number;
  highlightMultiples?: boolean;
  size?: "sm" | "md" | "lg";
  animateIn?: boolean;
}

export function SkipCountDisplay({
  skipBy,
  maxNumber = 20,
  highlightMultiples = true,
  animateIn = true,
}: SkipCountDisplayProps) {
  const { shouldReduceMotion } = useAccessibility();

  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-md">
      {numbers.map((num, index) => {
        const isSkipNumber = num % skipBy === 0;

        return (
          <motion.div
            key={num}
            initial={animateIn && !shouldReduceMotion ? { scale: 0, opacity: 0 } : {}}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.03,
              type: "spring",
              stiffness: 400,
            }}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
              "border-2 transition-all duration-200",
              isSkipNumber && highlightMultiples
                ? "bg-purple-500 text-white border-purple-600 shadow-md"
                : "bg-gray-100 text-gray-500 border-gray-200"
            )}
          >
            {num}
          </motion.div>
        );
      })}
    </div>
  );
}
