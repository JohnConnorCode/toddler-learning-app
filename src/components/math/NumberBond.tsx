"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccessibility } from "@/hooks/use-accessibility";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";

interface NumberBondProps {
  /** The whole number (top of the bond) */
  whole: number;
  /** The two parts that make up the whole */
  parts: [number, number];
  /** Which part is hidden (shown as ?) */
  missingPart?: "whole" | "left" | "right" | "none";
  /** Layout style */
  layout?: "vertical" | "horizontal";
  /** Show the answer (reveal the hidden part) */
  showAnswer?: boolean;
  /** Callback when a part is clicked */
  onPartClick?: (part: "whole" | "left" | "right") => void;
  /** Whether parts are interactive */
  interactive?: boolean;
  /** Selected part (for answer feedback) */
  selectedPart?: "whole" | "left" | "right" | null;
  /** Whether the selection is correct */
  isCorrect?: boolean | null;
  /** Emoji to show inside parts (visual representation) */
  emoji?: string;
  /** Show emoji counters inside each part */
  showCounters?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Animation enabled */
  animateIn?: boolean;
}

const SIZE_CLASSES = {
  sm: {
    circle: "w-14 h-14",
    text: "text-xl",
    emoji: "text-xs",
    line: "h-8",
    gap: "gap-1",
  },
  md: {
    circle: "w-20 h-20",
    text: "text-3xl",
    emoji: "text-sm",
    line: "h-12",
    gap: "gap-2",
  },
  lg: {
    circle: "w-28 h-28",
    text: "text-4xl",
    emoji: "text-lg",
    line: "h-16",
    gap: "gap-3",
  },
};

export function NumberBond({
  whole,
  parts,
  missingPart = "none",
  layout = "vertical",
  showAnswer = false,
  onPartClick,
  interactive = false,
  selectedPart = null,
  isCorrect = null,
  emoji,
  showCounters = false,
  size = "md",
  animateIn = true,
}: NumberBondProps) {
  const { shouldReduceMotion } = useAccessibility();
  const sizeClasses = SIZE_CLASSES[size];
  const [leftPart, rightPart] = parts;

  const handleClick = (part: "whole" | "left" | "right") => {
    if (!interactive || !onPartClick) return;
    playFeedback("pop", "light");
    onPartClick(part);
  };

  const getDisplayValue = (part: "whole" | "left" | "right"): string | number => {
    if (part === missingPart && !showAnswer) {
      return "?";
    }
    switch (part) {
      case "whole":
        return whole;
      case "left":
        return leftPart;
      case "right":
        return rightPart;
    }
  };

  const getPartColor = (part: "whole" | "left" | "right") => {
    const isMissing = part === missingPart;
    const isSelected = part === selectedPart;

    if (isSelected && isCorrect === true) {
      return "bg-green-100 border-green-500 text-green-700";
    }
    if (isSelected && isCorrect === false) {
      return "bg-red-100 border-red-500 text-red-700";
    }
    if (isMissing && !showAnswer) {
      return "bg-yellow-100 border-yellow-400 text-yellow-700 border-dashed";
    }
    if (part === "whole") {
      return "bg-purple-100 border-purple-400 text-purple-700";
    }
    if (part === "left") {
      return "bg-blue-100 border-blue-400 text-blue-700";
    }
    return "bg-green-100 border-green-400 text-green-700";
  };

  const renderCounters = (count: number, maxDisplay: number = 10) => {
    if (!emoji || !showCounters) return null;
    const displayCount = Math.min(count, maxDisplay);

    return (
      <div className={cn("flex flex-wrap justify-center", sizeClasses.gap)}>
        {Array.from({ length: displayCount }).map((_, i) => (
          <span key={i} className={sizeClasses.emoji}>
            {emoji}
          </span>
        ))}
        {count > maxDisplay && <span className={sizeClasses.emoji}>...</span>}
      </div>
    );
  };

  const renderCirclePart = (part: "whole" | "left" | "right", delay: number) => {
    const value = getDisplayValue(part);
    const colorClasses = getPartColor(part);
    const count = part === "whole" ? whole : part === "left" ? leftPart : rightPart;

    return (
      <motion.button
        key={part}
        type="button"
        disabled={!interactive}
        onClick={() => handleClick(part)}
        initial={animateIn && !shouldReduceMotion ? { scale: 0, opacity: 0 } : {}}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay,
          type: "spring",
          stiffness: 300,
        }}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        whileHover={interactive ? { scale: 1.05 } : undefined}
        className={cn(
          sizeClasses.circle,
          "rounded-full border-4 flex flex-col items-center justify-center",
          "transition-all duration-200 shadow-md",
          colorClasses,
          interactive && "cursor-pointer hover:shadow-lg",
          !interactive && "cursor-default"
        )}
        aria-label={`${part} part: ${value}`}
      >
        <span className={cn(sizeClasses.text, "font-black")}>{value}</span>
        {showCounters && emoji && value !== "?" && (
          <div className="absolute -bottom-1 opacity-50 scale-75">
            {renderCounters(count, 5)}
          </div>
        )}
      </motion.button>
    );
  };

  if (layout === "horizontal") {
    return (
      <div className="flex items-center gap-4">
        {renderCirclePart("left", 0)}
        <motion.span
          initial={animateIn && !shouldReduceMotion ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-400"
        >
          +
        </motion.span>
        {renderCirclePart("right", 0.1)}
        <motion.span
          initial={animateIn && !shouldReduceMotion ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-400"
        >
          =
        </motion.span>
        {renderCirclePart("whole", 0.2)}
      </div>
    );
  }

  // Vertical layout (classic number bond shape)
  return (
    <div className="flex flex-col items-center">
      {/* Whole (top) */}
      {renderCirclePart("whole", 0)}

      {/* Lines connecting to parts */}
      <svg
        className={cn(sizeClasses.line, "w-32")}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M50 0 L20 40"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={animateIn && !shouldReduceMotion ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        />
        <motion.path
          d="M50 0 L80 40"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={animateIn && !shouldReduceMotion ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        />
      </svg>

      {/* Parts (bottom) */}
      <div className="flex items-center gap-8">
        {renderCirclePart("left", 0.3)}
        {renderCirclePart("right", 0.4)}
      </div>
    </div>
  );
}

// ============================================
// NUMBER BOND WITH ANSWER OPTIONS
// ============================================

interface NumberBondQuizProps {
  whole: number;
  parts: [number, number];
  missingPart: "whole" | "left" | "right";
  options: number[];
  onAnswer: (isCorrect: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export function NumberBondQuiz({
  whole,
  parts,
  missingPart,
  options,
  onAnswer,
  size = "md",
}: NumberBondQuizProps) {
  const { shouldReduceMotion } = useAccessibility();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const correctAnswer =
    missingPart === "whole" ? whole : missingPart === "left" ? parts[0] : parts[1];

  const handleOptionClick = (option: number) => {
    if (showResult) return;

    setSelectedOption(option);
    setShowResult(true);

    const isCorrect = option === correctAnswer;
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
    <div className="flex flex-col items-center gap-6">
      <NumberBond
        whole={whole}
        parts={parts}
        missingPart={missingPart}
        showAnswer={showResult}
        size={size}
      />

      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option, i) => {
          const isSelected = option === selectedOption;
          const isCorrectOption = option === correctAnswer;

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={showResult}
              initial={!shouldReduceMotion ? { scale: 0, opacity: 0 } : {}}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileTap={!showResult ? { scale: 0.95 } : undefined}
              className={cn(
                "w-16 h-16 rounded-xl border-4 text-2xl font-black",
                "transition-all duration-200 shadow-md",
                !showResult && "bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50",
                showResult && isSelected && isCorrectOption && "bg-green-100 border-green-500 text-green-700",
                showResult && isSelected && !isCorrectOption && "bg-red-100 border-red-500 text-red-700",
                showResult && !isSelected && isCorrectOption && "bg-green-100 border-green-500 text-green-700 ring-4 ring-green-200",
                showResult && !isSelected && !isCorrectOption && "opacity-50"
              )}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

