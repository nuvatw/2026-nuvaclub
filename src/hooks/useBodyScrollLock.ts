'use client';

import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a modal/drawer is open
 * @param isLocked - Whether body scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}
