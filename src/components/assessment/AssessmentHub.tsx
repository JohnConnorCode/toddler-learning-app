"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAssessment } from "@/hooks/use-assessment";
import { QuestionDisplay } from "./QuestionDisplay";
import { PlacementResults } from "./PlacementResults";
import { ClipboardCheck, Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function AssessmentHub() {
  const {
    inProgress,
    currentQuestion,
    results,
    placement,
    completedAssessment,
    startAssessment,
    answerQuestion,
    skipQuestion,
    resetAssessment,
    getProgress,
    getSectionName,
  } = useAssessment();

  const router = useRouter();
  const progress = getProgress();

  // If assessment completed, show results
  if (completedAssessment && results && placement) {
    return (
      <PlacementResults
        results={results}
        placement={placement}
        overallScore={completedAssessment.overallScore}
        onStart={() => {
          // Navigate to recommended path
          router.push(`/${placement.startPath}`);
        }}
        onRetake={resetAssessment}
      />
    );
  }

  // If assessment in progress, show current question
  if (inProgress && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        {/* Section Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 bg-white rounded-full shadow-lg"
          >
            <span className="text-sm font-bold text-gray-600">
              {getSectionName(progress.currentSection)}
            </span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <QuestionDisplay
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={answerQuestion}
            onSkip={skipQuestion}
            questionNumber={progress.answeredQuestions + 1}
            totalQuestions={progress.totalQuestions}
          />
        </AnimatePresence>
      </div>
    );
  }

  // Welcome screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6"
          >
            <ClipboardCheck className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-4"
          >
            Let's Find Your Starting Point!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed"
          >
            This quick assessment will help us create a personalized learning path just for you.
            It takes about 10-15 minutes.
          </motion.p>

          {/* What to Expect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-2xl p-6 mb-8 text-left"
          >
            <h3 className="font-bold text-gray-800 mb-4 text-lg">What to expect:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>
                  <strong>50 questions</strong> across 5 categories
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>
                  Letter names, letter sounds, sound awareness, reading words, and sight words
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>
                  No pressure - you can skip any question
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>
                  Get instant personalized recommendations at the end
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Tips for Parents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-purple-50 rounded-2xl p-6 mb-8 text-left border-l-4 border-purple-500"
          >
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Tips for Success:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Find a quiet place with no distractions</li>
              <li>✓ Sit with your child and help them understand each question</li>
              <li>✓ Don't worry about wrong answers - this helps us place them correctly</li>
              <li>✓ Take breaks if needed - progress is saved automatically</li>
              <li>✓ Make it fun and encouraging!</li>
            </ul>
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAssessment}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-purple-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all"
          >
            <Play className="w-6 h-6" />
            <span>Start Assessment</span>
          </motion.button>

          {/* Reset Option (if previous assessment exists) */}
          {completedAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <button
                onClick={resetAssessment}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear previous results</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
