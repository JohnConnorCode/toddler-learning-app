"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Music, Star, Settings, Eye, Users, ClipboardCheck, Sparkles, BarChart3, Rocket, Map } from "lucide-react";
import { useState } from "react";
import { HelpModal } from "@/components/ui/HelpModal";
import { InstallButton } from "@/components/InstallButton";
import { useLevelProgress } from "@/hooks/use-level-progress";

export default function Home() {
    const { getTotalProgress, currentLevel } = useLevelProgress();
    return (
        <main className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-8 sm:mb-12 md:mb-16 text-center relative z-10"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-800 tracking-tight mb-2 drop-shadow-sm">
                    Little <span className="text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Learner</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-500 font-medium">Let's play and learn!</p>
            </motion.div>

            {/* Featured Learning Journey Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-4xl mb-6 sm:mb-8 relative z-10"
            >
                <Link href="/levels" className="group block">
                    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl border-b-6 sm:border-b-8 border-blue-800 group-hover:scale-[1.02] transition-all overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

                        {/* Progress Badge */}
                        {currentLevel && (
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute top-4 right-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 shadow-lg"
                            >
                                <Rocket className="w-4 h-4" />
                                LEVEL {currentLevel}
                            </motion.div>
                        )}

                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                                <Map className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                                    {currentLevel ? 'Continue Your Journey' : 'Start Your Learning Adventure'}
                                </h2>
                                <p className="text-white/90 text-base sm:text-lg font-medium mb-4">
                                    {currentLevel
                                        ? `Keep learning with 10 exciting levels! You're ${getTotalProgress()}% complete`
                                        : 'Explore 10 magical levels filled with reading activities and stories'
                                    }
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                        <span>✓ 10 Themed Levels</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                        <span>✓ Earn Stars</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                        <span>✓ Unlock Stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* Featured Assessment Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-4xl mb-6 sm:mb-8 relative z-10"
            >
                <Link href="/assessment" className="group block">
                    <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl border-b-6 sm:border-b-8 border-purple-700 group-hover:scale-[1.02] transition-all overflow-hidden">
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                        {/* Badge */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 shadow-lg"
                        >
                            <Sparkles className="w-4 h-4" />
                            START HERE
                        </motion.div>

                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                                <ClipboardCheck className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                                    Find Your Perfect Path
                                </h2>
                                <p className="text-white/90 text-base sm:text-lg font-medium mb-4">
                                    Take a quick 10-minute assessment to get personalized recommendations
                                </p>
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                    <span>✓ Personalized learning path</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl relative z-10">
                <Link href="/phonics" className="group">
                    <motion.div
                        whileHover={{ scale: 1.03, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-primary/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-50" />
                        <div className="bg-yellow-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 fill-yellow-500" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-primary transition-colors">ABC Phonics</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Learn letters & sounds</span>
                    </motion.div>
                </Link>

                <Link href="/blending-activities" className="group">
                    <motion.div
                        whileHover={{ scale: 1.03, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-green-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50" />
                        <div className="bg-green-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-green-600 transition-colors">Blending Practice</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Connect sounds to read!</span>
                    </motion.div>
                </Link>

                <Link href="/words" className="group">
                    <motion.div
                        whileHover={{ scale: 1.03, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-accent/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-50" />
                        <div className="bg-pink-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500 fill-pink-500" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-accent transition-colors">First Words</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Spell simple words</span>
                    </motion.div>
                </Link>

                <Link href="/sight-words" className="group">
                    <motion.div
                        whileHover={{ scale: 1.03, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-purple-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50" />
                        <div className="bg-purple-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-purple-600 transition-colors">Sight Words</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Learn to recognize</span>
                    </motion.div>
                </Link>

                <Link href="/word-families" className="group">
                    <motion.div
                        whileHover={{ scale: 1.03, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-blue-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
                        <div className="bg-blue-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">Word Families</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Rhyming patterns</span>
                    </motion.div>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 sm:mt-12 md:mt-16 flex flex-col items-center gap-4"
            >
                {/* Install App Button */}
                <InstallButton />

                {/* Icon Buttons */}
                <div className="flex gap-3 sm:gap-4">
                    <Link
                        href="/parent-dashboard"
                        className="p-3 sm:p-4 rounded-full bg-white shadow-md text-purple-400 hover:text-purple-600 hover:scale-110 transition-all group"
                        title="Parent Dashboard"
                    >
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                    </Link>
                    <Link
                        href="/settings"
                        className="p-3 sm:p-4 rounded-full bg-white shadow-md text-gray-400 hover:text-gray-600 hover:scale-110 transition-all group"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
