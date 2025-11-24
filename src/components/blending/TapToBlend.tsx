"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterBlock } from "./LetterBlock";
import { useSpeech } from "@/hooks/use-speech";
import { triggerConfetti } from "@/lib/confetti";
import { Sparkles, RotateCcw, Volume2 } from "lucide-react";

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

    // Generate feedback
    if (smooth) {
      setFeedback("Super smooth! Those blocks snapped together perfectly! 🎉");
      triggerConfetti();
      setTimeout(() => speak(word), 300);
    } else if (score >= 0.5) {
      setFeedback("Good try! Let's make the blocks snap together even faster!");
      setTimeout(() => speak(word), 300);
    } else {
      setFeedback("That was a bit slow. Try tapping quickly without pausing!");
      setTimeout(() => speak("Try again"), 300);
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
      {/* Instructions */}
      {tapState === "waiting" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
            Tap the blocks fast to snap them together!
          </h3>
          <p className="text-lg text-gray-500">
            Tap each letter quickly—don't pause!
          </p>
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

      {/* Timing Visualization */}
      {tapState === "tapping" && tapTimings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-2 items-center"
        >
          {tapTimings.slice(1).map((timing, index) => {
            const isSmooth = timing < SMOOTH_THRESHOLD_MS;
            return (
              <motion.div
                key={index}
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  isSmooth
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {timing}ms
              </motion.div>
            );
          })}
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
            {/* Feedback Message */}
            <div
              className={`px-6 py-4 rounded-2xl ${
                isSmooth
                  ? "bg-green-100 border-2 border-green-400"
                  : "bg-orange-100 border-2 border-orange-400"
              }`}
            >
              <p className={`text-xl font-bold ${
                isSmooth ? "text-green-700" : "text-orange-700"
              }`}>
                {feedback}
              </p>

              {/* Smoothness Score Bar */}
              <div className="mt-3 bg-white/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${smoothnessScore * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-full ${
                    isSmooth ? "bg-green-500" : "bg-orange-500"
                  }`}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Smoothness: {Math.round(smoothnessScore * 100)}%
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleStartAgain}
                className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={handleHearWord}
                className="flex items-center gap-2 px-5 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
              >
                <Volume2 className="w-5 h-5" />
                Hear Word
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
