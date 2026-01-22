'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTestLevelCard,
} from '@/components/atoms/Skeleton';

export function TestPageSkeleton() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <SkeletonText size="3xl" width="1/4" className="mx-auto mb-4" />
        <SkeletonText size="base" width="1/2" className="mx-auto" />
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SkeletonCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SkeletonText size="sm" width="1/4" className="mb-2" />
              <SkeletonText size="2xl" width="1/3" />
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <SkeletonText size="2xl" width="1/2" className="mx-auto mb-1" />
                <SkeletonText size="xs" width="full" />
              </div>
              <div className="text-center">
                <SkeletonText size="2xl" width="1/2" className="mx-auto mb-1" />
                <SkeletonText size="xs" width="full" />
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <Skeleton className="w-full h-3 rounded-full" />
        </SkeletonCard>
      </motion.div>

      {/* Level Categories Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          'bg-green-900/30 border-green-800',
          'bg-blue-900/30 border-blue-800',
          'bg-purple-900/30 border-purple-800',
          'bg-amber-900/30 border-amber-800',
        ].map((colorClass, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 + index * 0.03 }}
            className={`rounded-xl border p-4 ${colorClass}`}
          >
            <SkeletonText size="lg" width="1/2" className="mb-2" />
            <SkeletonText size="sm" width="full" className="mb-1" />
            <SkeletonText size="sm" width="3/4" />
          </motion.div>
        ))}
      </motion.div>

      {/* Level Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.04 }}
          >
            <SkeletonTestLevelCard />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
