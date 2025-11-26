"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PhonicsItem } from "@/lib/phonics-data";
import { Volume2 } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { usePhonicsStore } from "@/hooks/use-phonics-store";

interface LetterCardProps {
    item: PhonicsItem;
    onComplete?: () => void;
}

export function LetterCard({ item, onComplete }: LetterCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const { playLetterSound, stopAll, playSequence } = useAudio();
    const { mode } = usePhonicsStore();
    const isPlayingSequence = useRef(false);
    const isMounted = useRef(true);

    // Reset flip state when item changes and cleanup
    useEffect(() => {
        setIsFlipped(false);
        isPlayingSequence.current = false;
        return () => {
            isMounted.current = false;
        };
    }, [item]);

    // Cleanup on unmount
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            stopAll();
        };
    }, [stopAll]);

    const handleTap = useCallback(async () => {
        if (!isFlipped) {
            setIsFlipped(true);

            // Prevent overlapping audio sequences
            if (isPlayingSequence.current) return;
            isPlayingSequence.current = true;

            // Stop any currently playing audio
            stopAll();

            // Play complete sequence: phonics → letter name → example
            await playSequence([
                { type: "letter-phonics", value: item.letter },
                { type: "letter-name", value: item.letter },
                { type: "letter-example", value: item.letter },
            ], 400);

            if (isMounted.current) {
                isPlayingSequence.current = false;
            }

            if (onComplete) onComplete();
        } else {
            setIsFlipped(false);
            stopAll();
            // When flipping back, just play phonics sound
            playLetterSound(item.letter, "phonics");
        }
    }, [isFlipped, item.letter, onComplete, playLetterSound, playSequence, stopAll]);

    const handleSoundOnly = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        stopAll();
        const type = mode === "phonics" ? "phonics" : "name";
        playLetterSound(item.letter, type);
    }, [mode, item.letter, playLetterSound, stopAll]);

    return (
        <div className="perspective-1000 w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[400px] cursor-pointer group" onClick={handleTap}>
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front - Letter */}
                <div className={cn(
                    "absolute inset-0 backface-hidden rounded-2xl sm:rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center border-4 sm:border-6 md:border-8 border-white/30",
                    item.color,
                    "group-hover:scale-105 transition-transform duration-300"
                )}>
                    <span className="text-[8rem] sm:text-[10rem] md:text-[11rem] font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]">
                        {item.letter}
                    </span>

                    {/* Vowel Indicator (Subtle) */}
                    {item.isVowel && (
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                            <span className="text-white font-bold text-[10px] sm:text-xs tracking-widest">VOWEL</span>
                        </div>
                    )}

                    <button
                        onClick={handleSoundOnly}
                        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"
                    >
                        <Volume2 className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                    </button>

                    {/* Decorative pattern */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                </div>

                {/* Back - Words/Image */}
                <div
                    className={cn(
                        "absolute inset-0 backface-hidden rounded-2xl sm:rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-4 sm:p-6 border-4 sm:border-6 md:border-8 border-white/30 bg-white",
                    )}
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="flex flex-col items-center">
                        <span className={cn("text-5xl sm:text-6xl md:text-7xl font-black mb-1", `text-${item.color.replace('bg-', '')}`)}>
                            {item.letter}
                        </span>
                        <span className="text-2xl sm:text-3xl text-gray-800 font-bold tracking-wider">{item.word}</span>
                    </div>

                    {/* Real Image */}
                    <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 md:border-4 border-gray-100 shadow-inner">
                        <img
                            src={item.image}
                            alt={item.word}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Example Words */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-widest">Examples</span>
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {item.exampleWords.map((word, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
