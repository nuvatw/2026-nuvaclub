'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import type { ModuleType } from '@/data/types';
import type { WatchProgress } from '@/data/types/user';
import { MOCK_USER_PROGRESS, getInProgressItems, hasAnyProgress } from '@/data/user-data/progress';

const PROGRESS_STORAGE_KEY = 'nuva-user-progress';

interface UserProgress {
  items: WatchProgress[];
}

export function useProgress(moduleType?: ModuleType) {
  const [progress, setProgress] = useState<UserProgress>({ items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const items = parsed.items.map((item: WatchProgress) => ({
          ...item,
          lastWatchedAt: new Date(item.lastWatchedAt),
          completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
        }));
        setProgress({ items });
      } else {
        // Use mock data as default for demo
        setProgress({ items: MOCK_USER_PROGRESS });
      }
    } catch {
      setProgress({ items: MOCK_USER_PROGRESS });
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated && progress.items.length > 0) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isHydrated]);

  const getItemsInProgress = useCallback(
    (module: ModuleType, userId = 'user-1') => {
      // Filter by module type (course items for learn, etc.)
      const moduleItemTypes: Record<ModuleType, string[]> = {
        learn: ['course', 'lesson'],
        forum: ['post'],
        space: ['companion'],
        sprint: ['sprint-project'],
        shop: ['product'],
      };

      const validTypes = moduleItemTypes[module] || [];

      return progress.items
        .filter(
          (item) =>
            item.userId === userId &&
            validTypes.includes(item.itemType) &&
            item.progressPercent > 0 &&
            item.progressPercent < 100
        )
        .sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime());
    },
    [progress.items]
  );

  const hasProgress = useCallback(
    (module: ModuleType, userId = 'user-1') => {
      const moduleItemTypes: Record<ModuleType, string[]> = {
        learn: ['course', 'lesson'],
        forum: ['post'],
        space: ['companion'],
        sprint: ['sprint-project'],
        shop: ['product'],
      };

      const validTypes = moduleItemTypes[module] || [];

      return progress.items.some(
        (item) =>
          item.userId === userId && validTypes.includes(item.itemType) && item.progressPercent > 0
      );
    },
    [progress.items]
  );

  const getItemProgress = useCallback(
    (itemId: string, userId = 'user-1') => {
      return progress.items.find((item) => item.itemId === itemId && item.userId === userId);
    },
    [progress.items]
  );

  const updateProgress = useCallback(
    (
      itemId: string,
      itemType: WatchProgress['itemType'],
      progressValue: number,
      totalDuration: number,
      userId = 'user-1'
    ) => {
      setProgress((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) => item.itemId === itemId && item.userId === userId
        );

        const newItem: WatchProgress = {
          itemId,
          itemType,
          userId,
          progressPercent: Math.min(100, Math.max(0, progressValue)),
          currentPosition: Math.round((progressValue / 100) * totalDuration),
          totalDuration,
          lastWatchedAt: new Date(),
          completedAt: progressValue >= 100 ? new Date() : undefined,
        };

        if (existingIndex >= 0) {
          const newItems = [...prev.items];
          newItems[existingIndex] = newItem;
          return { items: newItems };
        }

        return { items: [...prev.items, newItem] };
      });
    },
    []
  );

  const moduleItems = useMemo(
    () => (moduleType ? getItemsInProgress(moduleType) : []),
    [moduleType, getItemsInProgress]
  );

  return {
    progress,
    isHydrated,
    getItemsInProgress,
    hasProgress,
    getItemProgress,
    updateProgress,
    moduleItems,
  };
}
