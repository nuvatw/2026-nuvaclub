'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { CourseCard } from './CourseCard';
import type { Course } from '@/features/learn/types';
import { ChevronRightIcon, ChevronLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface CourseRowProps {
  title: string;
  courses: Course[];
  href?: string;
}

export function CourseRow({ title, courses, href }: CourseRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (courses.length === 0) return null;

  return (
    <div className="relative group py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">{title}</h2>
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
          className={cn(
            'absolute left-0 top-0 bottom-0 z-10 w-12',
            'bg-gradient-to-r from-neutral-950 to-transparent',
            'flex items-center justify-start pl-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            !canScrollLeft && 'hidden'
          )}
        >
          <div className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition-colors">
            <ChevronLeftIcon size="md" className="text-white" />
          </div>
        </button>

        {/* Course List */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className={cn(
            'flex gap-3 overflow-x-auto hide-scrollbar',
            'px-4 sm:px-6 lg:px-8',
            'pb-4' // Padding for visual spacing
          )}
        >
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-0 bottom-0 z-10 w-12',
            'bg-gradient-to-l from-neutral-950 to-transparent',
            'flex items-center justify-end pr-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
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
