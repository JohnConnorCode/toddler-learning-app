import { notFound } from "next/navigation";
import { getLevelById, LEVELS } from "@/lib/levels-data";
import { LevelDetail } from "@/components/levels/LevelDetail";

export async function generateStaticParams() {
  return LEVELS.map((level) => ({
    levelId: level.id,
  }));
}

export async function generateMetadata({ params }: { params: { levelId: string } }) {
  const level = getLevelById(params.levelId);

  if (!level) {
    return {
      title: "Level Not Found",
    };
  }

  return {
    title: `${level.title} - Little Learner`,
    description: level.description,
  };
}

export default function LevelPage({ params }: { params: { levelId: string } }) {
  const level = getLevelById(params.levelId);

  if (!level) {
    notFound();
  }

  return <LevelDetail level={level} />;
}
