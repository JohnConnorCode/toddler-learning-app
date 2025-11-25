"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useOnboarding, AVATAR_EMOJIS, AGE_OPTIONS, DAILY_GOAL_OPTIONS } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { ArrowLeft, ArrowRight, User, Calendar, Clock, Check } from "lucide-react";

interface ParentSetupProps {
  onNext: () => void;
  onBack: () => void;
}

export function ParentSetup({ onNext, onBack }: ParentSetupProps) {
  const { setChildProfile, setParentPreferences, childProfile, parentPreferences } =
    useOnboarding();
  const { shouldReduceMotion } = useAccessibility();

  const [name, setName] = useState(childProfile?.name || "");
  const [age, setAge] = useState<number | null>(childProfile?.age ?? null);
  const [avatar, setAvatar] = useState(childProfile?.avatarEmoji || AVATAR_EMOJIS[0]);
  const [dailyGoal, setDailyGoal] = useState(parentPreferences.dailyGoalMinutes);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = () => {
    // Validate
    if (!name.trim()) {
      setErrors({ name: "Please enter your child's name" });
      return;
    }

    // Save profile
    setChildProfile({
      name: name.trim(),
      age: age || 3,
      avatarEmoji: avatar,
    });

    setParentPreferences({
      dailyGoalMinutes: dailyGoal,
    });

    onNext();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
          Tell Us About Your Child
        </h2>
        <p className="text-gray-500">
          This helps us personalize the learning experience
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Child's Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({});
            }}
            placeholder="Enter name"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.name ? "border-red-300" : "border-gray-200"
            } focus:border-yellow-400 focus:outline-none text-lg font-medium`}
            maxLength={20}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Choose an Avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_EMOJIS.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                onClick={() => setAvatar(emoji)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  avatar === emoji
                    ? "bg-yellow-100 ring-2 ring-yellow-400"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                aria-label={`Select ${emoji} avatar`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Age Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Age
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AGE_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => setAge(option.value)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-bold transition-all ${
                  age === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{option.emoji}</span>
                <span className="text-sm">{option.value}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Daily Learning Goal
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DAILY_GOAL_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => setDailyGoal(option.value)}
                className={`relative flex flex-col items-center px-3 py-3 rounded-xl font-bold transition-all ${
                  dailyGoal === option.value
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{option.label}</span>
                <span
                  className={`text-xs ${
                    dailyGoal === option.value ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {option.description}
                </span>
                {option.value === 15 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full">
                    Best
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
