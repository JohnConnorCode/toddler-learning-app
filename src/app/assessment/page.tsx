import { AssessmentHub } from "@/components/assessment/AssessmentHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Assessment | Toddler Learning App",
  description: "Find your perfect starting point with our personalized reading assessment",
};

export default function AssessmentPage() {
  return <AssessmentHub />;
}
