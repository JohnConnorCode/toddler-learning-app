"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIGHT_WORDS_DATA } from "@/lib/sight-words-data";
import { SightWordCard } from "@/components/game/SightWordCard";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft, Filter } from "lucide-react";

export default function SightWordsPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

    const filteredWords = selectedDifficulty
        ? SIGHT_WORDS_DATA.filter(w => w.difficulty === selectedDifficulty)
        : SIGHT_WORDS_DATA;

    const nextWord = () => {
        if (currentIndex < filteredWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevWord = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleDifficultyChange = (difficulty: number | null) => {
        setSelectedDifficulty(difficulty);
        setCurrentIndex(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
            {/* Header */}
            <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
                <Link href="/">
                    <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                        <span className="font-bold text-purple-600 text-base sm:text-lg">
                            {currentIndex + 1} / {filteredWords.length}
                        </span>
                    </div>
                </div>

                <div className="w-10 sm:w-12" />
            </header>

            {/* Difficulty Filter */}
            <div className="px-3 sm:px-4 md:px-6 pb-4">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-gray-500 font-semibold flex items-center gap-1">
                        <Filter className="w-4 h-4" />
                        Level:
                    </span>
                    <button
                        onClick={() => handleDifficultyChange(null)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                            selectedDifficulty === null
                                ? "bg-gray-700 text-white shadow-md scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleDifficultyChange(1)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                            selectedDifficulty === 1
                                ? "bg-green-500 text-white shadow-md scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                        }`}
                    >
                        Pre-K
                    </button>
                    <button
                        onClick={() => handleDifficultyChange(2)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                            selectedDifficulty === 2
                                ? "bg-blue-500 text-white shadow-md scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                        }`}
                    >
                        K
                    </button>
                    <button
                        onClick={() => handleDifficultyChange(3)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                            selectedDifficulty === 3
                                ? "bg-purple-500 text-white shadow-md scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                        }`}
                    >
                        1st
                    </button>
                </div>
            </div>

            {/* Main Game Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedDifficulty}-${currentIndex}`}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-2xl"
                    >
                        <SightWordCard
                            item={filteredWords[currentIndex]}
                            onComplete={nextWord}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
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
