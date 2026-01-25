'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface MediaPreloadOptions {
  heroVideoId?: string;
  thumbnailUrls: string[];
  timeout?: number; // Max time to wait before showing UI anyway
  onProgress?: (loaded: number, total: number) => void;
}

interface MediaPreloadState {
  isReady: boolean;
  heroReady: boolean;
  thumbnailsReady: boolean;
  loadedCount: number;
  totalCount: number;
}

/**
 * Hook to preload hero video metadata and first-row thumbnails before revealing UI.
 * Returns isReady: true when all critical media is loaded or timeout is reached.
 */
export function useMediaPreloadGate({
  heroVideoId,
  thumbnailUrls,
  timeout = 2000,
  onProgress,
}: MediaPreloadOptions): MediaPreloadState {
  const [heroReady, setHeroReady] = useState(!heroVideoId); // Ready if no hero
  const [loadedCount, setLoadedCount] = useState(0);
  const [thumbnailsReady, setThumbnailsReady] = useState(thumbnailUrls.length === 0);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const totalCount = thumbnailUrls.length + (heroVideoId ? 1 : 0);

  // Preload hero video (just check if it's accessible via img thumbnail)
  const preloadHeroVideo = useCallback(async (videoId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // YouTube video thumbnail as proxy for video availability
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true); // Continue even on error
      img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Fallback timeout for hero specifically
      setTimeout(() => resolve(true), 800);
    });
  }, []);

  // Preload a single thumbnail
  const preloadThumbnail = useCallback((url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Skip if not a valid image URL
      if (!url || url.startsWith('data:')) {
        resolve(true);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true); // Continue even on error
      img.src = url;

      // Per-image timeout
      setTimeout(() => resolve(true), 1500);
    });
  }, []);

  // Main preload effect
  useEffect(() => {
    isMounted.current = true;

    const preloadAll = async () => {
      let loaded = 0;

      // Start hero preload
      if (heroVideoId) {
        preloadHeroVideo(heroVideoId).then(() => {
          if (isMounted.current) {
            setHeroReady(true);
            loaded++;
            onProgress?.(loaded, totalCount);
          }
        });
      }

      // Preload thumbnails concurrently with limited parallelism
      const batchSize = 3;
      for (let i = 0; i < thumbnailUrls.length; i += batchSize) {
        const batch = thumbnailUrls.slice(i, i + batchSize);
        await Promise.all(
          batch.map((url) =>
            preloadThumbnail(url).then(() => {
              if (isMounted.current) {
                setLoadedCount((prev) => {
                  const newCount = prev + 1;
                  onProgress?.(newCount + (heroReady ? 1 : 0), totalCount);
                  return newCount;
                });
              }
            })
          )
        );
      }

      if (isMounted.current) {
        setThumbnailsReady(true);
      }
    };

    preloadAll();

    // Global timeout fallback - show UI after timeout even if not all loaded
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setHeroReady(true);
        setThumbnailsReady(true);
        setIsReady(true);
      }
    }, timeout);

    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [heroVideoId, thumbnailUrls, timeout, preloadHeroVideo, preloadThumbnail, onProgress, totalCount, heroReady]);

  // Update isReady when both hero and thumbnails are ready
  useEffect(() => {
    if (heroReady && thumbnailsReady) {
      setIsReady(true);
    }
  }, [heroReady, thumbnailsReady]);

  return {
    isReady,
    heroReady,
    thumbnailsReady,
    loadedCount,
    totalCount,
  };
}
