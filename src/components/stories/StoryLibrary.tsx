"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  STORIES,
  Story,
  DifficultyLevel,
  StoryCategory,
  getUnlockedStories,
  getFeaturedStories,
} from "@/lib/stories-data";
import { useStoryProgress } from "@/hooks/use-story-progress";
import { useLevelProgress } from "@/hooks/use-level-progress";
import { StoryReader } from "./StoryReader";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import {
  BookOpen,
  Lock,
  Star,
  Heart,
  CheckCircle,
  Filter,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type FilterType = "all" | "unlocked" | "favorites" | "completed";

export function StoryLibrary() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | null>(null);

  const { currentLevel } = useLevelProgress();
  const { getStoryProgress, favorites } = useStoryProgress();

  // Filter stories based on selected filters
  const getFilteredStories = (): Story[] => {
    let stories = STORIES;

    // Apply main filter
    if (filter === "unlocked") {
      // Convert level ID like "level-1" to number
      const levelNumber = currentLevel ? parseInt(currentLevel.replace("level-", ""), 10) : 1;
      stories = getUnlockedStories(levelNumber);
    } else if (filter === "favorites") {
      stories = stories.filter((s) => favorites.includes(s.id));
    } else if (filter === "completed") {
      stories = stories.filter((s) => {
        const progress = getStoryProgress(s.id);
        return progress?.completed;
      });
    }

    // Apply difficulty filter
    if (difficultyFilter) {
      stories = stories.filter((s) => s.difficulty === difficultyFilter);
    }

    return stories;
  };

  const filteredStories = getFilteredStories();
  const featuredStories = getFeaturedStories();

  const isStoryUnlocked = (story: Story): boolean => {
    if (!story.unlockLevel) return true;
    // Convert level ID like "level-1" to number for comparison
    const levelNumber = currentLevel ? parseInt(currentLevel.replace("level-", ""), 10) : 0;
    return levelNumber >= story.unlockLevel;
  };

  if (selectedStory) {
    return <StoryReader story={selectedStory} onClose={() => setSelectedStory(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Story Library
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Read amazing stories and learn new words!
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          {/* Main Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="text-sm font-bold text-gray-600 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Show:
            </span>
            {(["all", "unlocked", "favorites", "completed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all",
                  filter === f
                    ? "bg-purple-500 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-bold text-gray-600">Difficulty:</span>
            {(["beginner", "intermediate", "advanced"] as DifficultyLevel[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(difficultyFilter === diff ? null : diff)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all",
                  difficultyFilter === diff
                    ? "bg-blue-500 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      {filter === "all" && !difficultyFilter && featuredStories.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-black text-gray-800">Featured Stories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                index={index}
                isUnlocked={isStoryUnlocked(story)}
                progress={getStoryProgress(story.id)}
                onClick={() => isStoryUnlocked(story) && setSelectedStory(story)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Stories Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-gray-800 mb-4">
          {filter !== "all" ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Stories` : "All Stories"}
        </h2>

        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 font-bold">No stories found</p>
            <p className="text-gray-400 mt-2">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                index={index}
                isUnlocked={isStoryUnlocked(story)}
                progress={getStoryProgress(story.id)}
                onClick={() => isStoryUnlocked(story) && setSelectedStory(story)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StoryCardProps {
  story: Story;
  index: number;
  isUnlocked: boolean;
  progress: any;
  onClick: () => void;
}

function StoryCard({ story, index, isUnlocked, progress, onClick }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all",
        isUnlocked
          ? "cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
          : "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-100 to-gray-200">
        <ImageWithFallback
          src={story.coverImage}
          alt={story.title}
          fallbackText="📚"
          className="w-full h-full object-cover"
        />

        {/* Status Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {progress?.favorited && (
            <div className="bg-red-500 p-2 rounded-full shadow-lg">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          )}
          {progress?.completed && (
            <div className="bg-green-500 p-2 rounded-full shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
          {!isUnlocked && (
            <div className="bg-gray-800 p-2 rounded-full shadow-lg">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress && progress.started && !progress.completed && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              style={{
                width: `${(progress.lastPageRead / story.pages.length) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-black text-lg text-gray-800 mb-1 line-clamp-2">
          {story.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">by {story.author}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {story.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {story.difficulty}
          </span>
          <span>{story.estimatedMinutes} min</span>
          <span>{story.pages.length} pages</span>
        </div>

        {/* Unlock Message */}
        {!isUnlocked && story.unlockLevel && (
          <div className="mt-3 text-xs font-bold text-center text-gray-500 bg-gray-100 py-2 rounded-lg">
            Unlock at Level {story.unlockLevel}
          </div>
        )}
      </div>
    </motion.div>
  );
}
