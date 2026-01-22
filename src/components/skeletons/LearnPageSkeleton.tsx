'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

// Smooth easing curve for premium feel
const smoothEase = [0.25, 0.1, 0.25, 1];

// Skeleton primitives with shimmer
function ShimmerBlock({ className }: { className?: string }) {
  return <div className={cn('animate-shimmer rounded', className)} />;
}

function ShimmerText({
  width = 'full',
  size = 'base',
  className,
}: {
  width?: 'full' | '3/4' | '2/3' | '1/2' | '1/3' | '1/4';
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}) {
  const widthClasses = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '2/3': 'w-2/3',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
  };
  const sizeClasses = {
    sm: 'h-4',
    base: 'h-5',
    lg: 'h-6',
    xl: 'h-7',
    '2xl': 'h-8',
    '3xl': 'h-10',
  };

  return (
    <ShimmerBlock
      className={cn(widthClasses[width], sizeClasses[size], className)}
    />
  );
}

function ShimmerButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36',
  };
  return <ShimmerBlock className={cn('rounded-lg', sizeClasses[size])} />;
}

function ShimmerBadge() {
  return <ShimmerBlock className="h-6 w-20 rounded-full" />;
}

function CourseCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: smoothEase,
      }}
      className="w-72 flex-shrink-0 bg-neutral-900 rounded-xl border border-neutral-800/50 p-4 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
        <ShimmerBlock className="w-full h-full rounded-lg" />
      </div>

      {/* Title */}
      <ShimmerText size="lg" width="3/4" className="mb-2" />

      {/* Instructor */}
      <ShimmerText size="sm" width="1/2" className="mb-3" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <ShimmerBadge />
        <ShimmerText size="sm" width="1/4" />
      </div>
    </motion.div>
  );
}

function CourseRowSkeleton({ delay = 0, rowIndex }: { delay?: number; rowIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: smoothEase,
      }}
      className="mb-8"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.4,
          delay: delay + 0.1,
          ease: smoothEase,
        }}
        className="flex items-center justify-between mb-4 px-4"
      >
        <ShimmerText size="xl" width="1/4" />
        <ShimmerButton size="sm" />
      </motion.div>

      {/* Course cards row */}
      <div className="flex gap-4 overflow-hidden px-4">
        {[...Array(5)].map((_, index) => (
          <CourseCardSkeleton key={index} index={index + rowIndex * 5} />
        ))}
      </div>
    </motion.div>
  );
}

function HeroSkeleton() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: smoothEase }}
      className="relative w-full aspect-[21/9] max-h-[500px] bg-neutral-900 overflow-hidden"
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-neutral-800/30 to-transparent"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 to-transparent z-10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: smoothEase }}
        >
          <ShimmerBadge />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: smoothEase }}
          className="mt-4"
        >
          <ShimmerText size="3xl" width="1/2" className="mb-3" />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: smoothEase }}
        >
          <ShimmerText size="base" width="1/3" className="mb-6" />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: smoothEase }}
          className="flex gap-4"
        >
          <ShimmerButton size="lg" />
          <ShimmerButton size="lg" />
        </motion.div>
      </div>
    </motion.section>
  );
}

export function LearnPageSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* VideoHero Skeleton */}
      <HeroSkeleton />

      {/* Course Rows Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="relative -mt-20 z-10 py-8"
      >
        <CourseRowSkeleton delay={0.4} rowIndex={0} />
        <CourseRowSkeleton delay={0.55} rowIndex={1} />
        <CourseRowSkeleton delay={0.7} rowIndex={2} />
        <CourseRowSkeleton delay={0.85} rowIndex={3} />
      </motion.div>
    </div>
  );
}
