"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Sparkles, ChevronRight, HelpCircle } from "lucide-react";
import { useSpeech } from "@/hooks/use-audio";
import { triggerConfetti, triggerSmallConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface RhymingPracticeProps {
  targetWord: string;
  rhymingWords: string[]; // Words that rhyme with target
  nonRhymingWords: string[]; // Distractors
  onComplete: (score: number, total: number) => void;
}

/**
 * RhymingPractice Component
 *
 * Teaches phonemic awareness through rhyming:
 * - Shows a target word
 * - Child taps words that rhyme with it
 * - Helps build word family recognition
 *
 * Example: CAT rhymes with BAT, HAT, RAT (but not DOG, SUN)
 */
export function RhymingPractice({
  targetWord,
  rhymingWords,
  nonRhymingWords,
  onComplete,
}: RhymingPracticeProps) {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { speak } = useSpeech();

  // Mix rhyming and non-rhyming words
  const allOptions = useMemo(() => {
    const options = [...rhymingWords, ...nonRhymingWords.slice(0, 3)];
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [rhymingWords, nonRhymingWords]);

  // Get the rhyme ending (e.g., "-at" from "cat")
  const rhymeEnding = useMemo(() => {
    // Simple: take last 2-3 characters
    if (targetWord.length <= 2) return targetWord;
    if (targetWord.length === 3) return "-" + targetWord.slice(1);
    return "-" + targetWord.slice(-3);
  }, [targetWord]);

  // Speak the target word on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(`${targetWord}. Find words that rhyme with ${targetWord}.`, {
        rate: 0.8,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [targetWord, speak]);

  const handleWordClick = useCallback(
    (word: string) => {
      if (showResults) return;

      // Speak the word
      speak(word, { rate: 0.8 });

      // Toggle selection
      const newSelected = new Set(selectedWords);
      if (newSelected.has(word)) {
        newSelected.delete(word);
      } else {
        newSelected.add(word);

        // Quick feedback
        const isRhyming = rhymingWords.includes(word);
        if (isRhyming) {
          triggerSmallConfetti();
        }
      }
      setSelectedWords(newSelected);
    },
    [showResults, selectedWords, speak, rhymingWords]
  );

  const handleSubmit = () => {
    setShowResults(true);

    // Calculate score
    let correct = 0;
    let incorrect = 0;

    selectedWords.forEach((word) => {
      if (rhymingWords.includes(word)) {
        correct++;
      } else {
        incorrect++;
      }
    });

    // Check for missed rhymes
    const missed = rhymingWords.filter((w) => !selectedWords.has(w)).length;

    const score = correct;
    const total = rhymingWords.length;

    if (score === total && incorrect === 0) {
      triggerConfetti();
      speak("Perfect! You found all the rhymes!", { rate: 0.9 });
    } else if (score > 0) {
      speak(`Good job! You found ${score} rhymes.`, { rate: 0.9 });
    } else {
      speak("Let's see which words rhyme.", { rate: 0.9 });
    }

    // Complete after showing results
    setTimeout(() => {
      onComplete(score - incorrect, total);
    }, 3000);
  };

  const handleSpeak = () => {
    speak(targetWord, { rate: 0.75 });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto p-4">
      {/* Target Word */}
      <div className="text-center">
        <p className="text-lg text-gray-600 font-semibold mb-3">
          Find words that rhyme with:
        </p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl px-8 py-6 shadow-xl"
        >
          <p className="text-4xl sm:text-5xl font-black text-white uppercase">
            {targetWord}
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
          >
            <Volume2 className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Hear it</span>
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Hint</span>
          </button>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-600 mt-3 bg-yellow-50 px-4 py-2 rounded-xl"
            >
              Words that rhyme end with the same sound:{" "}
              <span className="font-bold text-purple-600">{rhymeEnding}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <p className="text-gray-500 text-sm text-center">
        Tap all the words that rhyme with{" "}
        <span className="font-bold">{targetWord.toUpperCase()}</span>
      </p>

      {/* Word Options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {allOptions.map((word, index) => {
          const isSelected = selectedWords.has(word);
          const isRhyming = rhymingWords.includes(word);

          // Show results styling
          let resultStyle = "";
          if (showResults) {
            if (isRhyming && isSelected) {
              resultStyle = "bg-green-500 text-white border-green-700"; // Correct
            } else if (isRhyming && !isSelected) {
              resultStyle = "bg-green-100 text-green-800 border-green-400"; // Missed
            } else if (!isRhyming && isSelected) {
              resultStyle = "bg-red-400 text-white border-red-600"; // Wrong
            } else {
              resultStyle = "bg-gray-100 text-gray-400 border-gray-200"; // Correct non-selection
            }
          }

          return (
            <motion.button
              key={word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!showResults ? { scale: 1.05 } : {}}
              whileTap={!showResults ? { scale: 0.95 } : {}}
              onClick={() => handleWordClick(word)}
              disabled={showResults}
              className={cn(
                "py-4 px-4 rounded-2xl font-black text-xl uppercase transition-all border-b-4",
                showResults
                  ? resultStyle
                  : isSelected
                  ? "bg-purple-500 text-white border-purple-700 shadow-lg"
                  : "bg-white text-gray-800 border-gray-200 hover:border-purple-300 shadow-md"
              )}
            >
              {word}
              {showResults && isRhyming && (
                <span className="ml-2 text-sm">
                  {isSelected ? "✓" : "(rhymes)"}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Count */}
      {!showResults && (
        <p className="text-sm text-gray-500">
          Selected: {selectedWords.size} words
        </p>
      )}

      {/* Submit Button */}
      {!showResults && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={selectedWords.size === 0}
          className={cn(
            "px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 transition-all",
            selectedWords.size > 0
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <span>Check Answers</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-2xl font-black">
              <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-800">
                {(() => {
                  const correct = [...selectedWords].filter((w) =>
                    rhymingWords.includes(w)
                  ).length;
                  const total = rhymingWords.length;
                  if (correct === total) return "Perfect!";
                  if (correct > 0) return `${correct}/${total} rhymes found!`;
                  return "Let's try again!";
                })()}
              </span>
              <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Words that rhyme with {targetWord.toUpperCase()}:{" "}
              <span className="font-bold text-purple-600">
                {rhymingWords.join(", ").toUpperCase()}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
