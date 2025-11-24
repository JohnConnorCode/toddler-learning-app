"use client";

import { useEffect, useState } from "react";
import { Download, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
            return;
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
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user's response
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
            setShowSuccess(true);
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
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstallClick}
                className="relative overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-primary to-yellow-400 text-white font-bold shadow-lg hover:shadow-xl transition-all group"
                title="Install App"
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
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.button>
        </AnimatePresence>
    );
}
