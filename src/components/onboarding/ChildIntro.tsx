"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding, useChildName } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";

interface ChildIntroProps {
  onNext: () => void;
  onBack: () => void;
}

const INTRO_MESSAGES = [
  { emoji: "👋", text: "Hi there, {name}!" },
  { emoji: "🦉", text: "I'm Ollie the Owl!" },
  { emoji: "📚", text: "I love to read and learn!" },
  { emoji: "🎉", text: "Let's learn letters together!" },
  { emoji: "✨", text: "Are you ready for fun?" },
];

export function ChildIntro({ onNext, onBack }: ChildIntroProps) {
  const childName = useChildName();
  const { shouldReduceMotion } = useAccessibility();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentMessage = INTRO_MESSAGES[currentMessageIndex];
  const displayText = currentMessage.text.replace("{name}", childName);
  const isLastMessage = currentMessageIndex === INTRO_MESSAGES.length - 1;

  // Auto-advance messages
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentMessageIndex < INTRO_MESSAGES.length - 1) {
        setCurrentMessageIndex((prev) => prev + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, isAutoPlaying]);

  const handleTap = () => {
    if (currentMessageIndex < INTRO_MESSAGES.length - 1) {
      setCurrentMessageIndex((prev) => prev + 1);
      setIsAutoPlaying(false);
    }
  };

  return (
    <div className="text-center">
      {/* Large Animated Owl */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -15, 0],
                  rotate: [0, -5, 5, 0],
                }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative inline-block"
        >
          {/* Owl */}
          <span className="text-[140px] sm:text-[180px] inline-block">🦉</span>

          {/* Speech bubble indicator */}
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2"
          >
            <Volume2 className="w-5 h-5 text-yellow-800" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Speech Bubble */}
      <motion.div
        onClick={handleTap}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl cursor-pointer relative"
      >
        {/* Speech bubble tail */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-white" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-6xl mb-4"
            >
              {currentMessage.emoji}
            </motion.div>

            {/* Message Text */}
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              {displayText}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Tap to continue hint */}
        {!isLastMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-400 mt-4"
          >
            Tap to continue
          </motion.p>
        )}

        {/* Message progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {INTRO_MESSAGES.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentMessageIndex ? "bg-yellow-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onNext}
          disabled={!isLastMessage && isAutoPlaying}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl shadow-lg transition-all ${
            isLastMessage
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <span>{isLastMessage ? "Yes! Let's Go!" : "Continue"}</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
