'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getEffectiveUserId } from '@/features/auth/components/AuthProvider';

// ==========================================
// Types
// ==========================================

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  watchedSeconds: number;
  totalDuration: number;
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: string;
  lastWatchedAt: string;
}

export interface TrailerProgress {
  courseId: string;
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

interface VideoProgressStore {
  lessonProgress: Record<string, LessonProgress>; // key: `${userId}-${courseId}-${lessonId}`
  trailerProgress: Record<string, TrailerProgress>; // key: `${userId}-${courseId}`
  lastWatchedLesson: Record<string, { lessonIndex: number; courseId: string }>; // key: `${userId}-${courseId}`
}

// ==========================================
// Storage Keys & Constants
// ==========================================

const STORAGE_KEY = 'nuvaclub_video_progress';
const COMPLETION_THRESHOLD = 0.9; // 90% = completed

// ==========================================
// Storage Utilities
// ==========================================

function getStore(): VideoProgressStore {
  if (typeof window === 'undefined') {
    return { lessonProgress: {}, trailerProgress: {}, lastWatchedLesson: {} };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }

  return { lessonProgress: {}, trailerProgress: {}, lastWatchedLesson: {} };
}

function saveStore(store: VideoProgressStore): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

// ==========================================
// Hook: useVideoProgress
// ==========================================

export function useVideoProgress(userId: string | null) {
  // Map test account IDs to user IDs for consistency
  const effectiveUserId = useMemo(() => getEffectiveUserId(userId), [userId]);

  const [store, setStore] = useState<VideoProgressStore>(() => getStore());

  // Sync with localStorage on mount
  useEffect(() => {
    setStore(getStore());
  }, []);

  // ==========================================
  // Lesson Progress Methods
  // ==========================================

  const getLessonProgress = useCallback(
    (courseId: string, lessonId: string): LessonProgress | null => {
      if (!effectiveUserId) return null;
      const key = `${effectiveUserId}-${courseId}-${lessonId}`;
      return store.lessonProgress[key] || null;
    },
    [effectiveUserId, store.lessonProgress]
  );

  const saveLessonProgress = useCallback(
    (
      courseId: string,
      lessonId: string,
      lessonIndex: number,
      watchedSeconds: number,
      totalDuration: number
    ) => {
      if (!effectiveUserId || totalDuration === 0) return;

      const key = `${effectiveUserId}-${courseId}-${lessonId}`;
      const progressPercent = Math.min(100, (watchedSeconds / totalDuration) * 100);
      const isCompleted = progressPercent >= COMPLETION_THRESHOLD * 100;
      const now = new Date().toISOString();

      const existing = store.lessonProgress[key];
      const completedAt = isCompleted && !existing?.isCompleted ? now : existing?.completedAt;

      const updatedProgress: LessonProgress = {
        lessonId,
        courseId,
        watchedSeconds,
        totalDuration,
        progressPercent,
        isCompleted,
        completedAt,
        lastWatchedAt: now,
      };

      const newStore: VideoProgressStore = {
        ...store,
        lessonProgress: {
          ...store.lessonProgress,
          [key]: updatedProgress,
        },
        lastWatchedLesson: {
          ...store.lastWatchedLesson,
          [`${effectiveUserId}-${courseId}`]: { lessonIndex, courseId },
        },
      };

      setStore(newStore);
      saveStore(newStore);
    },
    [effectiveUserId, store]
  );

  // ==========================================
  // Trailer Progress Methods
  // ==========================================

  const getTrailerProgress = useCallback(
    (courseId: string): TrailerProgress | null => {
      if (!effectiveUserId) return null;
      const key = `${effectiveUserId}-${courseId}`;
      return store.trailerProgress[key] || null;
    },
    [effectiveUserId, store.trailerProgress]
  );

  const saveTrailerProgress = useCallback(
    (courseId: string, watchedSeconds: number, totalDuration: number) => {
      if (!effectiveUserId || totalDuration === 0) return;

      const key = `${effectiveUserId}-${courseId}`;
      const progressPercent = Math.min(100, (watchedSeconds / totalDuration) * 100);
      const isCompleted = progressPercent >= COMPLETION_THRESHOLD * 100;
      const now = new Date().toISOString();

      const existing = store.trailerProgress[key];
      const completedAt = isCompleted && !existing?.isCompleted ? now : existing?.completedAt;

      const updatedProgress: TrailerProgress = {
        courseId,
        watchedSeconds,
        totalDuration,
        progressPercent,
        isCompleted,
        completedAt,
        lastWatchedAt: now,
      };

      const newStore: VideoProgressStore = {
        ...store,
        trailerProgress: {
          ...store.trailerProgress,
          [key]: updatedProgress,
        },
      };

      setStore(newStore);
      saveStore(newStore);
    },
    [effectiveUserId, store]
  );

  // ==========================================
  // Resume Point Logic
  // ==========================================

  const getResumePoint = useCallback(
    (courseId: string, trailerDuration: number = 120): ResumePoint => {
      if (!effectiveUserId) {
        // No user - start from trailer
        return {
          type: 'trailer',
          lessonIndex: -1,
          startSeconds: 0,
          hasAnyProgress: false,
        };
      }

      const trailerProgress = getTrailerProgress(courseId);
      const lastWatchedKey = `${effectiveUserId}-${courseId}`;
      const lastWatched = store.lastWatchedLesson[lastWatchedKey];

      // Case 1: Never watched anything -> Start with trailer
      if (!trailerProgress && !lastWatched) {
        return {
          type: 'trailer',
          lessonIndex: -1,
          startSeconds: 0,
          hasAnyProgress: false,
        };
      }

      // Case 2: Trailer in progress (not completed) -> Resume trailer
      if (trailerProgress && !trailerProgress.isCompleted) {
        return {
          type: 'trailer',
          lessonIndex: -1,
          startSeconds: Math.max(0, trailerProgress.watchedSeconds - 5), // Back up 5 seconds
          hasAnyProgress: true,
        };
      }

      // Case 3: Trailer completed, has lesson progress -> Resume lesson
      if (lastWatched) {
        const lessonIndex = lastWatched.lessonIndex;
        // Find the progress for the last watched lesson
        const lessonKeys = Object.keys(store.lessonProgress).filter(
          (k) => k.startsWith(`${effectiveUserId}-${courseId}-`)
        );

        let lastProgress: LessonProgress | null = null;
        let lastWatchedTime = 0;

        for (const key of lessonKeys) {
          const progress = store.lessonProgress[key];
          const watchedTime = new Date(progress.lastWatchedAt).getTime();
          if (watchedTime > lastWatchedTime) {
            lastWatchedTime = watchedTime;
            lastProgress = progress;
          }
        }

        if (lastProgress && !lastProgress.isCompleted) {
          return {
            type: 'lesson',
            lessonIndex: lessonIndex,
            startSeconds: Math.max(0, lastProgress.watchedSeconds - 5),
            hasAnyProgress: true,
          };
        }

        // Last lesson was completed, start next lesson
        return {
          type: 'lesson',
          lessonIndex: lessonIndex,
          startSeconds: 0,
          hasAnyProgress: true,
        };
      }

      // Case 4: Trailer completed, no lesson progress -> Start lesson 1
      return {
        type: 'lesson',
        lessonIndex: 0,
        startSeconds: 0,
        hasAnyProgress: true,
      };
    },
    [effectiveUserId, getTrailerProgress, store.lastWatchedLesson, store.lessonProgress]
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

      const lessonKeys = Object.keys(store.lessonProgress).filter(
        (k) => k.startsWith(`${effectiveUserId}-${courseId}-`)
      );

      let completedCount = 0;
      for (const key of lessonKeys) {
        if (store.lessonProgress[key]?.isCompleted) {
          completedCount++;
        }
      }

      return Math.round((completedCount / totalLessons) * 100);
    },
    [effectiveUserId, store.lessonProgress]
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

    // Status
    isReady: typeof window !== 'undefined',
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
  // Map test account IDs to user IDs
  const effectiveUserId = getEffectiveUserId(userId);

  if (!effectiveUserId) {
    return {
      type: 'trailer',
      lessonIndex: -1,
      startSeconds: 0,
      hasAnyProgress: false,
    };
  }

  const store = getStore();
  const trailerKey = `${effectiveUserId}-${courseId}`;
  const trailerProgress = store.trailerProgress[trailerKey];
  const lastWatchedKey = `${effectiveUserId}-${courseId}`;
  const lastWatched = store.lastWatchedLesson[lastWatchedKey];

  // Case 1: Never watched anything
  if (!trailerProgress && !lastWatched) {
    return {
      type: 'trailer',
      lessonIndex: -1,
      startSeconds: 0,
      hasAnyProgress: false,
    };
  }

  // Case 2: Trailer in progress
  if (trailerProgress && !trailerProgress.isCompleted) {
    return {
      type: 'trailer',
      lessonIndex: -1,
      startSeconds: Math.max(0, trailerProgress.watchedSeconds - 5),
      hasAnyProgress: true,
    };
  }

  // Case 3: Has lesson progress
  if (lastWatched) {
    const lessonKeys = Object.keys(store.lessonProgress).filter(
      (k) => k.startsWith(`${effectiveUserId}-${courseId}-`)
    );

    let lastProgress: LessonProgress | null = null;
    let lastWatchedTime = 0;

    for (const key of lessonKeys) {
      const progress = store.lessonProgress[key];
      const watchedTime = new Date(progress.lastWatchedAt).getTime();
      if (watchedTime > lastWatchedTime) {
        lastWatchedTime = watchedTime;
        lastProgress = progress;
      }
    }

    if (lastProgress && !lastProgress.isCompleted) {
      return {
        type: 'lesson',
        lessonIndex: lastWatched.lessonIndex,
        startSeconds: Math.max(0, lastProgress.watchedSeconds - 5),
        hasAnyProgress: true,
      };
    }

    return {
      type: 'lesson',
      lessonIndex: lastWatched.lessonIndex,
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
}
