"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Zap, Target, Flame, Award } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";

export type AchievementType =
  | "star"
  | "level"
  | "streak"
  | "perfect"
  | "milestone"
  | "badge";

interface AchievementToastProps {
  isVisible: boolean;
  type: AchievementType;
  title: string;
  description?: string;
  onComplete?: () => void;
  duration?: number;
}

const ACHIEVEMENT_CONFIG: Record<
  AchievementType,
  { icon: React.ReactNode; bgColor: string; iconBg: string }
> = {
  star: {
    icon: <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />,
    bgColor: "from-yellow-400 to-orange-400",
    iconBg: "bg-yellow-100",
  },
  level: {
    icon: <Trophy className="w-6 h-6 text-purple-600" />,
    bgColor: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-100",
  },
  streak: {
    icon: <Flame className="w-6 h-6 text-orange-600" />,
    bgColor: "from-orange-500 to-red-500",
    iconBg: "bg-orange-100",
  },
  perfect: {
    icon: <Target className="w-6 h-6 text-green-600" />,
    bgColor: "from-green-500 to-emerald-500",
    iconBg: "bg-green-100",
  },
  milestone: {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    bgColor: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-100",
  },
  badge: {
    icon: <Award className="w-6 h-6 text-pink-600" />,
    bgColor: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-100",
  },
};

export function AchievementToast({
  isVisible,
  type,
  title,
  description,
  onComplete,
  duration = 4000,
}: AchievementToastProps) {
  const { shouldReduceMotion } = useAccessibility();
  const config = ACHIEVEMENT_CONFIG[type];
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      return;
    }

    // Animate progress bar
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Auto-dismiss
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -100, scale: 0.8 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -50, scale: 0.8 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Gradient Header */}
            <div className={`bg-gradient-to-r ${config.bgColor} p-4`}>
              <div className="flex items-center gap-3">
                {/* Icon */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className={`${config.iconBg} p-3 rounded-full shadow-lg`}
                >
                  {config.icon}
                </motion.div>

                {/* Text */}
                <div className="flex-1">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white font-black text-lg"
                  >
                    {title}
                  </motion.h3>
                  {description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/90 text-sm"
                    >
                      {description}
                    </motion.p>
                  )}
                </div>

                {/* Sparkle animation */}
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className={`h-full bg-gradient-to-r ${config.bgColor}`}
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy toast management
export function useAchievementToast() {
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: AchievementType;
    title: string;
    description?: string;
  }>({
    isVisible: false,
    type: "star",
    title: "",
  });

  const showToast = (
    type: AchievementType,
    title: string,
    description?: string
  ) => {
    setToast({ isVisible: true, type, title, description });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
}
