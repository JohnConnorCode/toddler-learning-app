"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calculator, Lock, Star, Check, Play, Unlock, Zap } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { getMathUnits, type MathUnit, type MathLesson } from "@/lib/math-data";
import { useSubjectProgress } from "@/lib/framework";

export default function MathPage() {
  const { shouldReduceMotion } = useAccessibility();
  // Memoize units to prevent new array on every render
  const units = useMemo(() => getMathUnits(), []);
  const { isLessonCompleted, isUnitUnlocked, unlockUnit } = useSubjectProgress("math");
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Unlock first unit and set ready state - run only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (units[0]) {
      if (!isUnitUnlocked(units[0].id)) {
        unlockUnit(units[0].id);
      }
      setExpandedUnit(units[0].id);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unlock all units
  const handleUnlockAll = useCallback(() => {
    units.forEach((unit) => {
      if (!isUnitUnlocked(unit.id)) {
        unlockUnit(unit.id);
      }
    });
  }, [units, isUnitUnlocked, unlockUnit]);

  // Unlock a specific unit
  const handleUnlockUnit = useCallback((unitId: string) => {
    unlockUnit(unitId);
    setShowUnlockConfirm(null);
    setExpandedUnit(unitId);
  }, [unlockUnit]);

  // Check if all units are already unlocked
  const allUnitsUnlocked = useMemo(() =>
    units.every((unit) => isUnitUnlocked(unit.id)),
    [units, isUnitUnlocked]
  );

  // Show loading while initializing
  if (!isReady) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🔢
          </motion.div>
          <p className="text-gray-500 font-medium">Loading math...</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
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
              Math
            </h1>
            <p className="text-gray-500">Numbers, counting & operations</p>
          </div>
        </div>

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 mb-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calculator className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black mb-1">Learn Math!</h2>
              <p className="text-white/90">
                Master numbers, counting, addition, and subtraction with fun
                interactive lessons!
              </p>
            </div>
          </div>
          {/* Skip Ahead Button */}
          {!allUnitsUnlocked && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handleUnlockAll}
              className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-5 h-5" />
              Skip Ahead - Unlock All Levels
            </motion.button>
          )}
        </motion.div>

        {/* Units */}
        <div className="space-y-4">
          {units.map((unit, index) => {
            const isUnlocked = isUnitUnlocked(unit.id);
            const completedLessons = unit.lessons.filter((l) =>
              isLessonCompleted(l.id)
            ).length;
            const isComplete = completedLessons === unit.lessons.length;
            const isExpanded = expandedUnit === unit.id;
            const isShowingUnlock = showUnlockConfirm === unit.id;

            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Unit Header */}
                <motion.button
                  onClick={() => {
                    if (isUnlocked) {
                      setExpandedUnit(isExpanded ? null : unit.id);
                    } else {
                      // Show unlock confirmation for locked units
                      setShowUnlockConfirm(isShowingUnlock ? null : unit.id);
                    }
                  }}
                  className={`
                    w-full p-4 rounded-2xl flex items-center gap-4 transition-all
                    ${isUnlocked
                      ? "bg-white shadow-lg hover:shadow-xl cursor-pointer"
                      : "bg-gray-100 hover:bg-gray-200 cursor-pointer opacity-80"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                      ${isUnlocked ? unit.color : "bg-gray-300"}
                    `}
                  >
                    {isUnlocked ? (
                      isComplete ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <span>{unit.icon}</span>
                      )
                    ) : (
                      <Lock className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg text-gray-800">
                      {unit.title}
                    </h3>
                    <p className="text-sm text-gray-500">{unit.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${unit.color}`}
                          style={{
                            width: `${(completedLessons / unit.lessons.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {completedLessons}/{unit.lessons.length}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  {isUnlocked && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="text-gray-400"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Unlock confirmation for locked units */}
                <AnimatePresence>
                  {isShowingUnlock && !isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 overflow-hidden"
                    >
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                        <p className="text-amber-800 text-sm mb-3">
                          This level is locked. Would you like to skip ahead?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUnlockUnit(unit.id)}
                            className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                          >
                            <Unlock className="w-4 h-4" />
                            Unlock This Level
                          </button>
                          <button
                            onClick={() => setShowUnlockConfirm(null)}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lessons */}
                <AnimatePresence>
                  {isExpanded && isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 ml-4 space-y-2"
                    >
                      {unit.lessons.map((lesson, lessonIndex) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          unit={unit}
                          index={lessonIndex}
                          isCompleted={isLessonCompleted(lesson.id)}
                          shouldReduceMotion={shouldReduceMotion}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function LessonCard({
  lesson,
  unit,
  index,
  isCompleted,
  shouldReduceMotion,
}: {
  lesson: MathLesson;
  unit: MathUnit;
  index: number;
  isCompleted: boolean;
  shouldReduceMotion: boolean;
}) {
  return (
    <Link href={`/math/lesson/${lesson.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={shouldReduceMotion ? {} : { x: 4 }}
        className={`
          p-4 rounded-xl flex items-center gap-3 transition-all
          ${isCompleted
            ? "bg-green-50 border-2 border-green-200"
            : "bg-white border-2 border-gray-100 hover:border-gray-200"
          }
        `}
      >
        {/* Status Icon */}
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${isCompleted ? "bg-green-500" : unit.color}
          `}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
          <p className="text-xs text-gray-500">
            {lesson.problems.length} problems • {lesson.estimatedMinutes} min
          </p>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                isCompleted ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
