'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
} from '@/components/atoms/Skeleton';

export function TestExamSkeleton() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <SkeletonCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <SkeletonText size="lg" width="1/4" />
              <Skeleton className="w-px h-6 bg-neutral-700" />
              <SkeletonText size="sm" width="1/6" />
            </div>
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <SkeletonText size="lg" width="1/4" />
            </div>
          </div>
          {/* Progress bar */}
          <Skeleton className="w-full h-2 rounded-full" />
        </SkeletonCard>
      </motion.div>

      {/* Question Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SkeletonCard className="mb-8">
          {/* Question number */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-8 h-8 rounded-full" />
            <SkeletonText size="sm" width="1/6" />
          </div>

          {/* Question text */}
          <div className="mb-8">
            <SkeletonText size="xl" width="full" className="mb-2" />
            <SkeletonText size="xl" width="3/4" />
          </div>

          {/* Answer options */}
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg"
              >
                <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
                <SkeletonText size="base" width="3/4" />
              </motion.div>
            ))}
          </div>
        </SkeletonCard>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <SkeletonButton size="md" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-8 h-8 rounded" />
          ))}
        </div>
        <SkeletonButton size="md" />
      </motion.div>
    </div>
  );
}
