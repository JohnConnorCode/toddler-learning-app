"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "./BottomNav";
import { useAccessibility } from "@/hooks/use-accessibility";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell - Professional native app-like wrapper
 *
 * Handles:
 * - Smooth splash screen on initial load
 * - Page transitions
 * - Bottom navigation
 * - Safe areas for mobile
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { shouldReduceMotion } = useAccessibility();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Pages that should hide the bottom nav (immersive experiences)
  const hideNavPaths = [
    "/onboarding",
    "/levels/",
    "/math/lesson/",
    "/stories/",
  ];

  const shouldHideNav = hideNavPaths.some(path => pathname.startsWith(path)) || pathname === "/onboarding";

  // Initialize app
  useEffect(() => {
    // Check if we've already shown splash this session
    const hasShownSplash = sessionStorage.getItem("splashShown");

    if (hasShownSplash) {
      setShowSplash(false);
      setIsInitialized(true);
      return;
    }

    // Show splash for first load
    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("splashShown", "true");
      setTimeout(() => setIsInitialized(true), 300);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Splash screen
  if (showSplash) {
    return <SplashScreen reducedMotion={shouldReduceMotion} />;
  }

  return (
    <div className="app-shell">
      {/* Page content with transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={!isInitialized || shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className={`page-content ${!shouldHideNav ? 'has-bottom-nav' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}

/**
 * Splash Screen - Branded loading screen
 */
function SplashScreen({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 flex flex-col items-center justify-center"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Logo/Mascot */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Owl mascot */}
        <motion.div
          animate={reducedMotion ? {} : {
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl sm:text-9xl mb-4 drop-shadow-lg"
        >
          🦉
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight"
        >
          Little Learner
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/90 text-lg font-medium mt-2"
        >
          Learn, Play, Grow!
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={reducedMotion ? {} : {
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-3 h-3 bg-white rounded-full shadow-md"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
