"use client";

import { motion } from "framer-motion";
import { Star, Info } from "lucide-react";
import { useState } from "react";

interface StarCriteriaProps {
  /** Current score (0-100) */
  currentScore?: number;
  /** Whether to show as compact tooltip or full display */
  variant?: "full" | "compact" | "tooltip";
  /** Custom thresholds */
  thresholds?: {
    oneStar: number;
    twoStars: number;
    threeStars: number;
  };
  className?: string;
}

const DEFAULT_THRESHOLDS = {
  oneStar: 0, // Complete to get 1 star
  twoStars: 70, // 70%+ for 2 stars
  threeStars: 90, // 90%+ for 3 stars
};

export function StarCriteria({
  currentScore,
  variant = "full",
  thresholds = DEFAULT_THRESHOLDS,
  className = "",
}: StarCriteriaProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStarsForScore = (score: number): number => {
    if (score >= thresholds.threeStars) return 3;
    if (score >= thresholds.twoStars) return 2;
    return 1;
  };

  const currentStars = currentScore !== undefined ? getStarsForScore(currentScore) : 0;

  if (variant === "tooltip") {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
          aria-label="How to earn stars"
        >
          <Info className="w-5 h-5 text-gray-400" />
        </button>

        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-gray-900 text-white text-sm rounded-xl p-4 shadow-xl min-w-[200px]">
              <p className="font-bold mb-2">Earn Stars:</p>
              <StarCriteriaList thresholds={thresholds} compact />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {[1, 2, 3].map((starNum) => (
          <div key={starNum} className="flex items-center gap-1">
            <Star
              className={`w-4 h-4 ${
                currentScore !== undefined && currentStars >= starNum
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
            <span className="text-xs text-gray-500">
              {starNum === 1 ? "Finish" : `${starNum === 2 ? thresholds.twoStars : thresholds.threeStars}%`}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200 ${className}`}
    >
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        How to Earn Stars
      </h3>

      <div className="space-y-2">
        <StarCriteriaItem
          stars={1}
          label="Complete the activity"
          achieved={currentScore !== undefined && currentStars >= 1}
        />
        <StarCriteriaItem
          stars={2}
          label={`Get ${thresholds.twoStars}%+ correct`}
          achieved={currentScore !== undefined && currentStars >= 2}
        />
        <StarCriteriaItem
          stars={3}
          label={`Get ${thresholds.threeStars}%+ correct`}
          achieved={currentScore !== undefined && currentStars >= 3}
        />
      </div>

      {currentScore !== undefined && (
        <div className="mt-3 pt-3 border-t border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Score:</span>
            <span className="font-bold text-lg text-gray-800">{Math.round(currentScore)}%</span>
          </div>
          <div className="flex items-center gap-1 mt-1 justify-end">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= currentStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StarCriteriaItem({
  stars,
  label,
  achieved,
}: {
  stars: number;
  label: string;
  achieved: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${achieved ? "opacity-100" : "opacity-70"}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(stars)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              achieved ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        {[...Array(3 - stars)].map((_, i) => (
          <Star key={i + stars} className="w-4 h-4 text-gray-200" />
        ))}
      </div>
      <span className={`text-sm ${achieved ? "text-gray-800 font-medium" : "text-gray-600"}`}>
        {label}
        {achieved && " ✓"}
      </span>
    </div>
  );
}

function StarCriteriaList({
  thresholds,
  compact = false,
}: {
  thresholds: typeof DEFAULT_THRESHOLDS;
  compact?: boolean;
}) {
  const items = [
    { stars: 1, label: "Complete" },
    { stars: 2, label: `${thresholds.twoStars}%+ correct` },
    { stars: 3, label: `${thresholds.threeStars}%+ correct` },
  ];

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {items.map(({ stars, label }) => (
        <div key={stars} className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className={compact ? "text-xs" : "text-sm"}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// Helper function to calculate stars from score
export function calculateStars(
  score: number,
  thresholds = DEFAULT_THRESHOLDS
): number {
  if (score >= thresholds.threeStars) return 3;
  if (score >= thresholds.twoStars) return 2;
  return 1;
}
