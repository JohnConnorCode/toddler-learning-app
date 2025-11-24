"use client";

import { useCallback, useEffect, useState } from "react";

type SpeechType = "letter" | "phonics" | "word" | "sentence";

interface SpeechOptions {
    type?: SpeechType;
    volume?: number;
    onEnd?: () => void;
}

export function useSpeech() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Load voices when available
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Select best voice for toddlers (prefer female, clear, child-friendly voices)
    const selectBestVoice = useCallback(() => {
        if (voices.length === 0) return null;

        // Priority 1: Child-specific voices
        const childVoice = voices.find((voice) =>
            voice.name.toLowerCase().includes("child") ||
            voice.name.toLowerCase().includes("kid")
        );
        if (childVoice) return childVoice;

        // Priority 2: Female Google voices (generally clearer for toddlers)
        const femaleGoogle = voices.find((voice) =>
            voice.name.includes("Google") &&
            voice.lang.startsWith("en") &&
            (voice.name.includes("female") || voice.name.includes("Female"))
        );
        if (femaleGoogle) return femaleGoogle;

        // Priority 3: Any Google English voice
        const googleEnglish = voices.find((voice) =>
            voice.name.includes("Google") && voice.lang.startsWith("en")
        );
        if (googleEnglish) return googleEnglish;

        // Priority 4: US English voices
        const usEnglish = voices.find((voice) =>
            voice.lang === "en-US"
        );
        if (usEnglish) return usEnglish;

        // Priority 5: Any English voice
        const anyEnglish = voices.find((voice) =>
            voice.lang.startsWith("en")
        );
        if (anyEnglish) return anyEnglish;

        // Fallback: First available voice
        return voices[0];
    }, [voices]);

    const speak = useCallback((text: string, options: SpeechOptions = {}) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            const voice = selectBestVoice();

            if (voice) {
                utterance.voice = voice;
            }

            // Adjust settings based on speech type
            const type = options.type || "word";
            switch (type) {
                case "phonics":
                    // For letter sounds, emphasize and slow down
                    utterance.pitch = 1.3;
                    utterance.rate = 0.7;
                    utterance.volume = options.volume ?? 1.0;
                    break;
                case "letter":
                    // For letter names, clear and moderate
                    utterance.pitch = 1.2;
                    utterance.rate = 0.85;
                    utterance.volume = options.volume ?? 1.0;
                    break;
                case "word":
                    // For words, friendly and clear
                    utterance.pitch = 1.15;
                    utterance.rate = 0.9;
                    utterance.volume = options.volume ?? 1.0;
                    break;
                case "sentence":
                    // For sentences, natural and expressive
                    utterance.pitch = 1.1;
                    utterance.rate = 0.95;
                    utterance.volume = options.volume ?? 1.0;
                    break;
            }

            // Handle end callback
            if (options.onEnd) {
                utterance.onend = options.onEnd;
            }

            window.speechSynthesis.speak(utterance);
        }
    }, [selectBestVoice]);

    // Speak phonics sound (uses phonemeSpelling for better pronunciation)
    const speakPhonics = useCallback((phonemeSpelling: string, onEnd?: () => void) => {
        speak(phonemeSpelling, { type: "phonics", onEnd });
    }, [speak]);

    // Speak letter name
    const speakLetter = useCallback((letter: string, onEnd?: () => void) => {
        speak(letter, { type: "letter", onEnd });
    }, [speak]);

    // Speak word
    const speakWord = useCallback((word: string, onEnd?: () => void) => {
        speak(word, { type: "word", onEnd });
    }, [speak]);

    // Speak sentence
    const speakSentence = useCallback((sentence: string, onEnd?: () => void) => {
        speak(sentence, { type: "sentence", onEnd });
    }, [speak]);

    return {
        speak,
        speakPhonics,
        speakLetter,
        speakWord,
        speakSentence,
        voices
    };
}
