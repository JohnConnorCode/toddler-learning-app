import { notFound } from "next/navigation";
import { getLessonById, LEVELS } from "@/lib/levels-data";
import { LessonPlayer } from "@/components/levels/LessonPlayer";

export async function generateStaticParams() {
  const params: { levelId: string; lessonId: string }[] = [];

  LEVELS.forEach((level) => {
    level.lessons.forEach((lesson) => {
      params.push({
        levelId: level.id,
        lessonId: lesson.id,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: {
  params: { levelId: string; lessonId: string };
}) {
  const result = getLessonById(params.lessonId);

  if (!result) {
    return {
      title: "Lesson Not Found",
    };
  }

  return {
    title: `${result.lesson.title} - Little Learner`,
    description: result.lesson.description,
  };
}

export default function LessonPage({ params }: {
  params: { levelId: string; lessonId: string };
}) {
  const result = getLessonById(params.lessonId);

  if (!result) {
    notFound();
  }

  const { level, lesson } = result;

  return <LessonPlayer level={level} lesson={lesson} />;
}
