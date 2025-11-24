"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { LetterBlock } from "./LetterBlock";
import { useSpeech } from "@/hooks/use-speech";
import { triggerConfetti } from "@/lib/confetti";
import { Sparkles, RotateCcw, Volume2, Play } from "lucide-react";

interface BlendingSliderProps {
  word: string;
  onComplete?: (smoothnessScore: number) => void;
  showInstructions?: boolean;
}

export function BlendingSlider({
  word,
  onComplete,
  showInstructions = true
}: BlendingSliderProps) {
  const letters = word.toUpperCase().split("");
  const vowels = ["A", "E", "I", "O", "U"];

  const [isSliding, setIsSliding] = useState(false);
  const [completedSlide, setCompletedSlide] = useState(false);
  const [activeLetterIndex, setActiveLetterIndex] = useState<number>(-1);
  const [connectedIndices, setConnectedIndices] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderX = useMotionValue(0);
  const { speak } = useSpeech();

  const letterRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    resetSlider();
  }, [word]);

  const resetSlider = () => {
    sliderX.set(0);
    setIsSliding(false);
    setCompletedSlide(false);
    setActiveLetterIndex(-1);
    setConnectedIndices([]);
  };

  const handleDragStart = () => {
    setIsSliding(true);
  };

  const handleDrag = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = sliderX.get();

    // Calculate which letter we're over
    let newActiveIndex = -1;
    let newConnected: number[] = [];

    letters.forEach((_, index) => {
      const letterEl = letterRefs.current[index];
      if (!letterEl) return;

      const letterRect = letterEl.getBoundingClientRect();
      const letterCenter = letterRect.left + letterRect.width / 2 - containerRect.left;

      // If slider has passed this letter's center
      if (currentX >= letterCenter - 40) {
        newConnected.push(index);
      }

      // If slider is currently over this letter
      if (
        currentX >= letterCenter - letterRect.width / 2 &&
        currentX <= letterCenter + letterRect.width / 2
      ) {
        newActiveIndex = index;
      }
    });

    // Play sound when entering a new letter
    if (newActiveIndex !== activeLetterIndex && newActiveIndex >= 0) {
      speak(letters[newActiveIndex]);
    }

    setActiveLetterIndex(newActiveIndex);
    setConnectedIndices(newConnected);
  };

  const handleDragEnd = () => {
    const currentX = sliderX.get();
    const containerWidth = containerRef.current?.offsetWidth || 1;

    // Check if we reached the end (90% of the way)
    if (currentX / containerWidth >= 0.9 && connectedIndices.length === letters.length) {
      handleComplete();
    } else {
      // Reset to start
      sliderX.set(0);
      setIsSliding(false);
      setActiveLetterIndex(-1);
      setConnectedIndices([]);
    }
  };

  const handleComplete = () => {
    setCompletedSlide(true);
    setIsSliding(false);
    triggerConfetti();

    // Play the full blended word
    setTimeout(() => {
      speak(word);
    }, 300);

    // Calculate smoothness score (assume perfect if they completed)
    const smoothnessScore = 0.9;

    if (onComplete) {
      setTimeout(() => onComplete(smoothnessScore), 3000);
    }
  };

  const handlePlayWord = () => {
    speak(word);
  };

  const handleStartAgain = () => {
    resetSlider();
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-3xl mx-auto p-4">
      {/* Instructions */}
      {showInstructions && !completedSlide && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
            Drag the knob smoothly across all blocks!
          </h3>
          <p className="text-lg text-gray-500">
            Go slow and steady—listen to the sounds blend together
          </p>
        </motion.div>
      )}

      {/* Letter Blocks Row */}
      <div
        ref={containerRef}
        className="relative w-full max-w-xl"
      >
        {/* Blocks */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-6">
          {letters.map((letter, index) => {
            const isVowel = vowels.includes(letter);
            const isActive = activeLetterIndex === index;
            const isConnected = connectedIndices.includes(index);

            let state: "idle" | "active" | "connected" | "locked" = "idle";
            if (completedSlide) {
              state = "locked";
            } else if (isActive) {
              state = "active";
            } else if (isConnected) {
              state = "connected";
            }

            return (
              <div
                key={index}
                ref={(el) => { letterRefs.current[index] = el; }}
              >
                <LetterBlock
                  letter={letter}
                  state={state}
                  size="lg"
                  isVowel={isVowel}
                />
              </div>
            );
          })}
        </div>

        {/* Slider Track */}
        {!completedSlide && (
          <div className="relative h-16 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full shadow-inner overflow-hidden">
            {/* Progress Fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-40"
              style={{
                width: useTransform(
                  sliderX,
                  [0, containerRef.current?.offsetWidth || 1],
                  ["0%", "100%"]
                )
              }}
            />

            {/* Draggable Knob */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: containerRef.current?.offsetWidth || 500 }}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{ x: sliderX }}
              className="absolute top-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-2xl cursor-grab active:cursor-grabbing border-4 border-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />

              {/* Drag Indicator (animated) */}
              {!isSliding && (
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute right-2"
                >
                  <div className="text-white text-2xl">→</div>
                </motion.div>
              )}
            </motion.div>

            {/* End Target */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        )}
      </div>

      {/* Completion Screen */}
      {completedSlide && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center space-y-4 w-full"
        >
          <div className="bg-green-100 border-2 border-green-400 rounded-2xl px-6 sm:px-8 py-6">
            <div className="flex items-center justify-center gap-3 text-green-700 font-black text-2xl sm:text-3xl mb-3">
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
              <span>Amazing!</span>
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            </div>
            <p className="text-xl font-bold text-green-600 mb-2">
              You blended: <span className="text-3xl">{word}</span>
            </p>
            <p className="text-gray-600">
              The blocks connected perfectly!
            </p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleStartAgain}
              className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={handlePlayWord}
              className="flex items-center gap-2 px-5 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
            >
              <Volume2 className="w-5 h-5" />
              Hear Word
            </button>
          </div>
        </motion.div>
      )}

      {/* Helper Buttons (when not sliding) */}
      {!completedSlide && !isSliding && (
        <button
          onClick={handlePlayWord}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
        >
          <Volume2 className="w-5 h-5" />
          Hear the Word
        </button>
      )}
    </div>
  );
}
