"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useTheme } from "@/hooks/use-theme";
import { useSpeech } from "@/hooks/use-audio";
import type { MathProblem } from "@/lib/math-data";
import { formatProblem, checkAnswer, getEmojiForProblem, MATH_EMOJI_THEMES, type EmojiTheme } from "@/lib/math-data";
import { playSound, playFeedback } from "@/lib/sound-effects";
import { triggerSmallConfetti, triggerMediumConfetti, triggerStarShower } from "@/lib/confetti";
import { pickRandom } from "@/lib/utils/array-helpers";

interface MathProblemCardProps {
  problem: MathProblem;
  onAnswer: (isCorrect: boolean, attempts: number) => void;
  showHint?: boolean;
  autoSpeak?: boolean;
}

// ============================================
// EMOJI COUNTER COMPONENT
// ============================================

interface EmojiCounterProps {
  count: number;
  emoji: string;
  animate?: boolean;
  crossedOut?: number;
  color?: string;
}

function EmojiCounter({ count, emoji, animate = true, crossedOut = 0, color }: EmojiCounterProps) {
  const { shouldReduceMotion } = useAccessibility();

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
      {Array.from({ length: count }).map((_, i) => {
        const isCrossed = i >= count - crossedOut;

        return (
          <motion.span
            key={i}
            initial={animate && !shouldReduceMotion ? { scale: 0, opacity: 0 } : {}}
            animate={{ scale: 1, opacity: isCrossed ? 0.3 : 1 }}
            transition={{ delay: animate ? i * 0.1 : 0, duration: 0.2 }}
            className={`text-3xl sm:text-4xl relative ${isCrossed ? 'grayscale' : ''}`}
          >
            {emoji}
            {isCrossed && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center text-red-500 text-2xl"
              >
                ❌
              </motion.span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

// ============================================
// TEN FRAME COMPONENT
// ============================================

interface TenFrameProps {
  count: number;
  showSecondFrame?: boolean;
  secondCount?: number;
  highlightFilled?: boolean;
  animate?: boolean;
}

function TenFrame({
  count,
  showSecondFrame = false,
  secondCount = 0,
  highlightFilled = true,
  animate = true,
}: TenFrameProps) {
  const { shouldReduceMotion } = useAccessibility();
  const shouldAnimate = animate && !shouldReduceMotion;

  // Render a single ten frame
  const renderFrame = (filled: number, startDelay: number = 0, color: string = "bg-purple-500") => (
    <div className="bg-gray-100 rounded-xl p-2 inline-block">
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const isFilled = i < filled;
          return (
            <motion.div
              key={i}
              initial={shouldAnimate ? { scale: 0 } : {}}
              animate={{ scale: 1 }}
              transition={{ delay: shouldAnimate ? startDelay + i * 0.05 : 0 }}
              className={`
                w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2
                ${isFilled
                  ? `${color} border-transparent shadow-sm`
                  : "bg-white border-gray-300"
                }
                ${highlightFilled && isFilled ? "ring-2 ring-purple-200" : ""}
              `}
            >
              {isFilled && (
                <motion.div
                  initial={shouldAnimate ? { opacity: 0 } : {}}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldAnimate ? startDelay + i * 0.05 + 0.1 : 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-center gap-3">
      {renderFrame(Math.min(count, 10), 0)}
      {(showSecondFrame || count > 10) && (
        <>
          {count > 10 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-400"
            >
              +
            </motion.span>
          )}
          {renderFrame(
            count > 10 ? count - 10 : secondCount,
            0.5,
            count > 10 ? "bg-purple-500" : "bg-teal-500"
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// FINGER COUNTING COMPONENT
// ============================================

interface FingerCountProps {
  count: number;
  animate?: boolean;
}

function FingerCount({ count, animate = true }: FingerCountProps) {
  const { shouldReduceMotion } = useAccessibility();
  const shouldAnimate = animate && !shouldReduceMotion;

  // Use hand emojis for 5s and finger emojis for 1s
  const hands = Math.floor(count / 5);
  const fingers = count % 5;

  // Finger emojis for 1-4
  const fingerEmojis = ["☝️", "✌️", "🤟", "🖖"];
  const handEmoji = "🖐️";

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      {/* Show full hands (5 fingers each) */}
      {Array.from({ length: hands }).map((_, i) => (
        <motion.span
          key={`hand-${i}`}
          initial={shouldAnimate ? { scale: 0, rotate: -20 } : {}}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: shouldAnimate ? i * 0.15 : 0 }}
          className="text-4xl sm:text-5xl"
        >
          {handEmoji}
        </motion.span>
      ))}

      {/* Show remaining fingers */}
      {fingers > 0 && (
        <motion.span
          initial={shouldAnimate ? { scale: 0, rotate: -20 } : {}}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: shouldAnimate ? hands * 0.15 : 0 }}
          className="text-4xl sm:text-5xl"
        >
          {fingerEmojis[fingers - 1]}
        </motion.span>
      )}

      {/* Label */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : {}}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full text-center mt-2"
      >
        <span className="text-sm text-gray-500 font-medium">
          {count} finger{count !== 1 ? "s" : ""}
        </span>
      </motion.div>
    </div>
  );
}

// ============================================
// NUMBER LINE COMPONENT
// ============================================

interface NumberLineProps {
  min?: number;
  max?: number;
  current?: number;
  highlight?: number[];
  showJumps?: { from: number; to: number; label: string }[];
}

function NumberLine({
  min = 0,
  max = 20,
  current,
  highlight = [],
  showJumps = []
}: NumberLineProps) {
  const { shouldReduceMotion } = useAccessibility();
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="relative w-full overflow-x-auto py-4">
      <div className="flex items-center justify-center gap-1 min-w-fit px-4">
        {numbers.map((num, i) => {
          const isHighlighted = highlight.includes(num);
          const isCurrent = num === current;

          return (
            <motion.div
              key={num}
              initial={!shouldReduceMotion ? { y: -10, opacity: 0 } : {}}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`
                flex flex-col items-center
                ${isCurrent ? 'scale-125 z-10' : ''}
              `}
            >
              {/* Jump indicators */}
              {showJumps.map((jump, jumpIdx) => {
                if (jump.from === num) {
                  return (
                    <motion.div
                      key={jumpIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-6 text-xs font-bold text-purple-600"
                    >
                      {jump.label}
                    </motion.div>
                  );
                }
                return null;
              })}

              {/* Number circle */}
              <div
                className={`
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold
                  transition-all duration-200
                  ${isCurrent
                    ? 'bg-purple-500 text-white shadow-lg ring-2 ring-purple-300'
                    : isHighlighted
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {num}
              </div>

              {/* Tick mark */}
              <div className={`w-0.5 h-2 mt-1 ${isCurrent ? 'bg-purple-500' : 'bg-gray-300'}`} />
            </motion.div>
          );
        })}
      </div>

      {/* Line */}
      <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-gray-300" />
    </div>
  );
}

// ============================================
// MATH VISUALIZER COMPONENT
// ============================================

interface MathVisualizerProps {
  problem: MathProblem;
  emoji: string;
}

function MathVisualizer({ problem, emoji }: MathVisualizerProps) {
  const { shouldReduceMotion } = useAccessibility();

  // Check for specific visual hint preferences first
  const visualHint = problem.visualHint;

  // Ten Frame visualization
  if (visualHint === "tenframe") {
    if (problem.operands.length === 1) {
      return (
        <div className="my-4">
          <TenFrame count={problem.operands[0]} animate={!shouldReduceMotion} />
        </div>
      );
    }
    // For addition with ten frame
    if (problem.operator === "+") {
      const [a, b] = problem.operands;
      return (
        <div className="my-4">
          <TenFrame count={a} showSecondFrame secondCount={b} animate={!shouldReduceMotion} />
          <div className="text-center mt-2 text-sm text-gray-500">
            {a} + {b} = {problem.answer}
          </div>
        </div>
      );
    }
  }

  // Finger counting visualization
  if (visualHint === "fingers") {
    const total = problem.operands.length === 1
      ? problem.operands[0]
      : problem.operator === "+"
        ? problem.operands.reduce((sum, n) => sum + n, 0)
        : problem.answer;

    if (total <= 10) {
      return (
        <div className="my-4">
          <FingerCount count={total} animate={!shouldReduceMotion} />
        </div>
      );
    }
  }

  // Number bond visualization
  if (visualHint === "numberbond" && problem.operator === "+") {
    const [a, b] = problem.operands;
    const total = a + b;
    return (
      <div className="my-4 flex flex-col items-center">
        {/* Total at top */}
        <div className="w-14 h-14 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
          {total}
        </div>
        {/* Lines */}
        <div className="flex items-center justify-center gap-8 -mt-2">
          <div className="w-8 h-8 border-l-2 border-b-2 border-purple-300 -rotate-45" />
          <div className="w-8 h-8 border-r-2 border-b-2 border-purple-300 rotate-45" />
        </div>
        {/* Parts at bottom */}
        <div className="flex items-center gap-8 -mt-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-md"
          >
            {a}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold shadow-md"
          >
            {b}
          </motion.div>
        </div>
        <p className="text-sm text-gray-500 mt-3">{a} and {b} make {total}</p>
      </div>
    );
  }

  // Number line visualization (explicit or for larger numbers)
  if (visualHint === "numberline") {
    const total = problem.operands.length === 1
      ? problem.operands[0]
      : problem.operator === "+"
        ? problem.operands.reduce((sum, n) => sum + n, 0)
        : problem.operands[0];
    return (
      <div className="my-4">
        <NumberLine
          min={0}
          max={Math.min(total + 3, 20)}
          current={problem.operands[0]}
          highlight={problem.operator === "+"
            ? [problem.operands[0], problem.answer]
            : [problem.operands[0], problem.answer]
          }
        />
        {problem.operands.length > 1 && (
          <div className="text-center mt-2 text-sm text-gray-500">
            Start at {problem.operands[0]}, {problem.operator === "+" ? "jump forward" : "jump back"} {problem.operands[1]}
          </div>
        )}
      </div>
    );
  }

  // Default visualizations based on problem type

  // Counting (single operand)
  if (problem.operands.length === 1) {
    const count = problem.operands[0];

    // Use ten frame for counts up to 10 (better for learning)
    if (count <= 10 && count > 5) {
      return (
        <div className="my-4">
          <TenFrame count={count} animate={!shouldReduceMotion} />
        </div>
      );
    }

    // Use finger counting for very small numbers
    if (count <= 5) {
      return (
        <div className="my-4">
          <FingerCount count={count} animate={!shouldReduceMotion} />
        </div>
      );
    }

    // Use number line for larger numbers
    if (count > 10) {
      return (
        <div className="my-4">
          <NumberLine
            min={0}
            max={Math.min(count + 2, 20)}
            current={count}
            highlight={Array.from({ length: count + 1 }, (_, i) => i)}
          />
        </div>
      );
    }

    // Use emoji counter as fallback
    return (
      <div className="my-4">
        <EmojiCounter count={count} emoji={emoji} animate={!shouldReduceMotion} />
      </div>
    );
  }

  // Addition - show two groups combining
  if (problem.operator === "+") {
    const [a, b, c] = problem.operands;
    const hasThreeOperands = problem.operands.length === 3;
    const total = problem.operands.reduce((sum, n) => sum + n, 0);

    // Use ten frame for totals up to 20
    if (total <= 10) {
      return (
        <div className="my-4">
          <TenFrame count={a} showSecondFrame secondCount={b} animate={!shouldReduceMotion} />
          <div className="text-center mt-2 text-sm text-gray-500">
            {a} + {b} = ?
          </div>
        </div>
      );
    }

    // Use number line for larger totals
    if (total > 12) {
      return (
        <div className="my-4">
          <NumberLine
            min={0}
            max={Math.min(total + 2, 20)}
            current={a}
            highlight={[a, a + b, hasThreeOperands ? total : a + b]}
          />
          <div className="text-center mt-2 text-sm text-gray-500">
            Start at {a}, jump +{b}{hasThreeOperands ? `, then +${c}` : ''}
          </div>
        </div>
      );
    }

    // Show emoji groups
    return (
      <div className="flex flex-wrap justify-center items-center gap-3 my-4">
        <EmojiCounter count={a} emoji={emoji} animate={!shouldReduceMotion} />
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-gray-400"
        >
          +
        </motion.span>
        <EmojiCounter count={b} emoji={emoji} animate={!shouldReduceMotion} />
        {hasThreeOperands && (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-400"
            >
              +
            </motion.span>
            <EmojiCounter count={c} emoji={emoji} animate={!shouldReduceMotion} />
          </>
        )}
      </div>
    );
  }

  // Subtraction - show items being crossed out
  if (problem.operator === "-") {
    const [total, ...subtracts] = problem.operands;
    const totalSubtracted = subtracts.reduce((sum, n) => sum + n, 0);

    // Use number line for larger numbers
    if (total > 12) {
      return (
        <div className="my-4">
          <NumberLine
            min={0}
            max={Math.min(total + 2, 20)}
            current={total}
            highlight={[total, total - subtracts[0], problem.answer]}
          />
          <div className="text-center mt-2 text-sm text-gray-500">
            Start at {total}, jump back -{subtracts[0]}{subtracts.length > 1 ? `, then -${subtracts[1]}` : ''}
          </div>
        </div>
      );
    }

    // Show emoji with crossed out items
    return (
      <div className="my-4">
        <EmojiCounter
          count={total}
          emoji={emoji}
          animate={!shouldReduceMotion}
          crossedOut={totalSubtracted}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-2 text-sm text-gray-500"
        >
          Take away {totalSubtracted}
        </motion.p>
      </div>
    );
  }

  return null;
}

// ============================================
// CELEBRATION HELPER
// ============================================

function celebrateCorrectAnswer(difficulty: number, shouldReduceMotion: boolean) {
  if (shouldReduceMotion) {
    // Just play sound for reduced motion users
    playSound('success');
    return;
  }

  // Difficulty-based celebration
  if (difficulty <= 2) {
    // Easy: Sound effect + haptic
    playFeedback('success', 'light');
  } else if (difficulty === 3) {
    // Medium: Sound + small confetti
    playFeedback('success', 'medium');
    triggerSmallConfetti();
  } else {
    // Hard: Sound + star shower
    playFeedback('celebrate', 'heavy');
    triggerMediumConfetti();
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function MathProblemCard({
  problem,
  onAnswer,
  showHint = true,
  autoSpeak = true,
}: MathProblemCardProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { themeId, hasInterests } = useTheme();
  const { speak, stop: stopSpeech } = useSpeech();
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHintText, setShowHintText] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedWrongAnswer, setSelectedWrongAnswer] = useState<number | null>(null);

  // Get consistent emoji for this problem, preferring user's interest theme
  const emoji = useMemo(() => {
    // If user has selected an interest that matches a math theme, use it
    if (hasInterests && themeId in MATH_EMOJI_THEMES) {
      const emojis = MATH_EMOJI_THEMES[themeId as EmojiTheme];
      // Use problem ID to pick a consistent emoji from the theme
      let hash = 0;
      for (let i = 0; i < problem.id.length; i++) {
        hash = ((hash << 5) - hash) + problem.id.charCodeAt(i);
        hash = hash & hash;
      }
      return emojis[Math.abs(hash) % emojis.length];
    }
    // Fall back to default behavior
    return getEmojiForProblem(problem.id);
  }, [problem.id, themeId, hasInterests]);

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

  // Speak the problem with improved phrasing
  const speakProblem = useCallback(() => {
    stopSpeech();

    let text: string;
    if (problem.operands.length === 1) {
      text = `How many is ${problem.operands[0]}?`;
    } else if (problem.operands.length === 3) {
      const operatorWord = problem.operator === "+" ? "plus" : "minus";
      text = `What is ${problem.operands[0]}... ${operatorWord}... ${problem.operands[1]}... ${operatorWord}... ${problem.operands[2]}?`;
    } else {
      const operatorWord = problem.operator === "+" ? "plus" : "minus";
      text = `What is ${problem.operands[0]}... ${operatorWord}... ${problem.operands[1]}?`;
    }

    speak(text, { rate: 0.7 });
  }, [problem, speak, stopSpeech]);

  useEffect(() => {
    if (autoSpeak) {
      // Small delay before speaking
      const timer = setTimeout(speakProblem, 300);
      return () => clearTimeout(timer);
    }
  }, [autoSpeak, speakProblem]);

  const handleOptionClick = (answer: number) => {
    // Play tap sound
    playSound('snap');

    const isCorrect = checkAnswer(problem, answer);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setShowFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      // Celebration based on difficulty
      celebrateCorrectAnswer(problem.difficulty, shouldReduceMotion);

      // Speak encouragement
      const encouragementPhrases = ["Great job!", "Awesome!", "Perfect!", "You got it!", "Amazing!"];
      const text = pickRandom(encouragementPhrases) ?? "Great job!";
      setTimeout(() => speak(text, { rate: 0.9 }), 300);

      setTimeout(() => {
        onAnswer(true, newAttempts);
        setShowFeedback(null);
        setAttempts(0);
      }, 1500);
    } else {
      // Wrong answer feedback
      playSound('pop');
      setSelectedWrongAnswer(answer);

      // After 2 wrong attempts, show explanation
      if (newAttempts >= 2) {
        // Show visual explanation
        setShowExplanation(true);

        stopSpeech();
        // Explain the correct answer
        const operatorWord = problem.operator === "+" ? "plus" : "minus";
        let explanation: string;
        if (problem.operands.length === 1) {
          explanation = `Let's count together. ${problem.answer}!`;
        } else {
          explanation = `${problem.operands[0]} ${operatorWord} ${problem.operands[1]} equals ${problem.answer}. Let's try again!`;
        }
        setTimeout(() => speak(explanation, { rate: 0.7 }), 300);

        // Reset after showing explanation
        setTimeout(() => {
          setShowFeedback(null);
          setShowExplanation(false);
          setSelectedWrongAnswer(null);
        }, 4000);
      } else {
        // First wrong attempt - just encourage retry
        const retryPhrases = ["Almost!", "Try again!", "Not quite!", "Keep trying!"];
        const text = pickRandom(retryPhrases) ?? "Try again!";
        setTimeout(() => speak(text, { rate: 0.9 }), 200);

        setTimeout(() => {
          setShowFeedback(null);
          setSelectedWrongAnswer(null);
        }, 1000);
      }
    }
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
          onClick={() => {
            playSound('pop');
            speakProblem();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Volume2 className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Hear problem</span>
        </motion.button>
      </div>

      {/* Visual Representation */}
      <MathVisualizer problem={problem} emoji={emoji} />

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
            {showExplanation ? (
              /* Show visual explanation after multiple wrong attempts */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm mx-4 text-center"
              >
                <div className="text-4xl mb-4">🤔</div>
                <p className="text-lg font-bold text-gray-800 mb-4">
                  Let&apos;s figure it out together!
                </p>

                {/* Show the correct answer visually */}
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-4 mb-4">
                  <p className="text-2xl sm:text-3xl font-black text-gray-800">
                    {formatProblem(problem)} ={" "}
                    <span className="text-green-600">{problem.answer}</span>
                  </p>
                </div>

                {/* Visual representation */}
                <div className="mb-4">
                  <MathVisualizer problem={problem} emoji={emoji} />
                </div>

                {/* Counting explanation for addition */}
                {problem.operator === "+" && problem.operands.length >= 2 && (
                  <p className="text-sm text-gray-600">
                    {problem.operands[0]} + {problem.operands[1]} = {problem.answer}
                    <br />
                    <span className="text-xs">
                      Start with {problem.operands[0]}, then count {problem.operands[1]} more!
                    </span>
                  </p>
                )}

                {/* Counting explanation for subtraction */}
                {problem.operator === "-" && problem.operands.length >= 2 && (
                  <p className="text-sm text-gray-600">
                    {problem.operands[0]} - {problem.operands[1]} = {problem.answer}
                    <br />
                    <span className="text-xs">
                      Start with {problem.operands[0]}, take away {problem.operands[1]}!
                    </span>
                  </p>
                )}

                <p className="text-sm font-medium text-purple-600 mt-4">
                  Tap the right answer: {problem.answer}
                </p>
              </motion.div>
            ) : (
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.2, 1],
                  rotate: showFeedback === "correct" ? [0, -10, 10, 0] : [0, -5, 5, 0]
                }}
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
            )}
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
            onClick={() => {
              playSound('pop');
              setShowHintText(!showHintText);
            }}
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
            onClick={() => {
              playSound('snap');
              onNumberPress(num);
            }}
            className="py-4 text-2xl font-bold bg-white rounded-xl hover:bg-gray-50 transition-colors"
          >
            {num}
          </motion.button>
        ))}
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={() => {
            playSound('pop');
            onClear();
          }}
          className="py-4 text-xl font-bold bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
        >
          <RotateCcw className="w-6 h-6 mx-auto" />
        </motion.button>
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={() => {
            playSound('snap');
            onNumberPress("0");
          }}
          className="py-4 text-2xl font-bold bg-white rounded-xl hover:bg-gray-50 transition-colors"
        >
          0
        </motion.button>
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={() => {
            playSound('chime');
            onSubmit();
          }}
          className="py-4 text-xl font-bold bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          <ArrowRight className="w-6 h-6 mx-auto" />
        </motion.button>
      </div>
    </div>
  );
}
