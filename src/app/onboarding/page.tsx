"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useOnboarding, useOnboardingHydrated } from "@/hooks/use-onboarding";
import { OnboardingWizard } from "@/components/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const { isOnboardingComplete } = useOnboarding();
  const hasHydrated = useOnboardingHydrated();

  // Redirect to home if onboarding is already complete (after hydration)
  useEffect(() => {
    if (!hasHydrated) return;
    if (isOnboardingComplete) {
      router.replace("/");
    }
  }, [isOnboardingComplete, router, hasHydrated]);

  // Show loading until hydration is complete
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🌟
          </motion.div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">
            Smart Starts
          </h1>
          <p className="text-gray-500 font-medium">
            Getting ready...
          </p>
        </motion.div>
      </div>
    );
  }

  // Don't render wizard if already completed (avoid flash)
  if (isOnboardingComplete) {
    return null;
  }

  return <OnboardingWizard />;
}
