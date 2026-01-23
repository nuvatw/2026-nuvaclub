'use client';

import { useCallback, useState } from 'react';
import { useDB, useDBContext } from '../provider/DBProvider';
import { PostRepository } from '../repositories/PostRepository';

/**
 * Hook to handle post sharing with tracking
 */
export function useShare(postId: string, userId?: string | null) {
  const db = useDB();
  const { refresh } = useDBContext();
  const [showCopied, setShowCopied] = useState(false);

  const share = useCallback(async () => {
    const url = `${window.location.origin}/forum/${postId}`;

    try {
      // Try native share API first
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }

      // Track the share if user is logged in
      if (db && userId) {
        const repo = new PostRepository(db);
        repo.trackShare(postId, userId);
        repo.updatePostScores(postId);
        refresh();
      }

      return true;
    } catch {
      // User cancelled or share failed
      return false;
    }
  }, [db, postId, userId, refresh]);

  return {
    share,
    showCopied,
    canTrack: !!userId,
  };
}
