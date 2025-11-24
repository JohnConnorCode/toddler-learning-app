"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SoundMatchingGame } from "./SoundMatchingGame";
import { RhymeTime } from "./RhymeTime";
import { FirstSoundGame } from "./FirstSoundGame";
import { SoundCounter } from "./SoundCounter";
import { Volume2, Music, Ear, Hash, ArrowLeft, CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ActivityType = "sound-matching" | "rhyme-time" | "first-sound" | "sound-counting" | null;

interface ActivityProgress {
  soundMatching: number | null;
  rhymeTime: number | null;
  firstSound: number | null;
  soundCounting: number | null;
}

export function PreReadingHub() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(null);
  const [progress, setProgress] = useState<ActivityProgress>({
    soundMatching: null,
    rhymeTime: null,
    firstSound: null,
    soundCounting: null,
  });

  const handleActivityComplete = (activity: ActivityType, score: number) => {
    setProgress((prev) => {
      switch (activity) {
        case "sound-matching":
          return { ...prev, soundMatching: score };
        case "rhyme-time":
          return { ...prev, rhymeTime: score };
        case "first-sound":
          return { ...prev, firstSound: score };
        case "sound-counting":
          return { ...prev, soundCounting: score };
        default:
          return prev;
      }
    });
    setCurrentActivity(null);
  };

  // If activity is active, show that activity
  if (currentActivity === "sound-matching") {
    return (
      <SoundMatchingGame
        onComplete={(score) => handleActivityComplete("sound-matching", score)}
        onExit={() => setCurrentActivity(null)}
      />
    );
  }

  if (currentActivity === "rhyme-time") {
    return (
      <RhymeTime
        onComplete={(score) => handleActivityComplete("rhyme-time", score)}
        onExit={() => setCurrentActivity(null)}
      />
    );
  }

  if (currentActivity === "first-sound") {
    return (
      <FirstSoundGame
        onComplete={(score) => handleActivityComplete("first-sound", score)}
        onExit={() => setCurrentActivity(null)}
      />
    );
  }

  if (currentActivity === "sound-counting") {
    return (
      <SoundCounter
        onComplete={(score) => handleActivityComplete("sound-counting", score)}
        onExit={() => setCurrentActivity(null)}
      />
    );
  }

  // Activity menu
  const activities = [
    {
      id: "sound-matching" as const,
      title: "Sound Matching",
      description: "Find things that start with the same sound",
      icon: Volume2,
      color: "from-blue-400 to-purple-500",
      score: progress.soundMatching,
    },
    {
      id: "rhyme-time" as const,
      title: "Rhyme Time",
      description: "Do these words rhyme?",
      icon: Music,
      color: "from-pink-400 to-purple-500",
      score: progress.rhymeTime,
    },
    {
      id: "first-sound" as const,
      title: "First Sound",
      description: "What sound do you hear first?",
      icon: Ear,
      color: "from-green-400 to-blue-500",
      score: progress.firstSound,
    },
    {
      id: "sound-counting" as const,
      title: "Sound Counter",
      description: "How many sounds in this word?",
      icon: Hash,
      color: "from-orange-400 to-pink-500",
      score: progress.soundCounting,
    },
  ];

  const completedCount = Object.values(progress).filter((score) => score !== null).length;
  const totalActivities = activities.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4"
          >
            <Star className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Pre-Reading Skills
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4">
            Building blocks for reading success!
          </p>

          {/* Progress indicator */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
            <CheckCircle
              className={cn(
                "w-5 h-5",
                completedCount === totalActivities ? "text-green-600" : "text-gray-400"
              )}
            />
            <span className="font-bold text-gray-700">
              {completedCount} of {totalActivities} completed
            </span>
          </div>
        </motion.div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-800 mb-2">What are pre-reading skills?</h3>
          <p className="text-gray-700 leading-relaxed">
            These activities focus on <strong>hearing sounds</strong>, not recognizing letters.
            This is an important foundation for learning to read! Children learn to identify,
            compare, and manipulate sounds in spoken words.
          </p>
        </div>
      </motion.div>

      {/* Activities Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isCompleted = activity.score !== null;

          return (
            <motion.button
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentActivity(activity.id)}
              className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden"
            >
              {/* Gradient background accent */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full bg-gradient-to-br",
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
              <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                {activity.title}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg">{activity.description}</p>

              {/* Action hint */}
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500">
                <span>{isCompleted ? "Play Again" : "Start Activity"}</span>
                <span>→</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Completion message */}
      {completedCount === totalActivities && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-8 text-center text-white shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
          >
            <Star className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black mb-2">All Activities Complete!</h2>
          <p className="text-lg sm:text-xl mb-4">
            You've mastered pre-reading skills! Ready for the next challenge?
          </p>
          <Link
            href="/phonics"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-full font-black text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Start Learning Phonics
          </Link>
        </motion.div>
      )}
    </div>
  );
}
