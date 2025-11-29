"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/hooks/use-audio";
import { Sparkles, Heart, Star, Zap } from "lucide-react";

export type AffirmationType =
    | 'i-am-smart'           // "One, two, three... I am smart!"
    | 'you-can-do-hard-things' // Before a challenge
    | 'we-read-a-word'       // After blending success
    | 'proud-of-you'         // General celebration
    | 'self-hug'             // "Squeeze, pat on the back"
    | 'growth-mindset';      // "It's okay to make mistakes"

interface AffirmationMomentProps {
    type: AffirmationType;
    onComplete?: () => void;
    autoAdvance?: boolean;
    delay?: number; // ms before auto-advance
}

const AFFIRMATION_DATA: Record<AffirmationType, {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    bgGradient: string;
    duration: number;
}> = {
    'i-am-smart': {
        title: "I am smart!",
        subtitle: "One, two, three...",
        icon: <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />,
        bgGradient: "from-yellow-100 to-orange-100",
        duration: 3000
    },
    'you-can-do-hard-things': {
        title: "You can do hard things!",
        subtitle: "I believe in you!",
        icon: <Zap className="w-16 h-16 text-purple-500" />,
        bgGradient: "from-purple-100 to-pink-100",
        duration: 3000
    },
    'we-read-a-word': {
        title: "We read a word!",
        subtitle: "Woohoo! We are readers!",
        icon: <Sparkles className="w-16 h-16 text-green-500" />,
        bgGradient: "from-green-100 to-emerald-100",
        duration: 4000
    },
    'proud-of-you': {
        title: "I'm so proud of you!",
        subtitle: "You did amazing!",
        icon: <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />,
        bgGradient: "from-pink-100 to-rose-100",
        duration: 3000
    },
    'self-hug': {
        title: "Give yourself a hug!",
        subtitle: "Squeeze... pat on the back... I love myself!",
        icon: <span className="text-6xl"></span>,
        bgGradient: "from-blue-100 to-cyan-100",
        duration: 4000
    },
    'growth-mindset': {
        title: "It's okay to make mistakes!",
        subtitle: "That's how we learn!",
        icon: <span className="text-6xl"></span>,
        bgGradient: "from-teal-100 to-green-100",
        duration: 3000
    }
};

export function AffirmationMoment({
    type,
    onComplete,
    autoAdvance = true,
    delay
}: AffirmationMomentProps) {
    const [showContent, setShowContent] = useState(false);
    const { playSentenceSound } = useAudio();
    const data = AFFIRMATION_DATA[type];

    useEffect(() => {
        // Brief delay before showing content
        const showTimer = setTimeout(() => {
            setShowContent(true);
            // Speak the affirmation using TTS
            if (data.subtitle) {
                playSentenceSound(data.subtitle);
                setTimeout(() => playSentenceSound(data.title), 1500);
            } else {
                playSentenceSound(data.title);
            }
        }, 300);

        return () => clearTimeout(showTimer);
    }, [data, playSentenceSound]);

    useEffect(() => {
        if (autoAdvance && showContent && onComplete) {
            const advanceDelay = delay ?? data.duration;
            const timer = setTimeout(onComplete, advanceDelay);
            return () => clearTimeout(timer);
        }
    }, [showContent, autoAdvance, onComplete, delay, data.duration]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col items-center justify-center min-h-[300px] p-8 bg-gradient-to-b ${data.bgGradient} rounded-3xl`}
        >
            {showContent && (
                <>
                    {/* Icon with animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10 }}
                    >
                        {data.icon}
                    </motion.div>

                    {/* Subtitle (shows first for countdown style) */}
                    {data.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-500 mt-4 text-center"
                        >
                            {data.subtitle}
                        </motion.p>
                    )}

                    {/* Main title */}
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-3xl sm:text-4xl font-black text-gray-800 mt-3 text-center"
                    >
                        {data.title}
                    </motion.h2>

                    {/* Decorative sparkles */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex gap-4 mt-4"
                    >
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                        <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </motion.div>

                    {/* Tap to continue (if not auto-advance) */}
                    {!autoAdvance && onComplete && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={onComplete}
                            className="mt-6 px-6 py-3 bg-white/80 rounded-full text-gray-600 font-semibold shadow-md hover:shadow-lg transition-shadow"
                        >
                            Tap to continue
                        </motion.button>
                    )}
                </>
            )}
        </motion.div>
    );
}

// Preset components for common use cases
export function IAmSmartAffirmation({ onComplete }: { onComplete?: () => void }) {
    return <AffirmationMoment type="i-am-smart" onComplete={onComplete} />;
}

export function YouCanDoHardThings({ onComplete }: { onComplete?: () => void }) {
    return <AffirmationMoment type="you-can-do-hard-things" onComplete={onComplete} />;
}

export function WeReadAWord({ onComplete }: { onComplete?: () => void }) {
    return <AffirmationMoment type="we-read-a-word" onComplete={onComplete} />;
}

export function ProudOfYou({ onComplete }: { onComplete?: () => void }) {
    return <AffirmationMoment type="proud-of-you" onComplete={onComplete} />;
}

export function SelfHug({ onComplete }: { onComplete?: () => void }) {
    return <AffirmationMoment type="self-hug" onComplete={onComplete} />;
}
