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

interface HoverPreviewContextValue<T = unknown> {
  state: HoverPreviewState<T>;
  openPreview: (id: string, item: T, position: CardPosition) => void;
  closePreview: () => void;
  forceClose: () => void;
  isMouseInPreview: React.MutableRefObject<boolean>;
  isMouseInTrigger: React.MutableRefObject<boolean>;
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

  const [data, setData] = useState<{ id: string; item: T; position: CardPosition } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isMouseInPreview = useRef(false);
  const isMouseInTrigger = useRef(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { pinnedPosition, resetPosition } = useScrollPinnedPosition(
    data?.position ?? null,
    mergedConfig
  );

  const openPreview = useCallback(
    (id: string, item: T, position: CardPosition) => {
      // Clear any pending close
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      setData({ id, item, position });
      setIsOpen(true);
    },
    []
  );

  const performClose = useCallback(() => {
    setData(null);
    setIsOpen(false);
    resetPosition();
  }, [resetPosition]);

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
    isMouseInPreview.current = false;
    isMouseInTrigger.current = false;
    performClose();
  }, [performClose]);

  const state: HoverPreviewState<T> = {
    data,
    pinnedPosition,
    isOpen,
  };

  return (
    <HoverPreviewContext.Provider
      value={{
        state: state as HoverPreviewState<unknown>,
        openPreview: openPreview as (id: string, item: unknown, position: CardPosition) => void,
        closePreview,
        forceClose,
        isMouseInPreview,
        isMouseInTrigger,
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
