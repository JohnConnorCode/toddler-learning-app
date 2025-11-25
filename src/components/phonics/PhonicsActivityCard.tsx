"use client";

import { motion } from "framer-motion";
import { useAccessibility } from "@/hooks/use-accessibility";
import { Volume2, Check, Lock } from "lucide-react";

interface PhonicsActivityCardProps {
  id: string;
  pattern: string; // The digraph, blend, or vowel team
  description: string;
  exampleWord: string;
  color: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  index: number;
  onClick: () => void;
  onPlaySound?: () => void;
}

export function PhonicsActivityCard({
  pattern,
  description,
  exampleWord,
  color,
  isCompleted,
  isLocked,
  index,
  onClick,
  onPlaySound,
}: PhonicsActivityCardProps) {
  const { shouldReduceMotion } = useAccessibility();

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySound?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={shouldReduceMotion || isLocked ? {} : { scale: 1.02, y: -5 }}
      whileTap={shouldReduceMotion || isLocked ? {} : { scale: 0.98 }}
      onClick={isLocked ? undefined : onClick}
      className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border-b-4 transition-all ${
        isLocked
          ? "opacity-50 cursor-not-allowed border-gray-200"
          : "cursor-pointer hover:shadow-xl border-gray-100"
      }`}
    >
      {/* Status Badge */}
      {(isCompleted || isLocked) && (
        <div className="absolute top-3 right-3">
          {isCompleted ? (
            <div className="bg-green-500 p-1.5 rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="bg-gray-400 p-1.5 rounded-full">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      )}

      {/* Pattern Display */}
      <div
        className={`${color} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md`}
      >
        <span className="text-white text-2xl sm:text-3xl font-black">
          {pattern}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm sm:text-base text-center mb-2 line-clamp-2">
        {description}
      </p>

      {/* Example Word */}
      <div className="flex items-center justify-center gap-2 text-gray-800">
        <span className="font-bold text-lg">{exampleWord}</span>
        {onPlaySound && !isLocked && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlaySound}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={`Play sound for ${exampleWord}`}
          >
            <Volume2 className="w-4 h-4 text-gray-600" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
