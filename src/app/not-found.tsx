"use client";

import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-4 sm:p-6 md:p-8"
      role="main"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-lg"
      >
        {/* Lost owl mascot */}
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
          role="img"
          aria-label="Confused owl looking around"
        >
          🦉
        </motion.div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-6xl font-black text-gray-300 mb-4">404</div>

          <h1 className="text-3xl font-black text-gray-800 mb-3">
            Page Not Found
          </h1>

          <p className="text-gray-500 text-lg mb-6">
            The owl looked everywhere but couldn't find this page!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform touch-target"
              aria-label="Return to home page"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span>Go Home</span>
            </Link>

            <Link
              href="/levels"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors touch-target"
              aria-label="Browse learning levels"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <span>Explore Levels</span>
            </Link>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Looking for something specific? Try one of our main activities!
        </p>
      </motion.div>
    </main>
  );
}
