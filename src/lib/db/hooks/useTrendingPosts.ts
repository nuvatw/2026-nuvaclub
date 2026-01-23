'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import { PostRepository, type PostWithRelations } from '../repositories/PostRepository';

/**
 * Hook to get trending posts with diversity rules applied
 */
export function useTrendingPosts(limit = 5) {
  const db = useDB();

  const { posts, isLoading } = useMemo(() => {
    if (!db) {
      return { posts: [] as PostWithRelations[], isLoading: true };
    }
    const repo = new PostRepository(db);
    const trending = repo.getTrending(limit);
    return { posts: trending, isLoading: false };
  }, [db, limit]);

  return { posts, isLoading };
}
