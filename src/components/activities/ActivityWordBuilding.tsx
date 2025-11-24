"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { type Activity } from "@/lib/levels-data";

interface ActivityWordBuildingProps {
  activity: Activity;
  onComplete: (stars: number) => void;
  levelColor: string;
}

export function ActivityWordBuilding({
  activity,
  onComplete,
  levelColor,
}: ActivityWordBuildingProps) {
  // contentId should be the word to build (e.g., "cat", "hat")
  const word = activity.contentId;

  if (!word) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-red-600">Error: No word specified for this activity</p>
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
          <Pencil className="w-10 h-10" style={{ color: levelColor }} />
        </div>

        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {activity.description}
        </p>

        <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-6 mb-6">
          <p className="text-pink-900 font-medium mb-4">
            Spell the word: <strong className="text-2xl">{word.toUpperCase()}</strong>
          </p>
          <p className="text-sm text-pink-700">
            You'll go to the word spelling activity. When you finish, you'll return here automatically.
          </p>
        </div>

        {/* Link to existing words page */}
        <Link
          href={`/words?word=${word}&returnTo=lesson`}
          className="inline-flex px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform items-center gap-2"
          style={{ backgroundColor: levelColor }}
        >
          <Pencil className="w-5 h-5" />
          <span>Start Spelling</span>
        </Link>
      </div>
    </div>
  );
}
