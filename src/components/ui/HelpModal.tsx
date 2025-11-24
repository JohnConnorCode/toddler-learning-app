"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Type, Info } from "lucide-react";
import { usePhonicsStore } from "@/hooks/use-phonics-store";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    const { mode, toggleMode } = usePhonicsStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-50 border-4 border-primary/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Info className="text-primary" />
                                Parents Guide
                            </h2>
                            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <h3 className="font-bold text-blue-800 mb-2">Learning Mode</h3>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-blue-600">
                                        {mode === "phonics" ? (
                                            <p>Current: <strong>Phonics Sounds</strong> (Recommended). Teaches "Ah", "Buh", "Kuh".</p>
                                        ) : (
                                            <p>Current: <strong>Letter Names</strong>. Teaches "Ay", "Bee", "See".</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={toggleMode}
                                        className="px-4 py-2 bg-white rounded-xl shadow-sm border border-blue-200 font-bold text-blue-600 active:scale-95 transition-transform"
                                    >
                                        Switch
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-bold text-gray-700">How to Play</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex gap-2">
                                        <span className="bg-yellow-100 text-yellow-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                        <span><strong>Phonics:</strong> Tap cards to flip. Listen to the sound.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="bg-pink-100 text-pink-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                        <span><strong>Words:</strong> Tap letters to spell. The app will sound out the word for you!</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
