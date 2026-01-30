'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Course } from '../types';

export type CourseCategory = {
  id: string;
  name: string;
  description?: string;
};

/**
 * Hook to access course data via BFF
 */
export function useCourses() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/bff/learn/courses')
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setAllCourses(Array.isArray(data) ? data : []);
          setIsReady(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch courses', err);
        if (mounted) setIsReady(true);
      });
    return () => { mounted = false; };
  }, []);

  const courses = allCourses;

  const featuredCourses = useMemo(() =>
    courses.filter(c => c.isFeatured),
    [courses]
  );

  const freeCourses = useMemo(() =>
    courses.filter(c => c.isFree),
    [courses]
  );

  const categories = useMemo(() => {
    // Extract unique categories from courses
    const categoryMap = new Map<string, CourseCategory>();
    courses.forEach(c => {
      if (c.category && !categoryMap.has(c.category)) {
        categoryMap.set(c.category, {
          id: c.category,
          name: c.category,
        });
      }
    });
    return Array.from(categoryMap.values());
  }, [courses]);

  const getCourseById = useCallback((id: string) => {
    return courses.find(c => c.id === id);
  }, [courses]);

  const getCoursesByCategory = useCallback((categoryId: string) => {
    return courses.filter(c => c.category === categoryId);
  }, [courses]);

  const searchCourses = useCallback((query: string) => {
    const q = query.toLowerCase();
    return courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  }, [courses]);

  return {
    courses,
    featuredCourses,
    freeCourses,
    categories,
    isReady,
    getCourseById,
    getCoursesByCategory,
    searchCourses,
  };
}

/**
 * Hook to get a single course by ID via BFF
 */
export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let mounted = true;
    fetch(`/api/bff/learn/courses?id=${courseId}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (mounted && data) setCourse(data);
      })
      .catch(err => console.error(err));
    return () => { mounted = false; };
  }, [courseId]);

  return course;
}

/**
 * Hook to get course categories via BFF
 */
export function useCourseCategories() {
  const { categories } = useCourses();
  return categories;
}
