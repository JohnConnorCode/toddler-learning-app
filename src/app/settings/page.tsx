"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  Zap,
  Eye,
  Clock,
  Lock,
  Unlock,
  PlayCircle,
  Sparkles
} from "lucide-react";
import { useSettings, WordDifficulty } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const {
    // Audio
    isMuted,
    volume,
    toggleMute,
    setVolume,

    // Gameplay
    autoAdvance,
    showHints,
    wordDifficulty,
    showWordFamilies,
    delayBetweenWords,
    toggleAutoAdvance,
    toggleShowHints,
    setWordDifficulty,
    toggleShowWordFamilies,
    setDelayBetweenWords,

    // Progression
    lockProgression,
    toggleLockProgression,

    // Accessibility
    autoPlaySuccess,
    toggleAutoPlaySuccess,

    // Actions
    resetSettings,
  } = useSettings();

  const difficulties: { value: WordDifficulty; label: string; description: string }[] = [
    { value: "easy", label: "Easy", description: "Exact letters only" },
    { value: "medium", label: "Medium", description: "+2-3 extra letters" },
    { value: "hard", label: "Hard", description: "+4-6 extra letters" },
  ];

  const delayOptions = [
    { value: 1000, label: "Fast (1s)" },
    { value: 2000, label: "Normal (2s)" },
    { value: 3000, label: "Slow (3s)" },
    { value: 5000, label: "Very Slow (5s)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4"
          >
            <SettingsIcon className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Settings
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Customize your learning experience
          </p>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Audio Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Volume2 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Audio</h2>
          </div>

          <div className="space-y-6">
            {/* Mute Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Sound</h3>
                <p className="text-sm text-gray-600">Enable or disable all sounds</p>
              </div>
              <button
                onClick={toggleMute}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  isMuted ? "bg-gray-300" : "bg-green-500"
                )}
              >
                <motion.div
                  animate={{ x: isMuted ? 2 : 34 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 text-gray-600" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-green-600" />
                  )}
                </motion.div>
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">Volume</h3>
                <span className="text-sm font-bold text-gray-600">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                disabled={isMuted}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: isMuted
                    ? "#e5e7eb"
                    : `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        </motion.section>

        {/* Difficulty Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Difficulty</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Word Spelling Challenge</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setWordDifficulty(diff.value)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      wordDifficulty === diff.value
                        ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    )}
                  >
                    <div className="font-black text-gray-800 mb-1">{diff.label}</div>
                    <div className="text-xs text-gray-600">{diff.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Display Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Display</h2>
          </div>

          <div className="space-y-6">
            {/* Show Hints */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Show Hints Button</h3>
                <p className="text-sm text-gray-600">Display the lightbulb hint button</p>
              </div>
              <button
                onClick={toggleShowHints}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  showHints ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  animate={{ x: showHints ? 34 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Show Word Families */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Show Word Families</h3>
                <p className="text-sm text-gray-600">Display related words after completing a word</p>
              </div>
              <button
                onClick={toggleShowWordFamilies}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  showWordFamilies ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  animate={{ x: showWordFamilies ? 34 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Auto Play Success */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Auto-play Celebration</h3>
                <p className="text-sm text-gray-600">Automatically play letter sounds after success</p>
              </div>
              <button
                onClick={toggleAutoPlaySuccess}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  autoPlaySuccess ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  animate={{ x: autoPlaySuccess ? 34 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  <PlayCircle className="w-3 h-3 text-gray-600" />
                </motion.div>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Timing Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Timing</h2>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Delay Between Words</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {delayOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDelayBetweenWords(option.value)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all font-bold",
                    delayBetweenWords === option.value
                      ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-purple-300"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Progression Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-pink-100 rounded-xl">
              {lockProgression ? (
                <Lock className="w-6 h-6 text-pink-600" />
              ) : (
                <Unlock className="w-6 h-6 text-pink-600" />
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-800">Progression</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Lock Units</h3>
              <p className="text-sm text-gray-600">
                {lockProgression
                  ? "Units unlock as previous ones are completed"
                  : "All units are unlocked and accessible"}
              </p>
            </div>
            <button
              onClick={toggleLockProgression}
              className={cn(
                "relative w-16 h-8 rounded-full transition-colors",
                lockProgression ? "bg-pink-500" : "bg-green-500"
              )}
            >
              <motion.div
                animate={{ x: lockProgression ? 34 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
              >
                {lockProgression ? (
                  <Lock className="w-3 h-3 text-pink-600" />
                ) : (
                  <Unlock className="w-3 h-3 text-green-600" />
                )}
              </motion.div>
            </button>
          </div>
        </motion.section>

        {/* Reset Button */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="text-center">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all settings to default?")) {
                  resetSettings();
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-lg rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Reset All Settings
            </button>
            <p className="text-sm text-gray-500 mt-3">
              This will restore all settings to their default values
            </p>
          </div>
        </motion.section>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
}
