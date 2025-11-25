"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Calculator,
  Trophy,
  Settings,
} from "lucide-react";
import { playSound } from "@/lib/sound-effects";
import { useAccessibility } from "@/hooks/use-accessibility";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  activeColor: string;
  matchPaths?: string[];
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Home",
    activeColor: "text-yellow-500",
  },
  {
    href: "/levels",
    icon: BookOpen,
    label: "Learn",
    activeColor: "text-blue-500",
    matchPaths: ["/levels", "/phonics", "/words", "/sight-words", "/blending", "/stories"],
  },
  {
    href: "/math",
    icon: Calculator,
    label: "Math",
    activeColor: "text-green-500",
    matchPaths: ["/math"],
  },
  {
    href: "/achievements",
    icon: Trophy,
    label: "Awards",
    activeColor: "text-purple-500",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    activeColor: "text-gray-500",
    matchPaths: ["/settings", "/parent-dashboard"],
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { shouldReduceMotion } = useAccessibility();

  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.matchPaths) {
      return item.matchPaths.some(path => pathname.startsWith(path));
    }
    return false;
  };

  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playSound('pop')}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
              aria-current={active ? "page" : undefined}
            >
              <motion.div
                className="bottom-nav-icon-wrapper"
                whileTap={shouldReduceMotion ? {} : { scale: 0.85 }}
              >
                {/* Active indicator pill */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="bottom-nav-active-bg"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                  />
                )}

                <Icon
                  className={`bottom-nav-icon ${active ? item.activeColor : 'text-gray-400'}`}
                />
              </motion.div>

              <span className={`bottom-nav-label ${active ? item.activeColor : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
