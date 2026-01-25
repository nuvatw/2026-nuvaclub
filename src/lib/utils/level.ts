/**
 * Level formatting utilities
 * Single source of truth for level labels across the app
 *
 * IMPORTANT: Course levels (1-10) are DISTINCT from Nunu ranks (1-5)
 * - Course levels = difficulty/progression of AI courses
 * - Nunu ranks = mentor experience/contributions (see test/constants.ts)
 */

import type { CourseLevel } from '@/features/learn/types';

/**
 * Returns a short course level label like "Lv 1", "Lv 2", etc.
 * Used for consistent display across Learn and Test pages.
 * NOTE: This is for COURSE difficulty, not Nunu mentor ranks.
 */
export function getLvLabel(level: number): string {
  return `Lv ${level}`;
}

/**
 * Alias for getLvLabel for explicit naming
 * Use this when you want to be explicit about course level vs Nunu rank
 */
export const formatCourseLv = getLvLabel;

/**
 * Course status types for filtering
 */
export type CourseStatus = 'not_started' | 'ongoing' | 'completed';

/**
 * Computes the status of a course based on progress data
 */
export function getCourseStatus(
  progressPercent: number | undefined | null
): CourseStatus {
  if (progressPercent === undefined || progressPercent === null || progressPercent <= 0) {
    return 'not_started';
  }
  if (progressPercent >= 100) {
    return 'completed';
  }
  return 'ongoing';
}

/**
 * Display labels for course status
 */
export const STATUS_LABELS: Record<CourseStatus | 'all', string> = {
  all: 'All',
  not_started: 'Not started',
  ongoing: 'Ongoing',
  completed: 'Completed',
};

/**
 * Get all available course levels (1-10)
 */
export function getAllCourseLevels(): CourseLevel[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
