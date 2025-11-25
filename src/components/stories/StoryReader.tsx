"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Story, StoryPage } from "@/lib/stories-data";
import { useStoryProgress } from "@/hooks/use-story-progress";
import { useSpeech, useVolumeControl } from "@/hooks/use-audio";
import { ChevronLeft, ChevronRight, X, Heart, BookOpen, Star, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import confetti from "canvas-confetti";

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
  startPage?: number;
}

export function StoryReader({ story, onClose, startPage = 0 }: StoryReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(startPage);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const isReadingRef = useRef(false);

  const {
    startStory,
    updatePageProgress,
    completeStory,
    toggleFavorite,
    getStoryProgress,
  } = useStoryProgress();

  const { speakWords, stop: stopSpeech, isSupported: isTTSSupported } = useSpeech();
  const { isMuted, toggleMute } = useVolumeControl();

  const currentPage = story.pages[currentPageIndex];
  const progress = getStoryProgress(story.id);
  const isFavorited = progress?.favorited || false;
  const isLastPage = currentPageIndex === story.pages.length - 1;
  const isFirstPage = currentPageIndex === 0;

  // Start story when component mounts
  useEffect(() => {
    startStory(story.id);
  }, [story.id, startStory]);

  // Update page progress when page changes
  useEffect(() => {
    if (currentPage) {
      updatePageProgress(story.id, currentPage.pageNumber);
    }
  }, [currentPage, story.id, updatePageProgress]);

  // Stop reading when page changes
  useEffect(() => {
    return () => {
      isReadingRef.current = false;
      stopSpeech();
    };
  }, [currentPageIndex, stopSpeech]);

  const nextPage = () => {
    // Stop reading before page change
    if (isReading) {
      isReadingRef.current = false;
      setIsReading(false);
      stopSpeech();
    }

    if (isLastPage) {
      // Story completed!
      completeStory(story.id);
      setShowCompletion(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setCurrentPageIndex(currentPageIndex + 1);
      setHighlightedWordIndex(null);
    }
  };

  const prevPage = () => {
    if (!isFirstPage) {
      // Stop reading before page change
      if (isReading) {
        isReadingRef.current = false;
        setIsReading(false);
        stopSpeech();
      }
      setCurrentPageIndex(currentPageIndex - 1);
      setHighlightedWordIndex(null);
    }
  };

  const handleReadAlong = async () => {
    if (isReading) {
      // Stop reading
      isReadingRef.current = false;
      setIsReading(false);
      setHighlightedWordIndex(null);
      stopSpeech();
      return;
    }

    // Start reading with TTS
    isReadingRef.current = true;
    setIsReading(true);
    setHighlightedWordIndex(0);

    const words = currentPage.words.map((w) => w.text);

    await speakWords(
      words,
      // onWordStart callback
      (index) => {
        if (isReadingRef.current) {
          setHighlightedWordIndex(index);
        }
      },
      // onComplete callback
      () => {
        if (isReadingRef.current) {
          setIsReading(false);
          setHighlightedWordIndex(null);
          isReadingRef.current = false;
        }
      }
    );
  };

  const handleFavorite = () => {
    toggleFavorite(story.id);
  };

  if (showCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6"
          >
            <Star className="w-14 h-14 text-white fill-white" />
          </motion.div>

          <h2 className="text-4xl font-black text-gray-800 mb-4">
            Story Complete!
          </h2>

          <p className="text-xl text-gray-600 mb-6">
            You finished reading <strong>{story.title}</strong>!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setShowCompletion(false);
                setCurrentPageIndex(0);
              }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
            >
              Read Again
            </button>

            <button
              onClick={onClose}
              className="px-8 py-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg transition-colors"
            >
              Back to Library
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: currentPage?.backgroundColor || story.theme.background }}
    >
      {/* Header Controls */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between z-10">
        <button
          onClick={onClose}
          className="p-2 sm:p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Volume Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 sm:p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            )}
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={handleFavorite}
            className="p-2 sm:p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Page Counter */}
          <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
            <span className="font-bold text-gray-700 text-sm sm:text-base">
              {currentPage.pageNumber} / {story.pages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Book Area */}
      <div className="w-full max-w-4xl aspect-[4/3] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPageIndex}
            initial={{ opacity: 0, x: currentPageIndex > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentPageIndex > 0 ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 flex flex-col"
          >
            {/* Image */}
            {currentPage.image && (
              <div className="flex-1 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={currentPage.image}
                  alt={currentPage.imageAlt || currentPage.text}
                  fallbackText="📖"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Text with Read-Along */}
            <div className="text-center">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-relaxed flex flex-wrap justify-center gap-1 sm:gap-2">
                {currentPage.words.map((word, index) => (
                  <motion.span
                    key={index}
                    animate={{
                      color: highlightedWordIndex === index ? story.theme.primary : "#1F2937",
                      scale: highlightedWordIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {word.text}
                  </motion.span>
                ))}
              </p>

              {/* Read-Along Button */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
                <motion.button
                  onClick={handleReadAlong}
                  disabled={isMuted}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isReading ? "#EF4444" : story.theme.primary,
                    color: "white",
                  }}
                >
                  {isReading ? (
                    <>
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Read to Me</span>
                    </>
                  )}
                </motion.button>

                {isMuted && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Turn on sound to hear the story
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          disabled={isFirstPage}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-white rounded-full shadow-xl hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
        </button>

        <button
          onClick={nextPage}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-white rounded-full shadow-xl hover:scale-110 transition-all z-10"
          style={{ backgroundColor: isLastPage ? story.theme.primary : "white" }}
        >
          <ChevronRight
            className={`w-6 h-6 sm:w-8 sm:h-8 ${
              isLastPage ? "text-white" : "text-gray-600"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
