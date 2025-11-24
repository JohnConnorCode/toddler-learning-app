"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LetterBlockState =
  | "idle"      // Default state
  | "active"    // Currently being interacted with
  | "connected" // Successfully connected to other blocks
  | "wobble"    // Failed connection attempt
  | "locked"    // Permanently locked in place (correct answer);

interface LetterBlockProps {
  letter: string;
  state?: LetterBlockState;
  size?: "sm" | "md" | "lg";
  isVowel?: boolean;
  onClick?: () => void;
  className?: string;
  showShadow?: boolean;
}

export function LetterBlock({
  letter,
  state = "idle",
  size = "md",
  isVowel = false,
  onClick,
  className,
  showShadow = true,
}: LetterBlockProps) {
  const sizeClasses = {
    sm: "w-14 h-16 text-2xl",
    md: "w-20 h-24 text-4xl",
    lg: "w-28 h-32 text-5xl",
  };

  const colorClasses = isVowel
    ? "bg-gradient-to-br from-pink-400 to-pink-500 border-pink-600"
    : "bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600";

  const stateStyles = {
    idle: "",
    active: "ring-4 ring-yellow-400 ring-offset-2 scale-105",
    connected: "bg-gradient-to-br from-green-400 to-green-500 border-green-600",
    wobble: "",
    locked: "bg-gradient-to-br from-green-500 to-emerald-600 border-emerald-700",
  };

  const animations = {
    idle: {},
    active: {
      scale: 1.05,
      y: -4,
      transition: { type: "spring" as const, stiffness: 400 }
    },
    connected: {
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    wobble: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.4 }
    },
    locked: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    },
  };

  return (
    <motion.div
      onClick={onClick}
      animate={animations[state]}
      whileHover={onClick ? { scale: 1.05, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={cn(
        "relative rounded-xl font-black text-white flex items-center justify-center",
        "border-b-4 transition-all duration-200",
        sizeClasses[size],
        state === "connected" || state === "locked"
          ? "bg-gradient-to-br from-green-400 to-green-500 border-green-600"
          : colorClasses,
        stateStyles[state],
        showShadow && "shadow-[0_6px_0_rgba(0,0,0,0.15)]",
        onClick && "cursor-pointer hover:shadow-[0_8px_0_rgba(0,0,0,0.2)]",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* 3D Block Effect - Top Face */}
      <div className="absolute inset-0 rounded-xl opacity-30 bg-gradient-to-b from-white to-transparent pointer-events-none" />

      {/* Letter Content */}
      <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] select-none">
        {letter.toUpperCase()}
      </span>

      {/* Connection Indicator (shows when connected/locked) */}
      {(state === "connected" || state === "locked") && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-1 -top-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg"
        >
          <span className="text-[8px] text-white flex items-center justify-center h-full">✓</span>
        </motion.div>
      )}

      {/* Bottom shadow for 3D effect */}
      {showShadow && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-black/20 blur-sm rounded-full"
          style={{ transform: "translateX(-50%) translateZ(-10px)" }}
        />
      )}
    </motion.div>
  );
}

/**
 * LetterBlockSlot - Empty slot where blocks can be placed
 */
interface LetterBlockSlotProps {
  index: number;
  hasBlock?: boolean;
  isCorrectPosition?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LetterBlockSlot({
  index,
  hasBlock = false,
  isCorrectPosition,
  size = "md",
  className,
}: LetterBlockSlotProps) {
  const sizeClasses = {
    sm: "w-14 h-16",
    md: "w-20 h-24",
    lg: "w-28 h-32",
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative rounded-xl border-4 border-dashed flex items-center justify-center",
        "bg-white/20 backdrop-blur-sm transition-all duration-300",
        sizeClasses[size],
        hasBlock
          ? "border-green-400 bg-green-50"
          : "border-gray-300 hover:border-gray-400",
        isCorrectPosition === false && "border-red-400 bg-red-50",
        className
      )}
    >
      {!hasBlock && (
        <span className="text-4xl text-gray-300 font-bold opacity-50">
          {index + 1}
        </span>
      )}
    </motion.div>
  );
}
