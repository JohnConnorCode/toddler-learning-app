import { SystematicPhonicsHub } from "@/components/phonics/SystematicPhonicsHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Systematic Phonics | Toddler Learning App",
  description: "Learn letters in the perfect order for reading success",
};

export default function PhonicsPage() {
  return <SystematicPhonicsHub />;
}
