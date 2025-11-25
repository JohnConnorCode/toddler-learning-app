"use client";

import { useEffect, ReactNode } from "react";
import { useAccessibility } from "@/hooks/use-accessibility";

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const { highContrast, largeText, shouldReduceMotion } = useAccessibility();

  // Apply accessibility classes to document
  useEffect(() => {
    const html = document.documentElement;

    // High contrast mode
    if (highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    // Large text mode
    if (largeText) {
      html.classList.add("large-text");
      html.style.fontSize = "125%";
    } else {
      html.classList.remove("large-text");
      html.style.fontSize = "";
    }

    // Reduced motion (set data attribute for CSS/JS checks)
    if (shouldReduceMotion) {
      html.setAttribute("data-reduced-motion", "true");
    } else {
      html.removeAttribute("data-reduced-motion");
    }
  }, [highContrast, largeText, shouldReduceMotion]);

  // Handle keyboard navigation hints
  useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
        window.addEventListener("mousedown", handleMouseDown);
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove("user-is-tabbing");
      window.removeEventListener("mousedown", handleMouseDown);
      window.addEventListener("keydown", handleFirstTab);
    };

    window.addEventListener("keydown", handleFirstTab);
    return () => {
      window.removeEventListener("keydown", handleFirstTab);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return <>{children}</>;
}
