'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
} from '@/components/atoms/Skeleton';

export function DocumentSkeleton() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-8"
      >
        <Skeleton className="w-5 h-5 rounded" />
        <SkeletonText size="sm" width="1/12" />
      </motion.div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="text-center mb-12"
      >
        <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-4" />
        <SkeletonText size="3xl" width="1/3" className="mx-auto mb-4" />
        <SkeletonText size="base" width="1/2" className="mx-auto" />
      </motion.div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SkeletonCard className="mb-8">
          {/* Section 1 */}
          <SkeletonText size="2xl" width="1/4" className="mb-4" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="3/4" className="mb-6" />

          {/* Code block placeholder */}
          <Skeleton className="w-full h-32 rounded-lg mb-6" />

          {/* Section 2 */}
          <SkeletonText size="xl" width="1/3" className="mb-4" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="2/3" className="mb-6" />

          {/* List items */}
          <div className="space-y-2 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                <SkeletonText size="base" width="3/4" />
              </div>
            ))}
          </div>

          {/* Section 3 */}
          <SkeletonText size="xl" width="1/4" className="mb-4" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="full" className="mb-2" />
          <SkeletonText size="base" width="1/2" />
        </SkeletonCard>
      </motion.div>

      {/* Quick Actions Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <SkeletonCard className="text-center">
          <SkeletonText size="xl" width="1/3" className="mx-auto mb-2" />
          <SkeletonText size="base" width="1/2" className="mx-auto mb-4" />
          <SkeletonButton size="lg" className="mx-auto" />
        </SkeletonCard>
      </motion.div>
    </div>
  );
}
