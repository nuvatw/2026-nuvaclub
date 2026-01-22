'use client';

import { useMemo } from 'react';
import { useSectionVisibility } from '@/features/shared/sections/useSectionVisibility';
import { useProgress } from '@/features/shared/progress/useProgress';
import {
  MOCK_COURSES,
  COURSE_CATEGORIES,
  getCoursesByCategory,
  getFeaturedCourses,
} from '@/features/learn/data/courses';
import type { Course } from '@/features/learn/types';
import { SECTION_ORDER } from '@/features/shared/sections/types';

interface LearnSection {
  id: string;
  title: string;
  courses: Course[];
  href?: string;
  order: number;
}

export function useLearnSections() {
  const { shouldShowContinueWatching, shouldShowFreeContent, isHydrated } =
    useSectionVisibility('learn');
  const { getItemsInProgress } = useProgress('learn');

  const sections = useMemo<LearnSection[]>(() => {
    const result: LearnSection[] = [];

    // Row 1: Continue Watching (conditional)
    if (shouldShowContinueWatching) {
      const progressItems = getItemsInProgress('learn');
      const continueWatchingCourses = progressItems
        .map((item) => MOCK_COURSES.find((c) => c.id === item.itemId))
        .filter((c): c is Course => c !== undefined)
        .slice(0, 10);

      if (continueWatchingCourses.length > 0) {
        result.push({
          id: 'continue-watching',
          title: 'Continue Learning',
          courses: continueWatchingCourses,
          href: '/learn/my-courses',
          order: SECTION_ORDER.CONTINUE_WATCHING,
        });
      }
    }

    // Row 2: Free Courses (role-gated for guest/explorer) - Level 1 courses are free
    if (shouldShowFreeContent) {
      const freeCourses = MOCK_COURSES.filter((c) => c.level === 1);
      if (freeCourses.length > 0) {
        result.push({
          id: 'free-courses',
          title: 'Free Courses',
          courses: freeCourses,
          href: '/learn/category/free',
          order: SECTION_ORDER.FREE_CONTENT,
        });
      }
    }

    // Row 3: Recommendations ("We Think You'll Like")
    const recommendations = getFeaturedCourses();
    if (recommendations.length > 0) {
      result.push({
        id: 'recommendations',
        title: 'Featured Recommendations',
        courses: recommendations,
        order: SECTION_ORDER.RECOMMENDATIONS,
      });
    }

    // Row 4+: Category Sections
    COURSE_CATEGORIES.forEach((category, index) => {
      // Skip the "Free Courses" category as it's handled separately
      if (category.slug === 'free') return;

      const courses = getCoursesByCategory(category.name);
      if (courses.length > 0) {
        result.push({
          id: `category-${category.id}`,
          title: category.name,
          courses,
          href: `/learn/category/${category.slug}`,
          order: SECTION_ORDER.CATEGORIES_START + index,
        });
      }
    });

    // Sort by order
    return result.sort((a, b) => a.order - b.order);
  }, [shouldShowContinueWatching, shouldShowFreeContent, getItemsInProgress]);

  return {
    sections,
    isHydrated,
  };
}
