"use client";

import { motion } from "framer-motion";
import { useAccessibility } from "@/hooks/use-accessibility";
import { Sparkles, ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  const { shouldReduceMotion } = useAccessibility();

  return (
    <div className="text-center">
      {/* Animated Owl Mascot */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-9xl"
          role="img"
          aria-label="Owl mascot"
        >
          <span className="inline-block">🦉</span>
        </motion.div>
      </motion.div>

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-8 shadow-xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <span className="text-sm font-bold text-yellow-600 uppercase tracking-wide">
            Welcome to
          </span>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-4">
          Little Learner
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Hi there! I'm Ollie the Owl, and I'm so excited to help your little
          one learn to read! Let's get started with a quick setup.
        </p>

        {/* Get Started Button */}
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={onNext}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-lg"
        >
          <span>Let's Begin!</span>
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        {/* Skip Option */}
        <button
          onClick={onSkip}
          className="mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          Skip setup and explore
        </button>
      </motion.div>

      {/* Fun Facts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 flex justify-center gap-4 text-sm text-gray-500"
      >
        <span className="flex items-center gap-1">
          <span>📚</span> 26 Letters
        </span>
        <span className="flex items-center gap-1">
          <span>🎵</span> Fun Songs
        </span>
        <span className="flex items-center gap-1">
          <span>🎮</span> Games
        </span>
      </motion.div>
    </div>
  );
}
