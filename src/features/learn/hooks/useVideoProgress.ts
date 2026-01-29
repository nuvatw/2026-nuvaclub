'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getEffectiveUserId } from '@/features/auth/components/AuthProvider';

// ==========================================
// Types
// ==========================================

export interface LessonProgress {
  lessonId: string;
  courseId?: string;
  watchedSeconds: number;
  totalDuration: number;
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: string;
  lastWatchedAt: string;
}

export interface TrailerProgress {
  courseId?: string;
  watchedSeconds: number;
  totalDuration: number;
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: string;
  lastWatchedAt: string;
}

export interface ResumePoint {
  type: 'trailer' | 'lesson';
  lessonIndex: number; // -1 for trailer, 0+ for lessons
  startSeconds: number;
  hasAnyProgress: boolean;
}

interface CourseProgressData {
  courseId: string;
  lessons: Record<string, LessonProgress>;
  trailer: TrailerProgress | null;
  lastWatched: { lessonId: string; timestamp: string } | null;
}

// ==========================================
// Constants
// ==========================================

const COMPLETION_THRESHOLD = 0.9; // 90% = completed

// ==========================================
// Hook: useVideoProgress
// ==========================================

export function useVideoProgress(userId: string | null) {
  const effectiveUserId = useMemo(() => getEffectiveUserId(userId), [userId]);
  const [progressCache, setProgressCache] = useState<Record<string, CourseProgressData>>({});
  const [isReady, setIsReady] = useState(false);

  // Fetch progress for a course
  const fetchCourseProgress = useCallback(
    async (courseId: string): Promise<CourseProgressData | null> => {
      if (!effectiveUserId) return null;

      try {
        const res = await fetch(`/api/bff/learn/progress?courseId=${courseId}`);
        if (!res.ok) return null;
        const data = await res.json();

        setProgressCache(prev => ({ ...prev, [courseId]: data }));
        return data;
      } catch (err) {
        console.error('Failed to fetch progress:', err);
        return null;
      }
    },
    [effectiveUserId]
  );

  // ==========================================
  // Lesson Progress Methods
  // ==========================================

  const getLessonProgress = useCallback(
    (courseId: string, lessonId: string): LessonProgress | null => {
      const progress = progressCache[courseId];
      return progress?.lessons[lessonId] || null;
    },
    [progressCache]
  );

  const saveLessonProgress = useCallback(
    async (
      courseId: string,
      lessonId: string,
      lessonIndex: number,
      watchedSeconds: number,
      totalDuration: number
    ) => {
      if (!effectiveUserId || totalDuration === 0) return;

      try {
        const res = await fetch('/api/bff/learn/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            lessonId,
            watchedSeconds,
            totalDuration,
            type: 'lesson',
          }),
        });

        if (res.ok) {
          const { progress } = await res.json();
          setProgressCache(prev => ({ ...prev, [courseId]: progress }));
        }
      } catch (err) {
        console.error('Failed to save lesson progress:', err);
      }
    },
    [effectiveUserId]
  );

  // ==========================================
  // Trailer Progress Methods
  // ==========================================

  const getTrailerProgress = useCallback(
    (courseId: string): TrailerProgress | null => {
      const progress = progressCache[courseId];
      return progress?.trailer || null;
    },
    [progressCache]
  );

  const saveTrailerProgress = useCallback(
    async (courseId: string, watchedSeconds: number, totalDuration: number) => {
      if (!effectiveUserId || totalDuration === 0) return;

      try {
        const res = await fetch('/api/bff/learn/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            watchedSeconds,
            totalDuration,
            type: 'trailer',
          }),
        });

        if (res.ok) {
          const { progress } = await res.json();
          setProgressCache(prev => ({ ...prev, [courseId]: progress }));
        }
      } catch (err) {
        console.error('Failed to save trailer progress:', err);
      }
    },
    [effectiveUserId]
  );

  // ==========================================
  // Resume Point Logic
  // ==========================================

  const getResumePoint = useCallback(
    (courseId: string, trailerDuration: number = 120): ResumePoint => {
      if (!effectiveUserId) {
        return {
          type: 'trailer',
          lessonIndex: -1,
          startSeconds: 0,
          hasAnyProgress: false,
        };
      }

      const progress = progressCache[courseId];
      const trailer = progress?.trailer;
      const lastWatched = progress?.lastWatched;

      // Case 1: No progress
      if (!trailer && !lastWatched) {
        return {
          type: 'trailer',
          lessonIndex: -1,
          startSeconds: 0,
          hasAnyProgress: false,
        };
      }

      // Case 2: Trailer in progress
      if (trailer && !trailer.isCompleted) {
        return {
          type: 'trailer',
          lessonIndex: -1,
          startSeconds: Math.max(0, trailer.watchedSeconds - 5),
          hasAnyProgress: true,
        };
      }

      // Case 3: Has lesson progress
      if (lastWatched) {
        const lessonProgress = progress?.lessons[lastWatched.lessonId];
        const lessonIndex = 0; // Would need lesson ordering from course data

        if (lessonProgress && !lessonProgress.isCompleted) {
          return {
            type: 'lesson',
            lessonIndex,
            startSeconds: Math.max(0, lessonProgress.watchedSeconds - 5),
            hasAnyProgress: true,
          };
        }

        return {
          type: 'lesson',
          lessonIndex,
          startSeconds: 0,
          hasAnyProgress: true,
        };
      }

      // Case 4: Trailer completed, no lessons
      return {
        type: 'lesson',
        lessonIndex: 0,
        startSeconds: 0,
        hasAnyProgress: true,
      };
    },
    [effectiveUserId, progressCache]
  );

  // ==========================================
  // Helper Methods
  // ==========================================

  const isTrailerCompleted = useCallback(
    (courseId: string): boolean => {
      const progress = getTrailerProgress(courseId);
      return progress?.isCompleted ?? false;
    },
    [getTrailerProgress]
  );

  const getCourseProgress = useCallback(
    (courseId: string, totalLessons: number): number => {
      if (!effectiveUserId || totalLessons === 0) return 0;

      const progress = progressCache[courseId];
      if (!progress) return 0;

      const completedCount = Object.values(progress.lessons).filter(
        l => l.isCompleted
      ).length;

      return Math.round((completedCount / totalLessons) * 100);
    },
    [effectiveUserId, progressCache]
  );

  const getLessonProgressByIndex = useCallback(
    (courseId: string, lessonId: string): number => {
      const progress = getLessonProgress(courseId, lessonId);
      return progress?.progressPercent ?? 0;
    },
    [getLessonProgress]
  );

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string): boolean => {
      const progress = getLessonProgress(courseId, lessonId);
      return progress?.isCompleted ?? false;
    },
    [getLessonProgress]
  );

  // Initialize ready state
  useEffect(() => {
    setIsReady(typeof window !== 'undefined');
  }, []);

  // ==========================================
  // Return API
  // ==========================================

  return {
    // Lesson progress
    getLessonProgress,
    saveLessonProgress,
    getLessonProgressByIndex,
    isLessonCompleted,

    // Trailer progress
    getTrailerProgress,
    saveTrailerProgress,
    isTrailerCompleted,

    // Resume helpers
    getResumePoint,
    getCourseProgress,

    // Fetch utility (for prefetching)
    fetchCourseProgress,

    // Status
    isReady,
  };
}

// ==========================================
// Standalone utility for non-hook contexts
// ==========================================

export function getVideoResumePoint(
  userId: string | null,
  courseId: string,
  trailerDuration: number = 120
): ResumePoint {
  // For standalone utility, return default
  // Real implementation would fetch from server
  return {
    type: 'trailer',
    lessonIndex: -1,
    startSeconds: 0,
    hasAnyProgress: false,
  };
}
