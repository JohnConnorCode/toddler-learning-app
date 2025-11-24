"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { type Activity } from "@/lib/levels-data";

interface ActivityPhonicsProps {
  activity: Activity;
  onComplete: (stars: number) => void;
  levelColor: string;
}

export function ActivityPhonics({
  activity,
  onComplete,
  levelColor,
}: ActivityPhonicsProps) {
  // contentId should be the letter (e.g., "A", "B", "C")
  const letter = activity.contentId;

  if (!letter) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-red-600">Error: No letter specified for this activity</p>
          <button
            onClick={() => onComplete(1)}
            className="mt-4 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${levelColor}20` }}
        >
          <BookOpen className="w-10 h-10" style={{ color: levelColor }} />
        </div>

        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {activity.description}
        </p>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
          <p className="text-yellow-900 font-medium mb-4">
            This will open the phonics activity for letter <strong className="text-2xl">{letter}</strong>.
            When you finish, you'll return here automatically.
          </p>
        </div>

        {/* Link to existing phonics page */}
        <Link
          href={`/phonics?letter=${letter}&returnTo=lesson`}
          className="inline-flex px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform items-center gap-2"
          style={{ backgroundColor: levelColor }}
        >
          <BookOpen className="w-5 h-5" />
          <span>Start Learning</span>
        </Link>

        {/* Temporary complete button for testing */}
        <button
          onClick={() => onComplete(3)}
          className="block mx-auto mt-4 px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          Complete (for testing)
        </button>
      </div>
    </div>
  );
}
