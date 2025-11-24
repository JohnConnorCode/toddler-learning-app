"use client";

import { useState } from "react";
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

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200",
        className
      )}>
        <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-2xl font-black text-gray-600">
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
