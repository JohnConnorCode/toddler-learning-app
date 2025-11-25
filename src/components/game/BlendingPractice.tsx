"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import { useSpeech } from "@/hooks/use-audio";
import { cn } from "@/lib/utils";

interface BlendingPracticeProps {
  word: string;
  letters: string[];
  image?: string;
  onComplete?: () => void;
  showImage?: boolean;
}

type Phase = "intro" | "letters" | "blend" | "complete";

/**
 * BlendingPractice Component
 *
 * Teaches children to sound out words letter by letter, then blend them together.
 * This is the foundational skill for reading - connecting letters to sounds.
 *
 * Flow:
 * 1. Intro: Show word image, "Let's sound it out!"
 * 2. Letters: Tap each letter to hear its sound
 * 3. Blend: Hear all sounds together, then the whole word
 * 4. Complete: Celebration!
 */
export function BlendingPractice({
  word,
  letters,
  image,
  onComplete,
  showImage = true,
}: BlendingPracticeProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);
  const [tappedLetters, setTappedLetters] = useState<Set<number>>(new Set());
  const [isBlending, setIsBlending] = useState(false);
  const [highlightedLetter, setHighlightedLetter] = useState<number | null>(null);

  const { speak, speakWords, stop } = useSpeech();

  // Reset when word changes
  useEffect(() => {
    setPhase("intro");
    setCurrentLetterIndex(-1);
    setTappedLetters(new Set());
    setIsBlending(false);
    setHighlightedLetter(null);
  }, [word]);

  // Auto-start intro
  useEffect(() => {
    if (phase === "intro") {
      const timer = setTimeout(() => {
        speak("Let's sound it out! Tap each letter.", { rate: 0.85 });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, speak]);

  const handleStartLetters = () => {
    setPhase("letters");
    setCurrentLetterIndex(0);
  };

  const handleLetterTap = useCallback(async (index: number) => {
    if (phase !== "letters" || isBlending) return;

    setHighlightedLetter(index);
    setTappedLetters((prev) => new Set(prev).add(index));

    // Speak the letter sound (phonetically)
    const letter = letters[index].toLowerCase();

    // Use phonetic sounds for common letters
    const phoneticSounds: Record<string, string> = {
      a: "aah",
      b: "buh",
      c: "kuh",
      d: "duh",
      e: "eh",
      f: "fff",
      g: "guh",
      h: "huh",
      i: "ih",
      j: "juh",
      k: "kuh",
      l: "lll",
      m: "mmm",
      n: "nnn",
      o: "oh",
      p: "puh",
      q: "kwuh",
      r: "rrr",
      s: "sss",
      t: "tuh",
      u: "uh",
      v: "vvv",
      w: "wuh",
      x: "ks",
      y: "yuh",
      z: "zzz",
    };

    const sound = phoneticSounds[letter] || letter;
    await speak(sound, { rate: 0.7, pitch: 1.0 });

    // Clear highlight after sound
    setTimeout(() => setHighlightedLetter(null), 300);

    // Check if all letters have been tapped
    const newTapped = new Set(tappedLetters).add(index);
    if (newTapped.size === letters.length) {
      setTimeout(() => setPhase("blend"), 800);
    }
  }, [phase, isBlending, letters, speak, tappedLetters]);

  const handleBlend = useCallback(async () => {
    if (isBlending) return;
    setIsBlending(true);

    // Sound out each letter with highlighting
    for (let i = 0; i < letters.length; i++) {
      setHighlightedLetter(i);
      const letter = letters[i].toLowerCase();
      const phoneticSounds: Record<string, string> = {
        a: "aah", b: "buh", c: "kuh", d: "duh", e: "eh", f: "fff",
        g: "guh", h: "huh", i: "ih", j: "juh", k: "kuh", l: "lll",
        m: "mmm", n: "nnn", o: "oh", p: "puh", q: "kwuh", r: "rrr",
        s: "sss", t: "tuh", u: "uh", v: "vvv", w: "wuh", x: "ks",
        y: "yuh", z: "zzz",
      };
      await speak(phoneticSounds[letter] || letter, { rate: 0.6, pitch: 1.0 });
      await new Promise((r) => setTimeout(r, 200));
    }

    setHighlightedLetter(null);
    await new Promise((r) => setTimeout(r, 300));

    // Say the whole word
    await speak(word, { rate: 0.8, pitch: 1.1 });

    setIsBlending(false);
    setTimeout(() => setPhase("complete"), 500);
  }, [isBlending, letters, speak, word]);

  const handleComplete = () => {
    onComplete?.();
  };

  const handleRestart = () => {
    setPhase("intro");
    setCurrentLetterIndex(-1);
    setTappedLetters(new Set());
    setIsBlending(false);
    setHighlightedLetter(null);
    stop();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto p-4">
      {/* Word Image */}
      {showImage && image && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white shadow-xl flex items-center justify-center overflow-hidden"
        >
          <img
            src={image}
            alt={word}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>
      )}

      {/* Phase: Intro */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 text-center">
              Let&apos;s sound it out!
            </h2>
            <p className="text-gray-600 text-center">
              Tap each letter to hear its sound
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartLetters}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg flex items-center gap-2"
            >
              <span>Start</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Phase: Letters */}
        {phase === "letters" && (
          <motion.div
            key="letters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-lg text-gray-600 font-semibold">
              Tap each letter to hear it!
            </p>

            {/* Letter Cards */}
            <div className="flex gap-3 sm:gap-4">
              {letters.map((letter, index) => {
                const isTapped = tappedLetters.has(index);
                const isHighlighted = highlightedLetter === index;

                return (
                  <motion.button
                    key={index}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{
                      scale: isHighlighted ? 1.2 : 1,
                      rotate: 0,
                      backgroundColor: isHighlighted
                        ? "#8B5CF6"
                        : isTapped
                        ? "#10B981"
                        : "#FFFFFF",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: index * 0.1,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLetterTap(index)}
                    className={cn(
                      "w-16 h-20 sm:w-20 sm:h-24 rounded-2xl shadow-lg flex items-center justify-center text-4xl sm:text-5xl font-black border-b-4 transition-colors",
                      isHighlighted
                        ? "text-white border-purple-700"
                        : isTapped
                        ? "text-white border-green-600"
                        : "text-gray-700 border-gray-200"
                    )}
                  >
                    <span className="drop-shadow-sm">{letter}</span>
                    {isTapped && !isHighlighted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2">
              {letters.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    tappedLetters.has(index) ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase: Blend */}
        {phase === "blend" && (
          <motion.div
            key="blend"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-lg text-gray-600 font-semibold text-center">
              Now let&apos;s blend the sounds together!
            </p>

            {/* Letter Cards (display only during blend) */}
            <div className="flex gap-3 sm:gap-4">
              {letters.map((letter, index) => {
                const isHighlighted = highlightedLetter === index;

                return (
                  <motion.div
                    key={index}
                    animate={{
                      scale: isHighlighted ? 1.2 : 1,
                      backgroundColor: isHighlighted ? "#8B5CF6" : "#10B981",
                    }}
                    className={cn(
                      "w-16 h-20 sm:w-20 sm:h-24 rounded-2xl shadow-lg flex items-center justify-center text-4xl sm:text-5xl font-black border-b-4 text-white",
                      isHighlighted ? "border-purple-700" : "border-green-600"
                    )}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </div>

            {/* Blend Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBlend}
              disabled={isBlending}
              className={cn(
                "mt-4 px-8 py-4 font-bold text-lg rounded-full shadow-lg flex items-center gap-3 transition-all",
                isBlending
                  ? "bg-purple-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              )}
            >
              <Volume2 className={cn("w-6 h-6", isBlending && "animate-pulse")} />
              <span>{isBlending ? "Blending..." : "Blend It!"}</span>
            </motion.button>
          </motion.div>
        )}

        {/* Phase: Complete */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-3xl sm:text-4xl font-black text-green-600"
            >
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <span>{word.toUpperCase()}!</span>
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </motion.div>

            <p className="text-xl text-gray-600 font-semibold">
              Great sounding out!
            </p>

            <div className="flex gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Again</span>
              </motion.button>

              {onComplete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full flex items-center gap-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
