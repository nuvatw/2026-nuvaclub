'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import type { Course } from '@/features/learn/types';
import { LEVEL_LABELS, LEVEL_BADGE_VARIANTS } from '@/features/learn/types';
import { cn } from '@/lib/utils';

interface HeroCarouselProps {
  courses: Course[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  courses,
  autoPlayInterval = 6000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  }, [courses.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  }, [courses.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, goToNext]);

  const currentCourse = courses[currentIndex];

  if (!currentCourse) return null;

  return (
    <div
      className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCourse.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={currentCourse.thumbnailUrl}
            alt={currentCourse.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCourse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{currentCourse.category}</Badge>
              <Badge variant={LEVEL_BADGE_VARIANTS[currentCourse.level]}>
                {LEVEL_LABELS[currentCourse.level]}
              </Badge>
              {currentCourse.level === 1 && (
                <Badge variant="success">Free</Badge>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {currentCourse.title}
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 mb-6">
              {currentCourse.subtitle}
            </p>

            <p className="text-neutral-400 mb-8 line-clamp-2">
              {currentCourse.description}
            </p>

            <div className="flex items-center gap-4">
              <Link href={`/learn/${currentCourse.id}`}>
                <Button size="lg" leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                }>
                  Start Learning
                </Button>
              </Link>
              <Link href={`/learn/${currentCourse.id}`}>
                <Button variant="secondary" size="lg" leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }>
                  Course Details
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Image
                  src={currentCourse.instructor.avatar}
                  alt={currentCourse.instructor.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{currentCourse.instructor.name}</span>
              </div>
              <span>•</span>
              <span>{currentCourse.lessonCount} Lessons</span>
              <span>•</span>
              <span>{Math.round(currentCourse.totalDuration / 60)} Minutes</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full',
          'bg-neutral-900/50 hover:bg-neutral-800/80 transition-colors',
          'text-white'
        )}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className={cn(
          'absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full',
          'bg-neutral-900/50 hover:bg-neutral-800/80 transition-colors',
          'text-white'
        )}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {courses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-neutral-500 hover:bg-neutral-400'
            )}
          />
        ))}
      </div>
    </div>
  );
}
