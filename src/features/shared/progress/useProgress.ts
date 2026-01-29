'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import type { ModuleType } from '@/lib/types/legacy-user-state';
import type { WatchProgress } from '@/lib/types/legacy-user-state';
import { MOCK_USER_PROGRESS } from '@/lib/types/legacy-user-state/progress';
import { getEffectiveUserId } from '@/features/auth/components/AuthProvider';

const PROGRESS_STORAGE_KEY = 'nuva-user-progress';

const MODULE_ITEM_TYPES: Record<ModuleType, string[]> = {
  learn: ['course', 'lesson'],
  forum: ['post'],
  space: ['companion'],
  sprint: ['sprint-project'],
  shop: ['product'],
};

interface UserProgress {
  items: WatchProgress[];
}

/**
 * Hook for managing user progress across modules.
 * @param moduleType - Optional module type to filter progress
 * @param currentUserId - The current user/account ID (e.g., 'test-explorer-solo-1' or 'user-1')
 */
export function useProgress(moduleType?: ModuleType, currentUserId?: string | null) {
  const [progress, setProgress] = useState<UserProgress>({ items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Get the effective user ID for lookups (maps test account IDs to user IDs)
  const effectiveUserId = useMemo(
    () => getEffectiveUserId(currentUserId ?? null),
    [currentUserId]
  );

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
    (module: ModuleType, userId?: string | null) => {
      // Use provided userId, fall back to effectiveUserId from hook, then to 'user-1'
      const resolvedUserId = getEffectiveUserId(userId ?? null) ?? effectiveUserId ?? 'user-1';
      const validTypes = MODULE_ITEM_TYPES[module] || [];

      return progress.items
        .filter(
          (item) =>
            item.userId === resolvedUserId &&
            validTypes.includes(item.itemType) &&
            item.progressPercent > 0 &&
            item.progressPercent < 100
        )
        .sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime());
    },
    [progress.items, effectiveUserId]
  );

  const getCompletedItems = useCallback(
    (module: ModuleType, userId?: string | null) => {
      const resolvedUserId = getEffectiveUserId(userId ?? null) ?? effectiveUserId ?? 'user-1';
      const validTypes = MODULE_ITEM_TYPES[module] || [];

      return progress.items
        .filter(
          (item) =>
            item.userId === resolvedUserId &&
            validTypes.includes(item.itemType) &&
            item.progressPercent === 100
        )
        .sort((a, b) => {
          const aTime = a.completedAt?.getTime() || 0;
          const bTime = b.completedAt?.getTime() || 0;
          return bTime - aTime;
        });
    },
    [progress.items, effectiveUserId]
  );

  const hasProgress = useCallback(
    (module: ModuleType, userId?: string | null) => {
      const resolvedUserId = getEffectiveUserId(userId ?? null) ?? effectiveUserId ?? 'user-1';
      const validTypes = MODULE_ITEM_TYPES[module] || [];

      return progress.items.some(
        (item) =>
          item.userId === resolvedUserId && validTypes.includes(item.itemType) && item.progressPercent > 0
      );
    },
    [progress.items, effectiveUserId]
  );

  const getItemProgress = useCallback(
    (itemId: string, userId?: string | null) => {
      const resolvedUserId = getEffectiveUserId(userId ?? null) ?? effectiveUserId ?? 'user-1';
      return progress.items.find((item) => item.itemId === itemId && item.userId === resolvedUserId);
    },
    [progress.items, effectiveUserId]
  );

  const updateProgress = useCallback(
    (
      itemId: string,
      itemType: WatchProgress['itemType'],
      progressValue: number,
      totalDuration: number,
      userId?: string | null
    ) => {
      const resolvedUserId = getEffectiveUserId(userId ?? null) ?? effectiveUserId ?? 'user-1';

      setProgress((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) => item.itemId === itemId && item.userId === resolvedUserId
        );

        const newItem: WatchProgress = {
          itemId,
          itemType,
          userId: resolvedUserId,
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
    [effectiveUserId]
  );

  // Module items filtered by current user
  const moduleItems = useMemo(
    () => (moduleType && effectiveUserId ? getItemsInProgress(moduleType, effectiveUserId) : []),
    [moduleType, effectiveUserId, getItemsInProgress]
  );

  return {
    progress,
    isHydrated,
    effectiveUserId,
    getItemsInProgress,
    getCompletedItems,
    hasProgress,
    getItemProgress,
    updateProgress,
    moduleItems,
  };
}
