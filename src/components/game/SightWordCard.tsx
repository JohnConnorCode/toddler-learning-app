"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SightWord } from "@/lib/sight-words-data";
import { cn } from "@/lib/utils";
import { Volume2, Eye, CheckCircle } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { triggerConfetti } from "@/lib/confetti";

interface SightWordCardProps {
    item: SightWord;
    onComplete?: () => void;
}

export function SightWordCard({ item, onComplete }: SightWordCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [showSentence, setShowSentence] = useState(false);
    const { speak } = useSpeech();

    useEffect(() => {
        setIsRevealed(false);
        setShowSentence(false);
    }, [item]);

    const handleReveal = () => {
        if (!isRevealed) {
            setIsRevealed(true);
            speak(item.word);

            setTimeout(() => {
                setShowSentence(true);
                speak(item.sentence);
            }, 1200);

            setTimeout(() => {
                triggerConfetti();
                if (onComplete) onComplete();
            }, 3500);
        }
    };

    const handleRepeat = (e: React.MouseEvent) => {
        e.stopPropagation();
        speak(isRevealed ? item.sentence : item.word);
    };

    const difficultyColors = {
        1: "from-green-400 to-emerald-500",
        2: "from-blue-400 to-cyan-500",
        3: "from-purple-400 to-violet-500",
        4: "from-orange-400 to-amber-500",
        5: "from-red-400 to-rose-500"
    };

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
            {/* Difficulty Badge */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn(
                    "px-4 sm:px-6 py-2 rounded-full text-white font-bold text-sm sm:text-base shadow-lg bg-gradient-to-r",
                    difficultyColors[item.difficulty as keyof typeof difficultyColors]
                )}
            >
                {item.category}
            </motion.div>

            {/* Main Card */}
            <motion.div
                onClick={handleReveal}
                whileHover={!isRevealed ? { scale: 1.02 } : {}}
                whileTap={!isRevealed ? { scale: 0.98 } : {}}
                className={cn(
                    "relative w-full rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] shadow-2xl transition-all duration-300",
                    !isRevealed
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:shadow-3xl"
                        : "bg-gradient-to-br from-green-400 to-blue-500"
                )}
            >
                <AnimatePresence mode="wait">
                    {!isRevealed ? (
                        <motion.div
                            key="hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 sm:gap-6"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }}
                                className="bg-white/20 p-6 sm:p-8 rounded-full backdrop-blur-sm"
                            >
                                <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </motion.div>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center drop-shadow-lg">
                                Tap to reveal the word!
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="revealed"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="flex flex-col items-center gap-4 sm:gap-6 w-full"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] tracking-tight">
                                    {item.word}
                                </h2>
                            </motion.div>

                            <AnimatePresence>
                                {showSentence && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white/90 backdrop-blur-sm px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl max-w-xl w-full"
                                    >
                                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 text-center leading-relaxed">
                                            {item.sentence}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={handleRepeat}
                                className="absolute bottom-6 right-6 bg-white/30 hover:bg-white/50 p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                            >
                                <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none rounded-3xl sm:rounded-[3rem]" />
            </motion.div>

            {/* Progress indicator */}
            {isRevealed && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600 font-bold text-lg sm:text-xl"
                >
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span>Great job!</span>
                </motion.div>
            )}
        </div>
    );
}
