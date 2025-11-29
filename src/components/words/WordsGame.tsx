"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WORDS_DATA, WordCategory, WordItem } from "@/lib/words-data";
import { useTheme } from "@/hooks/use-theme";
import { useLearningProgress, useLearningProgressHydrated } from "@/hooks/use-learning-progress";
import { getWordsPrioritizedByInterests, wordMatchesInterests } from "@/lib/interest-content";
import { WordBuilder } from "@/components/game/WordBuilder";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft, Filter, Heart, Sparkles } from "lucide-react";

type CategoryFilter = WordCategory | "for-you" | null;

export function WordsGame() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const word = searchParams.get("word");
    const returnTo = searchParams.get("returnTo");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(null);
    const [initialized, setInitialized] = useState(false);

    const { interests, hasInterests } = useTheme();
    const { sortWordsByDecodability, getMasteredLetters } = useLearningProgress();
    const learningProgressHydrated = useLearningProgressHydrated();

    // Get mastered letters for decodability indicator
    const masteredLetters = useMemo(() => {
        if (!learningProgressHydrated) return [];
        return getMasteredLetters();
    }, [learningProgressHydrated, getMasteredLetters]);

    // Check if a word is fully decodable
    const isWordDecodable = (wordItem: WordItem): boolean => {
        if (masteredLetters.length === 0) return false;
        const wordLetters = wordItem.word.toUpperCase().split("");
        return wordLetters.every((l) => masteredLetters.includes(l));
    };

    // Get words based on selected filter, sorted by decodability
    const filteredWords = useMemo((): WordItem[] => {
        let words: WordItem[];

        if (selectedCategory === "for-you") {
            // Show interest-matched words first, then others
            words = getWordsPrioritizedByInterests(interests);
        } else if (selectedCategory !== null) {
            // It's a WordCategory
            words = WORDS_DATA.filter(w => w.category === selectedCategory);
        } else {
            // Default (null): show all words, but prioritize by interests if user has them
            if (hasInterests) {
                words = getWordsPrioritizedByInterests(interests);
            } else {
                words = [...WORDS_DATA];
            }
        }

        // Sort by decodability - decodable words first!
        if (learningProgressHydrated && masteredLetters.length > 0) {
            return sortWordsByDecodability(words);
        }

        return words;
    }, [selectedCategory, interests, hasInterests, learningProgressHydrated, masteredLetters, sortWordsByDecodability]);

    // Check if current word matches user interests
    const currentWordMatchesInterest = useMemo(() => {
        if (!hasInterests || filteredWords.length === 0) return false;
        return wordMatchesInterests(filteredWords[currentIndex], interests);
    }, [filteredWords, currentIndex, interests, hasInterests]);

    // Auto-select word if specified in query params
    useEffect(() => {
        if (word && !initialized) {
            const wordIndex = filteredWords.findIndex(
                (w) => w.word.toLowerCase() === word.toLowerCase()
            );
            if (wordIndex !== -1) {
                setCurrentIndex(wordIndex);
                setInitialized(true);
            }
        }
    }, [word, initialized, filteredWords]);

    const nextWord = () => {
        // If coming from lesson and this is the target word, return to lesson after completion
        if (returnTo === "lesson" && word && filteredWords[currentIndex]?.word.toLowerCase() === word.toLowerCase()) {
            router.back();
        } else if (currentIndex < filteredWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleCategoryChange = (category: CategoryFilter) => {
        setSelectedCategory(category);
        setCurrentIndex(0);
    };

    const categories: (WordCategory | null)[] = [null, "Animals", "Food", "Objects", "Nature", "Actions", "Body", "Places"];

    return (
        <div className="min-h-screen bg-green-50 flex flex-col">
            {/* Header */}
            <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
                {returnTo === "lesson" ? (
                    <button onClick={() => router.back()}>
                        <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                        </div>
                    </button>
                ) : (
                    <Link href="/">
                        <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                        </div>
                    </Link>
                )}
                <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                    <span className="font-bold text-secondary text-base sm:text-lg">
                        {currentIndex + 1} / {filteredWords.length}
                    </span>
                </div>
                <div className="w-10 sm:w-12" />
            </header>

            {/* Category Filter */}
            <div className="px-3 sm:px-4 md:px-6 pb-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 font-semibold flex items-center gap-1">
                        <Filter className="w-4 h-4" />
                        Category:
                    </span>
                    {/* For You button - only shows if user has interests */}
                    {hasInterests && (
                        <button
                            onClick={() => handleCategoryChange("for-you")}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1 ${
                                selectedCategory === "for-you"
                                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md scale-105"
                                    : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 hover:from-pink-200 hover:to-purple-200 shadow-sm"
                            }`}
                        >
                            <Heart className="w-3 h-3" />
                            For You
                        </button>
                    )}
                    {categories.map((cat) => (
                        <button
                            key={cat || "all"}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                                selectedCategory === cat
                                    ? "bg-green-500 text-white shadow-md scale-105"
                                    : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                            }`}
                        >
                            {cat || "All"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Game Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-3 sm:mb-4">Spell the word</h2>

                    {/* Real Image */}
                    <motion.div
                        key={`${selectedCategory}-${currentIndex}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-white rounded-2xl sm:rounded-3xl shadow-lg mx-auto overflow-hidden border-4 sm:border-6 md:border-8 border-white"
                    >
                        <ImageWithFallback
                            src={filteredWords[currentIndex].image}
                            alt={filteredWords[currentIndex].word}
                            fallbackText={filteredWords[currentIndex].word}
                            className="w-full h-full"
                        />
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-sm sm:max-w-md md:max-w-lg px-2"
                    >
                        <WordBuilder
                            item={filteredWords[currentIndex]}
                            onComplete={nextWord}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls (Optional for this mode, as auto-advance is better, but good for manual skip) */}
                <div className="flex items-center gap-6 sm:gap-8 mt-6 sm:mt-8 transition-opacity">
                    <button
                        onClick={prevWord}
                        disabled={currentIndex === 0}
                        className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 hover:scale-105 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextWord}
                        disabled={currentIndex === filteredWords.length - 1}
                        className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 hover:scale-105 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                </div>
            </main>
        </div>
    );
}
