"use client";

import { useEffect, useState } from "react";
import { Download, Check, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/hooks/use-accessibility";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const { shouldReduceMotion, announce } = useAccessibility();

    useEffect(() => {
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
            return;
        }

        // On iOS, show the button to explain how to install
        if (isIOSDevice && !window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstallable(true);
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Listen for app installed event
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            announce("App installed successfully!");
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, [announce]);

    const handleInstallClick = async () => {
        // iOS - show instructions modal
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user's response
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
            setShowSuccess(true);
            announce("Installing app...");
            setTimeout(() => {
                setIsInstallable(false);
                setIsInstalled(true);
            }, 2000);
        }

        // Clear the deferred prompt
        setDeferredPrompt(null);
    };

    // Don't show button if already installed or not installable
    if (isInstalled || !isInstallable) return null;

    return (
        <>
            <AnimatePresence>
                <motion.button
                    initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    onClick={handleInstallClick}
                    className="relative overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-primary to-yellow-400 text-white font-bold shadow-lg hover:shadow-xl transition-all group touch-target"
                    aria-label={isIOS ? "How to install Little Learner on your device" : "Install Little Learner app on your device"}
                >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                className="flex items-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                <span className="text-sm sm:text-base">Installed!</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="install"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-5 h-5 group-hover:animate-bounce" />
                                <span className="text-sm sm:text-base">Install App</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden="true" />
            </motion.button>
        </AnimatePresence>

            {/* iOS Installation Instructions Modal */}
            <AnimatePresence>
                {showIOSInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowIOSInstructions(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ios-install-title"
                    >
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                                    <Smartphone className="w-10 h-10 text-blue-500" aria-hidden="true" />
                                </div>
                                <h2 id="ios-install-title" className="text-2xl font-black text-gray-800">
                                    Install on iPhone/iPad
                                </h2>
                            </div>

                            <ol className="space-y-4 text-left">
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                                    <span className="text-gray-700">Tap the <strong>Share</strong> button at the bottom of Safari</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                                    <span className="text-gray-700">Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-blue-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                                    <span className="text-gray-700">Tap <strong>"Add"</strong> to install the app</span>
                                </li>
                            </ol>

                            <button
                                onClick={() => setShowIOSInstructions(false)}
                                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors touch-target"
                            >
                                Got it!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
