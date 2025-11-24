"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TapToBlend } from "@/components/blending/TapToBlend";
import { SoundSegmenting } from "@/components/blending/SoundSegmenting";
import { BlendingSlider } from "@/components/blending/BlendingSlider";
import { DecodableSentence } from "@/components/blending/DecodableSentence";
import { getRandomSentence } from "@/lib/decodable-sentences-data";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import Link from "next/link";
import { ArrowLeft, Zap, MousePointer, SlidersHorizontal, BookOpen, CheckCircle, Lock } from "lucide-react";

type ActivityType = "tap" | "segment" | "slider" | "sentence" | null;

export default function BlendingActivitiesPage() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(null);
  const [currentWord, setCurrentWord] = useState("cat");
  const { getOverallProgress, state } = usePhonicsProgress();

  const progress = getOverallProgress();
  const completedUnits = state.completedUnits;
  const maxUnit = Math.max(...completedUnits, 1);

  // Check if activities are unlocked
  const hasCompletedUnits = completedUnits.length > 0;

  const activities = [
    {
      id: "tap" as ActivityType,
      title: "Tap to Blend",
      description: "Tap letters quickly to snap blocks together!",
      icon: MousePointer,
      color: "from-blue-400 to-cyan-500",
      difficulty: 1,
      unlocked: hasCompletedUnits,
    },
    {
      id: "segment" as ActivityType,
      title: "Sound Builder",
      description: "Drag blocks to build words sound by sound",
      icon: Zap,
      color: "from-purple-400 to-pink-500",
      difficulty: 1,
      unlocked: hasCompletedUnits,
    },
    {
      id: "slider" as ActivityType,
      title: "Blending Slider",
      description: "Drag the knob smoothly across all letters",
      icon: SlidersHorizontal,
      color: "from-green-400 to-emerald-500",
      difficulty: 2,
      unlocked: hasCompletedUnits,
    },
    {
      id: "sentence" as ActivityType,
      title: "Read Sentences",
      description: "Read real sentences using known sounds!",
      icon: BookOpen,
      color: "from-orange-400 to-red-500",
      difficulty: 2,
      unlocked: completedUnits.length >= 2,
    },
  ];

  const handleActivitySelect = (activity: ActivityType) => {
    setCurrentActivity(activity);
    // Generate a new word/sentence when starting activity
    if (activity === "sentence") {
      const sentence = getRandomSentence(maxUnit);
      if (sentence) {
        setCurrentWord(sentence.sentence);
      }
    } else {
      // For now, use a simple word - later this will use word scheduler
      setCurrentWord("cat");
    }
  };

  const handleActivityComplete = (score?: number | boolean) => {
    console.log("Activity complete with score:", score);
    // Return to hub after short delay
    setTimeout(() => {
      setCurrentActivity(null);
    }, 2000);
  };

  const handleBackToHub = () => {
    setCurrentActivity(null);
  };

  if (currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        {/* Header */}
        <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
          <button
            onClick={handleBackToHub}
            className="flex items-center gap-2 bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <span className="text-sm font-semibold text-gray-600 hidden sm:inline">
              Back
            </span>
          </button>

          <div className="bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="font-bold text-purple-600 text-base sm:text-lg">
              {activities.find(a => a.id === currentActivity)?.title}
            </span>
          </div>

          <div className="w-20" />
        </header>

        {/* Activity Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {currentActivity === "tap" && (
              <motion.div
                key="tap"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <TapToBlend
                  word={currentWord}
                  onComplete={handleActivityComplete}
                />
              </motion.div>
            )}

            {currentActivity === "segment" && (
              <motion.div
                key="segment"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <SoundSegmenting
                  word={currentWord}
                  onComplete={handleActivityComplete}
                />
              </motion.div>
            )}

            {currentActivity === "slider" && (
              <motion.div
                key="slider"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <BlendingSlider
                  word={currentWord}
                  onComplete={handleActivityComplete}
                />
              </motion.div>
            )}

            {currentActivity === "sentence" && (
              <motion.div
                key="sentence"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <DecodableSentence
                  sentence={currentWord}
                  onComplete={handleActivityComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Hub View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
        <Link href="/">
          <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </div>
        </Link>

        <div className="bg-white px-4 py-2 rounded-full shadow-sm">
          <span className="font-bold text-purple-600 text-base sm:text-lg">
            Blending Practice
          </span>
        </div>

        <div className="w-10 sm:w-12" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-2">
            Blending Activities
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Practice connecting sounds to make words!
          </p>

          {!hasCompletedUnits && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 bg-orange-100 border-2 border-orange-300 rounded-xl px-6 py-3 inline-block"
            >
              <p className="text-orange-800 font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Complete Unit 1 in Phonics first!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const isUnlocked = activity.unlocked;

            return (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => isUnlocked && handleActivitySelect(activity.id)}
                disabled={!isUnlocked}
                whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                className={`relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-b-6 sm:border-b-8 transition-all ${
                  isUnlocked
                    ? "border-gray-200 hover:shadow-2xl cursor-pointer"
                    : "border-gray-100 opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-10 rounded-2xl sm:rounded-3xl`}
                />

                {/* Lock Icon */}
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                {/* Content */}
                <div className="relative flex flex-col items-center text-center gap-4">
                  <div
                    className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${activity.color} shadow-lg`}
                  >
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {activity.description}
                    </p>
                  </div>

                  {/* Difficulty Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: activity.difficulty }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Progress Info */}
        {hasCompletedUnits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg px-6 py-4 max-w-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-semibold">
                Phonics Progress:
              </span>
              <span className="text-purple-600 font-black text-lg">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {completedUnits.length} unit{completedUnits.length !== 1 ? "s" : ""} completed
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
