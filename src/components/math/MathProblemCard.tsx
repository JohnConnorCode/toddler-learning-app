"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import type { MathProblem } from "@/lib/math-data";
import { formatProblem, checkAnswer, getNumberData } from "@/lib/math-data";

interface MathProblemCardProps {
  problem: MathProblem;
  onAnswer: (isCorrect: boolean, attempts: number) => void;
  showHint?: boolean;
  autoSpeak?: boolean;
}

export function MathProblemCard({
  problem,
  onAnswer,
  showHint = true,
  autoSpeak = true,
}: MathProblemCardProps) {
  const { shouldReduceMotion } = useAccessibility();
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHintText, setShowHintText] = useState(false);

  // Generate answer options for multiple choice
  const generateOptions = useCallback(() => {
    const correct = problem.answer;
    const options = new Set<number>([correct]);

    // Generate wrong answers close to correct
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2;
      const wrong = correct + offset;
      if (wrong >= 0 && wrong !== correct) {
        options.add(wrong);
      }
      // Add some random options if needed
      if (options.size < 4) {
        options.add(Math.floor(Math.random() * 20));
      }
    }

    return Array.from(options).sort((a, b) => a - b);
  }, [problem.answer]);

  const [options] = useState(generateOptions);

  // Speak the problem
  const speakProblem = useCallback(() => {
    if ("speechSynthesis" in window) {
      const text = problem.operands.length === 1
        ? `How many is ${problem.operands[0]}?`
        : `What is ${problem.operands.join(` ${problem.operator === "+" ? "plus" : "minus"} `)}?`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [problem]);

  useEffect(() => {
    if (autoSpeak) {
      speakProblem();
    }
  }, [autoSpeak, speakProblem]);

  const handleOptionClick = (answer: number) => {
    const isCorrect = checkAnswer(problem, answer);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setShowFeedback(isCorrect ? "correct" : "incorrect");

    // Speak feedback
    if ("speechSynthesis" in window) {
      const text = isCorrect
        ? ["Great job!", "Awesome!", "Perfect!", "You got it!"][Math.floor(Math.random() * 4)]
        : "Try again!";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }

    if (isCorrect) {
      setTimeout(() => {
        onAnswer(true, newAttempts);
        setShowFeedback(null);
        setAttempts(0);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowFeedback(null);
      }, 1000);
    }
  };

  const handleNumberInput = (num: string) => {
    if (userAnswer.length < 2) {
      setUserAnswer((prev) => prev + num);
    }
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) return;

    handleOptionClick(answer);
    setUserAnswer("");
  };

  const handleClear = () => {
    setUserAnswer("");
  };

  // Visual representation of the problem
  const renderVisual = () => {
    if (problem.operands.length === 1) {
      // Counting - show dots
      const count = problem.operands[0];
      return (
        <div className="flex flex-wrap justify-center gap-2 max-w-[200px] mx-auto my-4">
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-8 h-8 rounded-full bg-yellow-400 shadow-md"
            />
          ))}
        </div>
      );
    }

    // Addition/Subtraction visual
    if (problem.visualHint === "fingers" && problem.operands[0] <= 10) {
      return (
        <div className="flex justify-center items-center gap-4 my-4">
          {problem.operands.map((num, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-3xl font-bold text-gray-400">
                  {problem.operator}
                </span>
              )}
              <div className="flex flex-wrap justify-center gap-1 max-w-[100px]">
                {Array.from({ length: num }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (i * num + j) * 0.05 }}
                    className={`w-6 h-6 rounded-full shadow-sm ${
                      i === 0
                        ? "bg-blue-400"
                        : problem.operator === "+"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-xl max-w-md mx-auto"
    >
      {/* Problem Display */}
      <div className="text-center mb-6">
        <motion.div
          key={problem.id}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 mb-4"
        >
          <p className="text-4xl sm:text-5xl font-black text-gray-800">
            {formatProblem(problem)}{" "}
            <span className="text-purple-500">= ?</span>
          </p>
        </motion.div>

        {/* Sound button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={speakProblem}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Volume2 className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Hear problem</span>
        </motion.button>
      </div>

      {/* Visual Representation */}
      {renderVisual()}

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              showFeedback === "correct"
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
              className={`p-8 rounded-full ${
                showFeedback === "correct" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {showFeedback === "correct" ? (
                <Check className="w-16 h-16 text-white" />
              ) : (
                <X className="w-16 h-16 text-white" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {options.map((option) => (
          <motion.button
            key={option}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => handleOptionClick(option)}
            disabled={showFeedback !== null}
            className={`
              py-4 text-3xl font-black rounded-2xl transition-all
              ${
                showFeedback === "correct" && option === problem.answer
                  ? "bg-green-500 text-white"
                  : showFeedback === "incorrect" && option === problem.answer
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
              disabled:opacity-50
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Hint */}
      {showHint && problem.hint && (
        <div className="mt-4">
          <button
            onClick={() => setShowHintText(!showHintText)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mx-auto"
          >
            <HelpCircle className="w-4 h-4" />
            {showHintText ? "Hide hint" : "Show hint"}
          </button>
          <AnimatePresence>
            {showHintText && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center text-sm text-gray-500 mt-2 bg-yellow-50 p-3 rounded-xl"
              >
                💡 {problem.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Attempts indicator */}
      {attempts > 0 && !showFeedback && (
        <p className="text-center text-sm text-gray-400 mt-3">
          Attempts: {attempts}
        </p>
      )}
    </motion.div>
  );
}

/**
 * Number keypad for direct input
 */
export function NumberKeypad({
  onNumberPress,
  onSubmit,
  onClear,
  value,
}: {
  onNumberPress: (num: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  value: string;
}) {
  const { shouldReduceMotion } = useAccessibility();
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="bg-gray-100 rounded-2xl p-4">
      {/* Display */}
      <div className="bg-white rounded-xl p-4 mb-4 text-center">
        <span className="text-4xl font-black text-gray-800">
          {value || "_"}
        </span>
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-2">
        {numbers.slice(0, 9).map((num) => (
          <motion.button
            key={num}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => onNumberPress(num)}
            className="py-4 text-2xl font-bold bg-white rounded-xl hover:bg-gray-50 transition-colors"
          >
            {num}
          </motion.button>
        ))}
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={onClear}
          className="py-4 text-xl font-bold bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
        >
          <RotateCcw className="w-6 h-6 mx-auto" />
        </motion.button>
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={() => onNumberPress("0")}
          className="py-4 text-2xl font-bold bg-white rounded-xl hover:bg-gray-50 transition-colors"
        >
          0
        </motion.button>
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={onSubmit}
          className="py-4 text-xl font-bold bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          <ArrowRight className="w-6 h-6 mx-auto" />
        </motion.button>
      </div>
    </div>
  );
}
