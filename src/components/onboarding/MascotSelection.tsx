"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { playSound } from "@/lib/sound-effects";
import {
  MASCOTS,
  getMascotsForInterests,
  getRandomMascotMessage,
  type MascotId,
  type InterestThemeId,
} from "@/lib/theme-data";

interface MascotSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function MascotSelection({ onNext, onBack }: MascotSelectionProps) {
  const { childProfile, updateChildProfile } = useOnboarding();
  const { shouldReduceMotion } = useAccessibility();
  const [selectedMascot, setSelectedMascot] = useState<MascotId>(
    childProfile?.selectedMascot || "owl"
  );
  const [previewMessage, setPreviewMessage] = useState<string>("");

  // Get mascots based on user's interests, with related ones first
  const availableMascots = useMemo(() => {
    const interests = (childProfile?.interests || []) as InterestThemeId[];
    const relatedMascots = getMascotsForInterests(interests);
    const relatedIds = new Set(relatedMascots.map((m) => m.id));

    // Get remaining mascots that aren't related
    const otherMascots = Object.values(MASCOTS).filter(
      (m) => !relatedIds.has(m.id)
    );

    return [...relatedMascots, ...otherMascots];
  }, [childProfile?.interests]);

  const currentMascot = MASCOTS[selectedMascot];

  const selectMascot = (id: MascotId) => {
    playSound("pop");
    setSelectedMascot(id);

    // Show a greeting from the mascot
    const greeting = getRandomMascotMessage(id, "greeting");
    setPreviewMessage(greeting);

    // Speak the greeting
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = () => {
    playSound("chime");

    // Update profile with selected mascot
    updateChildProfile({
      selectedMascot,
    });

    onNext();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={shouldReduceMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
          Choose Your Learning Buddy!
        </h2>
        <p className="text-gray-500">
          Pick a friend who'll cheer you on while you learn.
        </p>
      </div>

      {/* Selected Mascot Preview */}
      <motion.div
        key={selectedMascot}
        initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 text-center"
      >
        {/* Mascot Emoji */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -10, 0],
                  rotate: [0, -5, 5, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-7xl mb-3"
        >
          {currentMascot.emoji}
        </motion.div>

        {/* Mascot Name */}
        <h3 className="text-2xl font-black text-gray-800 mb-1">
          {currentMascot.name}
        </h3>

        {/* Personality Tagline */}
        <p className="text-gray-500 text-sm mb-3">{currentMascot.tagline}</p>

        {/* Preview Message Bubble */}
        <AnimatePresence mode="wait">
          {previewMessage && (
            <motion.div
              key={previewMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl p-3 shadow-md inline-block max-w-xs"
            >
              <p className="text-gray-700 font-medium">"{previewMessage}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mascot Grid */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-3 text-center">
          {childProfile?.interests && childProfile.interests.length > 0
            ? "✨ Recommended for you"
            : "Pick your favorite!"}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {availableMascots.map((mascot, index) => {
            const isSelected = selectedMascot === mascot.id;
            const isRecommended =
              childProfile?.interests &&
              mascot.relatedThemes.some((t) =>
                childProfile.interests.includes(t)
              );

            return (
              <motion.button
                key={mascot.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                onClick={() => selectMascot(mascot.id)}
                className={`
                  relative flex flex-col items-center justify-center p-2 rounded-xl
                  transition-all duration-200 aspect-square
                  ${
                    isSelected
                      ? "bg-yellow-400 shadow-lg ring-2 ring-yellow-500"
                      : isRecommended
                      ? "bg-yellow-100 hover:bg-yellow-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
                aria-label={`Select ${mascot.name} as your learning buddy`}
                aria-pressed={isSelected}
              >
                {/* Recommended indicator */}
                {isRecommended && !isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 text-yellow-500"
                  >
                    ⭐
                  </motion.div>
                )}

                {/* Mascot emoji */}
                <span
                  className={`text-2xl sm:text-3xl ${
                    isSelected ? "animate-bounce-small" : ""
                  }`}
                >
                  {mascot.emoji}
                </span>

                {/* Name (hidden on mobile) */}
                <span className="text-[10px] font-bold text-gray-600 hidden sm:block mt-1">
                  {mascot.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={() => {
            playSound("pop");
            onBack();
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={handleContinue}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <span>Let's Go!</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
