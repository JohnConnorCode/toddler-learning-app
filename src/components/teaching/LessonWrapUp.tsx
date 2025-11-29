"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/hooks/use-audio";
import { Heart, Sparkles, Wind } from "lucide-react";

interface LessonWrapUpProps {
    learnedItems: string[]; // What was learned (e.g., ["the letter A", "the letter T", "the word 'at'"])
    childName?: string;
    onComplete: () => void;
}

type Phase = 'review' | 'proud' | 'feelings' | 'breathing' | 'love' | 'goodbye';

export function LessonWrapUp({
    learnedItems,
    childName,
    onComplete
}: LessonWrapUpProps) {
    const [phase, setPhase] = useState<Phase>('review');
    const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in');
    const { playSentenceSound } = useAudio();

    // Phase content and timing
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        switch (phase) {
            case 'review':
                playSentenceSound(`We had such a fun day together! We learned ${learnedItems.join(' and ')}.`);
                timers.push(setTimeout(() => setPhase('proud'), 5000));
                break;
            case 'proud':
                playSentenceSound("I am so, so, so proud of you!");
                timers.push(setTimeout(() => setPhase('feelings'), 3500));
                break;
            case 'feelings':
                playSentenceSound("Remember, it's okay to have big feelings. Taking a deep breath can help.");
                timers.push(setTimeout(() => setPhase('breathing'), 5000));
                break;
            case 'breathing':
                // Breathing exercise runs for about 8 seconds
                timers.push(setTimeout(() => setPhase('love'), 8000));
                break;
            case 'love':
                const name = childName ? `, ${childName}` : '';
                playSentenceSound(`You are an amazing kid${name}, and I love you.`);
                timers.push(setTimeout(() => setPhase('goodbye'), 4000));
                break;
            case 'goodbye':
                playSentenceSound("Bye bye, friends! I'll see you again real soon!");
                timers.push(setTimeout(onComplete, 3500));
                break;
        }

        return () => timers.forEach(clearTimeout);
    }, [phase, learnedItems, childName, playSentenceSound, onComplete]);

    // Breathing animation
    useEffect(() => {
        if (phase === 'breathing') {
            playSentenceSound("Smell the roses...");
            const interval = setInterval(() => {
                setBreathPhase(prev => {
                    if (prev === 'in') {
                        playSentenceSound("Blow out the candles...");
                        return 'out';
                    } else {
                        playSentenceSound("Smell the roses...");
                        return 'in';
                    }
                });
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [phase, playSentenceSound]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 rounded-3xl">
            <AnimatePresence mode="wait">
                {phase === 'review' && (
                    <motion.div
                        key="review"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            We had such a fun day together!
                        </h2>
                        <div className="space-y-2">
                            <p className="text-lg text-gray-600">We learned:</p>
                            {learnedItems.map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.3 }}
                                    className="inline-block mx-1 px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 font-semibold"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {phase === 'proud' && (
                    <motion.div
                        key="proud"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
                        >
                            <span className="text-7xl"></span>
                        </motion.div>
                        <h2 className="text-3xl font-black text-purple-600 mt-4">
                            I am so, so, so proud of you!
                        </h2>
                    </motion.div>
                )}

                {phase === 'feelings' && (
                    <motion.div
                        key="feelings"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center max-w-md"
                    >
                        <div className="flex justify-center gap-4 mb-4">
                            <span className="text-4xl"></span>
                            <span className="text-4xl"></span>
                            <span className="text-4xl"></span>
                        </div>
                        <p className="text-xl text-gray-700 mb-2">
                            Remember, it's okay to have big feelings.
                        </p>
                        <p className="text-lg text-gray-600">
                            It's okay to be sad or mad sometimes.
                        </p>
                        <p className="text-lg text-purple-600 font-semibold mt-3">
                            Taking a deep breath can help!
                        </p>
                    </motion.div>
                )}

                {phase === 'breathing' && (
                    <motion.div
                        key="breathing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{
                                scale: breathPhase === 'in' ? [1, 1.3] : [1.3, 1],
                            }}
                            transition={{ duration: 3.5 }}
                            className="w-32 h-32 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <Wind className="w-16 h-16 text-white" />
                        </motion.div>
                        <p className="text-2xl font-bold text-gray-700">
                            {breathPhase === 'in' ? (
                                <>
                                    <span className="text-3xl mr-2"></span>
                                    Smell the roses...
                                </>
                            ) : (
                                <>
                                    <span className="text-3xl mr-2"></span>
                                    Blow out the candles...
                                </>
                            )}
                        </p>
                        <p className="text-sm text-gray-500 mt-3">
                            Breathe {breathPhase === 'in' ? 'in' : 'out'} slowly...
                        </p>
                    </motion.div>
                )}

                {phase === 'love' && (
                    <motion.div
                        key="love"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            <Heart className="w-20 h-20 text-pink-500 fill-pink-500 mx-auto" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-700 mt-4">
                            {childName ? `${childName}, you are` : "You are"} an amazing kid,
                        </h2>
                        <h2 className="text-3xl font-black text-pink-600 mt-2">
                            and I love you!
                        </h2>
                    </motion.div>
                )}

                {phase === 'goodbye' && (
                    <motion.div
                        key="goodbye"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }}
                            className="text-7xl mb-4"
                        >

                        </motion.div>
                        <h2 className="text-3xl font-bold text-purple-600">
                            Bye bye, friends!
                        </h2>
                        <p className="text-xl text-gray-600 mt-2">
                            I'll see you again real soon!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
