"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useAccessibility } from "@/hooks/use-accessibility";

export default function OfflinePage() {
  const { shouldReduceMotion } = useAccessibility();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main
      id="main-content"
      role="main"
      aria-label="Offline"
      className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0.1 } : { type: "spring", stiffness: 200, damping: 20 }}
        className="text-center max-w-md"
      >
        {/* Owl mascot */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
          role="img"
          aria-label="Sleepy owl"
        >
          😴
        </motion.div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-6">
            <WifiOff className="w-12 h-12 text-gray-400" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-black text-gray-800 mb-3">
            Oops! No Internet
          </h1>

          <p className="text-gray-500 text-lg mb-6">
            The owl is taking a nap while we wait for the internet to come back.
            Don't worry, your progress is saved!
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors touch-target"
              aria-label="Try to reconnect to the internet"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
              Try Again
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-colors touch-target"
              aria-label="Go back to home page"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              Go Home
            </Link>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Tip: You can still use activities you've already visited!
        </p>
      </motion.div>
    </main>
  );
}
