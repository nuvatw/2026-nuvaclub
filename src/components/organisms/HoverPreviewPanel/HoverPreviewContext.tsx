'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { CardPosition, HoverPreviewState, PreviewConfig, PinnedPosition } from './types';
import { DEFAULT_CONFIG } from './types';
import { useScrollPinnedPosition } from './hooks/useScrollPinnedPosition';

/**
 * Delay when switching from one card to another (in ms).
 * Prevents flickering and ensures the preview properly re-anchors.
 */
const CARD_SWITCH_DELAY = 500;

interface HoverPreviewContextValue<T = unknown> {
  state: HoverPreviewState<T>;
  /** Register a trigger element for fresh position lookup */
  registerTrigger: (id: string, element: HTMLElement) => void;
  /** Unregister a trigger element */
  unregisterTrigger: (id: string) => void;
  /** Request to open preview - may be delayed if switching cards
   * @param instanceId - Unique trigger instance ID (from useId())
   * @param itemId - Original item ID (e.g., course.id) for consumers to match
   * @param item - The item data
   */
  requestPreview: (instanceId: string, itemId: string, item: T) => void;
  /** Cancel any pending preview request */
  cancelPendingPreview: (id: string) => void;
  closePreview: () => void;
  forceClose: () => void;
  isMouseInPreview: React.MutableRefObject<boolean>;
  isMouseInTrigger: React.MutableRefObject<boolean>;
  /** Track which trigger instance ID the mouse is currently over */
  currentHoveredId: React.MutableRefObject<string | null>;
  config: Required<PreviewConfig>;
}

const HoverPreviewContext = createContext<HoverPreviewContextValue | null>(null);

interface HoverPreviewProviderProps {
  children: ReactNode;
  config?: PreviewConfig;
}

export function HoverPreviewProvider<T = unknown>({
  children,
  config = {},
}: HoverPreviewProviderProps) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [data, setData] = useState<{ id: string; itemId: string; item: T; position: CardPosition } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isMouseInPreview = useRef(false);
  const isMouseInTrigger = useRef(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map of trigger element references for fresh position lookup
  const triggerElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Track pending preview requests for card switching
  const pendingPreviewRef = useRef<{
    id: string;
    itemId: string;
    item: T;
    timerId: NodeJS.Timeout;
  } | null>(null);

  // Track which card ID the mouse is currently hovering
  const currentHoveredId = useRef<string | null>(null);

  const { pinnedPosition, resetPosition } = useScrollPinnedPosition(
    data?.position ?? null,
    mergedConfig
  );

  /** Register a trigger element for fresh position lookup at open time */
  const registerTrigger = useCallback((id: string, element: HTMLElement) => {
    triggerElementsRef.current.set(id, element);
  }, []);

  /** Unregister a trigger element */
  const unregisterTrigger = useCallback((id: string) => {
    triggerElementsRef.current.delete(id);
  }, []);

  /** Get fresh position from a trigger element */
  const getFreshPosition = useCallback((id: string): CardPosition | null => {
    const element = triggerElementsRef.current.get(id);
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const performClose = useCallback(() => {
    setData(null);
    setIsOpen(false);
    resetPosition();
  }, [resetPosition]);

  const clearPendingPreview = useCallback(() => {
    if (pendingPreviewRef.current) {
      clearTimeout(pendingPreviewRef.current.timerId);
      pendingPreviewRef.current = null;
    }
  }, []);

  /**
   * Request to open a preview. Implements the card-switching logic:
   * - If no preview is open: open immediately after standard delay
   * - If switching cards: close current immediately, wait 500ms, then open new
   *
   * IMPORTANT: Position is NOT captured here. It's retrieved FRESH when the
   * delayed open actually fires, ensuring the preview anchors correctly.
   *
   * @param instanceId - Unique trigger instance ID (from useId()) for positioning
   * @param itemId - Original item ID (e.g., course.id) for consumers to match
   * @param item - The item data
   */
  const requestPreview = useCallback(
    (instanceId: string, itemId: string, item: T) => {
      // Clear any pending close
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      // If same trigger instance is already open, do nothing
      if (isOpen && data?.id === instanceId) {
        return;
      }

      // Clear any previous pending preview
      clearPendingPreview();

      // Determine the delay - longer when switching cards
      const delay = (isOpen && data?.id !== instanceId) ? CARD_SWITCH_DELAY : mergedConfig.openDelay;

      // If switching cards, close current preview immediately
      if (isOpen && data?.id !== instanceId) {
        performClose();
      }

      // Schedule new preview with the appropriate delay
      const timerId = setTimeout(() => {
        // Only open if mouse is still hovering this trigger instance
        if (currentHoveredId.current === instanceId) {
          // Get FRESH position from the trigger element at open time
          const freshPosition = getFreshPosition(instanceId);
          if (freshPosition) {
            setData({ id: instanceId, itemId, item, position: freshPosition });
            setIsOpen(true);
          }
        }
        pendingPreviewRef.current = null;
      }, delay);

      pendingPreviewRef.current = { id: instanceId, itemId, item, timerId };
    },
    [isOpen, data?.id, clearPendingPreview, performClose, mergedConfig.openDelay, getFreshPosition]
  );

  /**
   * Cancel any pending preview request for a specific card.
   * Called when mouse leaves a card.
   */
  const cancelPendingPreview = useCallback(
    (id: string) => {
      if (pendingPreviewRef.current?.id === id) {
        clearTimeout(pendingPreviewRef.current.timerId);
        pendingPreviewRef.current = null;
      }
    },
    []
  );

  const closePreview = useCallback(() => {
    // Only close if mouse is not in preview AND not in trigger
    if (!isMouseInPreview.current && !isMouseInTrigger.current) {
      closeTimeoutRef.current = setTimeout(() => {
        if (!isMouseInPreview.current && !isMouseInTrigger.current) {
          performClose();
        }
      }, mergedConfig.closeDelay);
    }
  }, [performClose, mergedConfig.closeDelay]);

  const forceClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    clearPendingPreview();
    isMouseInPreview.current = false;
    isMouseInTrigger.current = false;
    currentHoveredId.current = null;
    performClose();
  }, [performClose, clearPendingPreview]);

  const state: HoverPreviewState<T> = {
    data,
    pinnedPosition,
    isOpen,
  };

  return (
    <HoverPreviewContext.Provider
      value={{
        state: state as HoverPreviewState<unknown>,
        registerTrigger,
        unregisterTrigger,
        requestPreview: requestPreview as (instanceId: string, itemId: string, item: unknown) => void,
        cancelPendingPreview,
        closePreview,
        forceClose,
        isMouseInPreview,
        isMouseInTrigger,
        currentHoveredId,
        config: mergedConfig,
      }}
    >
      {children}
    </HoverPreviewContext.Provider>
  );
}

export function useHoverPreviewContext<T = unknown>() {
  const context = useContext(HoverPreviewContext);
  if (!context) {
    throw new Error('useHoverPreviewContext must be used within HoverPreviewProvider');
  }
  return context as HoverPreviewContextValue<T>;
}
