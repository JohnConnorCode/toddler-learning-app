"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding, useChildName } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { ArrowLeft, ArrowRight, Volume2, Hand, Check, Star } from "lucide-react";

interface GuidedFirstLessonProps {
  onNext: () => void;
  onBack: () => void;
}

type LessonStep = "intro" | "see-letter" | "hear-sound" | "tap-letter" | "celebration";

const TUTORIAL_LETTER = {
  letter: "A",
  word: "Apple",
  emoji: "🍎",
  color: "bg-red-400",
  sound: "ah",
};

export function GuidedFirstLesson({ onNext, onBack }: GuidedFirstLessonProps) {
  const childName = useChildName();
  const { completeGuidedLessonStep } = useOnboarding();
  const { shouldReduceMotion } = useAccessibility();
  const [currentStep, setCurrentStep] = useState<LessonStep>("intro");
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [hasTappedLetter, setHasTappedLetter] = useState(false);

  const goToStep = (step: LessonStep) => {
    setCurrentStep(step);
  };

  const handlePlaySound = () => {
    // In a real app, this would play the letter sound
    setHasPlayedSound(true);
    completeGuidedLessonStep("hasCompletedSoundDemo");

    // Simulate sound playing
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(TUTORIAL_LETTER.sound);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleTapLetter = () => {
    setHasTappedLetter(true);
    completeGuidedLessonStep("hasCompletedLetterDemo");

    // Show celebration after a brief delay
    setTimeout(() => {
      goToStep("celebration");
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="text-7xl mb-6"
            >
              📖
            </motion.div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              Let's Learn How It Works!
            </h2>
            <p className="text-gray-600 mb-6">
              {childName}, I'll show you how we learn letters. It's super easy
              and fun!
            </p>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => goToStep("see-letter")}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg"
            >
              <span>Show Me!</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        );

      case "see-letter":
        return (
          <div className="text-center">
            {/* Instruction Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block"
            >
              Step 1: See the Letter
            </motion.div>

            {/* Letter Card */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`${TUTORIAL_LETTER.color} w-40 h-40 mx-auto rounded-3xl flex items-center justify-center shadow-xl mb-6`}
            >
              <span className="text-white text-8xl font-black">
                {TUTORIAL_LETTER.letter}
              </span>
            </motion.div>

            {/* Letter Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xl text-gray-700 mb-2">
                This is the letter{" "}
                <span className="font-black text-2xl">{TUTORIAL_LETTER.letter}</span>
              </p>
              <p className="text-gray-500 flex items-center justify-center gap-2">
                <span className="text-3xl">{TUTORIAL_LETTER.emoji}</span>
                <span>is for {TUTORIAL_LETTER.word}</span>
              </p>
            </motion.div>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => goToStep("hear-sound")}
              className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg mx-auto"
            >
              <span>Next: Hear the Sound</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        );

      case "hear-sound":
        return (
          <div className="text-center">
            {/* Instruction Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block"
            >
              Step 2: Hear the Sound
            </motion.div>

            {/* Sound Button */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
              onClick={handlePlaySound}
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-xl mb-6 transition-colors ${
                hasPlayedSound
                  ? "bg-green-500"
                  : "bg-gradient-to-br from-purple-400 to-purple-600"
              }`}
            >
              {hasPlayedSound ? (
                <Check className="w-16 h-16 text-white" />
              ) : (
                <Volume2 className="w-16 h-16 text-white" />
              )}
            </motion.button>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {hasPlayedSound ? (
                <>
                  <p className="text-xl text-gray-700 mb-2">
                    Great job, {childName}! 🎉
                  </p>
                  <p className="text-gray-500">
                    The letter {TUTORIAL_LETTER.letter} says "{TUTORIAL_LETTER.sound}"
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl text-gray-700 mb-2">
                    Tap the button to hear the sound!
                  </p>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl"
                  >
                    👆
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Next Button */}
            {hasPlayedSound && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => goToStep("tap-letter")}
                className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg mx-auto"
              >
                <span>Next: Your Turn!</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        );

      case "tap-letter":
        return (
          <div className="text-center">
            {/* Instruction Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block"
            >
              Step 3: Your Turn!
            </motion.div>

            {/* Prompt */}
            <p className="text-xl text-gray-700 mb-6">
              {hasTappedLetter
                ? "You did it! 🎉"
                : `Find and tap the letter ${TUTORIAL_LETTER.letter}!`}
            </p>

            {/* Letter Options */}
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
              {["B", "A", "C"].map((letter, index) => (
                <motion.button
                  key={letter}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  onClick={() => {
                    if (letter === TUTORIAL_LETTER.letter) {
                      handleTapLetter();
                    }
                  }}
                  disabled={hasTappedLetter}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg transition-all ${
                    hasTappedLetter && letter === TUTORIAL_LETTER.letter
                      ? "bg-green-500 text-white ring-4 ring-green-300"
                      : "bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {letter}
                </motion.button>
              ))}
            </div>

            {/* Hand Pointer Animation */}
            {!hasTappedLetter && (
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center justify-center gap-2 text-gray-400"
              >
                <Hand className="w-6 h-6" />
                <span>Tap the correct letter!</span>
              </motion.div>
            )}
          </div>
        );

      case "celebration":
        return (
          <div className="text-center">
            {/* Stars Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-center gap-2 mb-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2, type: "spring" }}
                >
                  <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </motion.div>

            {/* Celebration Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-black text-gray-800 mb-4">
                Amazing Job, {childName}! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                You learned how to find letters and hear their sounds! You're
                ready to become a reading superstar!
              </p>
            </motion.div>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg"
            >
              <span>Finish Setup!</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Back Button (only show on intro) */}
      {currentStep === "intro" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="mt-4 w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </motion.button>
      )}
    </div>
  );
}
