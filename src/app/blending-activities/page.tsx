"use client";

import { SessionFlow } from "@/components/SessionFlow";
import { useRouter } from "next/navigation";

export default function BlendingActivitiesPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push("/");
  };

  return <SessionFlow onExit={handleExit} />;
}
