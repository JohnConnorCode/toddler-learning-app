import { StoryLibrary } from "@/components/stories/StoryLibrary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story Library | Little Learner",
  description: "Read amazing interactive stories and learn new words!",
};

export default function StoriesPage() {
  return <StoryLibrary />;
}
