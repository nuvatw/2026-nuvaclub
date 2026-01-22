'use client';

import { useRef, useCallback, type ReactNode } from 'react';
import { useHoverPreviewContext } from './HoverPreviewContext';

interface HoverPreviewTriggerProps<T> {
  id: string;
  item: T;
  children: ReactNode;
  className?: string;
}

export function HoverPreviewTrigger<T = unknown>({
  id,
  item,
  children,
  className,
}: HoverPreviewTriggerProps<T>) {
  const {
    state,
    openPreview,
    closePreview,
    isMouseInTrigger,
    config,
  } = useHoverPreviewContext<T>();

  const triggerRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = state.data?.id === id;

  const handleMouseEnter = useCallback(() => {
    isMouseInTrigger.current = true;

    // Clear any existing timeout
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }

    // Set timeout for delayed open
    openTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current && isMouseInTrigger.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        openPreview(id, item, {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }, config.openDelay);
  }, [id, item, openPreview, config.openDelay, isMouseInTrigger]);

  const handleMouseLeave = useCallback(() => {
    isMouseInTrigger.current = false;

    // Clear open timeout
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Schedule close (context will check if mouse moved to preview)
    closePreview();
  }, [closePreview, isMouseInTrigger]);

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-preview-active={isActive}
    >
      {children}
    </div>
  );
}
