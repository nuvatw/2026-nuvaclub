'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/atoms';
import { useHoverPreviewContext } from './HoverPreviewContext';
import { cn } from '@/lib/utils';
import type { PreviewAction, PinnedPosition } from './types';

interface HoverPreviewPanelProps<T> {
  renderMedia?: (item: T) => React.ReactNode;
  renderContent?: (item: T) => React.ReactNode;
  actions?: (item: T) => PreviewAction[];
  onPanelClick?: (item: T) => void;
  className?: string;
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function ActionButton({ action }: { action: PreviewAction }) {
  const isToggle = action.activeLabel !== undefined;
  const showActive = isToggle && action.isActive;

  if (action.variant === 'icon') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          action.onClick();
        }}
        disabled={action.disabled || action.isLoading}
        className={cn(
          'p-2 rounded-full border transition-colors',
          'pointer-events-auto relative z-30',
          showActive
            ? 'border-primary-500 bg-primary-500/20 text-primary-400'
            : 'border-neutral-600 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300'
        )}
        aria-label={showActive ? action.activeLabel : action.label}
      >
        {action.isLoading ? (
          <LoadingSpinner />
        ) : showActive ? (
          action.activeIcon ?? action.icon
        ) : (
          action.icon
        )}
      </button>
    );
  }

  return (
    <Button
      variant={action.variant === 'primary' ? 'primary' : 'secondary'}
      size="sm"
      className="flex-1 pointer-events-auto relative z-30"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        action.onClick();
      }}
      disabled={action.disabled || action.isLoading}
    >
      {action.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {action.icon && <span className="mr-1">{action.icon}</span>}
          {showActive ? action.activeLabel : action.label}
        </>
      )}
    </Button>
  );
}

export function HoverPreviewPanel<T = unknown>({
  renderMedia,
  renderContent,
  actions,
  onPanelClick,
  className,
}: HoverPreviewPanelProps<T>) {
  const {
    state,
    closePreview,
    forceClose,
    isMouseInPreview,
    config,
  } = useHoverPreviewContext<T>();

  const [mounted, setMounted] = useState(false);

  // Lock the initial position to prevent any updates during scroll
  const lockedPositionRef = useRef<PinnedPosition | null>(null);
  // Track which item the position was set for
  const lockedItemIdRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Compute locked position synchronously during render (not in effect)
  // This ensures position updates immediately when switching items
  const currentItemId = state.data?.id ?? null;

  // Reset position if item changed or panel closed
  if (!state.isOpen) {
    lockedPositionRef.current = null;
    lockedItemIdRef.current = null;
  } else if (currentItemId !== lockedItemIdRef.current) {
    // Different item - reset and use new position
    lockedPositionRef.current = state.pinnedPosition ? { ...state.pinnedPosition } : null;
    lockedItemIdRef.current = currentItemId;
  } else if (state.isOpen && state.pinnedPosition && !lockedPositionRef.current) {
    // Same item, first time locking position
    lockedPositionRef.current = { ...state.pinnedPosition };
  }

  // Use locked position (stable during scroll) or fall back to current position
  const lockedPosition = lockedPositionRef.current || state.pinnedPosition;

  const handleMouseEnter = useCallback(() => {
    isMouseInPreview.current = true;
  }, [isMouseInPreview]);

  const handleMouseLeave = useCallback(() => {
    isMouseInPreview.current = false;
    closePreview();
  }, [closePreview, isMouseInPreview]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        forceClose();
      }
    };

    if (state.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isOpen, forceClose]);

  if (!mounted) {
    return null;
  }

  const isVisible = state.isOpen && state.data && lockedPosition;
  const item = state.data?.item;
  const actionItems = item ? (actions?.(item) ?? []) : [];

  // Use item ID as key to trigger exit/enter animations when switching items
  const itemId = state.data?.id;

  return createPortal(
    <AnimatePresence mode="wait">
      {isVisible && item && lockedPosition && (
        <motion.div
          key={`hover-preview-${itemId}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.15,
            ease: [0.4, 0, 0.2, 1],
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => onPanelClick?.(item)}
          style={{
            position: 'absolute',
            top: lockedPosition.fixedTop,
            left: lockedPosition.fixedLeft,
            width: config.width,
            maxHeight: config.maxHeight,
            zIndex: 9999,
            transformOrigin: 'center center',
          }}
          className={cn(
            'rounded-lg overflow-hidden',
            'bg-neutral-900 border border-neutral-700',
            'shadow-2xl shadow-black/80',
            onPanelClick && 'cursor-pointer',
            className
          )}
        >
          {/* Media Section (thumbnail/video) */}
          {renderMedia && (
            <div className="relative aspect-video bg-neutral-800">
              {renderMedia(item)}
            </div>
          )}

          {/* Content Section */}
          <div className="p-4">
            {/* Action Buttons - Three buttons */}
            {actionItems.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {actionItems.map((action) => (
                  <ActionButton key={action.id} action={action} />
                ))}
              </div>
            )}

            {/* Custom Content */}
            {renderContent?.(item)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
