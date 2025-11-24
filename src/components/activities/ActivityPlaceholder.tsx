"use client";

import { CheckCircle } from "lucide-react";
import { type Activity } from "@/lib/levels-data";

interface ActivityPlaceholderProps {
  activity: Activity;
  onComplete: (stars: number) => void;
  levelColor: string;
}

export function ActivityPlaceholder({
  activity,
  onComplete,
  levelColor,
}: ActivityPlaceholderProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${levelColor}20` }}
        >
          <span className="text-4xl">🎯</span>
        </div>

        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {activity.description}
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <p className="text-blue-800 font-medium">
            This activity type <strong>"{activity.type}"</strong> is coming soon!
            For now, click below to continue to the next activity.
          </p>
        </div>

        <button
          onClick={() => onComplete(3)}
          className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          style={{ backgroundColor: levelColor }}
        >
          <CheckCircle className="w-5 h-5" />
          <span>Complete Activity</span>
        </button>
      </div>
    </div>
  );
}
