"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { playSound } from "@/lib/sound-effects";
import {
  INTEREST_THEMES,
  getInterestThemeIds,
  type InterestThemeId,
} from "@/lib/theme-data";

interface InterestSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function InterestSelection({ onNext, onBack }: InterestSelectionProps) {
  const { childProfile, updateChildProfile } = useOnboarding();
  const { shouldReduceMotion } = useAccessibility();
  const [selectedInterests, setSelectedInterests] = useState<InterestThemeId[]>(
    childProfile?.interests || []
  );

  const themes = getInterestThemeIds().map((id) => INTEREST_THEMES[id]);

  const toggleInterest = (id: InterestThemeId) => {
    playSound("pop");

    setSelectedInterests((prev) => {
      if (prev.includes(id)) {
        // Remove if already selected
        return prev.filter((i) => i !== id);
      } else if (prev.length < 3) {
        // Add if under limit
        return [...prev, id];
      }
      // At limit, replace oldest selection
      return [...prev.slice(1), id];
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) {
      return;
    }

    playSound("chime");

    // Update profile with interests
    updateChildProfile({
      interests: selectedInterests,
      primaryInterest: selectedInterests[0], // First selected is primary
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4"
        >
          <span className="text-4xl">✨</span>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
          What Do You Like?
        </h2>
        <p className="text-gray-500">
          Pick up to 3 things you love! We'll use them to make learning more fun.
        </p>
      </div>

      {/* Interest Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {themes.map((theme, index) => {
          const isSelected = selectedInterests.includes(theme.id);
          const selectionOrder = selectedInterests.indexOf(theme.id) + 1;

          return (
            <motion.button
              key={theme.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => toggleInterest(theme.id)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-2xl
                transition-all duration-200 min-h-[100px]
                ${
                  isSelected
                    ? `bg-gradient-to-br ${theme.colors.gradient} text-white shadow-lg ring-4 ring-white ring-offset-2`
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
              aria-label={`${isSelected ? "Deselect" : "Select"} ${theme.name}`}
              aria-pressed={isSelected}
            >
              {/* Selection badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold shadow-md"
                >
                  {selectionOrder}
                </motion.div>
              )}

              {/* Icon */}
              <motion.span
                animate={
                  isSelected && !shouldReduceMotion
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
                className="text-4xl mb-2"
              >
                {theme.icon}
              </motion.span>

              {/* Name */}
              <span className="font-bold text-sm">{theme.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">
          {selectedInterests.length === 0
            ? "Tap to select your favorites!"
            : selectedInterests.length === 1
            ? "Great choice! You can pick 2 more."
            : selectedInterests.length === 2
            ? "Awesome! You can pick 1 more."
            : "Perfect! You've picked 3 favorites!"}
        </p>
        {selectedInterests.length > 0 && (
          <div className="flex justify-center gap-2 mt-2">
            {selectedInterests.map((id) => (
              <motion.span
                key={id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                {INTEREST_THEMES[id].icon}
              </motion.span>
            ))}
          </div>
        )}
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
          disabled={selectedInterests.length === 0}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-6 font-bold rounded-xl shadow-lg transition-all
            ${
              selectedInterests.length > 0
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
