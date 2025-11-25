"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Trophy, Rocket, Gift, ChevronRight } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useChildName } from "@/hooks/use-onboarding";
import confetti from "canvas-confetti";
import { Level } from "@/lib/levels-data";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedLevel: Level;
  nextLevel?: Level;
  starsEarned: number;
  totalStars: number;
  unlockedReward?: string; // Story ID or achievement
}

export function LevelUpModal({
  isOpen,
  onClose,
  completedLevel,
  nextLevel,
  starsEarned,
  totalStars,
  unlockedReward,
}: LevelUpModalProps) {
  const childName = useChildName();
  const { shouldReduceMotion } = useAccessibility();
  const [showStars, setShowStars] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Trigger animations and confetti
  useEffect(() => {
    if (!isOpen) {
      setShowStars(false);
      setShowReward(false);
      return;
    }

    // Show stars after initial animation
    const starsTimer = setTimeout(() => setShowStars(true), 800);
    const rewardTimer = setTimeout(() => setShowReward(true), 1500);

    // Fire confetti
    if (!shouldReduceMotion) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = [completedLevel.color.primary, "#FFD700", "#FF6B6B", "#4ECDC4"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }

    return () => {
      clearTimeout(starsTimer);
      clearTimeout(rewardTimer);
    };
  }, [isOpen, shouldReduceMotion, completedLevel.color.primary]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Background decoration */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${completedLevel.color.primary}, ${completedLevel.color.secondary})`,
            }}
          />

          {/* Content */}
          <div className="relative text-center">
            {/* Level Complete Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <div
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-5xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${completedLevel.color.primary}, ${completedLevel.color.secondary})`,
                }}
              >
                {completedLevel.icon}
              </div>
            </motion.div>

            {/* Celebration Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-sm font-bold text-yellow-600 uppercase tracking-wide">
                  Level Complete!
                </span>
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>

              <h2 className="text-3xl font-black text-gray-800 mb-2">
                Amazing, {childName}!
              </h2>

              <p className="text-gray-600 mb-6">
                You completed{" "}
                <span className="font-bold" style={{ color: completedLevel.color.primary }}>
                  {completedLevel.title}
                </span>
                !
              </p>
            </motion.div>

            {/* Stars Earned */}
            {showStars && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-50 rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.2, type: "spring" }}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          i < starsEarned ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm font-bold text-yellow-700">
                  {starsEarned} of 3 stars earned!
                </p>
                <p className="text-xs text-yellow-600">
                  Total: {totalStars} stars collected
                </p>
              </motion.div>
            )}

            {/* Unlocked Reward */}
            {showReward && unlockedReward && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-bold text-purple-600">Reward Unlocked!</span>
                </div>
                <p className="text-gray-600 text-sm">
                  You unlocked a new story to read!
                </p>
              </motion.div>
            )}

            {/* Next Level Preview */}
            {nextLevel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="bg-gray-50 rounded-2xl p-4 mb-6"
              >
                <p className="text-sm text-gray-500 mb-2">Up Next:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{nextLevel.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{nextLevel.title}</p>
                    <p className="text-sm text-gray-500">{nextLevel.theme}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${completedLevel.color.primary}, ${completedLevel.color.secondary})`,
              }}
            >
              {nextLevel ? (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Continue to {nextLevel.title}</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>You're a Reading Champion!</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
