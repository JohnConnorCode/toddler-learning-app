"use client";

import { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackText
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);

    const timeout = setTimeout(() => {
      // If still loading after 5 seconds, treat as error
      setImageError(true);
      setImageLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [src]);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  // Map common words to emojis for toddler-friendly fallback
  const getEmoji = (text: string): string => {
    const emojiMap: Record<string, string> = {
      apple: "🍎", alligator: "🐊", ball: "⚽", bear: "🐻",
      cat: "🐱", cookie: "🍪", dog: "🐕", dinosaur: "🦕",
      elephant: "🐘", egg: "🥚", fish: "🐟", frog: "🐸",
      monkey: "🐵", moon: "🌙", penguin: "🐧", pizza: "🍕",
      snake: "🐍", star: "⭐", turtle: "🐢", toothbrush: "🪥"
    };
    return emojiMap[text.toLowerCase()] || "";
  };

  if (imageError) {
    const emoji = getEmoji(fallbackText || alt);
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50",
        className
      )}>
        {emoji ? (
          <span className="text-6xl mb-2">{emoji}</span>
        ) : (
          <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
        )}
        <span className="text-lg font-black text-gray-600">
          {fallbackText || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          imageLoading ? "opacity-0" : "opacity-100"
        )}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
