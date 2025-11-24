import { BlendingHub } from "@/components/blending/BlendingHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blending & Segmenting | Toddler Learning App",
  description: "Learn to blend sounds together and break words apart - the heart of reading!",
};

export default function BlendingPage() {
  return <BlendingHub />;
}
