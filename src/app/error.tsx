"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page Error:", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4 sm:p-6 md:p-8"
      role="main"
    >
      <div role="alert" aria-live="assertive">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full text-center"
        >
          {/* Sad owl mascot */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-6xl mb-4"
            role="img"
            aria-label="Confused owl"
          >
            😵
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full mb-4 sm:mb-6"
          >
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" aria-hidden="true" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-3 sm:mb-4">
            Oops! Something went wrong
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Don't worry, the owl got confused for a moment. Let's try again!
          </p>

          {process.env.NODE_ENV === "development" && error && (
            <details className="text-left mb-6 p-4 bg-gray-50 rounded-xl">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                Error Details (Dev Only)
              </summary>
              <pre className="text-xs text-red-600 overflow-auto max-h-40 whitespace-pre-wrap">
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base sm:text-lg font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform touch-target"
              aria-label="Try loading the page again"
            >
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              <span>Try Again</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors touch-target"
              aria-label="Return to home page"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span>Go Home</span>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
