"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordItem } from "@/lib/words-data";
import { cn } from "@/lib/utils";
import { Check, RefreshCw, Sparkles, Lightbulb } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { triggerConfetti } from "@/lib/confetti";
import { usePhonicsStore } from "@/hooks/use-phonics-store";

interface WordBuilderProps {
    item: WordItem;
    onComplete: () => void;
}

export function WordBuilder({ item, onComplete }: WordBuilderProps) {
    const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
    const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
    const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
    const [hintLetterIndex, setHintLetterIndex] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showSentence, setShowSentence] = useState(false);
    const { playLetterSound, playWordSound, playSentenceSound, playSequence} = useAudio();
    const { mode } = usePhonicsStore();

    useEffect(() => {
        // Shuffle letters but keep track of original indices if needed (simple string shuffle here)
        const shuffled = [...item.letters].sort(() => Math.random() - 0.5);
        setShuffledLetters(shuffled);
        setPlacedLetters(new Array(item.letters.length).fill(null));
        setUsedIndices(new Set());
        setIsComplete(false);
        setShowSentence(false);
    }, [item]);

    const handleLetterClick = (letter: string, index: number) => {
        if (isComplete) return;

        // Prevent clicking already-used letters
        if (usedIndices.has(index)) return;

        // Play sound based on mode
        const type = mode === "phonics" ? "phonics" : "name";
        playLetterSound(letter, type);

        // Find first empty slot
        const firstEmptyIndex = placedLetters.findIndex((l) => l === null);
        if (firstEmptyIndex === -1) return;

        const newPlaced = [...placedLetters];
        newPlaced[firstEmptyIndex] = letter;
        setPlacedLetters(newPlaced);

        // Mark this letter as used
        setUsedIndices(prev => new Set(prev).add(index));

        // Check if full
        if (firstEmptyIndex === item.letters.length - 1) {
            const formedWord = newPlaced.join("");
            if (formedWord === item.word) {
                handleSuccess(item.word, item.letters);
            } else {
                // Wrong word, reset after short delay
                playWordSound("oops");
                setTimeout(() => {
                    setPlacedLetters(new Array(item.letters.length).fill(null));
                    setUsedIndices(new Set());
                }, 800);
            }
        }
    };

    const handleSuccess = async (word: string, letters: string[]) => {
        setIsComplete(true);
        triggerConfetti();

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Wait a beat
        await delay(500);

        // Build sequence of sounds to play
        const soundType: "letter-phonics" | "letter-name" = mode === "phonics" ? "letter-phonics" : "letter-name";
        const letterSounds = letters.map(letter => ({
            type: soundType,
            value: letter
        }));
        const sequence = [
            ...letterSounds,
            { type: "word" as const, value: word },
        ];

        // Play the sequence (C... A... T... CAT!)
        await playSequence(sequence, 800);

        // Wait before showing sentence
        await delay(1500);

        // Show sentence context (visual only - no auto-play)
        // User can see the sentence but it won't play confusing audio
        setShowSentence(true);

        // Wait a bit before moving to next word
        await delay(2500);

        // Move to next word
        onComplete();
    };

    const handleReset = () => {
        setPlacedLetters(new Array(item.letters.length).fill(null));
        setUsedIndices(new Set());
        playWordSound("tryagain");
    };

    const handleHint = () => {
        const firstEmptyIndex = placedLetters.findIndex((l) => l === null);
        if (firstEmptyIndex !== -1) {
            const correctLetter = item.letters[firstEmptyIndex];

            // Find the index of the correct letter in shuffled letters that hasn't been used
            const correctLetterIndexInShuffled = shuffledLetters.findIndex(
                (letter, idx) => letter === correctLetter && !usedIndices.has(idx)
            );

            if (correctLetterIndexInShuffled !== -1) {
                // Highlight the correct letter
                setHintLetterIndex(correctLetterIndexInShuffled);

                // Clear highlight after 2 seconds
                setTimeout(() => {
                    setHintLetterIndex(null);
                }, 2000);
            }

            // Play hint sound
            const type = mode === "phonics" ? "phonics" : "name";
            playLetterSound(correctLetter, type);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
            {/* Target Word Slots */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
                {placedLetters.map((letter, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            "w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 rounded-xl sm:rounded-2xl border-b-4 sm:border-b-6 md:border-b-8 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black transition-all duration-300",
                            letter
                                ? "bg-white border-primary text-primary shadow-lg translate-y-0"
                                : "bg-white/40 border-white/60 border-dashed text-transparent shadow-none",
                            isComplete && "bg-green-400 border-green-600 text-white scale-110 rotate-3"
                        )}
                    >
                        <AnimatePresence mode="popLayout">
                            {letter && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    className="drop-shadow-sm"
                                >
                                    {letter}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Feedback & Sentence Area */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                <AnimatePresence>
                    {isComplete && (
                        <motion.div
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2 sm:gap-3 text-green-600 font-black text-xl sm:text-2xl md:text-3xl bg-white px-4 sm:px-6 py-2 rounded-full shadow-lg"
                        >
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                            <span>Great Job!</span>
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showSentence && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg max-w-xl mx-4"
                        >
                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 text-center">
                                {item.sentence}
                            </p>
                            {item.relatedWords && item.relatedWords.length > 0 && (
                                <div className="mt-3 flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                                        Word Family
                                    </span>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {item.relatedWords.map((word, idx) => (
                                            <span
                                                key={idx}
                                                className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full"
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Available Letters Bank */}
            <div className="bg-white/30 p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-[2rem] w-full max-w-lg backdrop-blur-sm relative">
                <button
                    onClick={handleHint}
                    className="absolute -top-4 sm:-top-5 md:-top-6 right-4 sm:right-6 bg-yellow-400 text-white p-2 sm:p-2.5 md:p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                    aria-label="Hint"
                >
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                </button>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                    {shuffledLetters.map((letter, i) => {
                        const isUsed = usedIndices.has(i);
                        const isHinted = hintLetterIndex === i;
                        return (
                            <motion.button
                                key={`${letter}-${i}`}
                                whileHover={!isUsed ? { scale: 1.1 } : {}}
                                whileTap={!isUsed ? { scale: 0.9 } : {}}
                                animate={isHinted ? {
                                    scale: [1, 1.15, 1, 1.15, 1],
                                    boxShadow: [
                                        "0 0 0 0 rgba(250, 204, 21, 0)",
                                        "0 0 0 8px rgba(250, 204, 21, 0.4)",
                                        "0 0 0 0 rgba(250, 204, 21, 0)",
                                        "0 0 0 8px rgba(250, 204, 21, 0.4)",
                                        "0 0 0 0 rgba(250, 204, 21, 0)"
                                    ]
                                } : {}}
                                transition={isHinted ? { duration: 2, ease: "easeInOut" } : {}}
                                onClick={() => handleLetterClick(letter, i)}
                                disabled={isUsed}
                                className={cn(
                                    "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl sm:rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.1)] sm:shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-2xl sm:text-3xl font-bold border-b-3 sm:border-b-4 transition-all",
                                    !isUsed && !isHinted && "text-gray-700 border-gray-200 hover:shadow-lg cursor-pointer active:border-b-0 active:translate-y-1 active:shadow-none",
                                    isUsed && "text-gray-300 opacity-40 cursor-not-allowed border-gray-200",
                                    isHinted && "text-yellow-600 border-yellow-400 bg-yellow-50"
                                )}
                            >
                                {letter}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            <button
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-600 p-2 sm:p-3 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Reset word"
            >
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
        </div>
    );
}
