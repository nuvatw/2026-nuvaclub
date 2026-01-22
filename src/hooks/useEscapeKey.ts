'use client';

import { useEffect, useCallback } from 'react';

/**
 * Hook to handle escape key press events
 * @param onEscape - Callback function to execute when escape key is pressed
 * @param enabled - Whether the hook is active (default: true)
 */
export function useEscapeKey(onEscape: () => void, enabled = true): void {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    },
    [onEscape]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape, enabled]);
}
