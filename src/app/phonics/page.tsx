"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHONICS_DATA } from "@/lib/phonics-data";
import { LetterCard } from "@/components/game/LetterCard";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";

export default function PhonicsPage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextLetter = () => {
        if (currentIndex < PHONICS_DATA.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevLetter = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            {/* Header */}
            <header className="p-3 sm:p-4 md:p-6 flex items-center justify-between">
                <Link href="/">
                    <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                </Link>
                <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                    <span className="font-bold text-primary text-base sm:text-lg">
                        {currentIndex + 1} / {PHONICS_DATA.length}
                    </span>
                </div>
                <div className="w-10 sm:w-12" /> {/* Spacer */}
            </header>

            {/* Main Game Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0, rotate: 10 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        exit={{ x: -300, opacity: 0, rotate: -10 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <LetterCard item={PHONICS_DATA[currentIndex]} />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex items-center gap-6 sm:gap-8 mt-6 sm:mt-8 md:mt-12">
                    <button
                        onClick={prevLetter}
                        disabled={currentIndex === 0}
                        className="p-3 sm:p-4 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                    </button>

                    <button
                        onClick={nextLetter}
                        disabled={currentIndex === PHONICS_DATA.length - 1}
                        className="p-4 sm:p-5 md:p-6 bg-secondary rounded-full shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all"
                    >
                        <ChevronRight className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                    </button>
                </div>
            </main>
        </div>
    );
}
