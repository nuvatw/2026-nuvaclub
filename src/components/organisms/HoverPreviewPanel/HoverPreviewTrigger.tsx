'use client';

import { useRef, useCallback, useEffect, useId, type ReactNode } from 'react';
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
    registerTrigger,
    unregisterTrigger,
    requestPreview,
    cancelPendingPreview,
    closePreview,
    isMouseInTrigger,
    currentHoveredId,
  } = useHoverPreviewContext<T>();

  const triggerRef = useRef<HTMLDivElement>(null);

  // Generate a unique instance ID for this trigger
  // This ensures each trigger instance has its own registration,
  // even if the same item (course) appears in multiple sections
  const instanceId = useId();

  // Use instanceId for active state check since that's what's stored in state.data.id
  const isActive = state.data?.id === instanceId;

  // Register this trigger element with unique instanceId so context can get fresh position at open time
  useEffect(() => {
    if (triggerRef.current) {
      registerTrigger(instanceId, triggerRef.current);
    }
    return () => {
      unregisterTrigger(instanceId);
    };
  }, [instanceId, registerTrigger, unregisterTrigger]);

  const handleMouseEnter = useCallback(() => {
    isMouseInTrigger.current = true;
    currentHoveredId.current = instanceId;

    // Request preview with unique instanceId for positioning and original id for item matching
    // Position will be retrieved fresh when the delay fires
    requestPreview(instanceId, id, item);
  }, [instanceId, id, item, requestPreview, isMouseInTrigger, currentHoveredId]);

  const handleMouseLeave = useCallback(() => {
    isMouseInTrigger.current = false;

    // Clear hover tracking if this was the hovered card
    if (currentHoveredId.current === instanceId) {
      currentHoveredId.current = null;
    }

    // Cancel any pending preview for this specific instance
    cancelPendingPreview(instanceId);

    // Schedule close (context will check if mouse moved to preview)
    closePreview();
  }, [instanceId, cancelPendingPreview, closePreview, isMouseInTrigger, currentHoveredId]);

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
