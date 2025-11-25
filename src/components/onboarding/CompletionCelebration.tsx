"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useChildName, useOnboarding } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { Sparkles, Star, Rocket, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

interface CompletionCelebrationProps {
  onComplete: () => void;
}

export function CompletionCelebration({ onComplete }: CompletionCelebrationProps) {
  const childName = useChildName();
  const { childProfile } = useOnboarding();
  const { shouldReduceMotion } = useAccessibility();
  const [showButton, setShowButton] = useState(false);

  // Trigger confetti on mount
  useEffect(() => {
    if (shouldReduceMotion) {
      setShowButton(true);
      return;
    }

    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F472B6"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Show button after celebration
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="text-center">
      {/* Animated Avatar & Stars */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative inline-block mb-6"
      >
        {/* Floating stars around avatar */}
        {!shouldReduceMotion &&
          [0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 1, 0],
                rotate: [0, 180, 360],
                x: [0, Math.cos((i * Math.PI) / 2) * 60],
                y: [0, Math.sin((i * Math.PI) / 2) * 60],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}

        {/* Main Avatar */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[120px] sm:text-[150px]"
        >
          {childProfile?.avatarEmoji || "🦉"}
        </motion.div>
      </motion.div>

      {/* Celebration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl p-8 shadow-xl"
      >
        {/* Header Icons */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={shouldReduceMotion ? {} : { rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <PartyPopper className="w-8 h-8 text-pink-500" />
          </motion.div>
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <motion.div
            animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <PartyPopper className="w-8 h-8 text-pink-500" />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4">
          You're All Set, {childName}!
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-6">
          Your learning adventure is about to begin! Get ready to discover
          letters, sounds, and words!
        </p>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">📚</div>
            <div className="text-sm font-bold text-gray-700">26 Letters</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">🎵</div>
            <div className="text-sm font-bold text-gray-700">Fun Sounds</div>
          </div>
          <div className="bg-pink-50 rounded-2xl p-4">
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-sm font-bold text-gray-700">Earn Stars</div>
          </div>
        </div>

        {/* Start Button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-lg"
          >
            <Rocket className="w-6 h-6" />
            <span>Start Learning!</span>
          </motion.button>
        )}
      </motion.div>

      {/* Mascot Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 flex items-center justify-center gap-2 text-gray-500"
      >
        <span className="text-2xl">🦉</span>
        <span className="text-sm font-medium">
          "I can't wait to learn with you!"
        </span>
      </motion.div>
    </div>
  );
}
