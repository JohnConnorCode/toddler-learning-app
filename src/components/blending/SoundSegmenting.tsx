"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterBlock, LetterBlockSlot } from "./LetterBlock";
import { useSpeech } from "@/hooks/use-speech";
import { triggerConfetti } from "@/lib/confetti";
import { Lightbulb, Volume2, RotateCcw, Sparkles } from "lucide-react";

interface SoundSegmentingProps {
  word: string;
  image?: string;
  onComplete?: (smoothnessScore: number) => void;
}

export function SoundSegmenting({
  word,
  image,
  onComplete
}: SoundSegmentingProps) {
  const letters = word.toUpperCase().split("");
  const vowels = ["A", "E", "I", "O", "U"];

  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>(
    new Array(letters.length).fill(null)
  );
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const { speak } = useSpeech();

  useEffect(() => {
    // Shuffle the letters
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setPlacedLetters(new Array(letters.length).fill(null));
    setMistakes(0);
    setShowHint(false);
    setIsComplete(false);

    // Play segmented sounds after a short delay
    setTimeout(() => playSegmentedSounds(), 500);
  }, [word]);

  const playSegmentedSounds = () => {
    letters.forEach((letter, index) => {
      setTimeout(() => {
        speak(letter);
      }, index * 800);
    });
  };

  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();

    if (!draggedLetter) return;

    // Check if this slot is already filled
    if (placedLetters[slotIndex] !== null) {
      return;
    }

    // Check if this is the correct letter for this position
    const correctLetter = letters[slotIndex];

    if (draggedLetter === correctLetter) {
      // Correct placement!
      const newPlaced = [...placedLetters];
      newPlaced[slotIndex] = draggedLetter;
      setPlacedLetters(newPlaced);

      // Remove from available
      setAvailableLetters(availableLetters.filter(l => l !== draggedLetter));

      // Play sound
      speak(draggedLetter);

      // Check if complete
      if (newPlaced.every(l => l !== null)) {
        handleComplete();
      }
    } else {
      // Wrong placement
      setMistakes(mistakes + 1);
      speak("Try again");

      // Show hint after 2 mistakes
      if (mistakes + 1 >= 2) {
        setShowHint(true);
      }
    }

    setDraggedLetter(null);
  };

  const handleComplete = () => {
    setIsComplete(true);
    triggerConfetti();

    // Calculate smoothness score based on mistakes
    // 0 mistakes = 1.0, 1 mistake = 0.85, 2 mistakes = 0.7, 3+ = 0.5
    let score = 1.0;
    if (mistakes === 1) score = 0.85;
    else if (mistakes === 2) score = 0.7;
    else if (mistakes >= 3) score = 0.5;

    // Play the full word
    setTimeout(() => {
      speak(word);
    }, 500);

    // Call completion callback with smoothness score
    if (onComplete) {
      setTimeout(() => onComplete(score), 3000);
    }
  };

  const handleHint = () => {
    // Play segmented sounds again
    playSegmentedSounds();
  };

  const handleReset = () => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setPlacedLetters(new Array(letters.length).fill(null));
    setMistakes(0);
    setShowHint(false);
    setIsComplete(false);
  };

  const handlePlayWord = () => {
    speak(word);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto p-4">
      {/* Instructions */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
            Listen and drag the blocks in order!
          </h3>
          <p className="text-lg text-gray-500">
            Put each sound in the right spot
          </p>
        </motion.div>
      )}

      {/* Image (if provided) */}
      {image && !isComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-gray-200"
        >
          <img
            src={image}
            alt={word}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Drop Slots */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {placedLetters.map((letter, index) => (
          <div
            key={index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className="relative"
          >
            {letter ? (
              <LetterBlock
                letter={letter}
                state={isComplete ? "locked" : "connected"}
                size="lg"
                isVowel={vowels.includes(letter)}
              />
            ) : (
              <LetterBlockSlot
                index={index}
                hasBlock={false}
                size="lg"
              />
            )}

            {/* Hint Indicator */}
            {showHint && !letter && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-xs font-bold text-white">
                  {letters[index]}
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Available Letters (Draggable) */}
      {!isComplete && availableLetters.length > 0 && (
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 w-full max-w-md">
          <p className="text-center text-sm font-semibold text-gray-600 mb-4">
            Drag these blocks:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {availableLetters.map((letter, index) => (
              <div
                key={`${letter}-${index}`}
                draggable
                onDragStart={() => handleDragStart(letter)}
              >
                <LetterBlock
                  letter={letter}
                  state="idle"
                  size="md"
                  isVowel={vowels.includes(letter)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isComplete && (
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-lg"
          >
            <Lightbulb className="w-5 h-5" />
            Hear Sounds
          </button>

          <button
            onClick={handlePlayWord}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
          >
            <Volume2 className="w-5 h-5" />
            Hear Word
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white font-bold rounded-xl hover:bg-gray-500 transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      )}

      {/* Completion Screen */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4"
          >
            <div className="bg-green-100 border-2 border-green-400 rounded-2xl px-8 py-6">
              <div className="flex items-center justify-center gap-3 text-green-700 font-black text-3xl mb-2">
                <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                <span>Perfect!</span>
                <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <p className="text-xl font-bold text-green-600 mb-4">
                You built: <span className="text-2xl">{word}</span>
              </p>
              <p className="text-gray-600">
                All the blocks snapped together perfectly!
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              Try Another Word
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mistakes Counter */}
      {mistakes > 0 && !isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-sm text-gray-500"
        >
          Tries: {mistakes}
        </motion.div>
      )}
    </div>
  );
}
