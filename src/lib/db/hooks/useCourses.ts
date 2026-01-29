'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import { CourseRepository, type CourseWithRelations } from '@/infra/mock/repositories';
import type { CourseCategoryRecord } from '@/infra/mock/schema';

/**
 * Hook to access course data from the database
 */
export function useCourses() {
  const db = useDB();

  const repo = useMemo(() => {
    if (!db) return null;
    return new CourseRepository(db);
  }, [db]);

  const courses = useMemo(() => {
    if (!repo) return [];
    return repo.findAllWithRelations();
  }, [repo]);

  const featuredCourses = useMemo(() => {
    if (!repo) return [];
    return repo.findFeatured();
  }, [repo]);

  const freeCourses = useMemo(() => {
    if (!repo) return [];
    return repo.findFree();
  }, [repo]);

  const categories = useMemo(() => {
    if (!repo) return [];
    return repo.getCategories();
  }, [repo]);

  return {
    courses,
    featuredCourses,
    freeCourses,
    categories,
    isReady: !!db,
    getCourseById: (id: string) => repo?.findByIdWithRelations(id),
    getCoursesByCategory: (categoryId: string) => repo?.findByCategory(categoryId) ?? [],
    searchCourses: (query: string) => repo?.search(query) ?? [],
  };
}

/**
 * Hook to get a single course by ID
 */
export function useCourse(courseId: string): CourseWithRelations | null {
  const db = useDB();

  return useMemo(() => {
    if (!db) return null;
    const repo = new CourseRepository(db);
    return repo.findByIdWithRelations(courseId) ?? null;
  }, [db, courseId]);
}

/**
 * Hook to get course categories
 */
export function useCourseCategories(): CourseCategoryRecord[] {
  const db = useDB();

  return useMemo(() => {
    if (!db) return [];
    const repo = new CourseRepository(db);
    return repo.getCategories();
  }, [db]);
}
