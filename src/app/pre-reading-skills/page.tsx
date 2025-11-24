import { PreReadingHub } from "@/components/phonemic/PreReadingHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Reading Skills | Toddler Learning App",
  description: "Build foundational phonemic awareness skills through fun sound activities",
};

export default function PreReadingSkillsPage() {
  return <PreReadingHub />;
}
