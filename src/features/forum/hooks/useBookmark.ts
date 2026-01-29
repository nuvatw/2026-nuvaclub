'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage bookmark state for a post via BFF
 */
export function useBookmark(postId: string, userId: string | null) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial bookmark state
  useEffect(() => {
    if (!userId || !postId) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    fetch(`/api/bff/forum/bookmark?postId=${postId}`)
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setIsBookmarked(data.isBookmarked || false);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch bookmark state:', err);
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [postId, userId]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async () => {
    if (!userId) return;

    const optimistic = !isBookmarked;
    setIsBookmarked(optimistic);

    try {
      const res = await fetch('/api/bff/forum/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
        return data.isBookmarked;
      } else {
        // Revert on error
        setIsBookmarked(!optimistic);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setIsBookmarked(!optimistic);
    }
  }, [postId, userId, isBookmarked]);

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
    canBookmark: !!userId,
  };
}
