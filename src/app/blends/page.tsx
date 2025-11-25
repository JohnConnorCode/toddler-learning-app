"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, BookOpen, Filter } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import {
  BLENDS,
  getWordsByBlend,
  getInitialBlends,
  getFinalBlends,
  BlendItem,
} from "@/lib/blends-data";
import { PhonicsActivityCard } from "@/components/phonics/PhonicsActivityCard";

type FilterType = "all" | "l-blend" | "r-blend" | "s-blend" | "final-blend";

export default function BlendsPage() {
  const { shouldReduceMotion } = useAccessibility();
  const [selectedBlend, setSelectedBlend] = useState<BlendItem | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredBlends =
    filter === "all" ? BLENDS : BLENDS.filter((b) => b.category === filter);

  const handleSelectBlend = (blend: BlendItem) => {
    setSelectedBlend(blend);
    setCurrentWordIndex(0);
  };

  const handlePlaySound = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Blend practice view
  if (selectedBlend) {
    const words = getWordsByBlend(selectedBlend.id).slice(0, 10);
    const currentWord = words[currentWordIndex];

    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => setSelectedBlend(null)}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
                The "{selectedBlend.blend}" Blend
              </h1>
              <p className="text-gray-500">{selectedBlend.description}</p>
            </div>
          </div>

          {/* Main Practice Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6"
          >
            {/* Blend Display */}
            <div className="text-center mb-8">
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`${selectedBlend.color} w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <span className="text-white text-5xl sm:text-6xl font-black">
                  {selectedBlend.blend}
                </span>
              </motion.div>
              <p className="text-gray-600 mb-2">
                {selectedBlend.type === "initial"
                  ? "This blend comes at the START of words"
                  : "This blend comes at the END of words"}
              </p>
              <button
                onClick={() => handlePlaySound(selectedBlend.blend)}
                className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-700">Hear the blend</span>
              </button>
            </div>

            {/* Current Word */}
            {currentWord && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Word {currentWordIndex + 1} of {words.length}
                </p>
                <motion.div
                  key={currentWord.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded-2xl p-6 mb-4"
                >
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-800 mb-2">
                    {currentWord.word.split("").map((letter, i) => {
                      const wordLower = currentWord.word.toLowerCase();
                      const blendLower = selectedBlend.blend.toLowerCase();
                      const blendStart =
                        selectedBlend.type === "initial"
                          ? 0
                          : wordLower.lastIndexOf(blendLower);
                      const isInBlend =
                        blendStart !== -1 &&
                        i >= blendStart &&
                        i < blendStart + blendLower.length;

                      return (
                        <span
                          key={i}
                          className={isInBlend ? "text-green-500" : "text-gray-800"}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </h2>
                  <button
                    onClick={() => handlePlaySound(currentWord.word)}
                    className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-700">Hear word</span>
                  </button>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                    disabled={currentWordIndex === 0}
                    className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentWordIndex(Math.min(words.length - 1, currentWordIndex + 1))
                    }
                    disabled={currentWordIndex === words.length - 1}
                    className="px-6 py-3 bg-green-500 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                  >
                    Next Word
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Word List */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="font-bold text-gray-700 mb-3">
              All {selectedBlend.blend} words:
            </h3>
            <div className="flex flex-wrap gap-2">
              {words.map((word, index) => (
                <button
                  key={word.id}
                  onClick={() => setCurrentWordIndex(index)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    index === currentWordIndex
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {word.word}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main blends selection view
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800">
              Consonant Blends
            </h1>
            <p className="text-gray-500">Two consonants that blend together!</p>
          </div>
        </div>

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-6 mb-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black mb-1">What are Blends?</h2>
              <p className="text-white/90">
                Blends are two consonants that work together, but you can still hear
                each sound. Like "bl" in "blue" - you hear both the "b" and "l"!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-bold text-gray-600 flex items-center gap-1">
            <Filter className="w-4 h-4" />
            Filter:
          </span>
          {(
            [
              { value: "all", label: "All" },
              { value: "l-blend", label: "L-Blends" },
              { value: "r-blend", label: "R-Blends" },
              { value: "s-blend", label: "S-Blends" },
              { value: "final-blend", label: "Final Blends" },
            ] as { value: FilterType; label: string }[]
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f.value
                  ? "bg-green-500 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Blend Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBlends.map((blend, index) => (
            <PhonicsActivityCard
              key={blend.id}
              id={blend.id}
              pattern={blend.blend}
              description={blend.description}
              exampleWord={blend.exampleWord}
              color={blend.color}
              index={index}
              onClick={() => handleSelectBlend(blend)}
              onPlaySound={() => handlePlaySound(blend.blend)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
