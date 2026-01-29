'use client';

import { useCallback, useState } from 'react';

/**
 * Hook to handle post sharing with tracking via BFF
 */
export function useShare(postId: string, userId?: string | null) {
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

      // Track the share
      if (userId) {
        fetch('/api/bff/forum/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'share',
            postId,
          }),
        }).catch(err => console.error('Failed to track share:', err));
      }

      return true;
    } catch {
      // User cancelled or share failed
      return false;
    }
  }, [postId, userId]);

  return {
    share,
    showCopied,
    canTrack: !!userId,
  };
}
