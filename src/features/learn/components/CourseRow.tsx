'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CourseCard } from './CourseCard';
import type { Course } from '@/features/learn/types';
import { ChevronRightIcon, ChevronLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

/**
 * Netflix-style carousel configuration:
 * - Desktop (xl+): 6.2 cards visible (6 full + small peek)
 * - Large (lg): 4.5 cards visible
 * - Medium (md): 3.5 cards visible
 * - Small (sm): 2.5 cards visible
 * - Mobile: 1.5 cards visible
 *
 * The "peek" effect (non-integer) creates visual affordance for scrolling.
 */

interface CourseRowProps {
  title: string;
  courses: Course[];
  href?: string;
}

export function CourseRow({ title, courses, href }: CourseRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [checkScrollability]);

  // Scroll by 5 cards at a time on desktop (matches Netflix behavior)
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Calculate scroll amount based on card width + gap
    // On desktop, scroll 6 cards (the integer part of 6.2)
    const containerWidth = container.clientWidth;
    const scrollAmount = containerWidth * (6 / 6.2); // Scroll by 6 cards worth

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (courses.length === 0) return null;

  return (
    <div className="relative group py-3">
      {/* Header - uses app gutter for consistent left alignment with header brand */}
      <div
        className="flex items-center justify-between mb-3"
        style={{ paddingLeft: 'var(--app-gutter)', paddingRight: 'var(--app-gutter)' }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRightIcon size="sm" />
          </Link>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className={cn(
            'absolute left-0 top-0 bottom-0 z-10 w-12',
            'bg-gradient-to-r from-neutral-950 to-transparent',
            'flex items-center justify-start pl-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            'focus:opacity-100 focus:outline-none',
            !canScrollLeft && 'hidden'
          )}
        >
          <div className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition-colors">
            <ChevronLeftIcon size="md" className="text-white" />
          </div>
        </button>

        {/* Course List - Netflix-style with right-bleed effect
            Left padding uses app gutter for baseline alignment with header brand.
            NO right padding - rows "bleed" to viewport edge to imply scroll continuation. */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className={cn(
            'flex overflow-x-auto hide-scrollbar scroll-smooth',
            'pr-0', // No right padding - bleed to edge
            'pb-2',
            'snap-x snap-mandatory',
            // CSS custom property for gap - used in card width calculation
            '[--row-gap:12px] sm:[--row-gap:14px] lg:[--row-gap:16px]',
            'gap-[var(--row-gap)]'
          )}
          style={{
            paddingLeft: 'var(--app-gutter)',
            scrollPaddingLeft: 'var(--app-gutter)', // Snap position aligns with baseline
          }}
        >
          {courses.map((course, index) => (
            <div
              key={course.id}
              className={cn(
                'snap-start flex-shrink-0',
                // Card width calculation for 6.2 cards visible on desktop:
                // width = (100% - (gaps * gap-size)) / cards-per-view
                // For 6.2 cards, we have 6 full gaps visible
                // Mobile (1.5 cards): 1 gap
                'w-[calc((100%-var(--row-gap)*1)/1.5)]',
                // Small (2.5 cards): 2 gaps
                'sm:w-[calc((100%-var(--row-gap)*2)/2.5)]',
                // Medium (3.5 cards): 3 gaps
                'md:w-[calc((100%-var(--row-gap)*3)/3.5)]',
                // Large (4.5 cards): 4 gaps
                'lg:w-[calc((100%-var(--row-gap)*4)/4.5)]',
                // Desktop (6.2 cards): 6 gaps
                'xl:w-[calc((100%-var(--row-gap)*6)/6.2)]'
              )}
            >
              <CourseCard course={course} index={index} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className={cn(
            'absolute right-0 top-0 bottom-0 z-10 w-12',
            'bg-gradient-to-l from-neutral-950 to-transparent',
            'flex items-center justify-end pr-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            'focus:opacity-100 focus:outline-none',
            !canScrollRight && 'hidden'
          )}
        >
          <div className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition-colors">
            <ChevronRightIcon size="md" className="text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
