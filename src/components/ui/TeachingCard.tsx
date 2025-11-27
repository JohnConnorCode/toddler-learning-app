"use client";

import { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useSpeech } from "@/hooks/use-audio";

/**
 * TeachingCard Props
 *
 * A reusable card component for displaying educational content
 * with optional auto-speak functionality.
 */
interface TeachingCardProps {
  /** Main content to display prominently */
  mainContent: React.ReactNode;
  /** Optional secondary content (description, example, etc.) */
  secondaryContent?: React.ReactNode;
  /** Text to speak when auto-speak is triggered or hear button clicked */
  speakText?: string;
  /** Whether to automatically speak when card appears */
  autoSpeak?: boolean;
  /** Speech rate (default: 0.8) */
  speechRate?: number;
  /** Background color gradient */
  color?: "purple" | "blue" | "green" | "pink" | "orange" | "yellow" | "indigo";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Show the "hear it" button */
  showSpeakButton?: boolean;
  /** Custom speak button text */
  speakButtonText?: string;
  /** Called when animation completes */
  onAnimationComplete?: () => void;
  /** Called when speak finishes */
  onSpeakEnd?: () => void;
  /** Additional className */
  className?: string;
  children?: React.ReactNode;
}

const colorStyles = {
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  green: "bg-gradient-to-br from-green-500 to-green-600",
  pink: "bg-gradient-to-br from-pink-500 to-rose-500",
  orange: "bg-gradient-to-br from-orange-400 to-orange-500",
  yellow: "bg-gradient-to-br from-yellow-400 to-amber-500",
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600",
};

const sizeStyles = {
  sm: "px-4 py-3 max-w-xs",
  md: "px-6 py-5 max-w-sm",
  lg: "px-8 py-6 max-w-md",
};

const mainContentSizeStyles = {
  sm: "text-3xl sm:text-4xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl",
};

/**
 * TeachingCard Component
 *
 * Use for displaying letters, words, blends, or other educational content
 * with consistent styling and audio support.
 *
 * @example Basic usage
 * ```tsx
 * <TeachingCard
 *   mainContent="CAT"
 *   secondaryContent="A word in the -AT family"
 *   speakText="cat"
 *   autoSpeak
 * />
 * ```
 *
 * @example With custom content
 * ```tsx
 * <TeachingCard color="blue" size="lg">
 *   <div className="flex gap-2">
 *     <span className="text-white">B</span>
 *     <span className="text-white">+</span>
 *     <span className="text-white">L</span>
 *   </div>
 * </TeachingCard>
 * ```
 */
export const TeachingCard = memo(function TeachingCard({
  mainContent,
  secondaryContent,
  speakText,
  autoSpeak = false,
  speechRate = 0.8,
  color = "purple",
  size = "md",
  showSpeakButton = true,
  speakButtonText = "Hear it",
  onAnimationComplete,
  onSpeakEnd,
  className,
  children,
}: TeachingCardProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak, stop } = useSpeech();
  const hasSpokenRef = useRef(false);

  // Auto-speak on mount
  useEffect(() => {
    if (autoSpeak && speakText && !hasSpokenRef.current) {
      hasSpokenRef.current = true;
      const timer = setTimeout(() => {
        speak(speakText, { rate: speechRate, onEnd: onSpeakEnd });
      }, 300);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [autoSpeak, speakText, speechRate, speak, stop, onSpeakEnd]);

  // Reset spoken flag when speakText changes
  useEffect(() => {
    hasSpokenRef.current = false;
  }, [speakText]);

  const handleSpeak = () => {
    if (speakText) {
      stop();
      speak(speakText, { rate: speechRate, onEnd: onSpeakEnd });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onAnimationComplete={onAnimationComplete}
        className={cn(
          "rounded-2xl sm:rounded-3xl shadow-xl text-center",
          colorStyles[color],
          sizeStyles[size],
          className
        )}
      >
        {children || (
          <>
            <div
              className={cn(
                "font-black text-white uppercase",
                mainContentSizeStyles[size]
              )}
            >
              {mainContent}
            </div>
            {secondaryContent && (
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 mt-2 text-sm sm:text-base"
              >
                {secondaryContent}
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {showSpeakButton && speakText && (
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={handleSpeak}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
            `bg-${color === "purple" ? "purple" : color}-100`,
            `hover:bg-${color === "purple" ? "purple" : color}-200`,
            `text-${color === "purple" ? "purple" : color}-700`
          )}
          style={{
            backgroundColor: `var(--${color}-100, #f3e8ff)`,
          }}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-sm font-medium">{speakButtonText}</span>
        </motion.button>
      )}
    </div>
  );
});

/**
 * TeachingCardWithExample Props
 *
 * Extended teaching card that shows an example word or sentence.
 */
interface TeachingCardWithExampleProps extends Omit<TeachingCardProps, "secondaryContent"> {
  /** Example word to display */
  exampleWord?: string;
  /** Image path for the example */
  exampleImage?: string;
  /** Description text */
  description?: string;
}

/**
 * TeachingCardWithExample Component
 *
 * Teaching card with built-in example display.
 *
 * @example
 * ```tsx
 * <TeachingCardWithExample
 *   mainContent="BL"
 *   exampleWord="BLUE"
 *   description="B and L together make the BL sound"
 *   speakText="B and L together make blue"
 *   autoSpeak
 * />
 * ```
 */
export const TeachingCardWithExample = memo(function TeachingCardWithExample({
  mainContent,
  exampleWord,
  exampleImage,
  description,
  ...props
}: TeachingCardWithExampleProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <TeachingCard mainContent={mainContent} {...props} showSpeakButton={false} />

      {(exampleWord || description) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          {exampleWord && (
            <p className="text-2xl font-bold text-gray-800">
              Like in: <span className="text-purple-600">{exampleWord}</span>
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </motion.div>
      )}

      {props.speakText && (
        <SpeakButton text={props.speakText} rate={props.speechRate} />
      )}
    </div>
  );
});

/**
 * SpeakButton Component
 *
 * Standalone speak button that can be used anywhere.
 */
interface SpeakButtonProps {
  text: string;
  rate?: number;
  label?: string;
  color?: "purple" | "blue" | "green" | "pink" | "orange" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const speakButtonColors = {
  purple: "bg-purple-100 hover:bg-purple-200 text-purple-700",
  blue: "bg-blue-100 hover:bg-blue-200 text-blue-700",
  green: "bg-green-100 hover:bg-green-200 text-green-700",
  pink: "bg-pink-100 hover:bg-pink-200 text-pink-700",
  orange: "bg-orange-100 hover:bg-orange-200 text-orange-700",
  gray: "bg-gray-100 hover:bg-gray-200 text-gray-700",
};

const speakButtonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export const SpeakButton = memo(function SpeakButton({
  text,
  rate = 0.8,
  label = "Hear it",
  color = "purple",
  size = "md",
  className,
}: SpeakButtonProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { speak, stop } = useSpeech();

  const handleSpeak = () => {
    stop();
    speak(text, { rate });
  };

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      onClick={handleSpeak}
      className={cn(
        "inline-flex items-center gap-2 rounded-full transition-colors font-medium",
        speakButtonColors[color],
        speakButtonSizes[size],
        className
      )}
    >
      <Volume2 className={cn("w-4 h-4", size === "lg" && "w-5 h-5")} />
      <span>{label}</span>
    </motion.button>
  );
});

/**
 * LessonStepIndicator Props
 *
 * Shows current step in a lesson sequence.
 */
interface LessonStepIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showProgress?: boolean;
  className?: string;
}

/**
 * LessonStepIndicator Component
 *
 * Simple step counter for lessons.
 *
 * @example
 * ```tsx
 * <LessonStepIndicator current={3} total={10} />
 * ```
 */
export function LessonStepIndicator({
  current,
  total,
  label = "Question",
  showProgress = true,
  className,
}: LessonStepIndicatorProps) {
  const progress = (current / total) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="font-medium">
          {label} {current} of {total}
        </span>
        {showProgress && <span>{Math.round(progress)}%</span>}
      </div>
      {showProgress && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          />
        </div>
      )}
    </div>
  );
}

/**
 * HintButton Props
 */
interface HintButtonProps {
  hint: string;
  showHint: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * HintButton Component
 *
 * Collapsible hint display.
 */
export function HintButton({
  hint,
  showHint,
  onToggle,
  className,
}: HintButtonProps) {
  const { shouldReduceMotion } = useAccessibility();

  return (
    <div className={className}>
      <motion.button
        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        onClick={onToggle}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
      >
        <span>{showHint ? "Hide hint" : "Show hint"}</span>
      </motion.button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-gray-600 bg-yellow-50 px-4 py-3 rounded-xl"
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
