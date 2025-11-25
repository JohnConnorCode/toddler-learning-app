"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingWizard } from "@/components/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const { isOnboardingComplete } = useOnboarding();

  // Redirect to home if onboarding is already complete
  useEffect(() => {
    if (isOnboardingComplete) {
      router.replace("/");
    }
  }, [isOnboardingComplete, router]);

  // Don't render wizard if already completed (avoid flash)
  if (isOnboardingComplete) {
    return null;
  }

  return <OnboardingWizard />;
}
