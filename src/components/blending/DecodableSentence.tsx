"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeech } from "@/hooks/use-speech";
import { triggerConfetti } from "@/lib/confetti";
import { Volume2, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

interface DecodableSentenceProps {
  sentence: string;
  image?: string;
  onComplete?: (smoothnessScore: number) => void;
  showImage?: boolean;
}

export function DecodableSentence({
  sentence,
  image,
  onComplete,
  showImage = true
}: DecodableSentenceProps) {
  const words = sentence.trim().split(" ");

  const [clickedWords, setClickedWords] = useState<Set<number>>(new Set());
  const [hasStartedReading, setHasStartedReading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wasIndependent, setWasIndependent] = useState(false);

  const { speak } = useSpeech();

  useEffect(() => {
    // Reset state when sentence changes
    setClickedWords(new Set());
    setHasStartedReading(false);
    setIsComplete(false);
    setWasIndependent(false);
  }, [sentence]);

  const handleWordClick = (index: number, word: string) => {
    if (isComplete) return;

    setHasStartedReading(true);
    setClickedWords(new Set(clickedWords).add(index));
    speak(word);
  };

  const handleFinishReading = () => {
    if (isComplete) return;

    setIsComplete(true);

    // Check if they read independently (didn't click any words for help)
    const independent = clickedWords.size === 0;
    setWasIndependent(independent);

    // Calculate smoothness score based on independence
    // 100% independent = 1.0, each word clicked reduces score
    const wordsClicked = clickedWords.size;
    const totalWords = words.length;
    const smoothnessScore = Math.max(0.5, 1.0 - (wordsClicked / totalWords) * 0.5);

    if (independent) {
      triggerConfetti();
    }

    // Play the full sentence
    setTimeout(() => {
      speak(sentence);
    }, independent ? 500 : 300);

    // Call completion callback with smoothness score
    if (onComplete) {
      setTimeout(() => onComplete(smoothnessScore), 3000);
    }
  };

  const handleHearSentence = () => {
    speak(sentence);
  };

  const getWordFeedbackColor = (index: number) => {
    if (!hasStartedReading) return "text-gray-700";
    if (clickedWords.has(index)) return "text-blue-600";
    return "text-gray-700";
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
            Can you read this sentence?
          </h3>
          <p className="text-lg text-gray-500">
            Tap words if you need help, or press "Done" when you've read it!
          </p>
        </motion.div>
      )}

      {/* Image (if provided) */}
      {showImage && image && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 sm:w-48 sm:h-48 bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-gray-200"
        >
          <img
            src={image}
            alt="Sentence illustration"
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Sentence Display */}
      {!isComplete && (
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border-4 border-gray-200 w-full max-w-2xl">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            {words.map((word, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleWordClick(index, word)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-black text-3xl sm:text-4xl md:text-5xl transition-all ${getWordFeedbackColor(
                  index
                )}`}
              >
                {word}

                {/* Click indicator */}
                {clickedWords.has(index) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Underline effect on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-current rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isComplete && (
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={handleHearSentence}
            className="flex items-center gap-2 px-5 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
          >
            <Volume2 className="w-5 h-5" />
            Hear Sentence
          </button>

          <button
            onClick={handleFinishReading}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg animate-pulse"
          >
            <CheckCircle className="w-5 h-5" />
            Done Reading!
            <ArrowRight className="w-5 h-5" />
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
            className="text-center space-y-4 w-full"
          >
            <div
              className={`border-2 rounded-2xl px-6 sm:px-8 py-6 ${
                wasIndependent
                  ? "bg-green-100 border-green-400"
                  : "bg-blue-100 border-blue-400"
              }`}
            >
              <div
                className={`flex items-center justify-center gap-3 font-black text-2xl sm:text-3xl mb-3 ${
                  wasIndependent ? "text-green-700" : "text-blue-700"
                }`}
              >
                {wasIndependent && (
                  <>
                    <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                    <span>Incredible!</span>
                    <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                  </>
                )}
                {!wasIndependent && (
                  <>
                    <CheckCircle className="w-8 h-8" />
                    <span>Great Job!</span>
                  </>
                )}
              </div>

              <p
                className={`text-xl font-bold mb-2 ${
                  wasIndependent ? "text-green-600" : "text-blue-600"
                }`}
              >
                {wasIndependent
                  ? "You read that all by yourself! 🌟"
                  : "You finished the sentence!"}
              </p>

              <div className="bg-white/50 rounded-xl p-4 mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-700 italic">
                  "{sentence}"
                </p>
              </div>

              {wasIndependent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg shadow-lg"
                >
                  <span className="text-2xl">🏆</span>
                  <span>Independent Reader!</span>
                  <span className="text-2xl">🏆</span>
                </motion.div>
              )}

              {!wasIndependent && (
                <p className="text-gray-600 mt-3">
                  {clickedWords.size === 0
                    ? "Next time, try reading it on your own!"
                    : `You used help on ${clickedWords.size} word${
                        clickedWords.size > 1 ? "s" : ""
                      }. That's okay!`}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Metrics Display */}
      {hasStartedReading && !isComplete && clickedWords.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 text-center"
        >
          <p>
            Words you listened to: {clickedWords.size} / {words.length}
          </p>
          {clickedWords.size === 0 && (
            <p className="text-green-600 font-semibold mt-1">
              Reading independently! ⭐
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
