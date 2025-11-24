"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { useSettings } from "@/hooks/use-settings";
import { SoundBlendingGame } from "./SoundBlendingGame";
import { WordSegmentingGame } from "./WordSegmentingGame";
import { Combine, Scissors, ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ActivityType = "blending" | "segmenting" | null;

interface ActivityProgress {
  blending: number | null;
  segmenting: number | null;
}

export function BlendingHub() {
  const { completedUnits, isLoaded } = usePhonicsProgress();
  const { lockProgression } = useSettings();
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(null);
  const [progress, setProgress] = useState<ActivityProgress>({
    blending: null,
    segmenting: null,
  });

  const handleActivityComplete = (activity: ActivityType, score: number) => {
    setProgress((prev) => ({
      ...prev,
      [activity!]: score,
    }));
    setCurrentActivity(null);
  };

  // Only check prerequisites if lockProgression is enabled
  const hasCompletedUnits = lockProgression ? completedUnits.length > 0 : true;

  // If activity is active, show that activity
  if (currentActivity === "blending") {
    return (
      <SoundBlendingGame
        completedUnits={completedUnits}
        onComplete={(score) => handleActivityComplete("blending", score)}
        onExit={() => setCurrentActivity(null)}
      />
    );
  }

  if (currentActivity === "segmenting") {
    return (
      <WordSegmentingGame
        completedUnits={completedUnits}
        onComplete={(score) => handleActivityComplete("segmenting", score)}
        onExit={() => setCurrentActivity(null)}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Activity menu
  const activities = [
    {
      id: "blending" as const,
      title: "Sound Blending",
      description: "Put sounds together to make words",
      icon: Combine,
      color: "from-green-400 to-blue-500",
      score: progress.blending,
      example: "/s/ + /a/ + /t/ = sat",
    },
    {
      id: "segmenting" as const,
      title: "Word Segmenting",
      description: "Break words into individual sounds",
      icon: Scissors,
      color: "from-orange-400 to-pink-500",
      score: progress.segmenting,
      example: "cat = /c/ + /a/ + /t/",
    },
  ];

  const completedCount = Object.values(progress).filter((score) => score !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4"
          >
            <Combine className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Blending & Segmenting
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4">
            Learn to blend sounds and break words apart!
          </p>

          {/* Progress indicator */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
            <CheckCircle
              className={cn(
                "w-5 h-5",
                completedCount === activities.length ? "text-green-600" : "text-gray-400"
              )}
            />
            <span className="font-bold text-gray-700">
              {completedCount} of {activities.length} completed
            </span>
          </div>
        </motion.div>
      </div>

      {/* Prerequisites check */}
      {!hasCompletedUnits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-yellow-50 rounded-2xl p-6 border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Complete Phonics First!</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These activities use the letters you've learned in phonics. Complete at least
                  Unit 1 in Systematic Phonics to unlock blending practice.
                </p>
                <Link
                  href="/phonics"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Go to Phonics
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      {hasCompletedUnits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-800 mb-2">The Heart of Reading!</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Blending</strong> is putting sounds together to read words.{" "}
              <strong>Segmenting</strong> is breaking words apart into sounds. These are the most
              important skills for learning to read!
            </p>
          </div>
        </motion.div>
      )}

      {/* Activities Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isCompleted = activity.score !== null;
          const isLocked = !hasCompletedUnits;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <button
                onClick={() => {
                  if (!isLocked) {
                    setCurrentActivity(activity.id);
                  }
                }}
                disabled={isLocked}
                className={cn(
                  "w-full relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl transition-all text-left overflow-hidden",
                  isLocked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                )}
              >
                {/* Gradient background accent */}
                <div
                  className={cn(
                    "absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full bg-gradient-to-br",
                    activity.color
                  )}
                />

                {/* Completed badge */}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>{activity.score}%</span>
                  </motion.div>
                )}

                {/* Locked badge */}
                {isLocked && (
                  <div className="absolute top-4 right-4 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>LOCKED</span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br",
                    activity.color
                  )}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2 relative">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-base sm:text-lg mb-4">{activity.description}</p>

                {/* Example */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Example:</p>
                  <p className="text-lg font-black text-gray-700">{activity.example}</p>
                </div>

                {/* Action hint */}
                {!isLocked && (
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                    <span>{isCompleted ? "Practice Again" : "Start Activity"}</span>
                    <span>→</span>
                  </div>
                )}

                {isLocked && (
                  <div className="text-sm text-gray-500 italic">
                    Complete Phonics Unit 1 to unlock
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Completion message */}
      {completedCount === activities.length && hasCompletedUnits && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-2">Amazing Work!</h2>
          <p className="text-lg sm:text-xl mb-4">
            You've mastered blending and segmenting! You're ready to read decodable stories!
          </p>
          <Link
            href="/words"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-full font-black text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Practice Reading Words
          </Link>
        </motion.div>
      )}
    </div>
  );
}
