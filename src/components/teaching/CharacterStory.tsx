"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterCharacter } from "@/lib/phonics-data";
import { useAudio } from "@/hooks/use-audio";
import { Sparkles, Heart, HelpCircle } from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface CharacterStoryProps {
    letter: string;
    character: LetterCharacter;
    onComplete: () => void;
}

type Phase = 'intro' | 'problem' | 'help' | 'celebration';

// Emoji map for character emotions
const EMOTION_EMOJI: Record<LetterCharacter['emotion'], string> = {
    sad: "",
    confused: "",
    curious: "",
    excited: "",
    shy: ""
};

const EMOTION_COLORS: Record<LetterCharacter['emotion'], string> = {
    sad: "from-blue-100 to-blue-200",
    confused: "from-purple-100 to-purple-200",
    curious: "from-yellow-100 to-yellow-200",
    excited: "from-orange-100 to-orange-200",
    shy: "from-pink-100 to-pink-200"
};

export function CharacterStory({
    letter,
    character,
    onComplete
}: CharacterStoryProps) {
    const [phase, setPhase] = useState<Phase>('intro');
    const { playLetterSound, playWordSound } = useAudio();

    // Auto-advance through phases
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        if (phase === 'intro') {
            timers.push(setTimeout(() => setPhase('problem'), 2500));
        } else if (phase === 'problem') {
            timers.push(setTimeout(() => setPhase('help'), 4000));
        }
        // 'help' waits for user tap
        // 'celebration' auto-completes

        return () => timers.forEach(clearTimeout);
    }, [phase]);

    useEffect(() => {
        if (phase === 'celebration') {
            triggerConfetti();
            playLetterSound(letter, 'name');
            const timer = setTimeout(() => onComplete(), 4000);
            return () => clearTimeout(timer);
        }
    }, [phase, letter, playLetterSound, onComplete]);

    const handleHelp = () => {
        if (phase === 'help') {
            setPhase('celebration');
        }
    };

    const bgGradient = EMOTION_COLORS[character.emotion];

    return (
        <div className={`flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-b ${bgGradient} rounded-3xl`}>
            {/* Character */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative mb-6"
            >
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                    <span className="text-6xl sm:text-7xl">
                        {EMOTION_EMOJI[character.emotion]}
                    </span>
                </div>

                {/* Emotion indicator */}
                <AnimatePresence>
                    {(phase === 'intro' || phase === 'problem') && character.emotion === 'sad' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 -right-2"
                        >
                            <span className="text-3xl"></span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Happy indicator after helping */}
                <AnimatePresence>
                    {phase === 'celebration' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                        >
                            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Character name */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-700 mb-4"
            >
                {character.name}
            </motion.h2>

            {/* Phase content */}
            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <p className="text-xl text-gray-600">
                            This is {character.name}!
                        </p>
                        {character.emotion === 'sad' && (
                            <p className="text-lg text-gray-500 mt-2">
                                Oh no, {character.name.split(' ')[0]} looks {character.emotion}...
                            </p>
                        )}
                    </motion.div>
                )}

                {phase === 'problem' && (
                    <motion.div
                        key="problem"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center max-w-md"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                            <p className="text-xl text-gray-700 italic">
                                "{character.problem}"
                            </p>
                        </div>
                        <p className="text-lg text-purple-600 font-semibold mt-3">
                            Can you help?
                        </p>
                    </motion.div>
                )}

                {phase === 'help' && (
                    <motion.div
                        key="help"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <p className="text-lg text-gray-600 mb-4">
                            What letter does {character.name.split(' ').pop()} start with?
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleHelp}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-lg text-2xl font-bold"
                        >
                            <span className="text-4xl mr-2">{letter}</span>
                            <span>is for {character.name.split(' ').pop()}!</span>
                        </motion.button>
                        <p className="text-sm text-gray-400 mt-3">
                            Tap to help {character.name.split(' ')[0]}!
                        </p>
                    </motion.div>
                )}

                {phase === 'celebration' && (
                    <motion.div
                        key="celebration"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles className="w-8 h-8 text-yellow-500" />
                            <span className="text-3xl font-black text-green-600">
                                You helped!
                            </span>
                            <Sparkles className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md">
                            <p className="text-xl text-gray-700 italic">
                                "{character.celebration}"
                            </p>
                        </div>

                        {/* Letter display */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="mt-4"
                        >
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
                                <span className="text-4xl font-black">{letter}</span>
                                <span className="text-xl font-bold">says "{letter.toLowerCase()}"</span>
                            </div>
                        </motion.div>

                        {/* Memory trick if available */}
                        {character.memoryTrick && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-sm text-gray-500 mt-4 max-w-sm mx-auto"
                            >
                                {character.memoryTrick}
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
