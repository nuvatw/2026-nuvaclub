'use client';

import { useEffect, useRef, useCallback, type RefObject } from 'react';

/**
 * Hook to trap focus within a container (for modals, dialogs)
 *
 * Accessibility requirements:
 * - Tab cycles through focusable elements within container
 * - Shift+Tab cycles backward
 * - Focus moves to first focusable element on open
 * - Focus returns to trigger element on close
 *
 * @param containerRef - Ref to the container element
 * @param isActive - Whether the focus trap is active
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  isActive: boolean
): void {
  // Store the element that was focused before the trap was activated
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const elements = containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
    return Array.from(elements).filter(
      (el) => el.offsetParent !== null // Only visible elements
    );
  }, [containerRef]);

  // Handle Tab key to trap focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: move backward
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: move forward
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements]
  );

  // Activate focus trap
  useEffect(() => {
    if (!isActive) return;

    // Store current focus to restore later
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Small delay to ensure modal content is rendered
    const timeoutId = setTimeout(() => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 10);

    // Add event listener for Tab key
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isActive, getFocusableElements, handleKeyDown]);
}
