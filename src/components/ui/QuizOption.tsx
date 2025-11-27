"use client";

import { memo, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/use-accessibility";

/**
 * Feedback state for quiz options after answer selection
 */
type FeedbackState = "correct" | "incorrect" | "missed" | "neutral" | null;

/**
 * QuizOptionButton Props
 *
 * A reusable button component for quiz/practice option selection.
 * Encapsulates common patterns: motion animations, selection states,
 * feedback states, and accessibility features.
 */
interface QuizOptionButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  /** Whether this option is currently selected */
  selected?: boolean;
  /** Feedback state after checking answers */
  feedback?: FeedbackState;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Color scheme for selected state */
  selectedColor?: "purple" | "blue" | "green" | "pink" | "orange";
  /** Show border on bottom for 3D effect */
  showBorder?: boolean;
  /** Override the default rounded corners */
  rounded?: "xl" | "2xl" | "3xl" | "full";
}

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-4 text-xl",
  lg: "px-6 py-5 text-2xl sm:text-3xl",
};

const roundedStyles = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const selectedColors = {
  purple: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-700",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-700",
  },
  green: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-700",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-white",
    border: "border-pink-700",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-700",
  },
};

const feedbackStyles: Record<NonNullable<FeedbackState>, string> = {
  correct: "bg-green-500 text-white border-green-700",
  incorrect: "bg-red-400 text-white border-red-600",
  missed: "bg-green-100 text-green-800 border-green-400",
  neutral: "bg-gray-100 text-gray-400 border-gray-200",
};

/**
 * QuizOptionButton Component
 *
 * Use for multiple choice options, word selections, and answer buttons.
 * Handles motion animations, selection states, and feedback states.
 *
 * @example
 * ```tsx
 * <QuizOptionButton
 *   selected={selectedAnswer === option}
 *   onClick={() => setSelectedAnswer(option)}
 * >
 *   {option}
 * </QuizOptionButton>
 * ```
 *
 * @example With feedback
 * ```tsx
 * <QuizOptionButton
 *   selected={selected}
 *   feedback={showResults ? (isCorrect ? "correct" : "incorrect") : null}
 *   disabled={showResults}
 * >
 *   {option}
 * </QuizOptionButton>
 * ```
 */
export const QuizOptionButton = memo(
  forwardRef<HTMLButtonElement, QuizOptionButtonProps>(
    (
      {
        children,
        selected = false,
        feedback = null,
        size = "md",
        selectedColor = "purple",
        showBorder = true,
        rounded = "2xl",
        className,
        disabled,
        ...props
      },
      ref
    ) => {
      const { shouldReduceMotion } = useAccessibility();
      const colorSet = selectedColors[selectedColor];

      // Determine styles based on state
      let stateStyles: string;
      if (feedback) {
        stateStyles = feedbackStyles[feedback];
      } else if (selected) {
        stateStyles = cn(colorSet.bg, colorSet.text, colorSet.border, "shadow-lg");
      } else {
        stateStyles = "bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-md";
      }

      return (
        <motion.button
          ref={ref}
          whileHover={
            shouldReduceMotion || disabled || feedback ? {} : { scale: 1.05 }
          }
          whileTap={
            shouldReduceMotion || disabled || feedback ? {} : { scale: 0.95 }
          }
          disabled={disabled}
          className={cn(
            "font-bold uppercase transition-all touch-target",
            roundedStyles[rounded],
            sizeStyles[size],
            showBorder && "border-b-4",
            stateStyles,
            disabled && "opacity-60 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {children}
        </motion.button>
      );
    }
  )
);

QuizOptionButton.displayName = "QuizOptionButton";

/**
 * QuizOptionGrid Props
 *
 * A container for arranging quiz options in a responsive grid.
 */
interface QuizOptionGridProps {
  children: React.ReactNode;
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Gap between items */
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const columnStyles = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const gapStyles = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

/**
 * QuizOptionGrid Component
 *
 * Provides a consistent grid layout for quiz options.
 *
 * @example
 * ```tsx
 * <QuizOptionGrid columns={2}>
 *   {options.map(option => (
 *     <QuizOptionButton key={option} onClick={() => select(option)}>
 *       {option}
 *     </QuizOptionButton>
 *   ))}
 * </QuizOptionGrid>
 * ```
 */
export function QuizOptionGrid({
  children,
  columns = 2,
  gap = "md",
  className,
}: QuizOptionGridProps) {
  return (
    <div
      className={cn(
        "grid w-full",
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * AnswerFeedbackOverlay Props
 *
 * A full-screen overlay for showing answer feedback.
 */
interface AnswerFeedbackOverlayProps {
  /** Whether the answer was correct */
  isCorrect: boolean;
  /** Whether to show the overlay */
  show: boolean;
  /** Optional custom content */
  children?: React.ReactNode;
}

/**
 * AnswerFeedbackOverlay Component
 *
 * Shows a full-screen feedback overlay with check or X icon.
 *
 * @example
 * ```tsx
 * <AnswerFeedbackOverlay isCorrect={true} show={showFeedback} />
 * ```
 */
export function AnswerFeedbackOverlay({
  isCorrect,
  show,
  children,
}: AnswerFeedbackOverlayProps) {
  const { shouldReduceMotion } = useAccessibility();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        isCorrect ? "bg-green-500/20" : "bg-red-500/20"
      )}
    >
      {children || (
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.2, 1],
                  rotate: isCorrect ? [0, -10, 10, 0] : [0, -5, 5, 0],
                }
          }
          className={cn(
            "p-8 rounded-full",
            isCorrect ? "bg-green-500" : "bg-red-500"
          )}
        >
          {isCorrect ? (
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Correct"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Incorrect"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
