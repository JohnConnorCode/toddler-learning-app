"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Trophy, ArrowRight, Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { type Level, type Lesson, type Activity } from "@/lib/levels-data";
import { useLevelProgress } from "@/hooks/use-level-progress";
import { useAchievements } from "@/hooks/use-achievements";
import { useSession } from "@/hooks/use-session";
import { ConfirmDialog, useConfirmNavigation } from "@/components/ui/ConfirmDialog";

// Activity component imports (to be created/connected)
import { ActivityPhonics } from "@/components/activities/ActivityPhonics";
import { ActivityWordBuilding } from "@/components/activities/ActivityWordBuilding";
import { ActivityPlaceholder } from "@/components/activities/ActivityPlaceholder";
import { LessonWrapUp } from "@/components/teaching";

interface LessonPlayerProps {
  level: Level;
  lesson: Lesson;
}

export function LessonPlayer({ level, lesson }: LessonPlayerProps) {
  const router = useRouter();
  const { completeLesson, startLesson } = useLevelProgress();
  const {
    updateStreak,
    trackActivity,
    trackLessonComplete,
    trackLevelVisit,
  } = useAchievements();
  const { startSession, updateSession, clearSession } = useSession();

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [starsEarned, setStarsEarned] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [learnedItems, setLearnedItems] = useState<string[]>([]);

  const currentActivity = lesson.activities[currentActivityIndex];
  const isLastActivity = currentActivityIndex === lesson.activities.length - 1;
  const progress = ((currentActivityIndex + 1) / lesson.activities.length) * 100;

  // Helper to get human-readable label for what was learned in an activity
  const getActivityLabel = (activity: Activity): string | null => {
    if (activity.type === "phonics" && activity.contentId) {
      // contentId for phonics is usually the letter (e.g., "A", "B")
      return `the letter ${activity.contentId}`;
    }
    if (activity.type === "blending" && activity.contentId) {
      // contentId for blending is usually the word
      return `the word "${activity.contentId}"`;
    }
    if (activity.type === "sight-words") {
      return "sight words";
    }
    if (activity.type === "word-building") {
      return "word building";
    }
    if (activity.type === "word-families") {
      return "word families";
    }
    // Fallback to activity title
    return activity.title ? activity.title.toLowerCase() : null;
  };

  // Warn before leaving during lesson
  useConfirmNavigation(currentActivityIndex > 0 && !showCompletion);

  // Mark lesson as started and track session
  useEffect(() => {
    startLesson(lesson.id);
    // Track level visit for achievements
    trackLevelVisit(level.levelNumber);
    // Update daily streak
    updateStreak();
    // Start session tracking for resume functionality
    startSession({
      type: "level-lesson",
      levelId: level.id,
      levelTitle: level.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      activityIndex: 0,
      totalActivities: lesson.activities.length,
      progress: 0,
    });
  }, [lesson.id, startLesson, level.levelNumber, trackLevelVisit, updateStreak, level.id, level.title, lesson.title, lesson.activities.length, startSession]);

  // Update session when activity changes
  useEffect(() => {
    updateSession({
      activityIndex: currentActivityIndex,
      progress: (currentActivityIndex / lesson.activities.length) * 100,
    });
  }, [currentActivityIndex, lesson.activities.length, updateSession]);

  const handleActivityComplete = (stars: number = 3) => {
    // Award stars (max 3 per activity)
    const actualStars = Math.min(3, Math.max(1, stars));
    setStarsEarned(prev => prev + actualStars);
    setCompletedActivities(prev => new Set([...prev, currentActivity.id]));

    // Track what was learned for the Ms. Rachel wrap-up summary
    const activityLabel = getActivityLabel(currentActivity);
    if (activityLabel) {
      setLearnedItems(prev => [...prev, activityLabel]);
    }

    // Track activity type for explorer badges
    trackActivity(currentActivity.type);

    // Show confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    // Move to next activity or show completion
    if (isLastActivity) {
      // Lesson complete!
      const totalStars = starsEarned + actualStars;
      const maxStars = lesson.activities.length * 3;
      const isPerfect = totalStars === maxStars;

      // Track lesson completion for achievements & XP
      trackLessonComplete(isPerfect);

      setTimeout(() => {
        setShowCompletion(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 500);
    } else {
      // Next activity
      setTimeout(() => {
        setCurrentActivityIndex(prev => prev + 1);
      }, 1500);
    }
  };

  const handleLessonComplete = () => {
    // Save progress
    completeLesson(lesson.id, starsEarned);

    // Clear session since lesson is complete
    clearSession();

    // Return to level page
    router.push(`/levels/${level.id}`);
  };

  const handleSkip = () => {
    if (!isLastActivity) {
      setCurrentActivityIndex(prev => prev + 1);
    }
  };

  const handleExitRequest = () => {
    // If progress made, show confirmation
    if (currentActivityIndex > 0 || starsEarned > 0) {
      setShowExitConfirm(true);
    } else {
      handleExitConfirmed();
    }
  };

  const handleExitConfirmed = () => {
    setShowExitConfirm(false);
    // Session is saved, navigate back
    router.push(`/levels/${level.id}`);
  };

  if (showCompletion) {
    // Use Ms. Rachel methodology emotional wrap-up
    return (
      <LessonWrapUp
        learnedItems={learnedItems.length > 0 ? learnedItems : ["today's lesson"]}
        onComplete={handleLessonComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* Header with Progress */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-3">
            {/* Back Button */}
            <button
              onClick={handleExitRequest}
              className="p-4 rounded-full hover:bg-gray-100 transition-colors touch-target"
              aria-label="Exit lesson"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Lesson Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-gray-800 truncate">
                {lesson.title}
              </h1>
              <p className="text-sm text-gray-500">
                Activity {currentActivityIndex + 1} of {lesson.activities.length}
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-50">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-800">{starsEarned}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${level.color.primary} 0%, ${level.color.secondary} 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActivityRouter
                activity={currentActivity}
                onComplete={handleActivityComplete}
                levelColor={level.color.primary}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Debug Skip Button (remove in production) */}
      {!isLastActivity && process.env.NODE_ENV === "development" && (
        <button
          onClick={handleSkip}
          className="fixed bottom-4 right-4 px-4 py-2 bg-gray-200 rounded-full text-xs font-medium hover:bg-gray-300"
        >
          Skip (Dev Only)
        </button>
      )}

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={handleExitConfirmed}
        title="Leave Lesson?"
        message="Your progress will be saved. You can resume this lesson from the home screen."
        confirmText="Exit & Save"
        cancelText="Keep Learning"
        variant="warning"
        icon={<Pause className="w-8 h-8 text-yellow-600" />}
      />
    </div>
  );
}

// Activity Router - Routes to correct activity component based on type
interface ActivityRouterProps {
  activity: Activity;
  onComplete: (stars: number) => void;
  levelColor: string;
}

function ActivityRouter({ activity, onComplete, levelColor }: ActivityRouterProps) {
  switch (activity.type) {
    case "phonics":
      return (
        <ActivityPhonics
          activity={activity}
          onComplete={onComplete}
          levelColor={levelColor}
        />
      );

    case "word-building":
      return (
        <ActivityWordBuilding
          activity={activity}
          onComplete={onComplete}
          levelColor={levelColor}
        />
      );

    case "sight-words":
    case "word-families":
    case "blending":
    case "story":
    case "assessment":
    case "tracing":
    case "mini-game":
      // Placeholder for activities not yet implemented
      return (
        <ActivityPlaceholder
          activity={activity}
          onComplete={onComplete}
          levelColor={levelColor}
        />
      );

    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Unknown activity type: {activity.type}</p>
        </div>
      );
  }
}

// Lesson Completion Screen
interface LessonCompletionScreenProps {
  level: Level;
  lesson: Lesson;
  starsEarned: number;
  totalStars: number;
  onContinue: () => void;
}

function LessonCompletionScreen({
  level,
  lesson,
  starsEarned,
  totalStars,
  onContinue,
}: LessonCompletionScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${level.color.primary}20 0%, ${level.color.secondary}40 100%)`,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center"
      >
        {/* Trophy */}
        <div
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${level.color.primary}20` }}
        >
          <Trophy className="w-12 h-12" style={{ color: level.color.primary }} />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-2">
          Lesson Complete!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Great job on {lesson.title}!
        </p>

        {/* Stars */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-12 h-12 ${
                  i < Math.floor((starsEarned / totalStars) * 3)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-lg font-bold text-gray-700">
            {starsEarned} / {totalStars} stars earned
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="px-8 py-4 rounded-full text-white font-black text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          style={{ backgroundColor: level.color.primary }}
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
