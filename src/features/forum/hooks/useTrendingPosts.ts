'use client';

import { useState, useEffect } from 'react';
import type { ForumPost } from '@/lib/legacy-db-shim';

/**
 * Hook to get trending posts via BFF
 */
export function useTrendingPosts(limit = 5) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch(`/api/bff/forum/trending?limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setPosts(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch trending posts:', err);
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [limit]);

  return { posts, isLoading };
}
