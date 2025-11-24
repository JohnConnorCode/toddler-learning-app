"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordFamily } from "@/lib/word-families-data";
import { cn } from "@/lib/utils";
import { Volume2, Sparkles } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { triggerConfetti } from "@/lib/confetti";

interface WordFamilyCardProps {
    family: WordFamily;
    onComplete?: () => void;
}

export function WordFamilyCard({ family, onComplete }: WordFamilyCardProps) {
    const [revealedWords, setRevealedWords] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const { speak } = useSpeech();

    useEffect(() => {
        setRevealedWords([]);
        setIsComplete(false);
    }, [family]);

    const revealNextWord = () => {
        if (revealedWords.length < family.words.length) {
            const nextIndex = revealedWords.length;
            setRevealedWords([...revealedWords, nextIndex]);
            speak(family.words[nextIndex]);

            if (nextIndex === family.words.length - 1) {
                setTimeout(() => {
                    setIsComplete(true);
                    triggerConfetti();
                    if (onComplete) setTimeout(onComplete, 3000);
                }, 800);
            }
        }
    };

    const handlePatternClick = () => {
        speak(`The ${family.name} pattern`);
    };

    const handleWordClick = (word: string, e: React.MouseEvent) => {
        e.stopPropagation();
        speak(word);
    };

    const difficultyStars = "⭐".repeat(family.difficulty);

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
            {/* Header with Pattern */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex flex-col items-center gap-3"
            >
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl">{difficultyStars}</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-700">
                        {family.name}
                    </h2>
                </div>
                <motion.button
                    onClick={handlePatternClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "px-8 sm:px-12 py-4 sm:py-6 rounded-3xl text-white font-black text-4xl sm:text-5xl md:text-6xl shadow-2xl transition-all",
                        family.color
                    )}
                >
                    {family.pattern}
                </motion.button>
            </motion.div>

            {/* Main Card */}
            <motion.div
                className={cn(
                    "relative w-full rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] shadow-2xl",
                    family.color,
                    "bg-opacity-10"
                )}
            >
                {/* Words Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full mb-6">
                    <AnimatePresence>
                        {family.words.map((word, index) => (
                            <motion.button
                                key={word}
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={
                                    revealedWords.includes(index)
                                        ? { scale: 1, rotate: 0, opacity: 1 }
                                        : { scale: 0, rotate: -180, opacity: 0 }
                                }
                                transition={{
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 200
                                }}
                                onClick={(e) => handleWordClick(word, e)}
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all",
                                    "flex items-center justify-center min-h-[80px] sm:min-h-[100px]",
                                    "border-b-4 sm:border-b-6 border-gray-200",
                                    revealedWords.includes(index) && "animate-pulse-once"
                                )}
                            >
                                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-700">
                                    {word}
                                </span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Reveal Button / Complete Message */}
                <AnimatePresence mode="wait">
                    {!isComplete ? (
                        <motion.button
                            key="reveal-button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onClick={revealNextWord}
                            disabled={revealedWords.length === family.words.length}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-bold text-lg sm:text-xl shadow-lg transition-all",
                                revealedWords.length === family.words.length
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : cn(family.color, "hover:shadow-xl")
                            )}
                        >
                            {revealedWords.length === 0
                                ? "Tap to reveal words!"
                                : revealedWords.length === family.words.length
                                ? "All revealed!"
                                : `Reveal next word (${revealedWords.length}/${family.words.length})`}
                        </motion.button>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="flex items-center gap-3 text-green-600 font-black text-2xl sm:text-3xl bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl"
                        >
                            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                            <span>Perfect! You learned the {family.name}!</span>
                            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sound Button */}
                {revealedWords.length > 0 && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={handlePatternClick}
                        className={cn(
                            "absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-4 rounded-full shadow-lg transition-all hover:scale-110",
                            family.color
                        )}
                    >
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.button>
                )}
            </motion.div>

            {/* Image Preview (if available) */}
            {family.image && revealedWords.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white"
                >
                    <img
                        src={family.image}
                        alt={family.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}
        </div>
    );
}
