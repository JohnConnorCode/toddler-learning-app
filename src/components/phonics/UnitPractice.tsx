"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { getPhonicsItemsForUnit, getUnitById } from "@/lib/systematic-phonics-data";
import { LetterCard } from "@/components/game/LetterCard";
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnitPracticeProps {
  unitId: number;
  onExit: () => void;
  onComplete: () => void;
}

export function UnitPractice({ unitId, onExit, onComplete }: UnitPracticeProps) {
  const {
    markLetterPracticed,
    updateUnitLetterCompletion,
    completeUnit,
    getUnitProgress,
  } = usePhonicsProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const unit = getUnitById(unitId);
  const phonicsItems = getPhonicsItemsForUnit(unitId);
  const currentItem = phonicsItems[currentIndex];
  const unitProgress = getUnitProgress(unitId);

  useEffect(() => {
    // Mark current letter as practiced when it's viewed
    if (currentItem) {
      markLetterPracticed(currentItem.letter);
      updateUnitLetterCompletion(unitId);
    }
  }, [currentIndex, currentItem, markLetterPracticed, updateUnitLetterCompletion, unitId]);

  if (!unit || phonicsItems.length === 0) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-gray-600 font-bold">Unit not found</p>
          <button
            onClick={onExit}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const nextLetter = () => {
    if (currentIndex < phonicsItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All letters completed - show completion screen
      setShowCompletion(true);
    }
  };

  const prevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishUnit = () => {
    // Mark unit as completed with 100% score (practice mode doesn't have mastery check yet)
    completeUnit(unitId, 100);
    onComplete();
  };

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6"
          >
            <Award className="w-14 h-14 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-4">
            Unit {unit.id} Complete!
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            You practiced all {phonicsItems.length} letters in this unit!
          </p>

          {/* Letters reviewed */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Letters Learned:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {phonicsItems.map((item) => (
                <div
                  key={item.letter}
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg",
                    item.color
                  )}
                >
                  {item.letter}
                </div>
              ))}
            </div>
          </div>

          {/* Blendable words preview */}
          {unit.blendableWords.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Words You Can Read Now:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {unit.blendableWords.slice(0, 12).map((word) => (
                  <span
                    key={word}
                    className="px-4 py-2 bg-white text-purple-700 rounded-full text-sm font-bold shadow"
                  >
                    {word}
                  </span>
                ))}
                {unit.blendableWords.length > 12 && (
                  <span className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-bold shadow">
                    +{unit.blendableWords.length - 12} more!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-black text-lg hover:bg-gray-300 transition-colors"
            >
              Practice Again
            </button>
            <button
              onClick={handleFinishUnit}
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Continue to Next Unit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
        <button
          onClick={onExit}
          className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>

        {/* Unit info & progress */}
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm font-bold text-gray-500 mb-1">
            Unit {unit.id}: {unit.title}
          </span>
          <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
            <span className="font-bold text-primary text-base sm:text-lg">
              {currentIndex + 1} / {phonicsItems.length}
            </span>
          </div>
        </div>

        <div className="w-10 sm:w-12" /> {/* Spacer */}
      </header>

      {/* Progress bar */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="max-w-4xl mx-auto w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / phonicsItems.length) * 100}%` }}
            className={cn("h-full bg-gradient-to-r", unit.color)}
          />
        </div>
      </div>

      {/* Main Card Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -300, opacity: 0, rotate: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <LetterCard
              item={currentItem}
              onComplete={() => {
                // Auto-advance after card is flipped
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center gap-6 sm:gap-8 mt-6 sm:mt-8 md:mt-12">
          <button
            onClick={prevLetter}
            disabled={currentIndex === 0}
            className="p-3 sm:p-4 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
          </button>

          <button
            onClick={nextLetter}
            className={cn(
              "p-4 sm:p-5 md:p-6 rounded-full shadow-lg hover:shadow-xl active:scale-90 transition-all",
              currentIndex === phonicsItems.length - 1
                ? "bg-green-500"
                : "bg-secondary"
            )}
          >
            {currentIndex === phonicsItems.length - 1 ? (
              <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
            ) : (
              <ChevronRight className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
