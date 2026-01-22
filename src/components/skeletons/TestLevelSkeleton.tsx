'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
} from '@/components/atoms/Skeleton';

export function TestLevelSkeleton() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-8"
      >
        <Skeleton className="w-5 h-5 rounded" />
        <SkeletonText size="sm" width="1/12" />
      </motion.div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <SkeletonCard className="mb-6">
          {/* Level number */}
          <div className="text-center mb-6">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <SkeletonText size="3xl" width="1/3" className="mx-auto mb-2" />
            <SkeletonText size="base" width="1/2" className="mx-auto" />
          </div>

          {/* Test info box */}
          <div className="bg-neutral-800/50 rounded-lg p-4 mb-4">
            <SkeletonText size="lg" width="1/4" className="mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <SkeletonText size="xs" width="1/2" className="mb-1" />
                  <SkeletonText size="base" width="3/4" />
                </div>
              ))}
            </div>
          </div>

          {/* History record box */}
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <SkeletonText size="lg" width="1/4" className="mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="text-center">
                  <SkeletonText size="2xl" width="1/2" className="mx-auto mb-1" />
                  <SkeletonText size="xs" width="full" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-4 mb-6"
      >
        <SkeletonButton size="lg" fullWidth />
        <SkeletonButton size="lg" fullWidth />
      </motion.div>

      {/* Warning Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-amber-900/20 border border-amber-800 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <SkeletonText size="base" width="full" className="mb-1" />
            <SkeletonText size="base" width="3/4" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
