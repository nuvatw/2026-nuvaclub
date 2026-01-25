'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface RowMedia {
  thumbnailUrls: string[];
}

interface UseProgressiveRowLoaderOptions {
  rows: RowMedia[];
  startFromRow?: number; // Skip first N rows (already loaded)
  maxConcurrent?: number;
  delayBetweenRows?: number; // ms to wait between rows
  enabled?: boolean;
}

interface UseProgressiveRowLoaderResult {
  loadedRows: Set<number>;
  isLoading: boolean;
  currentRow: number;
  progress: number; // 0-100
}

/**
 * Schedules work during idle time if available, otherwise uses setTimeout.
 */
function scheduleIdleWork(callback: () => void, fallbackDelay: number = 100): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as typeof window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(callback, { timeout: 200 });
  } else {
    setTimeout(callback, fallbackDelay);
  }
}

/**
 * Preloads an image and returns a promise.
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (!url || url.startsWith('data:')) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Continue on error
    img.src = url;

    // Timeout fallback per image
    setTimeout(() => resolve(), 2000);
  });
}

/**
 * Hook for progressively preloading row media in the background.
 * Uses requestIdleCallback to avoid blocking the main thread.
 */
export function useProgressiveRowLoader({
  rows,
  startFromRow = 1,
  maxConcurrent = 2,
  delayBetweenRows = 50,
  enabled = true,
}: UseProgressiveRowLoaderOptions): UseProgressiveRowLoaderResult {
  const [loadedRows, setLoadedRows] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentRow, setCurrentRow] = useState(startFromRow);
  const isMounted = useRef(true);
  const isProcessing = useRef(false);

  const loadRow = useCallback(async (rowIndex: number, thumbnails: string[]): Promise<void> => {
    // Load thumbnails in batches
    for (let i = 0; i < thumbnails.length; i += maxConcurrent) {
      if (!isMounted.current) return;

      const batch = thumbnails.slice(i, i + maxConcurrent);
      await Promise.all(batch.map(preloadImage));
    }
  }, [maxConcurrent]);

  const processNextRow = useCallback(async () => {
    if (!isMounted.current || isProcessing.current) return;
    if (currentRow >= rows.length) {
      setIsLoading(false);
      return;
    }

    isProcessing.current = true;
    setIsLoading(true);

    const row = rows[currentRow];
    if (row) {
      await loadRow(currentRow, row.thumbnailUrls);

      if (isMounted.current) {
        setLoadedRows((prev) => new Set([...prev, currentRow]));
        setCurrentRow((prev) => prev + 1);
      }
    }

    isProcessing.current = false;

    // Schedule next row load during idle time
    if (isMounted.current && currentRow + 1 < rows.length) {
      setTimeout(() => {
        scheduleIdleWork(() => {
          if (isMounted.current) {
            processNextRow();
          }
        }, delayBetweenRows);
      }, delayBetweenRows);
    } else if (isMounted.current) {
      setIsLoading(false);
    }
  }, [currentRow, rows, loadRow, delayBetweenRows]);

  // Start progressive loading after initial content is shown
  useEffect(() => {
    isMounted.current = true;

    if (enabled && rows.length > startFromRow) {
      // Small delay before starting background loading
      const startTimer = setTimeout(() => {
        scheduleIdleWork(() => {
          if (isMounted.current) {
            processNextRow();
          }
        }, 100);
      }, 300);

      return () => {
        clearTimeout(startTimer);
        isMounted.current = false;
      };
    }

    return () => {
      isMounted.current = false;
    };
  }, [enabled, rows.length, startFromRow, processNextRow]);

  // Calculate progress
  const totalRowsToLoad = rows.length - startFromRow;
  const progress = totalRowsToLoad > 0
    ? Math.round((loadedRows.size / totalRowsToLoad) * 100)
    : 100;

  return {
    loadedRows,
    isLoading,
    currentRow,
    progress,
  };
}
