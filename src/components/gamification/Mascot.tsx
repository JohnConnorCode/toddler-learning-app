"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface MascotProps {
  /** Mascot mood/state */
  mood?: "happy" | "excited" | "encouraging" | "celebrating" | "thinking";
  /** Message to display */
  message?: string;
  /** Size of mascot */
  size?: "small" | "medium" | "large";
  /** Auto-hide after delay (ms) */
  autoHide?: number;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

const MASCOT_MESSAGES = {
  happy: [
    "You're doing great!",
    "Keep up the good work!",
    "I'm so proud of you!",
  ],
  excited: [
    "Wow! Amazing!",
    "You're on fire!",
    "That's incredible!",
  ],
  encouraging: [
    "You can do it!",
    "Don't give up!",
    "Almost there!",
    "Keep trying!",
  ],
  celebrating: [
    "Woohoo! You did it!",
    "Outstanding!",
    "You're a superstar!",
    "Way to go!",
  ],
  thinking: [
    "Hmm, let's try again...",
    "That's okay, keep learning!",
    "Every mistake helps you learn!",
  ],
};

/**
 * Friendly mascot character that provides encouragement
 * Inspired by Duolingo's Duo
 */
export function Mascot({
  mood = "happy",
  message,
  size = "medium",
  autoHide,
  onDismiss,
}: MascotProps) {
  const [visible, setVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(
    message || MASCOT_MESSAGES[mood][0]
  );

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  useEffect(() => {
    if (!message) {
      // Rotate messages
      const messages = MASCOT_MESSAGES[mood];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
    } else {
      setCurrentMessage(message);
    }
  }, [mood, message]);

  if (!visible) return null;

  const sizeClasses = {
    small: "w-16 h-16 text-4xl",
    medium: "w-24 h-24 text-6xl",
    large: "w-32 h-32 text-8xl",
  };

  const getMascotAnimation = () => {
    switch (mood) {
      case "excited":
      case "celebrating":
        return {
          scale: [1, 1.2, 1, 1.1, 1],
          rotate: [0, -10, 10, -5, 0],
        };
      case "encouraging":
        return {
          y: [0, -10, 0],
        };
      case "thinking":
        return {
          rotate: [-5, 5, -5],
        };
      default:
        return {
          scale: [1, 1.05, 1],
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Mascot Character */}
      <motion.div
        animate={getMascotAnimation()}
        transition={{
          duration: mood === "celebrating" ? 0.5 : 1,
          repeat: Infinity,
          repeatDelay: mood === "celebrating" ? 0 : 2,
        }}
        className={`${sizeClasses[size]} flex items-center justify-center`}
      >
        {/* Owl emoji as our mascot - can be replaced with custom character */}
        🦉
      </motion.div>

      {/* Speech Bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-white rounded-2xl shadow-lg p-4 max-w-xs"
      >
        {/* Speech bubble arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />

        <p className="relative z-10 text-center font-bold text-gray-800 text-sm sm:text-base">
          {currentMessage}
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Floating mascot that appears in the corner
 */
export function FloatingMascot({
  mood = "happy",
  message,
  onDismiss,
}: Omit<MascotProps, "size">) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="relative">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-900"
          >
            ✕
          </button>
        )}
        <Mascot mood={mood} message={message} size="small" />
      </div>
    </motion.div>
  );
}
