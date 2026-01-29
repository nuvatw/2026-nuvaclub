'use client';

import { useMemo, useCallback, useState } from 'react';
import { useDB, useDBContext } from '../provider/DBProvider';
import { PostRepository } from '@/infra/mock/repositories/PostRepository';

/**
 * Hook to manage bookmark state for a post
 */
export function useBookmark(postId: string, userId: string | null) {
  const db = useDB();
  const { refresh } = useDBContext();
  const [localBookmarked, setLocalBookmarked] = useState<boolean | null>(null);

  // Get initial bookmark state from DB
  const dbBookmarked = useMemo(() => {
    if (!db || !userId) return false;
    const repo = new PostRepository(db);
    return repo.isBookmarked(postId, userId);
  }, [db, postId, userId]);

  // Use local state if set, otherwise use DB state
  const isBookmarked = localBookmarked ?? dbBookmarked;

  // Toggle bookmark
  const toggleBookmark = useCallback(() => {
    if (!db || !userId) {
      return;
    }

    const repo = new PostRepository(db);
    const newState = repo.toggleBookmark(postId, userId);
    setLocalBookmarked(newState);

    // Update post scores after bookmark change
    repo.updatePostScores(postId);
    refresh();

    return newState;
  }, [db, postId, userId, refresh]);

  return {
    isBookmarked,
    isLoading: !db,
    toggleBookmark,
    canBookmark: !!userId,
  };
}
