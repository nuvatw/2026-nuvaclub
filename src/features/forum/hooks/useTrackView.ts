'use client';

import { useEffect, useRef } from 'react';

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
 * Hook to track post view on mount via BFF (deduplicated)
 */
export function useTrackView(postId: string, userId?: string | null) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current || !postId) {
      return;
    }

    const sessionId = getSessionId();

    // Track the view
    fetch('/api/bff/forum/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'view',
        postId,
        sessionId,
      }),
    }).catch(err => console.error('Failed to track view:', err));

    hasTracked.current = true;
  }, [postId, userId]);
}
