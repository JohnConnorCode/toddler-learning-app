"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterBlock } from "./LetterBlock";
import { useSpeech } from "@/hooks/use-speech";
import { celebrateStars, celebrateMedium, celebrateSmall } from "@/lib/confetti";
import { playFeedback, playSound } from "@/lib/sound-effects";
import { Sparkles, RotateCcw, Volume2, Star } from "lucide-react";

interface TapToBlendProps {
  word: string;
  onComplete?: (smoothnessScore: number) => void;
  showFeedback?: boolean;
}

type TapState = "waiting" | "tapping" | "complete";

const SMOOTH_THRESHOLD_MS = 700; // Max time between taps to be considered "smooth"
const MAX_WORD_DURATION_MS = 2500; // Max total time to read word smoothly

export function TapToBlend({
  word,
  onComplete,
  showFeedback = true
}: TapToBlendProps) {
  const [tapState, setTapState] = useState<TapState>("waiting");
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [tapTimings, setTapTimings] = useState<number[]>([]);
  const [smoothnessScore, setSmoothnessScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSmooth, setIsSmooth] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const { speak } = useSpeech();

  const letters = word.toUpperCase().split("");
  const vowels = ["A", "E", "I", "O", "U"];

  useEffect(() => {
    // Reset on word change
    resetGame();
  }, [word]);

  const resetGame = () => {
    setTapState("waiting");
    setTappedIndices([]);
    setTapTimings([]);
    setSmoothnessScore(0);
    setFeedback("");
    setIsSmooth(false);
    startTimeRef.current = 0;
    lastTapTimeRef.current = 0;
  };

  const handleLetterTap = (index: number, letter: string) => {
    if (tapState === "complete") return;

    const now = Date.now();

    // Play tap sound + haptic feedback
    playFeedback('pop', 'light');

    // First tap - start timing
    if (tappedIndices.length === 0) {
      startTimeRef.current = now;
      lastTapTimeRef.current = now;
      setTapState("tapping");
      speak(letter);
      setTappedIndices([index]);
      setTapTimings([0]); // First tap has no interval
      return;
    }

    // Subsequent taps
    const timeSinceLastTap = now - lastTapTimeRef.current;
    lastTapTimeRef.current = now;

    speak(letter);
    setTappedIndices([...tappedIndices, index]);
    setTapTimings([...tapTimings, timeSinceLastTap]);

    // Mini celebration for each letter
    if (tappedIndices.length < letters.length - 1) {
      celebrateSmall();
    }

    // If this was the last letter, evaluate
    if (tappedIndices.length === letters.length - 1) {
      evaluateBlending(now, [...tapTimings, timeSinceLastTap]);
    }
  };

  const evaluateBlending = (endTime: number, allTimings: number[]) => {
    const totalDuration = endTime - startTimeRef.current;

    // Calculate smoothness score (0-1)
    // Based on: 1) average gap time, 2) consistency, 3) total duration
    const avgGap = allTimings.slice(1).reduce((a, b) => a + b, 0) / (allTimings.length - 1);
    const maxGap = Math.max(...allTimings.slice(1));

    let score = 1.0;

    // Penalize for long gaps
    if (maxGap > SMOOTH_THRESHOLD_MS) {
      score -= (maxGap - SMOOTH_THRESHOLD_MS) / 1000 * 0.3;
    }

    // Penalize for long total duration
    if (totalDuration > MAX_WORD_DURATION_MS) {
      score -= (totalDuration - MAX_WORD_DURATION_MS) / 1000 * 0.2;
    }

    // Penalize for inconsistency
    const variance = allTimings.slice(1).reduce((sum, timing) => {
      return sum + Math.abs(timing - avgGap);
    }, 0) / allTimings.length;
    score -= variance / 1000 * 0.1;

    score = Math.max(0, Math.min(1, score));

    // Determine if smooth
    const smooth = score >= 0.7 && maxGap < SMOOTH_THRESHOLD_MS;

    setSmoothnessScore(score);
    setIsSmooth(smooth);
    setTapState("complete");

    // Generate feedback - ALWAYS POSITIVE!
    if (smooth) {
      setFeedback("Amazing! You're So Fast! ⚡");
      celebrateStars();
      playSound('celebrate');
      setTimeout(() => speak(word), 300);
    } else if (score >= 0.5) {
      setFeedback("Great Job! Try Even Faster!");
      celebrateMedium();
      playSound('success');
      setTimeout(() => speak(word), 300);
    } else {
      setFeedback("You Did It! Tap Super Fast!");
      celebrateSmall();
      playSound('chime');
      setTimeout(() => speak(word), 300);
    }

    // Call completion callback after a delay
    if (onComplete) {
      setTimeout(() => onComplete(score), 3000);
    }
  };

  const handleStartAgain = () => {
    resetGame();
  };

  const handleHearWord = () => {
    speak(word);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-4">
      {/* Instructions - SIMPLE! */}
      {tapState === "waiting" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center"
        >
          <motion.h3
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
          >
            Tap Fast! 👆
          </motion.h3>
          <div className="flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
              >
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Letter Blocks */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        {letters.map((letter, index) => {
          const isTapped = tappedIndices.includes(index);
          const isNext = tappedIndices.length === index;
          const isVowel = vowels.includes(letter);

          let state: "idle" | "active" | "connected" | "locked" = "idle";

          if (tapState === "complete") {
            state = isSmooth ? "locked" : "connected";
          } else if (isTapped) {
            state = "connected";
          } else if (isNext) {
            state = "active";
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <LetterBlock
                letter={letter}
                state={state}
                size="lg"
                isVowel={isVowel}
                onClick={() => handleLetterTap(index, letter)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Progress Stars - Show how many letters tapped */}
      {tapState === "tapping" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3 items-center"
        >
          {letters.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{
                scale: tappedIndices.includes(index) ? [0, 1.3, 1] : 1,
                rotate: tappedIndices.includes(index) ? [0, 360] : 0,
              }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              <Star
                className={`w-10 h-10 sm:w-12 sm:h-12 ${
                  tappedIndices.includes(index)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {tapState === "complete" && showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center space-y-4"
          >
            {/* Feedback Message - BIG AND EXCITING! */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: "spring", bounce: 0.6 }}
              className={`px-8 py-8 rounded-3xl border-4 ${
                isSmooth
                  ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-400"
                  : "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400"
              }`}
            >
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: 3, duration: 0.5 }}
                className={`text-3xl sm:text-4xl md:text-5xl font-black text-center ${
                  isSmooth ? "text-green-700" : "text-orange-700"
                }`}
              >
                {feedback}
              </motion.p>

              {/* Show stars instead of score */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 * i, type: "spring", bounce: 0.7 }}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        i < Math.round(smoothnessScore * 5)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons - BIGGER! */}
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartAgain}
                className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-black rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-xl border-b-4 border-blue-700"
              >
                <RotateCcw className="w-7 h-7" />
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHearWord}
                className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl font-black rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-xl border-b-4 border-purple-700"
              >
                <Volume2 className="w-7 h-7" />
                Hear Word
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
