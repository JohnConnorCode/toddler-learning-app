"use client";

import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { motion } from "framer-motion";
import { useVolumeControl } from "@/hooks/use-audio";
import { cn } from "@/lib/utils";

interface VolumeControlProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function VolumeControl({ className, showLabel = true, size = "md" }: VolumeControlProps) {
  const { volume, isMuted, setVolume, toggleMute } = useVolumeControl();

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={toggleMute}
        className={cn(
          "p-2 rounded-full transition-colors touch-target",
          isMuted
            ? "bg-gray-200 text-gray-400"
            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
        )}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        aria-pressed={isMuted}
      >
        <VolumeIcon className={iconSizes[size]} aria-hidden="true" />
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {showLabel && (
          <label htmlFor="volume-slider" className="text-sm font-medium text-gray-700">
            Volume: {Math.round(volume * 100)}%
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={cn(
              "w-full appearance-none bg-gray-200 rounded-full cursor-pointer",
              sizeClasses[size],
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:w-4",
              "[&::-webkit-slider-thumb]:h-4",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-blue-500",
              "[&::-webkit-slider-thumb]:cursor-pointer",
              "[&::-webkit-slider-thumb]:shadow-md",
              "[&::-webkit-slider-thumb]:hover:bg-blue-600",
              "[&::-moz-range-thumb]:w-4",
              "[&::-moz-range-thumb]:h-4",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-blue-500",
              "[&::-moz-range-thumb]:border-none",
              "[&::-moz-range-thumb]:cursor-pointer"
            )}
            aria-label="Volume level"
            aria-valuenow={Math.round(volume * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          {/* Progress fill */}
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 bg-blue-500 rounded-full pointer-events-none",
              sizeClasses[size]
            )}
            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

interface QuickMuteButtonProps {
  className?: string;
}

export function QuickMuteButton({ className }: QuickMuteButtonProps) {
  const { isMuted, toggleMute, volume } = useVolumeControl();
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleMute}
      className={cn(
        "p-3 rounded-full shadow-md transition-colors touch-target",
        isMuted
          ? "bg-gray-100 text-gray-400"
          : "bg-white text-blue-500 hover:bg-blue-50",
        className
      )}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      aria-pressed={isMuted}
      title={isMuted ? "Unmute" : "Mute"}
    >
      <VolumeIcon className="w-5 h-5" aria-hidden="true" />
    </motion.button>
  );
}
