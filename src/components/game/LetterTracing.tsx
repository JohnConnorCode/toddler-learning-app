"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/use-audio";
import { cn } from "@/lib/utils";

interface LetterTracingProps {
  letter: string;
  onComplete?: () => void;
  showGuide?: boolean;
  /** Letter case to display */
  letterCase?: "upper" | "lower" | "both";
}

// SVG paths for uppercase letters (simplified for toddlers)
const LETTER_PATHS: Record<string, { path: string; viewBox: string }> = {
  A: {
    path: "M50,180 L100,20 L150,180 M65,120 L135,120",
    viewBox: "0 0 200 200",
  },
  B: {
    path: "M50,20 L50,180 M50,20 L120,20 Q160,20 160,60 Q160,100 120,100 L50,100 M50,100 L130,100 Q170,100 170,140 Q170,180 130,180 L50,180",
    viewBox: "0 0 200 200",
  },
  C: {
    path: "M160,50 Q100,10 60,50 Q20,90 20,100 Q20,110 60,150 Q100,190 160,150",
    viewBox: "0 0 200 200",
  },
  D: {
    path: "M50,20 L50,180 M50,20 L100,20 Q180,20 180,100 Q180,180 100,180 L50,180",
    viewBox: "0 0 200 200",
  },
  E: {
    path: "M150,20 L50,20 L50,180 L150,180 M50,100 L130,100",
    viewBox: "0 0 200 200",
  },
  F: {
    path: "M150,20 L50,20 L50,180 M50,100 L120,100",
    viewBox: "0 0 200 200",
  },
  G: {
    path: "M160,50 Q100,10 60,50 Q20,90 20,100 Q20,150 60,170 Q100,190 160,160 L160,100 L110,100",
    viewBox: "0 0 200 200",
  },
  H: {
    path: "M50,20 L50,180 M150,20 L150,180 M50,100 L150,100",
    viewBox: "0 0 200 200",
  },
  I: {
    path: "M60,20 L140,20 M100,20 L100,180 M60,180 L140,180",
    viewBox: "0 0 200 200",
  },
  J: {
    path: "M60,20 L140,20 M100,20 L100,150 Q100,180 70,180 Q40,180 40,150",
    viewBox: "0 0 200 200",
  },
  K: {
    path: "M50,20 L50,180 M150,20 L50,100 L150,180",
    viewBox: "0 0 200 200",
  },
  L: {
    path: "M50,20 L50,180 L150,180",
    viewBox: "0 0 200 200",
  },
  M: {
    path: "M30,180 L30,20 L100,100 L170,20 L170,180",
    viewBox: "0 0 200 200",
  },
  N: {
    path: "M50,180 L50,20 L150,180 L150,20",
    viewBox: "0 0 200 200",
  },
  O: {
    path: "M100,20 Q20,20 20,100 Q20,180 100,180 Q180,180 180,100 Q180,20 100,20",
    viewBox: "0 0 200 200",
  },
  P: {
    path: "M50,180 L50,20 L120,20 Q170,20 170,70 Q170,120 120,120 L50,120",
    viewBox: "0 0 200 200",
  },
  Q: {
    path: "M100,20 Q20,20 20,100 Q20,180 100,180 Q180,180 180,100 Q180,20 100,20 M120,140 L170,190",
    viewBox: "0 0 200 200",
  },
  R: {
    path: "M50,180 L50,20 L120,20 Q170,20 170,70 Q170,120 120,120 L50,120 M100,120 L160,180",
    viewBox: "0 0 200 200",
  },
  S: {
    path: "M150,50 Q150,20 100,20 Q50,20 50,60 Q50,100 100,100 Q150,100 150,140 Q150,180 100,180 Q50,180 50,150",
    viewBox: "0 0 200 200",
  },
  T: {
    path: "M20,20 L180,20 M100,20 L100,180",
    viewBox: "0 0 200 200",
  },
  U: {
    path: "M50,20 L50,140 Q50,180 100,180 Q150,180 150,140 L150,20",
    viewBox: "0 0 200 200",
  },
  V: {
    path: "M30,20 L100,180 L170,20",
    viewBox: "0 0 200 200",
  },
  W: {
    path: "M20,20 L50,180 L100,80 L150,180 L180,20",
    viewBox: "0 0 200 200",
  },
  X: {
    path: "M30,20 L170,180 M170,20 L30,180",
    viewBox: "0 0 200 200",
  },
  Y: {
    path: "M30,20 L100,100 L170,20 M100,100 L100,180",
    viewBox: "0 0 200 200",
  },
  Z: {
    path: "M30,20 L170,20 L30,180 L170,180",
    viewBox: "0 0 200 200",
  },
};

// SVG paths for lowercase letters (x-height based, with ascenders/descenders)
const LOWERCASE_PATHS: Record<string, { path: string; viewBox: string }> = {
  a: {
    path: "M140,80 Q140,60 100,60 Q60,60 60,100 Q60,140 100,140 Q140,140 140,120 L140,60 L140,140",
    viewBox: "0 0 200 200",
  },
  b: {
    path: "M60,20 L60,140 M60,100 Q60,60 100,60 Q140,60 140,100 Q140,140 100,140 Q60,140 60,100",
    viewBox: "0 0 200 200",
  },
  c: {
    path: "M140,70 Q100,50 70,70 Q40,100 70,130 Q100,150 140,130",
    viewBox: "0 0 200 200",
  },
  d: {
    path: "M140,20 L140,140 M140,100 Q140,60 100,60 Q60,60 60,100 Q60,140 100,140 Q140,140 140,100",
    viewBox: "0 0 200 200",
  },
  e: {
    path: "M50,100 L140,100 Q140,60 100,60 Q50,60 50,100 Q50,140 100,140 Q130,140 140,130",
    viewBox: "0 0 200 200",
  },
  f: {
    path: "M130,40 Q110,20 90,40 L90,140 M60,80 L120,80",
    viewBox: "0 0 200 200",
  },
  g: {
    path: "M140,60 L140,160 Q140,190 100,190 Q60,190 60,170 M140,100 Q140,60 100,60 Q60,60 60,100 Q60,140 100,140 Q140,140 140,100",
    viewBox: "0 0 200 200",
  },
  h: {
    path: "M60,20 L60,140 M60,90 Q60,60 100,60 Q140,60 140,90 L140,140",
    viewBox: "0 0 200 200",
  },
  i: {
    path: "M100,60 L100,140 M100,30 L100,35",
    viewBox: "0 0 200 200",
  },
  j: {
    path: "M110,60 L110,160 Q110,190 70,190 Q50,190 50,170 M110,30 L110,35",
    viewBox: "0 0 200 200",
  },
  k: {
    path: "M60,20 L60,140 M130,60 L60,100 L130,140",
    viewBox: "0 0 200 200",
  },
  l: {
    path: "M100,20 L100,140",
    viewBox: "0 0 200 200",
  },
  m: {
    path: "M40,140 L40,70 Q40,60 60,60 Q80,60 80,80 L80,140 M80,70 Q80,60 100,60 Q120,60 120,80 L120,140 M120,70 Q120,60 140,60 Q160,60 160,80 L160,140",
    viewBox: "0 0 200 200",
  },
  n: {
    path: "M60,140 L60,70 Q60,60 80,60 Q120,60 120,80 L120,140",
    viewBox: "0 0 200 200",
  },
  o: {
    path: "M100,60 Q60,60 60,100 Q60,140 100,140 Q140,140 140,100 Q140,60 100,60",
    viewBox: "0 0 200 200",
  },
  p: {
    path: "M60,60 L60,180 M60,100 Q60,60 100,60 Q140,60 140,100 Q140,140 100,140 Q60,140 60,100",
    viewBox: "0 0 200 200",
  },
  q: {
    path: "M140,60 L140,180 M140,100 Q140,60 100,60 Q60,60 60,100 Q60,140 100,140 Q140,140 140,100",
    viewBox: "0 0 200 200",
  },
  r: {
    path: "M70,140 L70,80 Q70,60 100,60 Q120,60 130,70",
    viewBox: "0 0 200 200",
  },
  s: {
    path: "M130,70 Q130,50 100,50 Q70,50 70,75 Q70,100 100,100 Q130,100 130,125 Q130,150 100,150 Q70,150 70,130",
    viewBox: "0 0 200 200",
  },
  t: {
    path: "M100,30 L100,140 Q100,150 120,150 M70,60 L130,60",
    viewBox: "0 0 200 200",
  },
  u: {
    path: "M60,60 L60,110 Q60,140 100,140 Q140,140 140,110 L140,60 L140,140",
    viewBox: "0 0 200 200",
  },
  v: {
    path: "M50,60 L100,140 L150,60",
    viewBox: "0 0 200 200",
  },
  w: {
    path: "M30,60 L55,140 L90,80 L125,140 L160,60",
    viewBox: "0 0 200 200",
  },
  x: {
    path: "M50,60 L150,140 M150,60 L50,140",
    viewBox: "0 0 200 200",
  },
  y: {
    path: "M50,60 L100,110 M150,60 L100,110 L70,180",
    viewBox: "0 0 200 200",
  },
  z: {
    path: "M50,60 L150,60 L50,140 L150,140",
    viewBox: "0 0 200 200",
  },
};

/**
 * LetterTracing Component
 *
 * Allows children to practice letter formation by tracing with their finger.
 * Uses canvas for drawing and SVG for the letter guide.
 */
export function LetterTracing({
  letter,
  onComplete,
  showGuide = true,
  letterCase = "upper",
}: LetterTracingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [activeCase, setActiveCase] = useState<"upper" | "lower">(
    letterCase === "lower" ? "lower" : "upper"
  );
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const { speak } = useSpeech();

  const upperLetter = letter.toUpperCase();
  const lowerLetter = letter.toLowerCase();
  const displayLetter = activeCase === "upper" ? upperLetter : lowerLetter;
  const letterPath =
    activeCase === "upper"
      ? LETTER_PATHS[upperLetter]
      : LOWERCASE_PATHS[lowerLetter];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
  }, [letter]);

  // Reset function
  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    setHasDrawn(false);
    setIsComplete(false);
    setStrokeCount(0);
    lastPoint.current = null;
  }, []);

  // Get position from event
  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPosition(e);
    if (!pos) return;

    setIsDrawing(true);
    setHasDrawn(true);
    lastPoint.current = pos;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getPosition(e);
    if (!pos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !lastPoint.current) return;

    // Draw smooth line
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#8B5CF6"; // Purple

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPoint.current = pos;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokeCount((prev) => prev + 1);
    }
    setIsDrawing(false);
    lastPoint.current = null;
  };

  // Speak letter
  const handleSpeak = () => {
    const caseLabel = activeCase === "upper" ? "capital" : "lowercase";
    speak(`${caseLabel} ${upperLetter}. ${upperLetter} says`, { rate: 0.8 });
    setTimeout(() => {
      const phoneticSounds: Record<string, string> = {
        A: "aah", B: "buh", C: "kuh", D: "duh", E: "eh", F: "fff",
        G: "guh", H: "huh", I: "ih", J: "juh", K: "kuh", L: "lll",
        M: "mmm", N: "nnn", O: "oh", P: "puh", Q: "kwuh", R: "rrr",
        S: "sss", T: "tuh", U: "uh", V: "vvv", W: "wuh", X: "ks",
        Y: "yuh", Z: "zzz",
      };
      speak(phoneticSounds[upperLetter] || upperLetter, { rate: 0.7 });
    }, 1200);
  };

  // Toggle between upper and lower case (for "both" mode)
  const handleToggleCase = () => {
    if (letterCase !== "both") return;
    setActiveCase((prev) => (prev === "upper" ? "lower" : "upper"));
    // Clear canvas when switching
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    }
    setHasDrawn(false);
    setStrokeCount(0);
  };

  // Mark complete
  const handleComplete = () => {
    setIsComplete(true);
    const caseLabel = activeCase === "upper" ? "capital" : "lowercase";
    speak(`Great job writing ${caseLabel} ${upperLetter}!`, { rate: 0.9 });
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Letter Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        {/* TODDLER: Big 60px case toggle buttons */}
        {letterCase === "both" && (
          <div className="flex justify-center gap-3 mb-3">
            <button
              onClick={() => activeCase !== "upper" && handleToggleCase()}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-full text-2xl sm:text-3xl font-black transition-colors flex items-center justify-center",
                activeCase === "upper"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              )}
            >
              {upperLetter}
            </button>
            <button
              onClick={() => activeCase !== "lower" && handleToggleCase()}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-full text-2xl sm:text-3xl font-black transition-colors flex items-center justify-center",
                activeCase === "lower"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              )}
            >
              {lowerLetter}
            </button>
          </div>
        )}
        <span className="text-6xl sm:text-7xl font-black text-gray-800">
          {displayLetter}
        </span>
        {/* TODDLER: Big 60px speak button */}
        <button
          onClick={handleSpeak}
          className="ml-3 p-4 sm:p-5 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors min-w-[60px] min-h-[60px] flex items-center justify-center"
        >
          <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </button>
      </motion.div>

      {/* Tracing Area */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* Letter Guide (SVG behind canvas) */}
        {showGuide && letterPath && (
          <svg
            viewBox={letterPath.viewBox}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <path
              d={letterPath.path}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,15"
            />
            {/* Arrow indicator for start */}
            <circle cx="50" cy="20" r="8" fill="#10B981" opacity="0.7" />
          </svg>
        )}

        {/* Canvas for drawing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair rounded-3xl bg-white/50 border-4 border-dashed border-gray-200"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Completion Overlay */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-green-500/90 rounded-3xl flex items-center justify-center"
          >
            <div className="text-center text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-2 fill-yellow-300 text-yellow-300" />
              <p className="text-2xl font-black">Great Job!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* TODDLER: Visual indicator instead of text instructions */}
      <div className="flex justify-center">
        {hasDrawn ? (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(strokeCount, 5) }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-purple-400" />
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-4xl"
          >
            ✏️
          </motion.div>
        )}
      </div>

      {/* TODDLER: Big 70px+ action buttons with icons only */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-5 sm:p-6 bg-gray-200 text-gray-700 font-bold rounded-full flex items-center justify-center min-w-[70px] min-h-[70px]"
        >
          <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.button>

        {hasDrawn && !isComplete && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="p-5 sm:p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full flex items-center justify-center min-w-[70px] min-h-[70px]"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
