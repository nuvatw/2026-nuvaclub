'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/atoms';
import { ChevronRightIcon } from '@/components/icons';
import { getLvLabel, STATUS_LABELS, getAllCourseLevels } from '@/lib/utils/level';
import type { CourseStatus } from '@/lib/utils/level';
import type { Course } from '@/features/learn/types';
import { LEVEL_BADGE_VARIANTS } from '@/features/learn/types';

// Course card for the course list section
export function CourseListCard({ course, status }: { course: Course; status: CourseStatus }) {
  const statusColors: Record<CourseStatus, string> = {
    not_started: 'text-neutral-400',
    ongoing: 'text-amber-400',
    completed: 'text-green-400',
  };

  return (
    <Link href={`/learn/${course.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer group"
      >
        <div className="relative w-24 h-14 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            sizes="96px"
          />
          {/* Level badge on thumbnail */}
          <div className="absolute top-1 right-1">
            <Badge variant={LEVEL_BADGE_VARIANTS[course.level]} size="sm">
              {getLvLabel(course.level)}
            </Badge>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
            {course.title}
          </h4>
          <p className="text-xs text-neutral-400 truncate">{course.instructor.name}</p>
          <p className={cn('text-xs mt-1', statusColors[status])}>
            {STATUS_LABELS[status]}
          </p>
        </div>
        <ChevronRightIcon size="sm" className="text-neutral-600 group-hover:text-primary-400 transition-colors flex-shrink-0 self-center" />
      </motion.div>
    </Link>
  );
}

// Status filter tabs component
export function StatusTabs({
  value,
  onChange,
  counts
}: {
  value: 'all' | CourseStatus;
  onChange: (v: 'all' | CourseStatus) => void;
  counts: Record<'all' | CourseStatus, number>;
}) {
  const tabs: Array<'all' | CourseStatus> = ['all', 'not_started', 'ongoing', 'completed'];

  return (
    <div className="flex gap-1 p-1 bg-neutral-800/50 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-all',
            value === tab
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          )}
        >
          {STATUS_LABELS[tab]}
          <span className="ml-1.5 text-xs text-neutral-500">({counts[tab]})</span>
        </button>
      ))}
    </div>
  );
}

// Level filter checkboxes component
export function LevelFilters({
  selectedLevels,
  onChange,
}: {
  selectedLevels: Set<number>;
  onChange: (levels: Set<number>) => void;
}) {
  const allLevels = getAllCourseLevels();

  const handleToggle = (level: number) => {
    const newSet = new Set(selectedLevels);
    if (newSet.has(level)) {
      newSet.delete(level);
    } else {
      newSet.add(level);
    }
    onChange(newSet);
  };

  const handleSelectAll = () => {
    onChange(new Set(allLevels));
  };

  const handleClearAll = () => {
    onChange(new Set());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-300">Filter by Level</span>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
          >
            All
          </button>
          <span className="text-neutral-600">|</span>
          <button
            onClick={handleClearAll}
            className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {allLevels.map((level) => (
          <label
            key={level}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all text-sm',
              selectedLevels.has(level)
                ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            )}
          >
            <input
              type="checkbox"
              checked={selectedLevels.has(level)}
              onChange={() => handleToggle(level)}
              className="sr-only"
            />
            {getLvLabel(level)}
          </label>
        ))}
      </div>
    </div>
  );
}
