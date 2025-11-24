"use client";

import { useState, useEffect, useCallback } from "react";

export type ProgressData = {
    completedWords: Set<string>;
    wordAttempts: Record<string, number>;
    wordMastery: Record<string, number>; // 0-100 score
    completedLetters: Set<string>;
    totalWordsCompleted: number;
    totalLettersCompleted: number;
    sessionStartTime: number;
    lastPlayedDate: string;
    streakDays: number;
};

const STORAGE_KEY = "toddler-learning-progress";

const getDefaultProgress = (): ProgressData => ({
    completedWords: new Set(),
    wordAttempts: {},
    wordMastery: {},
    completedLetters: new Set(),
    totalWordsCompleted: 0,
    totalLettersCompleted: 0,
    sessionStartTime: Date.now(),
    lastPlayedDate: new Date().toISOString().split('T')[0],
    streakDays: 1,
});

// Helper to serialize/deserialize Sets
const serializeProgress = (data: ProgressData): string => {
    return JSON.stringify({
        ...data,
        completedWords: Array.from(data.completedWords),
        completedLetters: Array.from(data.completedLetters),
    });
};

const deserializeProgress = (json: string): ProgressData => {
    const parsed = JSON.parse(json);
    return {
        ...parsed,
        completedWords: new Set(parsed.completedWords || []),
        completedLetters: new Set(parsed.completedLetters || []),
    };
};

export function useProgress() {
    const [progress, setProgress] = useState<ProgressData>(getDefaultProgress);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = deserializeProgress(stored);

                // Check if it's a new day for streak tracking
                const today = new Date().toISOString().split('T')[0];
                const lastPlayed = new Date(data.lastPlayedDate).toISOString().split('T')[0];

                if (today !== lastPlayed) {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    const streak = lastPlayed === yesterday ? data.streakDays + 1 : 1;
                    data.streakDays = streak;
                    data.lastPlayedDate = today;
                    data.sessionStartTime = Date.now();
                }

                setProgress(data);
            }
        } catch (error) {
            console.error("Failed to load progress:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (!isLoaded) return;
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(STORAGE_KEY, serializeProgress(progress));
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    }, [progress, isLoaded]);

    const markWordCompleted = useCallback((word: string, isCorrect: boolean) => {
        setProgress((prev) => {
            const attempts = (prev.wordAttempts[word] || 0) + 1;
            const currentMastery = prev.wordMastery[word] || 0;

            // Calculate new mastery: increase on success, slight decrease on failure
            let newMastery = currentMastery;
            if (isCorrect) {
                newMastery = Math.min(100, currentMastery + (100 / Math.max(attempts, 3)));
            } else {
                newMastery = Math.max(0, currentMastery - 10);
            }

            const wasCompleted = prev.completedWords.has(word);
            const newCompleted = new Set(prev.completedWords);
            if (isCorrect) {
                newCompleted.add(word);
            }

            return {
                ...prev,
                completedWords: newCompleted,
                wordAttempts: { ...prev.wordAttempts, [word]: attempts },
                wordMastery: { ...prev.wordMastery, [word]: Math.round(newMastery) },
                totalWordsCompleted: wasCompleted ? prev.totalWordsCompleted : prev.totalWordsCompleted + 1,
            };
        });
    }, []);

    const markLetterCompleted = useCallback((letter: string) => {
        setProgress((prev) => {
            if (prev.completedLetters.has(letter)) return prev;

            const newCompleted = new Set(prev.completedLetters);
            newCompleted.add(letter);

            return {
                ...prev,
                completedLetters: newCompleted,
                totalLettersCompleted: prev.totalLettersCompleted + 1,
            };
        });
    }, []);

    const getWordMastery = useCallback(
        (word: string): number => {
            return progress.wordMastery[word] || 0;
        },
        [progress.wordMastery]
    );

    const getWordAttempts = useCallback(
        (word: string): number => {
            return progress.wordAttempts[word] || 0;
        },
        [progress.wordAttempts]
    );

    const isWordCompleted = useCallback(
        (word: string): boolean => {
            return progress.completedWords.has(word);
        },
        [progress.completedWords]
    );

    const isLetterCompleted = useCallback(
        (letter: string): boolean => {
            return progress.completedLetters.has(letter);
        },
        [progress.completedLetters]
    );

    const resetProgress = useCallback(() => {
        setProgress(getDefaultProgress());
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const getSessionDuration = useCallback(() => {
        return Math.floor((Date.now() - progress.sessionStartTime) / 1000 / 60); // minutes
    }, [progress.sessionStartTime]);

    const getStats = useCallback(() => {
        const totalWords = progress.completedWords.size;
        const totalLetters = progress.completedLetters.size;
        const averageMastery = Object.values(progress.wordMastery).length > 0
            ? Math.round(
                Object.values(progress.wordMastery).reduce((a, b) => a + b, 0) /
                Object.values(progress.wordMastery).length
            )
            : 0;

        return {
            totalWords,
            totalLetters,
            averageMastery,
            streakDays: progress.streakDays,
            sessionDuration: getSessionDuration(),
        };
    }, [progress, getSessionDuration]);

    return {
        progress,
        isLoaded,
        markWordCompleted,
        markLetterCompleted,
        getWordMastery,
        getWordAttempts,
        isWordCompleted,
        isLetterCompleted,
        resetProgress,
        getStats,
    };
}
