'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonBadge,
  SkeletonCard,
  SkeletonImage,
  SkeletonCircle,
} from '@/components/atoms/Skeleton';

function LessonItemSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-4 p-4 border-b border-neutral-800 last:border-b-0"
    >
      {/* Lesson number */}
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      {/* Lesson info */}
      <div className="flex-1">
        <SkeletonText size="base" width="2/3" className="mb-1" />
        <SkeletonText size="xs" width="1/4" />
      </div>
      {/* Lock icon placeholder */}
      <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
    </motion.div>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Skeleton */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-[400px] bg-neutral-900 overflow-hidden"
      >
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 to-transparent z-10" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-7xl mx-auto">
          <SkeletonBadge width="md" className="mb-4" />
          <SkeletonText size="3xl" width="1/2" className="mb-3" />
          <div className="flex items-center gap-3">
            <SkeletonCircle size="sm" />
            <SkeletonText size="sm" width="1/6" />
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <SkeletonCard>
                <SkeletonText size="xl" width="1/4" className="mb-4" />
                <SkeletonText size="base" width="full" className="mb-2" />
                <SkeletonText size="base" width="full" className="mb-2" />
                <SkeletonText size="base" width="full" className="mb-2" />
                <SkeletonText size="base" width="3/4" />
              </SkeletonCard>
            </motion.div>

            {/* Lessons Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SkeletonCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-neutral-800">
                  <SkeletonText size="xl" width="1/4" />
                </div>
                {[...Array(6)].map((_, index) => (
                  <LessonItemSkeleton key={index} delay={0.2 + index * 0.05} />
                ))}
              </SkeletonCard>
            </motion.div>
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <SkeletonCard className="sticky top-24">
              {/* Course thumbnail */}
              <SkeletonImage aspect="16/9" className="mb-4" />

              {/* Price */}
              <SkeletonText size="2xl" width="1/3" className="mb-4" />

              {/* CTA Button */}
              <SkeletonButton fullWidth size="lg" className="mb-6" />

              {/* Metadata */}
              <div className="space-y-3 mb-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <SkeletonText size="sm" width="1/3" />
                    <SkeletonText size="sm" width="1/4" />
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, index) => (
                  <SkeletonBadge key={index} width="md" />
                ))}
              </div>
            </SkeletonCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
