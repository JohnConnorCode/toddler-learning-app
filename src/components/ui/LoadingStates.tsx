"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

export function LoadingSpinner({ size = "md", color = "primary", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-yellow-400",
    secondary: "border-green-400",
    white: "border-white",
  };

  return (
    <div
      className={cn(
        "border-4 border-gray-200 rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
      style={{
        borderTopColor: color === "primary" ? "#FFD166" : color === "secondary" ? "#06D6A0" : "#fff",
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div
      className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-4"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        {/* Animated owl */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-7xl mb-6"
          role="img"
          aria-label="Loading owl"
        >
          🦉
        </motion.div>

        <LoadingSpinner size="lg" className="mx-auto mb-4" />

        <p className="text-xl font-bold text-gray-700">{message}</p>

        {/* Loading dots animation */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-yellow-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

interface ActivityLoadingProps {
  activityName?: string;
}

export function ActivityLoading({ activityName = "activity" }: ActivityLoadingProps) {
  return (
    <div
      className="min-h-[400px] flex flex-col items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
          role="img"
          aria-label="Excited owl"
        >
          🦉
        </motion.div>

        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-700">
            Getting {activityName} ready...
          </p>
          <p className="text-gray-500 mt-2">
            Just a moment!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

interface ButtonLoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function ButtonLoading({
  children,
  isLoading,
  loadingText = "Loading...",
  className,
  disabled,
  onClick,
}: ButtonLoadingProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-bold transition-all touch-target",
        isLoading && "cursor-wait",
        className
      )}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

interface ContentLoadingProps {
  rows?: number;
  className?: string;
}

export function ContentLoading({ rows = 3, className }: ContentLoadingProps) {
  return (
    <div className={cn("animate-pulse space-y-4", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}

interface ImageLoadingProps {
  className?: string;
}

export function ImageLoading({ className }: ImageLoadingProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 animate-pulse flex items-center justify-center",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="w-12 h-12 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

interface GridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function GridSkeleton({ count = 6, columns = 2, className }: GridSkeletonProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-4 sm:gap-6", gridCols[columns], className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
