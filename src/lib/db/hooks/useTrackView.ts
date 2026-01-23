'use client';

import { useEffect, useRef } from 'react';
import { useDB } from '../provider/DBProvider';
import { PostRepository } from '../repositories/PostRepository';

/**
 * Generate a session ID for anonymous view tracking
 */
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const key = 'nuvaclub_session_id';
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

/**
 * Hook to track post view on mount (deduplicated)
 */
export function useTrackView(postId: string, userId?: string | null) {
  const db = useDB();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!db || hasTracked.current) {
      return;
    }

    // Track the view
    const repo = new PostRepository(db);
    const sessionId = getSessionId();
    const tracked = repo.trackView(postId, userId ?? undefined, sessionId);

    if (tracked) {
      // Update post scores after view
      repo.updatePostScores(postId);
    }

    hasTracked.current = true;
  }, [db, postId, userId]);
}
