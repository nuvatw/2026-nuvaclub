'use client';

import { useMemo } from 'react';
import { useSectionVisibility } from '@/features/shared/sections/useSectionVisibility';
import { useProgress } from '@/features/shared/progress/useProgress';
import { useAuth } from '@/features/auth/components/AuthProvider';
import {
  MOCK_COURSES,
  getNunuCourses,
  getFreeCoursesBySeries,
  getSeriesCourses,
  getVerifiedRequiredCourses,
  REQUIRED_SERIES_ORDER,
} from '@/features/learn/data/courses';
import type { Course } from '@/features/learn/types';

/**
 * Section order constants for Learn page.
 * Priority order:
 * 1. Continue Learning OR Most Popular (first row - always one of these)
 * 2. Free Courses (guest/explorer only)
 * 3-8. Required Series rows
 * 9. Nunu Courses
 */
const SECTION_ORDER = {
  FIRST_ROW: 1,         // Continue Learning or Most Popular
  FREE_COURSES: 2,
  SERIES_START: 10,
  NUNU_VERIFIED: 90,    // Nunu Verified Series (before general Nunu Training)
  NUNU_COURSES: 100,
} as const;

export interface LearnSection {
  id: string;
  title: string;
  courses: Course[];
  href?: string;
  order: number;
}

/**
 * Get most popular courses that user hasn't watched yet
 */
function getMostPopularUnwatched(watchedCourseIds: Set<string>): Course[] {
  return MOCK_COURSES
    .filter((c) => c.courseType === 'vava' && !watchedCourseIds.has(c.id))
    .sort((a, b) => {
      // Featured courses first (simulating popularity)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      // Then by creation date (newer = trending)
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, 10);
}

/**
 * Hook for building Learn page sections.
 *
 * First row logic:
 * - If user has progress → "Continue Learning"
 * - If no progress → "Most Popular" (courses they haven't watched)
 *
 * Following rows:
 * - Free Courses (guest/explorer only)
 * - 6 Required Series rows (ChatGPT, Make, n8n, Midjourney, Stable Diffusion, Gemini)
 * - Nunu Training
 */
export function useLearnSections() {
  const { currentAccountId } = useAuth();
  const { shouldShowContinueWatching, shouldShowFreeContent, isHydrated } =
    useSectionVisibility('learn', currentAccountId);
  const { getItemsInProgress, effectiveUserId, progress } = useProgress('learn', currentAccountId);

  const sections = useMemo<LearnSection[]>(() => {
    const allSections: LearnSection[] = [];

    // Get user's watched course IDs
    const watchedCourseIds = new Set<string>();
    if (effectiveUserId) {
      progress.items
        .filter((item) => item.userId === effectiveUserId && item.progressPercent > 0)
        .forEach((item) => watchedCourseIds.add(item.itemId));
    }

    // ===== FIRST ROW: Continue Learning OR Most Popular =====
    let hasFirstRow = false;

    // Try Continue Learning first
    if (shouldShowContinueWatching && effectiveUserId) {
      const progressItems = getItemsInProgress('learn', currentAccountId);
      const continueWatchingCourses = progressItems
        .map((item) => MOCK_COURSES.find((c) => c.id === item.itemId))
        .filter((c): c is Course => c !== undefined)
        .slice(0, 10);

      if (continueWatchingCourses.length > 0) {
        allSections.push({
          id: 'continue-learning',
          title: 'Continue Learning',
          courses: continueWatchingCourses,
          href: '/learn/my-courses',
          order: SECTION_ORDER.FIRST_ROW,
        });
        hasFirstRow = true;
      }
    }

    // If no Continue Learning, show Most Popular
    if (!hasFirstRow) {
      const popularCourses = getMostPopularUnwatched(watchedCourseIds);
      if (popularCourses.length > 0) {
        allSections.push({
          id: 'most-popular',
          title: 'Most Popular',
          courses: popularCourses,
          order: SECTION_ORDER.FIRST_ROW,
        });
      }
    }

    // ===== Free Courses (Guest + Explorer only) =====
    // No "View All" link - section is horizontally scrollable
    if (shouldShowFreeContent) {
      const freeCourses = getFreeCoursesBySeries();
      if (freeCourses.length > 0) {
        allSections.push({
          id: 'free-courses',
          title: 'Free Courses',
          courses: freeCourses,
          order: SECTION_ORDER.FREE_COURSES,
        });
      }
    }

    // ===== REQUIRED SERIES ROWS =====
    REQUIRED_SERIES_ORDER.forEach((seriesName, index) => {
      const seriesCourses = getSeriesCourses(seriesName);
      if (seriesCourses.length > 0) {
        allSections.push({
          id: `series-${seriesName.toLowerCase().replace(/\s+/g, '-')}`,
          title: seriesName,
          courses: seriesCourses,
          order: SECTION_ORDER.SERIES_START + index,
        });
      }
    });

    // ===== Nunu Verified Series =====
    // Required courses for Verified Nunu certification
    const verifiedCourses = getVerifiedRequiredCourses();
    if (verifiedCourses.length > 0) {
      allSections.push({
        id: 'nunu-verified-series',
        title: 'Nunu Verified Series',
        courses: verifiedCourses,
        href: '/test?track=nunu',
        order: SECTION_ORDER.NUNU_VERIFIED,
      });
    }

    // ===== Nunu Training =====
    const nunuCourses = getNunuCourses();
    if (nunuCourses.length > 0) {
      allSections.push({
        id: 'nunu-courses',
        title: 'Nunu Training',
        courses: nunuCourses,
        order: SECTION_ORDER.NUNU_COURSES,
      });
    }

    return allSections.sort((a, b) => a.order - b.order);
  }, [shouldShowContinueWatching, shouldShowFreeContent, getItemsInProgress, effectiveUserId, currentAccountId, progress.items]);

  return {
    sections,
    isHydrated,
  };
}
