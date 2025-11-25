"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, BookOpen, Pencil, Ear, Music } from "lucide-react";
import { BlendingPractice } from "@/components/game/BlendingPractice";
import { LetterTracing } from "@/components/game/LetterTracing";
import { WordRecognition } from "@/components/game/WordRecognition";
import { RhymingPractice } from "@/components/game/RhymingPractice";
import { WORDS_DATA as WORDS, WordItem } from "@/lib/words-data";
import { cn } from "@/lib/utils";

type ActivityType = "blending" | "tracing" | "recognition" | "rhyming" | null;

// Get simple CVC words for practice
const PRACTICE_WORDS = WORDS.filter(
  (w) => w.difficulty === 1 && w.letters.length === 3
);

// Word families for rhyming
const WORD_FAMILIES = {
  cat: { rhymes: ["bat", "hat", "rat", "mat"], nonRhymes: ["dog", "sun", "bed", "cup"] },
  dog: { rhymes: ["log", "fog", "hog", "jog"], nonRhymes: ["cat", "pen", "sun", "box"] },
  sun: { rhymes: ["bun", "fun", "run", "gun"], nonRhymes: ["cat", "dog", "bed", "pig"] },
  bed: { rhymes: ["red", "fed", "led", "wed"], nonRhymes: ["cat", "sun", "dog", "cup"] },
  pig: { rhymes: ["big", "dig", "fig", "wig"], nonRhymes: ["cat", "dog", "sun", "bed"] },
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function PracticePage() {
  const [activeActivity, setActiveActivity] = useState<ActivityType>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentRhymeFamily, setCurrentRhymeFamily] = useState<keyof typeof WORD_FAMILIES>("cat");

  const currentWord = PRACTICE_WORDS[currentWordIndex] || PRACTICE_WORDS[0];
  const currentLetter = LETTERS[currentLetterIndex];

  const handleBlendingComplete = () => {
    // Move to next word
    setCurrentWordIndex((prev) => (prev + 1) % PRACTICE_WORDS.length);
  };

  const handleTracingComplete = () => {
    // Move to next letter
    setCurrentLetterIndex((prev) => (prev + 1) % LETTERS.length);
  };

  const handleRecognitionComplete = () => {
    setCurrentWordIndex((prev) => (prev + 1) % PRACTICE_WORDS.length);
  };

  const handleRhymingComplete = () => {
    // Cycle through word families
    const families = Object.keys(WORD_FAMILIES) as (keyof typeof WORD_FAMILIES)[];
    const currentIdx = families.indexOf(currentRhymeFamily);
    setCurrentRhymeFamily(families[(currentIdx + 1) % families.length]);
  };

  // Get distractors for word recognition
  const getDistractors = (target: WordItem): WordItem[] => {
    return PRACTICE_WORDS.filter((w) => w.word !== target.word).slice(0, 3);
  };

  const activities = [
    {
      id: "blending" as const,
      title: "Sound It Out",
      description: "Learn to blend letter sounds",
      icon: Ear,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
    },
    {
      id: "tracing" as const,
      title: "Letter Tracing",
      description: "Practice writing letters",
      icon: Pencil,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
    },
    {
      id: "recognition" as const,
      title: "Word Match",
      description: "Match pictures to words",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-100",
    },
    {
      id: "rhyming" as const,
      title: "Rhyming Words",
      description: "Find words that rhyme",
      icon: Music,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {activeActivity ? (
            <button
              onClick={() => setActiveActivity(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-bold">Back</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-bold">Home</span>
            </Link>
          )}

          <h1 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Practice
          </h1>

          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {!activeActivity ? (
            /* Activity Selection */
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                  Choose an Activity
                </h2>
                <p className="text-gray-600">
                  Practice reading and writing skills
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map((activity, index) => (
                  <motion.button
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveActivity(activity.id)}
                    className="bg-white rounded-3xl p-6 shadow-xl text-left hover:shadow-2xl transition-shadow"
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                        activity.bgColor
                      )}
                    >
                      <activity.icon className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                    <div
                      className={cn(
                        "mt-4 h-1 rounded-full bg-gradient-to-r",
                        activity.color
                      )}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Active Activity */
            <motion.div
              key={activeActivity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl min-h-[500px]"
            >
              {activeActivity === "blending" && currentWord && (
                <BlendingPractice
                  word={currentWord.word}
                  letters={currentWord.letters}
                  image={currentWord.image}
                  onComplete={handleBlendingComplete}
                />
              )}

              {activeActivity === "tracing" && (
                <LetterTracing
                  letter={currentLetter}
                  onComplete={handleTracingComplete}
                />
              )}

              {activeActivity === "recognition" && currentWord && (
                <WordRecognition
                  targetWord={currentWord}
                  distractorWords={getDistractors(currentWord)}
                  onComplete={handleRecognitionComplete}
                  mode="image-to-word"
                />
              )}

              {activeActivity === "rhyming" && (
                <RhymingPractice
                  targetWord={currentRhymeFamily}
                  rhymingWords={WORD_FAMILIES[currentRhymeFamily].rhymes}
                  nonRhymingWords={WORD_FAMILIES[currentRhymeFamily].nonRhymes}
                  onComplete={handleRhymingComplete}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
