"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createAutoFlowSession,
  createMenuModeSession,
  getNextStep,
  advanceStep,
  getSessionProgress,
  isSessionComplete,
  getRecommendedMode,
  saveSession,
  loadSession,
  clearSession,
  getActivityName,
  getActivityIcon,
  type SessionPlan,
  type SessionMode,
  type ActivityType,
} from "@/lib/session-flow";
import { getSessionWords } from "@/lib/word-scheduler";
import { getAllBlendingWordStrings } from "@/lib/blending-words-data";
import { getRandomSentence } from "@/lib/decodable-sentences-data";
import { TapToBlend } from "@/components/blending/TapToBlend";
import { SoundSegmenting } from "@/components/blending/SoundSegmenting";
import { BlendingSlider } from "@/components/blending/BlendingSlider";
import { DecodableSentence } from "@/components/blending/DecodableSentence";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { recordReview, getOverallBlendingStats } from "@/lib/word-scheduler";
import {
  Play,
  List,
  ArrowRight,
  CheckCircle,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface SessionFlowProps {
  onExit: () => void;
}

export function SessionFlow({ onExit }: SessionFlowProps) {
  const { state } = usePhonicsProgress();
  const completedUnits = state.completedUnits;
  const maxUnit = completedUnits.length > 0 ? Math.max(...completedUnits) : 1;

  const [session, setSession] = useState<SessionPlan | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(
    null
  );
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Get stats for mode recommendation
  const stats = getOverallBlendingStats(maxUnit);
  const recommendedMode = getRecommendedMode(
    completedUnits,
    stats.totalReviews
  );

  useEffect(() => {
    // Try to load existing session
    const saved = loadSession();
    if (saved && saved.currentUnit === maxUnit) {
      setSession(saved);
      setShowModeSelection(false);
      loadNextActivity(saved);
    }
  }, []);

  const handleModeSelect = (mode: SessionMode) => {
    const availableWords = getAllBlendingWordStrings(maxUnit);
    const sessionWords = getSessionWords(availableWords, maxUnit, 10);

    const newSession =
      mode === "auto"
        ? createAutoFlowSession(maxUnit, sessionWords)
        : createMenuModeSession(maxUnit);

    setSession(newSession);
    saveSession(newSession);
    setShowModeSelection(false);

    if (mode === "auto") {
      loadNextActivity(newSession);
    }
  };

  const loadNextActivity = (currentSession: SessionPlan) => {
    if (currentSession.mode === "menu") {
      setCurrentActivity(null);
      return;
    }

    const nextStep = getNextStep(currentSession);
    if (!nextStep) {
      // Session complete
      handleSessionComplete();
      return;
    }

    setCurrentActivity(nextStep.activityType);

    if (nextStep.activityType === "sentence") {
      const sentence = getRandomSentence(maxUnit);
      setCurrentSentence(sentence?.sentence || "");
    } else {
      setCurrentWord(nextStep.word || "cat");
    }
  };

  const handleActivityComplete = (score?: number) => {
    if (!session) return;

    // Record review for all activities with smoothness scores
    if (typeof score === "number") {
      // For word activities, record with the word
      // For sentence activities, we could track differently or skip
      if (currentActivity !== "sentence") {
        recordReview(currentWord, maxUnit, score, score >= 0.7);
      }
      // Sentences don't use word scheduler - they're just practice
    }

    // Advance session
    if (session.mode === "auto") {
      const updatedSession = advanceStep(session);
      setSession(updatedSession);
      saveSession(updatedSession);

      // Small delay before loading next activity
      setTimeout(() => {
        loadNextActivity(updatedSession);
      }, 1500);
    } else {
      // Menu mode - return to hub
      setCurrentActivity(null);
    }
  };

  const handleSessionComplete = () => {
    clearSession();
    setSessionComplete(true);
    setCurrentActivity(null);
  };

  const handleMenuSelect = (activity: ActivityType) => {
    if (!session) return;

    setCurrentActivity(activity);

    if (activity === "sentence") {
      const sentence = getRandomSentence(maxUnit);
      setCurrentSentence(sentence?.sentence || "");
    } else {
      const availableWords = getAllBlendingWordStrings(maxUnit);
      const sessionWords = getSessionWords(availableWords, maxUnit, 1);
      setCurrentWord(sessionWords[0] || "cat");
    }
  };

  const handleRestart = () => {
    clearSession();
    setSession(null);
    setCurrentActivity(null);
    setSessionComplete(false);
    setShowModeSelection(true);
  };

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-4">
            Start Your Practice
          </h1>
          <p className="text-xl text-gray-600">Choose your session style</p>
          {recommendedMode === "auto" && (
            <p className="text-sm text-purple-600 mt-2 font-semibold">
              💡 We recommend Guided Mode for now!
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Auto-flow Mode */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleModeSelect("auto")}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-3xl p-8 shadow-xl border-b-8 transition-all ${
              recommendedMode === "auto"
                ? "border-purple-400 ring-4 ring-purple-200"
                : "border-gray-200"
            }`}
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-3xl font-black text-gray-800 mb-3">
              Guided Mode
            </h3>
            <p className="text-gray-600 mb-4">
              Follow a carefully designed sequence. Perfect for building strong
              foundations!
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-600 font-bold">
              <Play className="w-5 h-5" />
              <span>Auto-guided session</span>
            </div>
          </motion.button>

          {/* Menu Mode */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleModeSelect("menu")}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-3xl p-8 shadow-xl border-b-8 transition-all ${
              recommendedMode === "menu"
                ? "border-green-400 ring-4 ring-green-200"
                : "border-gray-200"
            }`}
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-3xl font-black text-gray-800 mb-3">
              Free Choice
            </h3>
            <p className="text-gray-600 mb-4">
              Pick any activity you want! Great for independent learners.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
              <List className="w-5 h-5" />
              <span>Choose your own</span>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  // Session Complete Screen
  if (sessionComplete) {
    const progress = getSessionProgress(session!);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-2xl"
        >
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-5xl font-black text-gray-800">
            Session Complete!
          </h1>
          <p className="text-2xl text-gray-600">
            Amazing work! You completed {progress.completed} activities!
          </p>

          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold text-gray-700">
                Keep up the great practice!
              </span>
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Practice More
              </button>
              <button
                onClick={onExit}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                All Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Activity View
  if (currentActivity) {
    const progress = session ? getSessionProgress(session) : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        {/* Progress Header (Auto mode only) */}
        {session?.mode === "auto" && progress && (
          <div className="bg-white shadow-sm p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Session Progress
                  </span>
                  {currentActivity !== "sentence" && currentWord && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold uppercase">
                      {currentWord}
                    </span>
                  )}
                  {currentActivity === "sentence" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                      📖 Sentence
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-purple-600">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                />
              </div>
            </div>
          </div>
        )}

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
                <TapToBlend word={currentWord} onComplete={handleActivityComplete} />
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
                  sentence={currentSentence}
                  onComplete={handleActivityComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Menu Mode Hub (when no activity selected)
  if (session?.mode === "menu") {
    const activities = [
      { id: "tap" as ActivityType, name: "Tap to Blend", icon: "👆" },
      { id: "segment" as ActivityType, name: "Sound Builder", icon: "🧩" },
      { id: "slider" as ActivityType, name: "Blending Slider", icon: "🎚️" },
      { id: "sentence" as ActivityType, name: "Read Sentence", icon: "📖" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-gray-800 mb-8"
        >
          Choose an Activity
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {activities.map((activity, index) => (
            <motion.button
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleMenuSelect(activity.id)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-3xl p-8 shadow-xl border-b-8 border-gray-200 hover:border-purple-400 transition-all"
            >
              <div className="text-6xl mb-4">{activity.icon}</div>
              <h3 className="text-2xl font-black text-gray-800">
                {activity.name}
              </h3>
            </motion.button>
          ))}
        </div>

        <button
          onClick={onExit}
          className="mt-8 px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
        >
          Exit Session
        </button>
      </div>
    );
  }

  return null;
}
