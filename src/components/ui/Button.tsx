"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingStates";
import { useAccessibility } from "@/hooks/use-accessibility";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl border-b-4 border-orange-500",
  secondary:
    "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl border-b-4 border-green-600",
  accent:
    "bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg hover:shadow-xl border-b-4 border-rose-600",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  outline:
    "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 shadow-sm hover:shadow",
  danger:
    "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg hover:shadow-xl border-b-4 border-red-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl gap-1.5",
  md: "px-6 py-3 text-base rounded-2xl gap-2",
  lg: "px-8 py-4 text-lg rounded-2xl gap-2.5",
  xl: "px-10 py-5 text-xl rounded-3xl gap-3",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const { shouldReduceMotion } = useAccessibility();

    return (
      <motion.button
        ref={ref}
        whileHover={shouldReduceMotion || disabled || isLoading ? {} : { scale: 1.02 }}
        whileTap={shouldReduceMotion || disabled || isLoading ? {} : { scale: 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all touch-target",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          isLoading && "cursor-wait",
          className
        )}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" color="white" />
            <span>{loadingText || "Loading..."}</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

// Icon-only button
interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "ghost", size = "md", label, className, ...props }, ref) => {
    const { shouldReduceMotion } = useAccessibility();

    const iconSizeStyles: Record<ButtonSize, string> = {
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
      xl: "p-5",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
        className={cn(
          "rounded-full transition-all touch-target",
          variantStyles[variant],
          iconSizeStyles[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";
