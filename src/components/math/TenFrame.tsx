"use client";

import { motion } from "framer-motion";
import { useAccessibility } from "@/hooks/use-accessibility";
import { playFeedback } from "@/lib/sound-effects";
import { cn } from "@/lib/utils";

interface TenFrameProps {
  /** Number of filled counters (0-20) */
  count: number;
  /** Total frame capacity - 10 for single, 20 for double */
  capacity?: 10 | 20;
  /** Visual style for counters */
  counterStyle?: "dots" | "emoji";
  /** Emoji to use if counterStyle is 'emoji' */
  emoji?: string;
  /** Color theme for counters */
  color?: "red" | "blue" | "green" | "purple" | "yellow";
  /** Whether to animate counters appearing */
  animateIn?: boolean;
  /** Interactive mode - allows tapping cells to add/remove */
  interactive?: boolean;
  /** Callback when count changes (interactive mode) */
  onCountChange?: (newCount: number) => void;
  /** Show number label below frame */
  showLabel?: boolean;
  /** Highlight specific cells (1-indexed) for teaching */
  highlightCells?: number[];
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

const COLOR_CLASSES = {
  red: {
    filled: "bg-red-500",
    highlight: "ring-red-300",
  },
  blue: {
    filled: "bg-blue-500",
    highlight: "ring-blue-300",
  },
  green: {
    filled: "bg-green-500",
    highlight: "ring-green-300",
  },
  purple: {
    filled: "bg-purple-500",
    highlight: "ring-purple-300",
  },
  yellow: {
    filled: "bg-yellow-400",
    highlight: "ring-yellow-300",
  },
};

const SIZE_CLASSES = {
  sm: {
    cell: "w-8 h-8",
    dot: "w-5 h-5",
    emoji: "text-lg",
    gap: "gap-1",
    label: "text-sm",
  },
  md: {
    cell: "w-12 h-12",
    dot: "w-8 h-8",
    emoji: "text-2xl",
    gap: "gap-1.5",
    label: "text-lg",
  },
  lg: {
    cell: "w-16 h-16",
    dot: "w-10 h-10",
    emoji: "text-3xl",
    gap: "gap-2",
    label: "text-xl",
  },
};

export function TenFrame({
  count,
  capacity = 10,
  counterStyle = "dots",
  emoji = "⭐",
  color = "red",
  animateIn = true,
  interactive = false,
  onCountChange,
  showLabel = false,
  highlightCells = [],
  size = "md",
  className,
}: TenFrameProps) {
  const { shouldReduceMotion } = useAccessibility();
  const colorClasses = COLOR_CLASSES[color];
  const sizeClasses = SIZE_CLASSES[size];

  // For capacity of 20, we show two ten-frames
  const showDoubleFrame = capacity === 20;
  const cellsPerFrame = 10;

  const handleCellClick = (cellIndex: number) => {
    if (!interactive || !onCountChange) return;

    // If clicking a filled cell, reduce count
    // If clicking an empty cell, increase count to that position
    if (cellIndex < count) {
      // Remove - set count to this position
      onCountChange(cellIndex);
      playFeedback("snap", "light");
    } else {
      // Add - fill up to and including this cell
      onCountChange(cellIndex + 1);
      playFeedback("pop", "light");
    }
  };

  const renderFrame = (frameOffset: number) => {
    const cells = Array.from({ length: cellsPerFrame }, (_, i) => {
      const globalIndex = frameOffset + i;
      const isFilled = globalIndex < count;
      const isHighlighted = highlightCells.includes(globalIndex + 1); // 1-indexed for API

      return (
        <motion.button
          key={globalIndex}
          type="button"
          disabled={!interactive}
          onClick={() => handleCellClick(globalIndex)}
          initial={animateIn && !shouldReduceMotion ? { scale: 0.8, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: animateIn ? globalIndex * 0.05 : 0,
            duration: 0.2,
            type: "spring",
            stiffness: 300,
          }}
          whileTap={interactive ? { scale: 0.95 } : undefined}
          className={cn(
            sizeClasses.cell,
            "rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center",
            "transition-all duration-150",
            interactive && "cursor-pointer hover:border-gray-400 hover:bg-gray-100",
            isHighlighted && `ring-2 ${colorClasses.highlight}`,
            !interactive && "cursor-default"
          )}
          aria-label={`Cell ${globalIndex + 1} of ${capacity}, ${isFilled ? "filled" : "empty"}`}
        >
          {isFilled && (
            <motion.div
              initial={animateIn && !shouldReduceMotion ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{
                delay: animateIn ? globalIndex * 0.05 + 0.1 : 0,
                type: "spring",
                stiffness: 400,
              }}
            >
              {counterStyle === "dots" ? (
                <div
                  className={cn(
                    sizeClasses.dot,
                    colorClasses.filled,
                    "rounded-full shadow-sm"
                  )}
                />
              ) : (
                <span className={sizeClasses.emoji}>{emoji}</span>
              )}
            </motion.div>
          )}
        </motion.button>
      );
    });

    return (
      <div
        className={cn(
          "grid grid-cols-5 grid-rows-2",
          sizeClasses.gap,
          "p-2 bg-white rounded-xl border-2 border-gray-200 shadow-sm"
        )}
        role="grid"
        aria-label={`Ten frame${frameOffset > 0 ? " (second)" : ""}`}
      >
        {cells}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("flex", showDoubleFrame ? "gap-4" : "")}>
        {renderFrame(0)}
        {showDoubleFrame && renderFrame(10)}
      </div>

      {showLabel && (
        <motion.div
          initial={animateIn && !shouldReduceMotion ? { opacity: 0, y: 10 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            sizeClasses.label,
            "mt-3 font-bold text-gray-700"
          )}
        >
          {count}
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// DOUBLE TEN FRAME FOR ADDITION
// ============================================

interface DoubleTenFrameProps {
  leftCount: number;
  rightCount: number;
  leftColor?: "red" | "blue" | "green" | "purple" | "yellow";
  rightColor?: "red" | "blue" | "green" | "purple" | "yellow";
  emoji?: string;
  counterStyle?: "dots" | "emoji";
  showLabels?: boolean;
  showTotal?: boolean;
  size?: "sm" | "md" | "lg";
  animateIn?: boolean;
}

export function DoubleTenFrame({
  leftCount,
  rightCount,
  leftColor = "red",
  rightColor = "blue",
  emoji = "⭐",
  counterStyle = "dots",
  showLabels = true,
  showTotal = true,
  size = "md",
  animateIn = true,
}: DoubleTenFrameProps) {
  const { shouldReduceMotion } = useAccessibility();
  const sizeClasses = SIZE_CLASSES[size];
  const total = leftCount + rightCount;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <TenFrame
            count={leftCount}
            color={leftColor}
            emoji={emoji}
            counterStyle={counterStyle}
            size={size}
            animateIn={animateIn}
          />
          {showLabels && (
            <span className={cn(sizeClasses.label, "mt-2 font-bold", `text-${leftColor}-600`)}>
              {leftCount}
            </span>
          )}
        </div>

        <motion.span
          initial={animateIn && !shouldReduceMotion ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-500"
        >
          +
        </motion.span>

        <div className="flex flex-col items-center">
          <TenFrame
            count={rightCount}
            color={rightColor}
            emoji={emoji}
            counterStyle={counterStyle}
            size={size}
            animateIn={animateIn}
          />
          {showLabels && (
            <span className={cn(sizeClasses.label, "mt-2 font-bold", `text-${rightColor}-600`)}>
              {rightCount}
            </span>
          )}
        </div>
      </div>

      {showTotal && (
        <motion.div
          initial={animateIn && !shouldReduceMotion ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2"
        >
          <span className="text-xl text-gray-500">=</span>
          <span className="text-3xl font-black text-purple-600">{total}</span>
        </motion.div>
      )}
    </div>
  );
}
