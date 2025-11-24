"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { PHONICS_UNITS, PhonicsUnit } from "@/lib/systematic-phonics-data";
import { Lock, CheckCircle, Star, ArrowLeft, BookOpen, Award, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UnitPractice } from "./UnitPractice";

export function SystematicPhonicsHub() {
  const {
    isLoaded,
    completedUnits,
    currentUnitId,
    getUnitProgress,
    isUnitUnlocked,
    getOverallProgress,
    startUnit,
  } = usePhonicsProgress();

  const [activeUnitId, setActiveUnitId] = useState<number | null>(null);

  // If a unit is active, show the unit practice
  if (activeUnitId) {
    return (
      <UnitPractice
        unitId={activeUnitId}
        onExit={() => setActiveUnitId(null)}
        onComplete={() => setActiveUnitId(null)}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Systematic Phonics
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4">
            Learn letters in the perfect order for reading success!
          </p>

          {/* Overall progress */}
          <div className="inline-flex flex-col items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Award className={cn("w-5 h-5", overallProgress === 100 ? "text-yellow-500" : "text-gray-400")} />
              <span className="font-black text-2xl text-primary">{overallProgress}%</span>
            </div>
            <span className="text-sm font-bold text-gray-600">
              {completedUnits.length} of {PHONICS_UNITS.length} units complete
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
          <h3 className="font-bold text-gray-800 mb-2">Why this order?</h3>
          <p className="text-gray-700 leading-relaxed">
            These letters are taught in a research-based sequence that lets you start reading words
            as quickly as possible! After just 4 letters, you'll be reading real words like{" "}
            <strong>sat</strong>, <strong>pat</strong>, and <strong>tap</strong>.
          </p>
        </div>
      </motion.div>

      {/* Units Grid */}
      <div className="max-w-6xl mx-auto space-y-6">
        {PHONICS_UNITS.map((unit, index) => {
          const isUnlocked = isUnitUnlocked(unit.id);
          const isCompleted = completedUnits.includes(unit.id);
          const isCurrent = currentUnitId === unit.id;
          const progress = getUnitProgress(unit.id);

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <button
                onClick={() => {
                  if (isUnlocked) {
                    startUnit(unit.id);
                    setActiveUnitId(unit.id);
                  }
                }}
                disabled={!isUnlocked}
                className={cn(
                  "w-full relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl transition-all text-left overflow-hidden",
                  isUnlocked
                    ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                )}
              >
                {/* Gradient background accent */}
                <div
                  className={cn(
                    "absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full bg-gradient-to-br",
                    unit.color
                  )}
                />

                {/* Status badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>COMPLETE</span>
                    </motion.div>
                  )}
                  {isCurrent && !isCompleted && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-black">
                      CURRENT
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>

                {/* Unit number badge */}
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br text-white font-black text-2xl",
                    unit.color
                  )}
                >
                  {unit.id}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                    {unit.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg mb-4">{unit.description}</p>

                  {/* Letters preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm font-bold text-gray-500">Letters:</span>
                    {unit.letters.map((letter) => (
                      <span
                        key={letter}
                        className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg font-black text-gray-700"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>

                  {/* Blendable words preview */}
                  <div className="mb-4">
                    <span className="text-sm font-bold text-gray-500 block mb-2">
                      Words you'll read:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {unit.blendableWords.slice(0, 8).map((word) => (
                        <span
                          key={word}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold"
                        >
                          {word}
                        </span>
                      ))}
                      {unit.blendableWords.length > 8 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
                          +{unit.blendableWords.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar (if started) */}
                  {progress && progress.lettersCompleted > 0 && !isCompleted && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>
                          {progress.lettersCompleted} / {progress.totalLetters} letters
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(progress.lettersCompleted / progress.totalLetters) * 100}%`,
                          }}
                          className={cn("h-full rounded-full bg-gradient-to-r", unit.color)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action hint */}
                  {isUnlocked && (
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                      <Play className="w-4 h-4" />
                      <span>{isCompleted ? "Practice Again" : "Start Unit"}</span>
                    </div>
                  )}

                  {!isUnlocked && unit.prerequisites.length > 0 && (
                    <div className="text-sm text-gray-500 italic">
                      Complete Unit {unit.prerequisites.join(", ")} to unlock
                    </div>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {overallProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center text-white shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
          >
            <Star className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black mb-2">
            Congratulations! All Units Complete!
          </h2>
          <p className="text-lg sm:text-xl mb-4">
            You've mastered all 26 letters! Ready to blend and read more complex words?
          </p>
          <Link
            href="/words"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-full font-black text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Start Blending Words
          </Link>
        </motion.div>
      )}
    </div>
  );
}
