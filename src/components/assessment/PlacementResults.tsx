"use client";

import { motion } from "framer-motion";
import { AssessmentResult, PlacementRecommendation } from "@/lib/assessment-data";
import { CheckCircle, TrendingUp, BookOpen, Users, ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlacementResultsProps {
  results: AssessmentResult[];
  placement: PlacementRecommendation;
  overallScore: number;
  onStart: () => void;
  onRetake?: () => void;
}

export function PlacementResults({
  results,
  placement,
  overallScore,
  onStart,
  onRetake,
}: PlacementResultsProps) {
  const getLevelColor = (level: PlacementRecommendation["level"]) => {
    switch (level) {
      case "pre-reading":
        return "from-green-400 to-emerald-500";
      case "early-phonics":
        return "from-blue-400 to-cyan-500";
      case "phonics":
        return "from-purple-400 to-pink-500";
      case "advanced-phonics":
        return "from-orange-400 to-red-500";
      case "fluency":
        return "from-yellow-400 to-amber-500";
    }
  };

  const getLevelLabel = (level: PlacementRecommendation["level"]) => {
    switch (level) {
      case "pre-reading":
        return "Pre-Reading Skills";
      case "early-phonics":
        return "Early Phonics";
      case "phonics":
        return "Phonics Development";
      case "advanced-phonics":
        return "Advanced Phonics";
      case "fluency":
        return "Fluency Building";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "letter-names":
        return "Letter Names";
      case "letter-sounds":
        return "Letter Sounds";
      case "phonemic-awareness":
        return "Sound Awareness";
      case "cvc-reading":
        return "Reading Words";
      case "sight-words":
        return "Sight Words";
      default:
        return category;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full mb-4"
        >
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-2">
          Assessment Complete!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Here's your personalized learning path
        </p>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white text-center mb-8"
      >
        <div className="text-6xl sm:text-7xl md:text-8xl font-black mb-2">{overallScore}%</div>
        <div className="text-xl sm:text-2xl font-bold">Overall Score</div>
      </motion.div>

      {/* Placement Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={cn("p-3 rounded-full bg-gradient-to-br", getLevelColor(placement.level))}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              Recommended Path
            </h2>
            <p className="text-lg font-semibold text-primary">{getLevelLabel(placement.level)}</p>
          </div>
        </div>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{placement.rationale}</p>

        {/* Strengths */}
        {placement.strengths.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {placement.strengths.map((strength, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Areas to Watch */}
        {placement.areasToWatch.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Areas to Practice</h3>
            <ul className="space-y-2">
              {placement.areasToWatch.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Parent Guidance */}
        <div className="bg-blue-50 rounded-2xl p-5 border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-gray-800 mb-2">For Parents & Teachers</h4>
              <p className="text-gray-700">{placement.parentGuidance}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6">Detailed Results</h2>

        <div className="space-y-6">
          {results.map((result, idx) => (
            <motion.div
              key={result.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {getCategoryName(result.category)}
                </h3>
                <span
                  className={cn(
                    "text-2xl font-black",
                    result.percentage >= 80
                      ? "text-green-600"
                      : result.percentage >= 60
                      ? "text-yellow-600"
                      : "text-orange-600"
                  )}
                >
                  {result.percentage}%
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <span>
                  {result.correctAnswers} / {result.totalQuestions} correct
                </span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.percentage}%` }}
                  transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                  className={cn(
                    "h-full rounded-full",
                    result.percentage >= 80
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : result.percentage >= 60
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                      : "bg-gradient-to-r from-orange-400 to-red-500"
                  )}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <button
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-6 h-6" />
        </button>

        {onRetake && (
          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-gray-200"
          >
            Retake Assessment
          </button>
        )}
      </motion.div>

      {/* Download Report (Optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6"
      >
        <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-semibold">
          <Download className="w-4 h-4" />
          <span>Download Report (PDF)</span>
        </button>
      </motion.div>
    </div>
  );
}
