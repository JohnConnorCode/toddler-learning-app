"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AssessmentQuestion } from "@/lib/assessment-data";
import { Volume2 } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: AssessmentQuestion;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({
  question,
  onAnswer,
  onSkip,
  questionNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  const { playWordSound } = useAudio();

  const handlePlayPrompt = () => {
    if (question.audioPrompt) {
      // Play audio prompt
      const audioPath = question.audioPrompt.replace(/^\/audio\//, "");
      playWordSound(audioPath);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-primary">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-purple-600"
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12"
      >
        {/* Prompt Section */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-4"
          >
            {question.prompt}
          </motion.h2>

          {question.audioPrompt && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              onClick={handlePlayPrompt}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
            >
              <Volume2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Listen Again</span>
            </motion.button>
          )}
        </div>

        {/* Image Prompt (if applicable) */}
        {question.imagePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8 sm:mb-10"
          >
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-lg flex items-center justify-center overflow-hidden">
              {/* Placeholder - In production, use actual image */}
              <div className="text-8xl sm:text-9xl font-black text-gray-700">
                {question.correctAnswer.toUpperCase().charAt(0)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Answer Options */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto">
            {question.options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(option)}
                className={cn(
                  "p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl font-bold text-xl sm:text-2xl md:text-3xl transition-all",
                  "bg-gradient-to-br from-blue-400 to-purple-500 text-white",
                  "shadow-lg hover:shadow-2xl",
                  "border-b-4 border-blue-600",
                  "active:border-b-0 active:translate-y-1"
                )}
              >
                {option}
              </motion.button>
            ))}
          </div>
        )}

        {/* Open-ended question (for word reading) */}
        {(!question.options || question.options.length === 0) && (
          <div className="text-center space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600"
            >
              Listen to your child read the word aloud.
            </motion.p>

            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(question.correctAnswer)}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all border-b-4 border-green-600 active:border-b-0 active:translate-y-1"
              >
                ✓ Read Correctly
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer("incorrect")}
                className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all border-b-4 border-orange-600 active:border-b-0 active:translate-y-1"
              >
                ✗ Couldn't Read
              </motion.button>
            </div>
          </div>
        )}

        {/* Skip Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold underline"
          >
            Skip this question
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
