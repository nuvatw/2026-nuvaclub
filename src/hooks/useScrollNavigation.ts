'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseScrollNavigationReturn {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
}

/**
 * Hook to handle horizontal scroll navigation with arrow buttons
 * @param containerRef - Ref to the scrollable container
 * @param scrollAmount - Amount to scroll on each button click (default: container width)
 */
export function useScrollNavigation(
  containerRef: RefObject<HTMLElement | null>,
  scrollAmount?: number
): UseScrollNavigationReturn {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkScrollability();
    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [containerRef, checkScrollability]);

  const scrollLeft = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const amount = scrollAmount ?? container.clientWidth;
    container.scrollBy({ left: -amount, behavior: 'smooth' });
  }, [containerRef, scrollAmount]);

  const scrollRight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const amount = scrollAmount ?? container.clientWidth;
    container.scrollBy({ left: amount, behavior: 'smooth' });
  }, [containerRef, scrollAmount]);

  return {
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  };
}
