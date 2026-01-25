'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { CardPosition, PinnedPosition, PreviewConfig } from '../types';
import { DEFAULT_CONFIG } from '../types';

export function useScrollPinnedPosition(
  cardPosition: CardPosition | null,
  config: PreviewConfig = {}
) {
  // Memoize config to prevent unnecessary callback recreation
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config.width, config.maxHeight, config.openDelay, config.closeDelay, config.padding]
  );

  // Store position in both ref (for stability) and state (for reactivity)
  const [pinnedPosition, setPinnedPosition] = useState<PinnedPosition | null>(null);
  const pinnedPositionRef = useRef<PinnedPosition | null>(null);

  // Track the card position that was used to calculate the current pinned position
  // This allows us to detect when the card has changed (different position = different card)
  const lastCardPositionRef = useRef<CardPosition | null>(null);

  const calculatePosition = useCallback(
    (position: CardPosition): PinnedPosition => {
      const { width, padding } = mergedConfig;
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;

      // Convert viewport-relative to document-relative coordinates
      const documentTop = position.top + scrollY;
      const documentLeft = position.left + scrollX;

      // Center horizontally on the card (using document coordinates)
      const originalCenterX = documentLeft + position.width / 2;
      let finalLeft = originalCenterX - width / 2;

      // Keep within viewport bounds (but in document coordinates)
      finalLeft = Math.max(padding + scrollX, Math.min(finalLeft, viewportWidth + scrollX - width - padding));

      // Position vertically - scale factor for expansion effect
      const SCALE_FACTOR = 1.3;
      let finalTop = documentTop - (position.height * (SCALE_FACTOR - 1)) / 2;
      finalTop = Math.max(padding, finalTop);

      // Estimate content height and adjust if needed (check against current viewport)
      const estimatedHeight = (width * 9) / 16 + 200;
      const viewportBottom = scrollY + viewportHeight;
      if (finalTop + estimatedHeight > viewportBottom - padding) {
        finalTop = viewportBottom - estimatedHeight - padding;
      }

      return { fixedTop: finalTop, fixedLeft: finalLeft };
    },
    [mergedConfig]
  );

  // Calculate position when cardPosition changes
  // The position is pinned (not updated during scroll) until the card changes or closes
  useEffect(() => {
    if (cardPosition) {
      // Check if this is a different card position (different card being hovered)
      const isDifferentCard =
        !lastCardPositionRef.current ||
        lastCardPositionRef.current.top !== cardPosition.top ||
        lastCardPositionRef.current.left !== cardPosition.left ||
        lastCardPositionRef.current.width !== cardPosition.width ||
        lastCardPositionRef.current.height !== cardPosition.height;

      if (isDifferentCard) {
        // Calculate fresh position for the new card
        const position = calculatePosition(cardPosition);
        pinnedPositionRef.current = position;
        setPinnedPosition(position);
        lastCardPositionRef.current = cardPosition;
      }
    } else {
      // Card position is null (preview closed) - reset everything
      if (pinnedPositionRef.current !== null) {
        pinnedPositionRef.current = null;
        setPinnedPosition(null);
        lastCardPositionRef.current = null;
      }
    }
  }, [cardPosition, calculatePosition]);

  // Reset when preview closes (called by context)
  const resetPosition = useCallback(() => {
    setPinnedPosition(null);
    pinnedPositionRef.current = null;
    lastCardPositionRef.current = null;
  }, []);

  return { pinnedPosition, resetPosition };
}
