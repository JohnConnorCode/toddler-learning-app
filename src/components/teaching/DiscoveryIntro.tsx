"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiscoveryObject } from "@/lib/phonics-data";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useAudio } from "@/hooks/use-audio";
import { Sparkles, HelpCircle, Check } from "lucide-react";

interface DiscoveryIntroProps {
    letter: string;
    objects: [DiscoveryObject, DiscoveryObject];
    wrongGuesses?: string[];
    onComplete: () => void;
}

type Phase = 'reveal' | 'question' | 'wrong-guess' | 'discovery' | 'celebration';

export function DiscoveryIntro({
    letter,
    objects,
    wrongGuesses = [],
    onComplete
}: DiscoveryIntroProps) {
    const [phase, setPhase] = useState<Phase>('reveal');
    const [wrongGuessIndex, setWrongGuessIndex] = useState(0);
    const { playWordSound } = useAudio();

    // Auto-advance through phases
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        if (phase === 'reveal') {
            // Show objects for 2 seconds, then ask question
            timers.push(setTimeout(() => setPhase('question'), 2000));
        } else if (phase === 'question') {
            // Show question for 3 seconds, then show wrong guess
            timers.push(setTimeout(() => {
                if (wrongGuesses.length > 0) {
                    setPhase('wrong-guess');
                } else {
                    setPhase('discovery');
                }
            }, 3000));
        } else if (phase === 'wrong-guess') {
            // Show wrong guess for 2.5 seconds
            timers.push(setTimeout(() => {
                if (wrongGuessIndex < wrongGuesses.length - 1) {
                    setWrongGuessIndex(prev => prev + 1);
                } else {
                    setPhase('discovery');
                }
            }, 2500));
        } else if (phase === 'discovery') {
            // Let child tap to discover, or auto-advance after 5 seconds
            timers.push(setTimeout(() => setPhase('celebration'), 5000));
        } else if (phase === 'celebration') {
            // Celebrate for 3 seconds then complete
            timers.push(setTimeout(() => onComplete(), 3000));
        }

        return () => timers.forEach(clearTimeout);
    }, [phase, wrongGuessIndex, wrongGuesses, onComplete]);

    const handleDiscoveryTap = () => {
        if (phase === 'discovery') {
            playWordSound(letter.toLowerCase());
            setPhase('celebration');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl">
            {/* Objects Display */}
            <div className="flex gap-8 mb-8">
                {objects.map((obj, i) => (
                    <motion.div
                        key={obj.name}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.3, type: "spring" }}
                        className="relative"
                    >
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white">
                            <ImageWithFallback
                                src={obj.image}
                                alt={obj.name}
                                fallbackText={obj.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <AnimatePresence>
                            {(phase === 'discovery' || phase === 'celebration') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md"
                                >
                                    <span className="font-bold text-gray-700">{obj.name}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Phase-specific content */}
            <AnimatePresence mode="wait">
                {phase === 'reveal' && (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <p className="text-2xl font-bold text-purple-600">
                            Look at these!
                        </p>
                    </motion.div>
                )}

                {phase === 'question' && (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <p className="text-2xl font-bold text-purple-600 mb-2">
                            What could this mean?
                        </p>
                        <p className="text-lg text-gray-500">
                            Can you help me figure it out?
                        </p>
                    </motion.div>
                )}

                {phase === 'wrong-guess' && (
                    <motion.div
                        key={`wrong-${wrongGuessIndex}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-center max-w-md"
                    >
                        <p className="text-xl text-gray-600 italic">
                            "{wrongGuesses[wrongGuessIndex]}"
                        </p>
                        <p className="text-lg text-purple-500 mt-2 font-semibold">
                            Hmm, that's not it! Keep thinking...
                        </p>
                    </motion.div>
                )}

                {phase === 'discovery' && (
                    <motion.button
                        key="discovery"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDiscoveryTap}
                        className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <p className="text-xl font-bold mb-1">
                            I know!
                        </p>
                        <p className="text-lg">
                            What letter do {objects[0].name} and {objects[1].name} start with?
                        </p>
                        <p className="text-3xl font-black mt-2 animate-pulse">
                            Tap to discover!
                        </p>
                    </motion.button>
                )}

                {phase === 'celebration' && (
                    <motion.div
                        key="celebration"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: 2 }}
                            className="inline-block"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto">
                                <span className="text-5xl font-black text-white">{letter}</span>
                            </div>
                        </motion.div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="w-8 h-8 text-yellow-500" />
                            <p className="text-2xl font-black text-green-600">
                                Yes! It's the letter {letter}!
                            </p>
                            <Sparkles className="w-8 h-8 text-yellow-500" />
                        </div>
                        <p className="text-lg text-gray-600">
                            {objects[0].name} and {objects[1].name} both start with {letter}!
                        </p>
                        <Check className="w-12 h-12 text-green-500 mx-auto mt-4" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
