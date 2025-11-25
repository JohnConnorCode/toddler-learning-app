"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Calculator, Lock, ChevronRight } from "lucide-react";
import { getEnabledSubjects, getAllSubjects, type SubjectConfig } from "@/lib/framework";
import { useAccessibility } from "@/hooks/use-accessibility";

interface SubjectSelectorProps {
  showComingSoon?: boolean;
  compact?: boolean;
}

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  reading: <BookOpen className="w-8 h-8" />,
  math: <Calculator className="w-8 h-8" />,
};

export function SubjectSelector({ showComingSoon = true, compact = false }: SubjectSelectorProps) {
  const { shouldReduceMotion } = useAccessibility();
  const subjects = showComingSoon ? getAllSubjects() : getEnabledSubjects();

  return (
    <div className={`grid ${compact ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 gap-4'}`}>
      {subjects.map((subject, index) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          index={index}
          compact={compact}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </div>
  );
}

interface SubjectCardProps {
  subject: SubjectConfig;
  index: number;
  compact: boolean;
  shouldReduceMotion: boolean;
}

function SubjectCard({ subject, index, compact, shouldReduceMotion }: SubjectCardProps) {
  const isEnabled = subject.enabled;
  const Icon = SUBJECT_ICONS[subject.id] || <BookOpen className="w-8 h-8" />;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={shouldReduceMotion || !isEnabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={shouldReduceMotion || !isEnabled ? {} : { scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl ${compact ? 'p-4' : 'p-6'}
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        transition-all duration-200
      `}
      style={{
        backgroundColor: isEnabled ? subject.theme.background : '#F3F4F6',
        borderLeft: `4px solid ${isEnabled ? subject.theme.primary : '#9CA3AF'}`,
      }}
    >
      {/* Coming Soon Badge */}
      {!isEnabled && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">
          <Lock className="w-3 h-3" />
          Soon
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`
            ${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-xl flex items-center justify-center
            ${isEnabled ? 'text-white' : 'text-gray-400 bg-gray-200'}
          `}
          style={{
            backgroundColor: isEnabled ? subject.theme.primary : undefined,
          }}
        >
          {Icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              ${compact ? 'text-lg' : 'text-xl'} font-bold
              ${isEnabled ? 'text-gray-800' : 'text-gray-400'}
            `}
          >
            {subject.name}
          </h3>
          {!compact && (
            <p className={`text-sm ${isEnabled ? 'text-gray-600' : 'text-gray-400'} line-clamp-2`}>
              {subject.description}
            </p>
          )}
        </div>

        {/* Arrow */}
        {isEnabled && (
          <ChevronRight
            className="w-5 h-5 text-gray-400"
            style={{ color: subject.theme.primary }}
          />
        )}
      </div>

      {/* Progress Bar (if enabled) */}
      {isEnabled && !compact && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>Get started!</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: '0%',
                backgroundColor: subject.theme.primary,
              }}
            />
          </div>
        </div>
      )}

      {/* Categories Preview */}
      {isEnabled && !compact && subject.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {subject.categories.slice(0, 4).map((cat) => (
            <span
              key={cat.id}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${subject.theme.primary}20`,
                color: subject.theme.primary,
              }}
            >
              {cat.name}
            </span>
          ))}
          {subject.categories.length > 4 && (
            <span className="text-xs text-gray-400">
              +{subject.categories.length - 4} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  if (isEnabled) {
    return (
      <Link href={subject.routePrefix || `/${subject.id}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

/**
 * Compact subject pills for navigation
 */
export function SubjectPills() {
  const subjects = getEnabledSubjects();
  const { shouldReduceMotion } = useAccessibility();

  return (
    <div className="flex gap-2 flex-wrap">
      {subjects.map((subject) => (
        <Link key={subject.id} href={subject.routePrefix || `/${subject.id}`}>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-sm transition-shadow hover:shadow-md"
            style={{ backgroundColor: subject.theme.primary }}
          >
            {SUBJECT_ICONS[subject.id]}
            <span>{subject.name}</span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
