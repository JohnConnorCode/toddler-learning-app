"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import { WordItem } from "@/lib/words-data";
import { useSpeech } from "@/hooks/use-audio";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface WordRecognitionProps {
  targetWord: WordItem;
  distractorWords: WordItem[];
  onComplete: (correct: boolean, attempts: number) => void;
  mode?: "image-to-word" | "sound-to-word" | "word-to-image";
}

/**
 * WordRecognition Component
 *
 * Tests reading recognition rather than spelling:
 * - image-to-word: Show image, tap the correct word
 * - sound-to-word: Hear the word, tap the correct written word
 * - word-to-image: See the word, tap the correct image
 *
 * This complements WordBuilder by testing receptive vocabulary.
 */
export function WordRecognition({
  targetWord,
  distractorWords,
  onComplete,
  mode = "image-to-word",
}: WordRecognitionProps) {
  const [attempts, setAttempts] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { speak } = useSpeech();

  // Combine target with distractors and shuffle
  const options = useMemo(() => {
    const all = [targetWord, ...distractorWords.slice(0, 3)];
    // Shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [targetWord, distractorWords]);

  // Find the correct index
  const correctIndex = options.findIndex((w) => w.word === targetWord.word);

  // Auto-speak for sound-to-word mode
  useEffect(() => {
    if (mode === "sound-to-word") {
      const timer = setTimeout(() => {
        speak(targetWord.word, { rate: 0.75 });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mode, targetWord.word, speak]);

  const handleSpeak = useCallback(() => {
    speak(targetWord.word, { rate: 0.75 });
  }, [speak, targetWord.word]);

  const handleOptionClick = (index: number) => {
    if (isComplete || showResult) return;

    setSelectedIndex(index);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const isCorrect = index === correctIndex;
    setShowResult(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      triggerConfetti();
      speak("Great job!", { rate: 0.9, pitch: 1.2 });

      setTimeout(() => {
        setIsComplete(true);
      }, 1000);

      setTimeout(() => {
        onComplete(true, newAttempts);
      }, 2000);
    } else {
      // Wrong - give feedback and let them try again
      speak("Try again!", { rate: 0.9 });

      setTimeout(() => {
        setShowResult(null);
        setSelectedIndex(null);
      }, 1200);
    }
  };

  const handleReset = () => {
    setAttempts(0);
    setSelectedIndex(null);
    setShowResult(null);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto p-4">
      {/* Prompt Area */}
      <div className="text-center mb-2">
        {mode === "image-to-word" && (
          <>
            <p className="text-lg text-gray-600 font-semibold mb-4">
              Tap the word for this picture
            </p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-3xl bg-white shadow-xl flex items-center justify-center overflow-hidden mb-4"
            >
              <img
                src={targetWord.image}
                alt="What word is this?"
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  // Show emoji fallback
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>
            <button
              onClick={handleSpeak}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Hear it</span>
            </button>
          </>
        )}

        {mode === "sound-to-word" && (
          <>
            <p className="text-lg text-gray-600 font-semibold mb-4">
              Listen and tap the word you hear
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpeak}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl flex items-center justify-center mb-4"
            >
              <Volume2 className="w-12 h-12 text-white" />
            </motion.button>
            <p className="text-sm text-gray-500">Tap to hear again</p>
          </>
        )}

        {mode === "word-to-image" && (
          <>
            <p className="text-lg text-gray-600 font-semibold mb-4">
              Tap the picture for this word
            </p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl px-8 py-6 mb-4"
            >
              <p className="text-4xl sm:text-5xl font-black text-gray-800 uppercase">
                {targetWord.word}
              </p>
            </motion.div>
            <button
              onClick={handleSpeak}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Hear it</span>
            </button>
          </>
        )}
      </div>

      {/* Answer Options */}
      <div
        className={cn(
          "grid gap-3 w-full",
          mode === "word-to-image" ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {options.map((word, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === correctIndex;
          const showAsCorrect = showResult === "correct" && isSelected;
          const showAsIncorrect = showResult === "incorrect" && isSelected;
          const revealCorrect = showResult === "incorrect" && isCorrectOption;

          if (mode === "word-to-image") {
            // Show images as options
            return (
              <motion.button
                key={word.word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionClick(index)}
                disabled={isComplete}
                className={cn(
                  "relative aspect-square rounded-2xl shadow-lg overflow-hidden border-4 transition-all",
                  showAsCorrect && "border-green-500 bg-green-100",
                  showAsIncorrect && "border-red-400 bg-red-50",
                  revealCorrect && "border-green-400 bg-green-50 animate-pulse",
                  !isSelected && !revealCorrect && "border-gray-200 bg-white hover:border-purple-300"
                )}
              >
                <img
                  src={word.image}
                  alt=""
                  className="w-full h-full object-contain p-4"
                />
                {showAsCorrect && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-green-600" />
                  </div>
                )}
              </motion.button>
            );
          }

          // Show words as options (image-to-word or sound-to-word)
          return (
            <motion.button
              key={word.word}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(index)}
              disabled={isComplete}
              className={cn(
                "py-4 px-6 rounded-2xl shadow-lg font-black text-2xl uppercase transition-all border-b-4",
                showAsCorrect && "bg-green-500 text-white border-green-700",
                showAsIncorrect && "bg-red-400 text-white border-red-600",
                revealCorrect && "bg-green-100 text-green-800 border-green-400 animate-pulse",
                !isSelected && !revealCorrect && "bg-white text-gray-800 border-gray-200 hover:border-purple-400 hover:bg-purple-50"
              )}
            >
              {word.word}
              {showAsCorrect && (
                <Sparkles className="inline-block ml-2 w-6 h-6" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-2xl font-black text-green-600"
          >
            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <span>You got it!</span>
            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attempts & Reset */}
      <div className="flex items-center gap-4">
        {attempts > 0 && !isComplete && (
          <p className="text-sm text-gray-400">Attempts: {attempts}</p>
        )}
        <button
          onClick={handleReset}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
