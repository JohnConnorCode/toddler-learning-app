"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Home, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/use-accessibility";
import Link from "next/link";

// Back Button
interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function BackButton({
  href,
  onClick,
  label = "Back",
  showLabel = false,
  className,
}: BackButtonProps) {
  const router = useRouter();
  const { shouldReduceMotion } = useAccessibility();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow touch-target",
        className
      )}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5 text-gray-600" aria-hidden="true" />
      {showLabel && <span className="font-medium text-gray-700">{label}</span>}
    </motion.button>
  );
}

// Home Button
interface HomeButtonProps {
  className?: string;
}

export function HomeButton({ className }: HomeButtonProps) {
  const { shouldReduceMotion } = useAccessibility();

  return (
    <Link href="/" aria-label="Go to home page">
      <motion.div
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        className={cn(
          "p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow touch-target",
          className
        )}
      >
        <Home className="w-5 h-5 text-gray-600" aria-hidden="true" />
      </motion.div>
    </Link>
  );
}

// Close Button
interface CloseButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function CloseButton({ onClick, href, className }: CloseButtonProps) {
  const router = useRouter();
  const { shouldReduceMotion } = useAccessibility();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
      onClick={handleClick}
      className={cn(
        "p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors touch-target",
        className
      )}
      aria-label="Close"
    >
      <X className="w-6 h-6 text-gray-600" aria-hidden="true" />
    </motion.button>
  );
}

// Page Header with navigation
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  showHome?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  showHome = false,
  rightContent,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between p-4 sm:p-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <BackButton href={backHref} />
        {showHome && <HomeButton />}
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-xl sm:text-2xl font-black text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightContent}
      </div>
    </header>
  );
}

// Breadcrumb
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-300" aria-hidden="true">
              /
            </span>
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                index === items.length - 1
                  ? "font-medium text-gray-800"
                  : "text-gray-500"
              )}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Bottom Navigation Bar
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomNavProps {
  items: NavItem[];
  activeHref?: string;
  className?: string;
}

export function BottomNav({ items, activeHref, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg safe-area-bottom",
        className
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 min-w-[72px] min-h-[56px] transition-colors touch-target",
                isActive ? "text-yellow-500" : "text-gray-400 hover:text-gray-600"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
