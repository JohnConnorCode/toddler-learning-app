"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/use-accessibility";

type CardVariant = "default" | "elevated" | "outlined" | "gradient";
type CardColor = "white" | "yellow" | "green" | "pink" | "blue" | "purple" | "orange";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: CardVariant;
  color?: CardColor;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white shadow-lg",
  elevated: "bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]",
  outlined: "bg-white border-2 border-gray-200",
  gradient: "bg-gradient-to-br",
};

const colorStyles: Record<CardColor, string> = {
  white: "",
  yellow: "from-yellow-50 to-yellow-100/50",
  green: "from-green-50 to-green-100/50",
  pink: "from-pink-50 to-pink-100/50",
  blue: "from-blue-50 to-blue-100/50",
  purple: "from-purple-50 to-purple-100/50",
  orange: "from-orange-50 to-orange-100/50",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      color = "white",
      interactive = false,
      padding = "md",
      className,
      ...props
    },
    ref
  ) => {
    const { shouldReduceMotion } = useAccessibility();

    const interactiveProps = interactive
      ? {
          whileHover: shouldReduceMotion ? {} : { scale: 1.02, y: -4 },
          whileTap: shouldReduceMotion ? {} : { scale: 0.98 },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl sm:rounded-3xl",
          variantStyles[variant],
          variant === "gradient" && colorStyles[color],
          paddingStyles[padding],
          interactive && "cursor-pointer transition-shadow hover:shadow-xl",
          className
        )}
        {...interactiveProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)} {...props}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-gray-100 rounded-xl" aria-hidden="true">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Activity Card
interface ActivityCardProps extends Omit<CardProps, "children"> {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: CardColor;
  href?: string;
  badge?: string;
  progress?: number;
}

export function ActivityCard({
  title,
  description,
  icon,
  color,
  href,
  badge,
  progress,
  className,
  ...props
}: ActivityCardProps) {
  const { shouldReduceMotion } = useAccessibility();

  const colorIconBg: Record<CardColor, string> = {
    white: "bg-gray-100",
    yellow: "bg-yellow-100",
    green: "bg-green-100",
    pink: "bg-pink-100",
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
  };

  const colorBorder: Record<CardColor, string> = {
    white: "border-gray-100",
    yellow: "border-yellow-200",
    green: "border-green-200",
    pink: "border-pink-200",
    blue: "border-blue-200",
    purple: "border-purple-200",
    orange: "border-orange-200",
  };

  const content = (
    <Card
      variant="elevated"
      interactive
      padding="lg"
      className={cn(
        "relative overflow-hidden border-b-4 sm:border-b-6",
        colorBorder[color],
        className
      )}
      {...props}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none",
          colorStyles[color]
        )}
        aria-hidden="true"
      />

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
          {badge}
        </div>
      )}

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          className={cn(
            "p-4 sm:p-5 rounded-full mb-4 transition-transform",
            colorIconBg[color]
          )}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-1">{title}</h3>
        <p className="text-sm sm:text-base text-gray-500">{description}</p>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "h-full rounded-full",
                  color === "yellow" && "bg-yellow-400",
                  color === "green" && "bg-green-400",
                  color === "pink" && "bg-pink-400",
                  color === "blue" && "bg-blue-400",
                  color === "purple" && "bg-purple-400",
                  color === "orange" && "bg-orange-400",
                  color === "white" && "bg-gray-400"
                )}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}
