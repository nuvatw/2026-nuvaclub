'use client';

import { useRef, useLayoutEffect, useMemo, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { DuoTier } from '@/features/duo/types';
import type { TimelineMonth } from '@/features/duo/hooks/useDuoMonthPasses';
import {
  formatMonthCompact,
  formatMonthYear,
  getYearFromMonth,
  addMonths as addMonthsUtil,
  getCurrentMonth,
  isMonthPast,
} from '@/features/duo/utils/month-utils';

/**
 * Timeline color configuration
 * - Go = Green
 * - Run = Amber/Orange
 * - Fly = Red
 * - Refunded = Gray/Muted
 */
const TIMELINE_COLORS: Record<DuoTier | 'refunded' | 'upgraded' | 'none', {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  glow: string;
}> = {
  go: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/50',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.4)]',
  },
  run: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  },
  fly: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/50',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
  },
  refunded: {
    bg: 'bg-neutral-600',
    bgLight: 'bg-neutral-600/20',
    text: 'text-neutral-500',
    border: 'border-neutral-600/50',
    glow: 'shadow-none',
  },
  upgraded: {
    bg: 'bg-gradient-to-r from-green-500 via-amber-500 to-red-500',
    bgLight: 'bg-gradient-to-r from-green-500/20 via-amber-500/20 to-red-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  },
  none: {
    bg: 'bg-neutral-700',
    bgLight: 'bg-neutral-800/40',
    text: 'text-neutral-500',
    border: 'border-neutral-700/50',
    glow: 'shadow-none',
  },
};

// Month block width (60px) + gap (4px) = 64px per block
const MONTH_BLOCK_WIDTH = 60;
const MONTH_GAP = 4;
const MONTH_TOTAL_WIDTH = MONTH_BLOCK_WIDTH + MONTH_GAP;

// Infinite scroll buffer - how many months to render on each side of the viewport
const BUFFER_MONTHS = 60; // 5 years on each side
const INITIAL_PAST_MONTHS = 36; // 3 years back from now

interface DuoPurchaseTimelineProps {
  /** Timeline months data from useDuoMonthPasses (user's purchase history) */
  timelineMonths: TimelineMonth[];
  /** Custom class name */
  className?: string;
}

/**
 * Purchase Detail Popover Component
 * Shows purchase timestamp when clicking a month block
 */
function PurchaseDetailPopover({
  month,
  monthKey,
  position,
  onClose,
}: {
  month: TimelineMonth | null;
  monthKey: string;
  position: { x: number; y: number };
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const colors = month?.tier ? TIMELINE_COLORS[month.tier] : TIMELINE_COLORS.none;
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Purchase details"
      className={cn(
        'fixed z-50 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl',
        'p-3 min-w-[200px] max-w-[280px]',
        'animate-in fade-in-0 zoom-in-95 duration-150',
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-12px)',
      }}
    >
      <div className="space-y-2">
        {/* Month header */}
        <div className="text-xs text-neutral-400 font-medium">
          {formatMonthYear(monthKey)}
        </div>

        {month?.tier ? (
          <>
            {/* Tier badge */}
            <div className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', colors.bg)} />
              <span className={cn('text-sm font-semibold', colors.text)}>
                Duo {month.tier.charAt(0).toUpperCase() + month.tier.slice(1)}
              </span>
              {month?.status === 'refunded' && (
                <span className="text-xs text-neutral-500 bg-neutral-700 px-1.5 py-0.5 rounded">
                  Refunded
                </span>
              )}
              {month?.status === 'upgraded' && (
                <span className="text-xs text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                  Upgraded
                </span>
              )}
            </div>

            {/* Purchase time */}
            {month?.purchasedAt && (
              <div className="text-xs text-neutral-400">
                <span className="text-neutral-500">Purchased:</span>{' '}
                <span className="text-neutral-300">{formatDate(month.purchasedAt)}</span>
              </div>
            )}

            {/* Refund info */}
            {month?.status === 'refunded' && month?.refundedAt && (
              <div className="text-xs text-neutral-400">
                <span className="text-neutral-500">Refunded:</span>{' '}
                <span className="text-neutral-300">{formatDate(month.refundedAt)}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-neutral-500">
            Not purchased
          </div>
        )}
      </div>

      {/* Arrow indicator pointing DOWN (popover is above) */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-800 border-r border-b border-neutral-700 rotate-45" />
    </div>
  );
}

/**
 * Hover Tooltip for quick info
 */
function HoverTooltip({
  month,
  monthKey,
  position,
}: {
  month: TimelineMonth | null;
  monthKey: string;
  position: { x: number; y: number };
}) {
  const colors = month?.tier ? TIMELINE_COLORS[month.tier] : TIMELINE_COLORS.none;

  return (
    <div
      className={cn(
        'fixed z-40 bg-neutral-900/95 border border-neutral-700 rounded-md shadow-lg',
        'px-2.5 py-2 text-xs pointer-events-none',
        'animate-in fade-in-0 duration-100',
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-8px)',
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-neutral-300 font-medium">{formatMonthYear(monthKey)}</span>
        {month?.tier ? (
          <div className="flex items-center gap-1.5">
            <div className={cn('w-2 h-2 rounded-full', colors.bg)} />
            <span className={colors.text}>
              Duo {month.tier.charAt(0).toUpperCase() + month.tier.slice(1)}
            </span>
          </div>
        ) : (
          <span className="text-neutral-500">Not purchased</span>
        )}
        {/* Click hint */}
        <span className="text-neutral-600 text-[10px] mt-0.5">Click for details</span>
      </div>
    </div>
  );
}

/**
 * DuoPurchaseTimeline Component
 *
 * A horizontally scrollable timeline with TRUE infinite scrolling.
 * Features:
 * - Infinite scroll in both directions (can scroll to 2060 and beyond!)
 * - Centers on current month on initial open
 * - Year label on each month block
 * - "Back to Now" button when scrolled away
 * - Hover feedback with glow effects
 * - Click to see purchase details
 */
export function DuoPurchaseTimeline({
  timelineMonths,
  className,
}: DuoPurchaseTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // State for infinite scroll
  const [startOffset, setStartOffset] = useState(-INITIAL_PAST_MONTHS);
  const [endOffset, setEndOffset] = useState(BUFFER_MONTHS);

  // UI state
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
  const [hoveredMonthKey, setHoveredMonthKey] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolledAway, setIsScrolledAway] = useState(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0, hasMoved: false });

  // Current month key for reference
  const currentMonthKey = useMemo(() => getCurrentMonth(), []);

  // Create a map from month key to TimelineMonth data for quick lookup
  const monthDataMap = useMemo(() => {
    const map = new Map<string, TimelineMonth>();
    timelineMonths.forEach((m) => {
      map.set(m.month, m);
    });
    return map;
  }, [timelineMonths]);

  // Generate the visible months based on offsets
  const visibleMonths = useMemo(() => {
    const months: { monthKey: string; offset: number }[] = [];
    for (let offset = startOffset; offset <= endOffset; offset++) {
      const monthKey = addMonthsUtil(currentMonthKey, offset);
      months.push({ monthKey, offset });
    }
    return months;
  }, [currentMonthKey, startOffset, endOffset]);

  // Find the index of the current month in the visible array
  const currentMonthVisibleIndex = useMemo(() => {
    return visibleMonths.findIndex((m) => m.offset === 0);
  }, [visibleMonths]);

  // Get month data for a month key
  const getMonthData = useCallback((monthKey: string): TimelineMonth | null => {
    return monthDataMap.get(monthKey) || null;
  }, [monthDataMap]);

  // Center the timeline on the current month on mount
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || currentMonthVisibleIndex < 0) return;

    // Calculate scroll position to center current month
    const currentMonthPosition = currentMonthVisibleIndex * MONTH_TOTAL_WIDTH;
    const centerOffset = container.clientWidth / 2 - MONTH_BLOCK_WIDTH / 2;
    const targetScroll = currentMonthPosition - centerOffset;

    container.scrollLeft = Math.max(0, targetScroll);
  }, [currentMonthVisibleIndex]);

  // Check if scrolled away from current month
  const updateScrolledAway = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    const currentMonthPosition = currentMonthVisibleIndex * MONTH_TOTAL_WIDTH + MONTH_BLOCK_WIDTH / 2;
    const distanceFromCurrent = Math.abs(scrollCenter - currentMonthPosition);

    // Consider "scrolled away" if more than 3 months away
    setIsScrolledAway(distanceFromCurrent > MONTH_TOTAL_WIDTH * 3);
  }, [currentMonthVisibleIndex]);

  // Handle infinite scroll - extend range when near edges
  const handleInfiniteScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // If near the left edge, prepend more months
    if (scrollLeft < MONTH_TOTAL_WIDTH * 10) {
      const newStart = startOffset - BUFFER_MONTHS;
      setStartOffset(newStart);
      // Adjust scroll position to compensate
      requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft + BUFFER_MONTHS * MONTH_TOTAL_WIDTH;
      });
    }

    // If near the right edge, append more months
    if (scrollLeft + clientWidth > scrollWidth - MONTH_TOTAL_WIDTH * 10) {
      setEndOffset((prev) => prev + BUFFER_MONTHS);
    }

    updateScrolledAway();
  }, [startOffset, updateScrolledAway]);

  // Scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      handleInfiniteScroll();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleInfiniteScroll]);

  const getMonthColors = (month: TimelineMonth | null) => {
    if (!month) return TIMELINE_COLORS.none;
    if (month.status === 'refunded') return TIMELINE_COLORS.refunded;
    if (month.status === 'upgraded') return TIMELINE_COLORS.upgraded;
    if (month.tier) return TIMELINE_COLORS[month.tier];
    return TIMELINE_COLORS.none;
  };

  // Handle month block click
  const handleMonthClick = useCallback((monthKey: string, event: React.MouseEvent) => {
    // Don't open popover if we just finished dragging
    if (dragStartRef.current.hasMoved) {
      return;
    }

    // Show details for all months
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top, // Use top for above positioning
    });
    setSelectedMonthKey(monthKey);
    setHoveredMonthKey(null); // Close hover tooltip
  }, []);

  // Handle month hover
  const handleMonthHover = useCallback((monthKey: string, event: React.MouseEvent) => {
    if (isDragging || selectedMonthKey) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setHoveredMonthKey(monthKey);
  }, [isDragging, selectedMonthKey]);

  const handleMonthLeave = useCallback(() => {
    setHoveredMonthKey(null);
  }, []);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.pageX,
      scrollLeft: container.scrollLeft,
      hasMoved: false,
    };
    setHoveredMonthKey(null);
  }, []);

  // Handle drag move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const dx = e.pageX - dragStartRef.current.x;

    // Mark as moved if dragged more than 5px
    if (Math.abs(dx) > 5) {
      dragStartRef.current.hasMoved = true;
    }

    container.scrollLeft = dragStartRef.current.scrollLeft - dx;
  }, [isDragging]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Reset hasMoved after a short delay to allow click events
    setTimeout(() => {
      dragStartRef.current.hasMoved = false;
    }, 100);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoveredMonthKey(null);
  }, []);

  // Back to Now button handler
  const handleBackToNow = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || currentMonthVisibleIndex < 0) return;

    const currentMonthPosition = currentMonthVisibleIndex * MONTH_TOTAL_WIDTH;
    const centerOffset = container.clientWidth / 2 - MONTH_BLOCK_WIDTH / 2;
    const targetScroll = currentMonthPosition - centerOffset;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [currentMonthVisibleIndex]);

  // Render a single month block
  const renderMonthBlock = (monthKey: string, offset: number) => {
    const month = getMonthData(monthKey);
    const colors = getMonthColors(month);
    const isOwned = month?.status === 'active' || month?.status === 'upgraded';
    const isRefunded = month?.status === 'refunded';
    const isHovered = hoveredMonthKey === monthKey;
    const isCurrentMonth = offset === 0;
    const isPast = isMonthPast(monthKey);
    const year = getYearFromMonth(monthKey);

    return (
      <div
        key={monthKey}
        className={cn(
          'relative flex flex-col items-center',
          // Add top margin for current month to make room for NOW badge outside
          isCurrentMonth && 'mt-6',
        )}
      >
        {/* "NOW" badge - outside the card, above it */}
        {isCurrentMonth && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-primary-500/50 whitespace-nowrap z-10">
            NOW
          </span>
        )}

        {/* The card itself */}
        <div
          data-month={monthKey}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${formatMonthYear(monthKey)}`}
          onClick={(e) => handleMonthClick(monthKey, e)}
          onMouseEnter={(e) => handleMonthHover(monthKey, e)}
          onMouseLeave={handleMonthLeave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMonthClick(monthKey, e as unknown as React.MouseEvent);
            }
          }}
          className={cn(
            'flex flex-col items-center justify-center relative',
            'rounded-lg border transition-all duration-150',
            // Current month highlight
            isCurrentMonth && 'ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-900',
            isPast && !isOwned && !isRefunded && 'opacity-50',
            isRefunded && 'opacity-60',
            'cursor-pointer',
            // Hover effects
            isHovered && isOwned && colors.glow,
            isHovered && !isOwned && !isRefunded && 'border-neutral-600 bg-neutral-700/50',
            isHovered && 'scale-105 -translate-y-0.5',
            colors.border,
            isOwned || isRefunded ? colors.bgLight : 'bg-neutral-800/30',
          )}
          style={{
            width: `${MONTH_BLOCK_WIDTH}px`,
            height: '60px',
            flexShrink: 0,
          }}
        >
          {/* Tier indicator dot - ABOVE month/year, only for owned months */}
          {(isOwned || isRefunded) && month?.tier && (
            <div className={cn(
              'w-2.5 h-2.5 rounded-full mb-1',
              isRefunded ? 'bg-neutral-600' : TIMELINE_COLORS[month.tier].bg,
            )} />
          )}

          {/* Month label */}
          <span className={cn(
            'text-xs font-medium',
            isOwned ? colors.text : 'text-neutral-400',
            isRefunded && 'line-through text-neutral-500',
            isCurrentMonth && !isOwned && 'text-primary-400 font-semibold',
          )}>
            {formatMonthCompact(monthKey)}
          </span>

          {/* Year label */}
          <span className="text-[9px] text-neutral-500">
            {year}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {/* Back to Now Button - positioned at top right, above the timeline */}
      {isScrolledAway && (
        <div className="absolute -top-10 right-0 z-10">
          <button
            onClick={handleBackToNow}
            className={cn(
              'bg-primary-600 hover:bg-primary-500 text-white',
              'px-3 py-1.5 rounded-full text-sm font-medium',
              'transition-all duration-200 shadow-lg',
              'flex items-center gap-1.5',
              'animate-in fade-in-0 slide-in-from-right-4 duration-200',
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Back to Now
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          'overflow-x-auto pb-2 pt-8 hide-scrollbar',
          isDragging && 'cursor-grabbing select-none',
          !isDragging && 'cursor-grab',
        )}
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={contentRef}
          className="inline-flex items-end"
          style={{ gap: `${MONTH_GAP}px` }}
        >
          {visibleMonths.map(({ monthKey, offset }) =>
            renderMonthBlock(monthKey, offset)
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-neutral-400">Go</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-neutral-400">Run</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-neutral-400">Fly</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-neutral-600" />
          <span className="text-neutral-400">Refunded</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-neutral-800 border border-neutral-700" />
          <span className="text-neutral-400">None</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="text-center text-xs text-neutral-600 mt-2">
        Scroll or drag to explore timeline
      </div>

      {/* Hover Tooltip */}
      {hoveredMonthKey && !selectedMonthKey && (
        <HoverTooltip
          month={getMonthData(hoveredMonthKey)}
          monthKey={hoveredMonthKey}
          position={hoverPosition}
        />
      )}

      {/* Purchase Detail Popover */}
      {selectedMonthKey && (
        <PurchaseDetailPopover
          month={getMonthData(selectedMonthKey)}
          monthKey={selectedMonthKey}
          position={popoverPosition}
          onClose={() => setSelectedMonthKey(null)}
        />
      )}
    </div>
  );
}

export { TIMELINE_COLORS };
