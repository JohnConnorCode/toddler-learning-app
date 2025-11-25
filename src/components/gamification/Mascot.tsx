"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useMascot } from "@/hooks/use-mascot";
import { useAccessibility } from "@/hooks/use-accessibility";
import type { MascotId, MascotMessages } from "@/lib/theme-data";
import { MASCOTS, getRandomMascotMessage } from "@/lib/theme-data";

type MascotMood = keyof MascotMessages;

interface MascotProps {
  /** Mascot mood/state */
  mood?: MascotMood;
  /** Message to display (overrides auto-generated) */
  message?: string;
  /** Size of mascot */
  size?: "small" | "medium" | "large";
  /** Auto-hide after delay (ms) */
  autoHide?: number;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Override which mascot to show (defaults to user's selected mascot) */
  mascotId?: MascotId;
  /** Show speech bubble */
  showBubble?: boolean;
}

/**
 * Friendly mascot character that provides encouragement
 * Dynamically shows the user's selected mascot companion
 */
export function Mascot({
  mood = "happy",
  message,
  size = "medium",
  autoHide,
  onDismiss,
  mascotId: overrideMascotId,
  showBubble = true,
}: MascotProps) {
  const { mascot: userMascot, getMessage } = useMascot();
  const { shouldReduceMotion } = useAccessibility();
  const [visible, setVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");

  // Use override mascot or user's selected mascot
  const mascot = overrideMascotId ? MASCOTS[overrideMascotId] : userMascot;

  // Set initial message
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      const mascotMessage = getRandomMascotMessage(mascot.id, mood);
      setCurrentMessage(mascotMessage);
    }
  }, [mood, message, mascot.id]);

  // Auto-hide logic
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  if (!visible) return null;

  const sizeClasses = {
    small: "w-16 h-16 text-4xl",
    medium: "w-24 h-24 text-6xl",
    large: "w-32 h-32 text-8xl",
  };

  const getMascotAnimation = () => {
    if (shouldReduceMotion) return {};

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
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Mascot Character */}
      <motion.div
        animate={getMascotAnimation()}
        transition={{
          duration: mood === "celebrating" ? 0.5 : 1,
          repeat: shouldReduceMotion ? 0 : Infinity,
          repeatDelay: mood === "celebrating" ? 0 : 2,
        }}
        className={`${sizeClasses[size]} flex items-center justify-center`}
      >
        {mascot.emoji}
      </motion.div>

      {/* Speech Bubble */}
      {showBubble && currentMessage && (
        <motion.div
          initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-lg p-4 max-w-xs"
        >
          {/* Speech bubble arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />

          <p className="relative z-10 text-center font-bold text-gray-800 text-sm sm:text-base">
            {currentMessage}
          </p>

          {/* Mascot name tag */}
          <p className="text-center text-xs text-gray-500 mt-1">
            — {mascot.name}
          </p>
        </motion.div>
      )}
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
  mascotId,
}: Omit<MascotProps, "size" | "showBubble">) {
  const { shouldReduceMotion } = useAccessibility();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={shouldReduceMotion ? {} : { x: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="relative">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-900"
            aria-label="Dismiss mascot"
          >
            ✕
          </button>
        )}
        <Mascot mood={mood} message={message} size="small" mascotId={mascotId} />
      </div>
    </motion.div>
  );
}

/**
 * Inline mascot for compact spaces (no bubble)
 */
export function InlineMascot({
  mood = "happy",
  size = "small",
  mascotId,
}: Pick<MascotProps, "mood" | "size" | "mascotId">) {
  const { mascot: userMascot } = useMascot();
  const { shouldReduceMotion } = useAccessibility();
  const mascot = mascotId ? MASCOTS[mascotId] : userMascot;

  const sizeClasses = {
    small: "text-2xl",
    medium: "text-4xl",
    large: "text-6xl",
  };

  return (
    <motion.span
      animate={
        shouldReduceMotion
          ? {}
          : mood === "celebrating"
          ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
          : { scale: [1, 1.05, 1] }
      }
      transition={{
        duration: 1,
        repeat: shouldReduceMotion ? 0 : Infinity,
        repeatDelay: 2,
      }}
      className={`inline-block ${sizeClasses[size]}`}
      role="img"
      aria-label={`${mascot.name} mascot`}
    >
      {mascot.emoji}
    </motion.span>
  );
}

/**
 * Mascot with greeting - shows the mascot with a personalized greeting
 */
export function MascotGreeting({
  childName,
  mascotId,
}: {
  childName?: string;
  mascotId?: MascotId;
}) {
  const { mascot: userMascot, greet } = useMascot();
  const { shouldReduceMotion } = useAccessibility();
  const mascot = mascotId ? MASCOTS[mascotId] : userMascot;

  const greeting = useMemo(() => {
    const baseGreeting = getRandomMascotMessage(mascot.id, "greeting");
    return childName ? baseGreeting.replace("friend", childName) : baseGreeting;
  }, [mascot.id, childName]);

  return (
    <div className="flex items-center gap-3">
      <motion.span
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -5, 0],
                rotate: [0, -5, 5, 0],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-4xl"
      >
        {mascot.emoji}
      </motion.span>
      <div>
        <p className="font-bold text-gray-800">{greeting}</p>
        <p className="text-sm text-gray-500">— {mascot.name}</p>
      </div>
    </div>
  );
}
