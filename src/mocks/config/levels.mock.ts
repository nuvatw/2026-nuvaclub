import type { CourseLevel } from '@/features/learn/types';

/**
 * Course Levels Configuration
 *
 * Labels, colors, and badge variants for course difficulty levels.
 */

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  1: 'Lv.1 Beginner',
  2: 'Lv.2 Basic',
  3: 'Lv.3 Elementary',
  4: 'Lv.4 Intermediate',
  5: 'Lv.5 Upper-Int',
  6: 'Lv.6 Advanced',
  7: 'Lv.7 Proficient',
  8: 'Lv.8 Expert',
  9: 'Lv.9 Master',
  10: 'Lv.10 Grandmaster',
};

export const LEVEL_COLORS: Record<CourseLevel, string> = {
  1: 'bg-green-500',
  2: 'bg-green-600',
  3: 'bg-blue-500',
  4: 'bg-blue-600',
  5: 'bg-purple-500',
  6: 'bg-purple-600',
  7: 'bg-orange-500',
  8: 'bg-orange-600',
  9: 'bg-red-500',
  10: 'bg-red-600',
};

export const LEVEL_BADGE_VARIANTS: Record<CourseLevel, 'success' | 'primary' | 'warning' | 'error' | 'default'> = {
  1: 'success',
  2: 'success',
  3: 'primary',
  4: 'primary',
  5: 'default',
  6: 'default',
  7: 'warning',
  8: 'warning',
  9: 'error',
  10: 'error',
};

export type CourseAccessLevel = 'first-chapter' | 'free' | 'paid';

export const ACCESS_LABELS: Record<CourseAccessLevel, string> = {
  'first-chapter': 'First Chapter Free',
  free: 'Free',
  paid: 'Premium',
};

export const ACCESS_BADGE_VARIANTS: Record<CourseAccessLevel, 'default' | 'success' | 'warning'> = {
  'first-chapter': 'default',
  free: 'success',
  paid: 'warning',
};

// Helper functions
export const getLevelLabel = (level: CourseLevel): string => LEVEL_LABELS[level];

export const getLevelColor = (level: CourseLevel): string => LEVEL_COLORS[level];

export const getLevelBadgeVariant = (level: CourseLevel) => LEVEL_BADGE_VARIANTS[level];

export const isBeginnerLevel = (level: CourseLevel): boolean => level <= 2;

export const isIntermediateLevel = (level: CourseLevel): boolean => level >= 3 && level <= 6;

export const isAdvancedLevel = (level: CourseLevel): boolean => level >= 7;

export const isFreeLevel = (level: CourseLevel): boolean => level === 1;
