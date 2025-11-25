import { AchievementsDisplay } from "@/components/gamification/AchievementsDisplay";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | Little Learner",
  description: "View your badges, XP, and learning achievements!",
};

export default function AchievementsPage() {
  return <AchievementsDisplay />;
}
