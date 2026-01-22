'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
  /** Minimum time to show skeleton (prevents flash) */
  minLoadTime?: number;
  /** Animation duration in seconds */
  duration?: number;
}

/**
 * PageTransition component handles smooth opacity transitions
 * from skeleton loading state to actual content.
 *
 * Usage:
 * ```tsx
 * <PageTransition skeleton={<MyPageSkeleton />}>
 *   <ActualPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  skeleton,
  className,
  minLoadTime = 400,
  duration = 0.4,
}: PageTransitionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Ensure minimum display time for skeleton (allows animations to play)
    const timer = setTimeout(() => {
      setShowContent(true);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  // Smooth easing curve
  const smoothEase = [0.25, 0.1, 0.25, 1];

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: duration * 0.8, ease: smoothEase }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, ease: smoothEase }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SectionTransitionProps {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
  /** Delay before this section starts transitioning (for stagger effect) */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether the content is ready to show */
  isReady?: boolean;
}

/**
 * SectionTransition handles individual section transitions within a page.
 * Use this when you want staggered loading effects for different sections.
 */
export function SectionTransition({
  children,
  skeleton,
  className,
  delay = 0,
  duration = 0.3,
  isReady = false,
}: SectionTransitionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isReady, delay]);

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: 'easeOut' }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StaggeredListProps {
  children: ReactNode[];
  skeleton: ReactNode;
  className?: string;
  /** Number of skeleton items to show */
  skeletonCount?: number;
  /** Delay between each item transition */
  staggerDelay?: number;
  /** Base delay before starting transitions */
  baseDelay?: number;
  /** Animation duration in seconds */
  duration?: number;
}

/**
 * StaggeredList renders items with a staggered fade-in effect.
 * Shows skeleton placeholders first, then reveals real items one by one.
 */
export function StaggeredList({
  children,
  skeleton,
  className,
  skeletonCount = 4,
  staggerDelay = 50,
  baseDelay = 200,
  duration = 0.3,
}: StaggeredListProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    setIsHydrated(true);

    // Start revealing items after base delay
    const startTimer = setTimeout(() => {
      const itemCount = Array.isArray(children) ? children.length : 1;

      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, i]);
        }, i * staggerDelay);
      }
    }, baseDelay);

    return () => clearTimeout(startTimer);
  }, [children, baseDelay, staggerDelay]);

  // Show skeletons before hydration
  if (!isHydrated) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index}>{skeleton}</div>
        ))}
      </div>
    );
  }

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleItems.includes(index) ? 1 : 0 }}
          transition={{ duration, ease: 'easeOut' }}
        >
          {visibleItems.includes(index) ? child : skeleton}
        </motion.div>
      ))}
    </div>
  );
}
