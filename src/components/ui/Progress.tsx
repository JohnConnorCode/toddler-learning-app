"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Star, Lock } from "lucide-react";

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "yellow" | "green" | "blue" | "pink" | "purple";
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  color = "yellow",
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colorStyles = {
    yellow: "bg-gradient-to-r from-yellow-400 to-orange-400",
    green: "bg-gradient-to-r from-green-400 to-emerald-500",
    blue: "bg-gradient-to-r from-blue-400 to-indigo-500",
    pink: "bg-gradient-to-r from-pink-400 to-rose-500",
    purple: "bg-gradient-to-r from-purple-400 to-violet-500",
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            colorStyles[color]
          )}
        />
      </div>
    </div>
  );
}

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "yellow" | "green" | "blue" | "pink" | "purple";
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = "yellow",
  showValue = true,
  label,
  className,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorStroke = {
    yellow: "#FBBF24",
    green: "#34D399",
    blue: "#60A5FA",
    pink: "#F472B6",
    purple: "#A78BFA",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `${Math.round(percentage)}% complete`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorStroke[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Step Progress
interface Step {
  id: string;
  label: string;
  completed?: boolean;
  current?: boolean;
  locked?: boolean;
}

interface StepProgressProps {
  steps: Step[];
  className?: string;
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step circle */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                step.completed && "bg-green-500 text-white",
                step.current && "bg-yellow-400 text-yellow-900 ring-4 ring-yellow-100",
                step.locked && "bg-gray-200 text-gray-400",
                !step.completed && !step.current && !step.locked && "bg-gray-100 text-gray-500"
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5" aria-hidden="true" />
              ) : step.locked ? (
                <Lock className="w-4 h-4" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step.completed ? "100%" : "0%" }}
                className="h-full bg-green-400 rounded"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Star Rating Display
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 3,
  size = "md",
  className,
}: StarRatingProps) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: "spring" }}
        >
          <Star
            className={cn(
              sizeStyles[size],
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

// XP Progress with level
interface XPProgressProps {
  currentXP: number;
  level: number;
  nextLevelXP: number;
  className?: string;
}

export function XPProgress({
  currentXP,
  level,
  nextLevelXP,
  className,
}: XPProgressProps) {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className={cn("bg-white rounded-2xl p-4 shadow-lg", className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-black">{level}</span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
          </motion.div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-gray-800">Level {level}</span>
            <span className="text-sm text-gray-500">
              {currentXP} / {nextLevelXP} XP
            </span>
          </div>
          <ProgressBar value={progress} color="purple" size="md" />
        </div>
      </div>
    </div>
  );
}
