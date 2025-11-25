"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding, OnboardingStep } from "@/hooks/use-onboarding";
import { useAccessibility } from "@/hooks/use-accessibility";
import { WelcomeStep } from "./WelcomeStep";
import { ParentSetup } from "./ParentSetup";
import { ChildIntro } from "./ChildIntro";
import { GuidedFirstLesson } from "./GuidedFirstLesson";
import { CompletionCelebration } from "./CompletionCelebration";

const STEPS: OnboardingStep[] = [
  "welcome",
  "parent-setup",
  "child-intro",
  "guided-lesson",
  "complete",
];

export function OnboardingWizard() {
  const { currentStep, setCurrentStep, completeOnboarding, skipOnboarding } =
    useOnboarding();
  const { shouldReduceMotion } = useAccessibility();
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const goToStep = (step: OnboardingStep) => {
    const newIndex = STEPS.indexOf(step);
    setDirection(newIndex > currentStepIndex ? 1 : -1);
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      goToStep(STEPS[currentStepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(STEPS[currentStepIndex - 1]);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const variants = {
    enter: (direction: number) => ({
      x: shouldReduceMotion ? 0 : direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: shouldReduceMotion ? 0 : direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep onNext={nextStep} onSkip={handleSkip} />;
      case "parent-setup":
        return <ParentSetup onNext={nextStep} onBack={prevStep} />;
      case "child-intro":
        return <ChildIntro onNext={nextStep} onBack={prevStep} />;
      case "guided-lesson":
        return <GuidedFirstLesson onNext={nextStep} onBack={prevStep} />;
      case "complete":
        return <CompletionCelebration onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col">
      {/* Progress Bar */}
      {currentStep !== "complete" && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-2 bg-white/50">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Step Indicators */}
      {currentStep !== "complete" && (
        <div className="flex justify-center gap-2 pt-6 pb-4">
          {STEPS.slice(0, -1).map((step, index) => (
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index <= currentStepIndex
                  ? "bg-orange-500 scale-110"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full max-w-lg"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
