'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
} from '@/components/atoms/Skeleton';

export function TestResultsSkeleton() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Result Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SkeletonCard className="text-center mb-8">
          {/* Score display */}
          <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6" />
          <SkeletonText size="3xl" width="1/4" className="mx-auto mb-2" />
          <SkeletonText size="xl" width="1/3" className="mx-auto mb-6" />

          {/* Performance stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="text-center">
                <SkeletonText size="2xl" width="1/2" className="mx-auto mb-1" />
                <SkeletonText size="sm" width="full" />
              </div>
            ))}
          </div>

          {/* Performance text */}
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <SkeletonText size="base" width="full" className="mb-1" />
            <SkeletonText size="base" width="3/4" className="mx-auto" />
          </div>
        </SkeletonCard>
      </motion.div>

      {/* Question Review */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SkeletonText size="xl" width="1/4" className="mb-4" />
        <div className="space-y-4 mb-8">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
            >
              <SkeletonCard>
                <div className="flex items-start gap-4">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <SkeletonText size="base" width="full" className="mb-2" />
                    <SkeletonText size="base" width="2/3" className="mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <SkeletonText size="xs" width="1/3" className="mb-1" />
                        <SkeletonText size="sm" width="full" />
                      </div>
                      <div>
                        <SkeletonText size="xs" width="1/3" className="mb-1" />
                        <SkeletonText size="sm" width="full" />
                      </div>
                    </div>
                  </div>
                </div>
              </SkeletonCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SkeletonCard className="bg-primary-900/20 border-primary-800">
          <SkeletonText size="lg" width="1/4" className="mb-4" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="2/3" />
        </SkeletonCard>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="flex justify-center gap-4 mt-8"
      >
        <SkeletonButton size="lg" />
        <SkeletonButton size="lg" />
      </motion.div>
    </div>
  );
}
