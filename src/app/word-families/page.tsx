"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORD_FAMILIES_DATA } from "@/lib/word-families-data";
import { WordFamilyCard } from "@/components/game/WordFamilyCard";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft, Filter } from "lucide-react";

export default function WordFamiliesPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

    const filteredFamilies = selectedDifficulty
        ? WORD_FAMILIES_DATA.filter(f => f.difficulty === selectedDifficulty)
        : WORD_FAMILIES_DATA;

    const nextFamily = () => {
        if (currentIndex < filteredFamilies.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevFamily = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleDifficultyChange = (difficulty: number | null) => {
        setSelectedDifficulty(difficulty);
        setCurrentIndex(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex flex-col">
            {/* Header */}
            <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
                <Link href="/">
                    <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                        <span className="font-bold text-blue-600 text-base sm:text-lg">
                            {currentIndex + 1} / {filteredFamilies.length}
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
                        ⭐ Easy
                    </button>
                    <button
                        onClick={() => handleDifficultyChange(2)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                            selectedDifficulty === 2
                                ? "bg-blue-500 text-white shadow-md scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                        }`}
                    >
                        ⭐⭐ Medium
                    </button>
                    <button
                        onClick={() => handleDifficultyChange(3)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                            selectedDifficulty === 3
                                ? "bg-purple-500 text-white shadow-md scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                        }`}
                    >
                        ⭐⭐⭐ Hard
                    </button>
                </div>
            </div>

            {/* Main Game Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedDifficulty}-${currentIndex}`}
                        initial={{ opacity: 0, x: 300, rotateY: 90 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -300, rotateY: -90 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        <WordFamilyCard
                            family={filteredFamilies[currentIndex]}
                            onComplete={nextFamily}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex items-center gap-6 sm:gap-8 mt-6 sm:mt-8 transition-opacity">
                    <button
                        onClick={prevFamily}
                        disabled={currentIndex === 0}
                        className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 hover:scale-105 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextFamily}
                        disabled={currentIndex === filteredFamilies.length - 1}
                        className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 hover:scale-105 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                </div>
            </main>
        </div>
    );
}
