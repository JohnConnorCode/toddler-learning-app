"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhonicsProgress } from "@/hooks/use-phonics-progress";
import { getPhonicsItemsForUnit, getUnitById, MASTERY_THRESHOLD, MIN_MASTERY_FOR_PROGRESSION } from "@/lib/systematic-phonics-data";
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Award, Volume2, Repeat, RefreshCw, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/hooks/use-audio";
import { playFeedback } from "@/lib/sound-effects";
import { DiscoveryIntro, CharacterStory, AffirmationMoment } from "@/components/teaching";

interface UnitPracticeProps {
  unitId: number;
  onExit: () => void;
  onComplete: () => void;
}

export function UnitPractice({ unitId, onExit, onComplete }: UnitPracticeProps) {
  const {
    markLetterPracticed,
    updateUnitLetterCompletion,
    completeUnit,
    getUnitProgress,
  } = usePhonicsProgress();

  const { playLetterSound, stopAll } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showRetryScreen, setShowRetryScreen] = useState(false);
  const [teachingPhase, setTeachingPhase] = useState<"discovery" | "character" | "intro" | "sound" | "word" | "practice" | "affirmation" | "quiz">("discovery");
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [letterMastery, setLetterMastery] = useState<Record<string, boolean>>({});
  const [attemptCount, setAttemptCount] = useState(1);
  const [strugglingLetters, setStrugglingLetters] = useState<string[]>([]);

  // Refs to prevent re-render issues
  const hasPlayedForIndex = useRef<number>(-1);
  const isPlayingRef = useRef(false);
  const isMountedRef = useRef(true);

  const unit = getUnitById(unitId);
  const phonicsItems = getPhonicsItemsForUnit(unitId);
  const currentItem = phonicsItems[currentIndex];
  const unitProgress = getUnitProgress(unitId);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopAll();
    };
  }, [stopAll]);

  // Generate quiz options (correct letter + 3 random distractors)
  const generateQuizOptions = useCallback(() => {
    if (!currentItem) return [];
    const otherLetters = phonicsItems
      .filter(item => item.letter !== currentItem.letter)
      .map(item => item.letter);
    // Add some common confusing letters if not enough in unit
    const extraLetters = ['B', 'D', 'P', 'M', 'N', 'S', 'F', 'V'].filter(
      l => l !== currentItem.letter && !otherLetters.includes(l)
    );
    const allDistractors = [...otherLetters, ...extraLetters];
    // Shuffle and take 3
    const shuffled = allDistractors.sort(() => Math.random() - 0.5).slice(0, 3);
    // Add correct answer and shuffle again
    const options = [...shuffled, currentItem.letter].sort(() => Math.random() - 0.5);
    return options;
  }, [currentItem, phonicsItems]);

  // Play the full teaching sequence for current letter
  const playTeachingSequence = useCallback(async () => {
    if (!currentItem) return;

    // Use ref to prevent overlapping plays
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);

    setTeachingPhase("intro");
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Wait a moment, then play phonics sound
    await new Promise(r => setTimeout(r, 500));
    if (!isMountedRef.current) return;

    setTeachingPhase("sound");

    await playLetterSound(currentItem.letter, "phonics");
    if (!isMountedRef.current) return;
    await new Promise(r => setTimeout(r, 300));

    // Play letter name
    await playLetterSound(currentItem.letter, "name");
    if (!isMountedRef.current) return;
    await new Promise(r => setTimeout(r, 300));

    // Play example
    setTeachingPhase("word");
    await playLetterSound(currentItem.letter, "example");
    if (!isMountedRef.current) return;

    setTeachingPhase("practice");
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [currentItem, playLetterSound]);

  // Start the quiz for current letter
  const startQuiz = useCallback(() => {
    setQuizOptions(generateQuizOptions());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTeachingPhase("quiz");
    // Play the sound they need to identify
    if (currentItem) {
      playLetterSound(currentItem.letter, "phonics");
    }
  }, [generateQuizOptions, currentItem, playLetterSound]);

  // Handle discovery phase completion (Ms. Rachel methodology)
  const handleDiscoveryComplete = useCallback(() => {
    if (currentItem?.character) {
      setTeachingPhase("character");
    } else {
      setTeachingPhase("intro");
      // Delay to let state update before playing
      setTimeout(() => playTeachingSequence(), 100);
    }
  }, [currentItem, playTeachingSequence]);

  // Handle character story completion (Ms. Rachel methodology)
  const handleCharacterComplete = useCallback(() => {
    setTeachingPhase("intro");
    // Delay to let state update before playing
    setTimeout(() => playTeachingSequence(), 100);
  }, [playTeachingSequence]);

  // Handle affirmation completion - move to next letter
  const handleAffirmationComplete = useCallback(() => {
    if (currentIndex < phonicsItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Reset to discovery phase for next letter
      setTeachingPhase("discovery");
    } else {
      // All letters completed - calculate actual mastery score
      const masteredCount = Object.values(letterMastery).filter(Boolean).length;
      const masteryScore = masteredCount / phonicsItems.length;

      // Track which letters were missed
      const missed = phonicsItems
        .filter(item => !letterMastery[item.letter])
        .map(item => item.letter);
      setStrugglingLetters(missed);

      // Check against mastery threshold (90%)
      if (masteryScore >= MASTERY_THRESHOLD) {
        setShowCompletion(true);
      } else if (masteryScore >= MIN_MASTERY_FOR_PROGRESSION && attemptCount >= 3) {
        setShowCompletion(true);
      } else {
        setShowRetryScreen(true);
      }
    }
  }, [currentIndex, phonicsItems, letterMastery, attemptCount]);

  // Handle quiz answer - with tap feedback for toddlers
  const handleQuizAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null || !currentItem) return; // Already answered

    // Immediate tap feedback - toddlers need instant response!
    playFeedback("pop", "light");

    setSelectedAnswer(answer);
    const correct = answer === currentItem.letter;
    setIsCorrect(correct);

    // Track mastery
    setLetterMastery(prev => ({
      ...prev,
      [currentItem.letter]: correct
    }));

    // Play feedback sound - success or encouragement
    if (correct) {
      playFeedback("success", "medium");
      playLetterSound(currentItem.letter, "name");
    } else {
      playFeedback("snap", "light"); // Gentle "try again" sound
    }
  }, [selectedAnswer, currentItem, playLetterSound]);

  // Auto-play when letter changes - only once per index
  useEffect(() => {
    if (currentItem && hasPlayedForIndex.current !== currentIndex) {
      hasPlayedForIndex.current = currentIndex;

      // Mark progress
      markLetterPracticed(currentItem.letter);
      updateUnitLetterCompletion(unitId);

      // Determine starting phase based on available Ms. Rachel content
      if (currentItem.discoveryObjects) {
        // Has discovery intro - start with discovery phase (no auto-play needed)
        setTeachingPhase("discovery");
      } else if (currentItem.character) {
        // Has character story but no discovery - start with character
        setTeachingPhase("character");
      } else {
        // No enhanced content - use traditional teaching sequence
        const timer = setTimeout(() => {
          if (isMountedRef.current && !isPlayingRef.current) {
            setTeachingPhase("intro");
            playTeachingSequence();
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
    // Note: intentionally limited dependencies to prevent re-triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, unitId]);

  if (!unit || phonicsItems.length === 0) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-gray-600 font-bold">Unit not found</p>
          <button
            onClick={onExit}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const nextLetter = () => {
    // Can only advance if quiz was passed OR if they answered correctly
    if (teachingPhase !== "quiz" || !isCorrect) {
      return; // Must pass quiz first
    }

    // Show affirmation before advancing (Ms. Rachel methodology)
    setTeachingPhase("affirmation");
  };

  const prevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishUnit = () => {
    // Calculate actual mastery score based on quiz results
    const masteredCount = Object.values(letterMastery).filter(Boolean).length;
    const masteryScore = Math.round((masteredCount / phonicsItems.length) * 100);
    completeUnit(unitId, masteryScore);
    onComplete();
  };

  // Handle retry - with tap feedback
  const handleRetry = () => {
    playFeedback("pop", "medium"); // Tap sound for toddlers!
    setAttemptCount(prev => prev + 1);
    setShowRetryScreen(false);
    setCurrentIndex(0);
    setLetterMastery({});
    setTeachingPhase("intro");
    hasPlayedForIndex.current = -1; // Reset play tracking
  };

  // Retry screen - TODDLER FRIENDLY (no text, visual stars only)
  if (showRetryScreen) {
    const masteredCount = Object.values(letterMastery).filter(Boolean).length;
    const masteryPercent = masteredCount / phonicsItems.length;
    const totalStars = phonicsItems.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center"
        >
          {/* Big encouraging emoji - toddlers understand this! */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            className="text-7xl sm:text-8xl mb-6"
          >
            {masteredCount === 0 ? "🤗" : masteredCount < totalStars / 2 ? "💪" : "🌟"}
          </motion.div>

          {/* VISUAL PROGRESS: Stars instead of percentages! */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
            {phonicsItems.map((item, i) => {
              const isMastered = letterMastery[item.letter];
              return (
                <motion.div
                  key={item.letter}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Star */}
                  <Star
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12",
                      isMastered
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                        : "text-gray-300"
                    )}
                  />
                  {/* Letter inside star area */}
                  <span className={cn(
                    "absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-black",
                    isMastered ? "text-yellow-700" : "text-gray-400"
                  )}>
                    {item.letter}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Show letters to practice - VISUAL, minimal text */}
          {strugglingLetters.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-4 sm:p-6 mb-6">
              {/* Arrow pointing at letters - visual cue */}
              <div className="text-4xl mb-3">👇</div>
              <div className="flex flex-wrap justify-center gap-3">
                {strugglingLetters.map((letter, i) => {
                  const item = phonicsItems.find(p => p.letter === letter);
                  return (
                    <motion.div
                      key={letter}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl text-white shadow-lg",
                        item?.color || "bg-gray-400"
                      )}
                    >
                      {letter}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BIG TRY AGAIN BUTTON - 60px+ tap target */}
          <div className="flex flex-col gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="w-full py-6 sm:py-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-black text-2xl sm:text-3xl shadow-lg flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10" />
              <span>🔄</span>
            </motion.button>

            {attemptCount >= 3 && masteryPercent >= MIN_MASTERY_FOR_PROGRESSION && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowRetryScreen(false);
                  setShowCompletion(true);
                }}
                className="w-full py-5 sm:py-6 bg-gray-200 text-gray-600 rounded-full font-bold text-xl flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
            )}
          </div>

          {/* Visual attempt indicator - dots not text */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={cn(
                  "w-4 h-4 rounded-full",
                  num <= attemptCount ? "bg-purple-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6"
          >
            <Award className="w-14 h-14 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-4">
            Unit {unit.id} Complete!
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            You practiced all {phonicsItems.length} letters in this unit!
          </p>

          {/* Letters reviewed */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Letters Learned:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {phonicsItems.map((item) => (
                <div
                  key={item.letter}
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg",
                    item.color
                  )}
                >
                  {item.letter}
                </div>
              ))}
            </div>
          </div>

          {/* Blendable words preview */}
          {unit.blendableWords.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Words You Can Read Now:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {unit.blendableWords.slice(0, 12).map((word) => (
                  <span
                    key={word}
                    className="px-4 py-2 bg-white text-purple-700 rounded-full text-sm font-bold shadow"
                  >
                    {word}
                  </span>
                ))}
                {unit.blendableWords.length > 12 && (
                  <span className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-bold shadow">
                    +{unit.blendableWords.length - 12} more!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-black text-lg hover:bg-gray-300 transition-colors"
            >
              Practice Again
            </button>
            <button
              onClick={handleFinishUnit}
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Continue to Next Unit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
        {/* TODDLER-FRIENDLY: Big 60px+ back button */}
        <button
          onClick={onExit}
          className="bg-white p-4 sm:p-5 rounded-full shadow-md hover:bg-gray-50 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
        >
          <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
        </button>

        {/* Unit info & progress */}
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm font-bold text-gray-500 mb-1">
            Unit {unit.id}: {unit.title}
          </span>
          <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
            <span className="font-bold text-primary text-base sm:text-lg">
              {currentIndex + 1} / {phonicsItems.length}
            </span>
          </div>
        </div>

        <div className="w-10 sm:w-12" /> {/* Spacer */}
      </header>

      {/* Progress bar */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="max-w-4xl mx-auto w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / phonicsItems.length) * 100}%` }}
            className={cn("h-full bg-gradient-to-r", unit.color)}
          />
        </div>
      </div>

      {/* Main Teaching Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${teachingPhase}`}
            initial={{ x: 300, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -300, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-lg"
          >
            {/* Ms. Rachel Methodology: Discovery Intro */}
            {teachingPhase === "discovery" && currentItem.discoveryObjects && (
              <DiscoveryIntro
                letter={currentItem.letter}
                objects={currentItem.discoveryObjects}
                wrongGuesses={currentItem.wrongGuesses}
                onComplete={handleDiscoveryComplete}
              />
            )}

            {/* Ms. Rachel Methodology: Character Story */}
            {teachingPhase === "character" && currentItem.character && (
              <CharacterStory
                letter={currentItem.letter}
                character={currentItem.character}
                onComplete={handleCharacterComplete}
              />
            )}

            {/* Ms. Rachel Methodology: Affirmation */}
            {teachingPhase === "affirmation" && (
              <AffirmationMoment
                type="proud-of-you"
                onComplete={handleAffirmationComplete}
              />
            )}

            {/* Traditional Teaching Card - for intro/sound/word/practice/quiz phases */}
            {(teachingPhase === "intro" || teachingPhase === "sound" || teachingPhase === "word" || teachingPhase === "practice" || teachingPhase === "quiz") && (
            <div className={cn(
              "bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center",
              "border-4 border-white"
            )}>
              {/* Big Letter Display */}
              <motion.div
                animate={teachingPhase === "sound" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: teachingPhase === "sound" ? Infinity : 0 }}
                className={cn(
                  "w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl flex items-center justify-center mb-4",
                  currentItem.color
                )}
              >
                <span className="text-7xl sm:text-8xl font-black text-white drop-shadow-lg">
                  {currentItem.letter}
                </span>
              </motion.div>

              {/* Teaching Phase Indicator */}
              <div className="mb-4">
                {teachingPhase === "intro" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-bold text-gray-600"
                  >
                    This is the letter...
                  </motion.p>
                )}
                {teachingPhase === "sound" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-2xl font-black text-primary mb-2">
                      "{currentItem.letter}" says...
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span className="text-xl font-black">
                        /{currentItem.sound || currentItem.letter.toLowerCase()}/
                      </span>
                    </motion.div>
                  </motion.div>
                )}
                {teachingPhase === "word" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-lg font-bold text-gray-500 mb-2">
                      {currentItem.letter} is for...
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={currentItem.image}
                          alt={currentItem.word}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-3xl font-black text-gray-800">
                        <span className={cn("text-4xl", currentItem.color.replace("bg-", "text-"))}>
                          {currentItem.letter}
                        </span>
                        {currentItem.word.slice(1)}
                      </p>
                    </div>
                  </motion.div>
                )}
                {teachingPhase === "practice" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-lg font-bold text-gray-600">Examples with "{currentItem.letter}":</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentItem.exampleWords.map((word, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 rounded-full font-bold text-gray-700"
                        >
                          <span className={currentItem.color.replace("bg-", "text-")}>
                            {word.charAt(0).toUpperCase()}
                          </span>
                          {word.slice(1)}
                        </span>
                      ))}
                    </div>
                    {/* Quiz button */}
                    <button
                      onClick={startQuiz}
                      className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-black text-lg hover:bg-green-600 active:scale-95 transition-all shadow-lg"
                    >
                      Test Your Knowledge!
                    </button>
                  </motion.div>
                )}
                {teachingPhase === "quiz" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <button
                        onClick={() => currentItem && playLetterSound(currentItem.letter, "phonics")}
                        className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <Volume2 className="w-6 h-6 text-blue-600" />
                      </button>
                      <p className="text-xl font-black text-gray-800">
                        Which letter makes this sound?
                      </p>
                    </div>

                    {/* Quiz Options - TODDLER: Big 80px+ tap targets */}
                    <div className="grid grid-cols-2 gap-4">
                      {quizOptions.map((letter) => {
                        const isSelected = selectedAnswer === letter;
                        const isCorrectAnswer = letter === currentItem.letter;
                        const showResult = selectedAnswer !== null;

                        return (
                          <button
                            key={letter}
                            onClick={() => handleQuizAnswer(letter)}
                            disabled={showResult}
                            className={cn(
                              "p-6 sm:p-8 rounded-2xl font-black text-5xl sm:text-6xl transition-all border-4 min-h-[80px] sm:min-h-[100px]",
                              !showResult && "bg-white border-gray-200 hover:border-blue-400 hover:scale-105 active:scale-95",
                              showResult && isSelected && isCorrect && "bg-green-100 border-green-500 scale-105",
                              showResult && isSelected && !isCorrect && "bg-red-100 border-red-500",
                              showResult && !isSelected && isCorrectAnswer && "bg-green-100 border-green-500 ring-4 ring-green-300",
                              showResult && !isSelected && !isCorrectAnswer && "opacity-50"
                            )}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback - Specific praise based on letter */}
                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        {isCorrect ? (
                          <div className="text-green-600">
                            <p className="text-2xl font-black">Correct!</p>
                            <p className="text-lg">
                              You know the <span className="font-bold">/{currentItem.sound || currentItem.letter.toLowerCase()}/</span> sound!
                            </p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="text-orange-600">
                            <p className="text-xl font-bold">Almost!</p>
                            <p className="text-base text-gray-600">
                              "{currentItem.letter}" makes the <span className="font-bold text-purple-600">/{currentItem.sound || currentItem.letter.toLowerCase()}/</span> sound
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Like in "{currentItem.word}"
                            </p>
                            <button
                              onClick={playTeachingSequence}
                              className="mt-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold hover:bg-orange-200 flex items-center gap-2 mx-auto"
                            >
                              <Volume2 className="w-4 h-4" />
                              Hear it again
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Replay Button - hide during quiz */}
              {teachingPhase !== "quiz" && (
                <button
                  onClick={playTeachingSequence}
                  disabled={isPlaying}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all",
                    isPlaying
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                  )}
                >
                  <Repeat className="w-5 h-5" />
                  {isPlaying ? "Playing..." : "Hear Again"}
                </button>
              )}
            </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls - TODDLER: Big 70px+ buttons */}
        <div className="flex items-center gap-6 sm:gap-8 mt-6 sm:mt-8 md:mt-12">
          <button
            onClick={prevLetter}
            disabled={currentIndex === 0}
            className="p-5 sm:p-6 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all min-w-[70px] min-h-[70px] flex items-center justify-center"
          >
            <ChevronLeft className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
          </button>

          <button
            onClick={nextLetter}
            disabled={teachingPhase !== "quiz" || !isCorrect}
            className={cn(
              "p-6 sm:p-7 md:p-8 rounded-full shadow-lg transition-all min-w-[80px] min-h-[80px] sm:min-w-[90px] sm:min-h-[90px] flex items-center justify-center",
              teachingPhase === "quiz" && isCorrect
                ? currentIndex === phonicsItems.length - 1
                  ? "bg-green-500 hover:shadow-xl active:scale-90"
                  : "bg-secondary hover:shadow-xl active:scale-90"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            )}
          >
            {currentIndex === phonicsItems.length - 1 ? (
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            ) : (
              <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
