import { Suspense } from "react";
import { SystematicPhonicsHub } from "@/components/phonics/SystematicPhonicsHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Systematic Phonics | Toddler Learning App",
  description: "Learn letters in the perfect order for reading success",
};

export default function PhonicsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-600 font-bold">Loading...</p>
          </div>
        </div>
      }
    >
      <SystematicPhonicsHub />
    </Suspense>
  );
}
