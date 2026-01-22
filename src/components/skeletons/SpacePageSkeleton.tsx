'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonBadge,
  SkeletonCard,
  SkeletonCompanionCard,
} from '@/components/atoms/Skeleton';

export function SpacePageSkeleton() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-12"
      >
        <SkeletonText size="3xl" width="1/6" className="mx-auto mb-4" />
        <SkeletonText size="base" width="1/3" className="mx-auto mb-4" />
        <SkeletonBadge width="lg" className="mx-auto" />
      </motion.div>

      {/* Companion Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + Math.floor(index / 3) * 0.1 }}
          >
            <SkeletonCompanionCard />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Locked state skeleton for users without Duo Ticket
 */
export function SpaceLockedSkeleton() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Lock Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
        <SkeletonText size="2xl" width="1/3" className="mx-auto mb-2" />
        <SkeletonText size="base" width="1/2" className="mx-auto" />
      </motion.div>

      {/* Plan Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} className="text-center">
            <SkeletonText size="xl" width="1/2" className="mx-auto mb-2" />
            <SkeletonText size="sm" width="3/4" className="mx-auto mb-4" />
            <SkeletonText size="2xl" width="1/3" className="mx-auto mb-4" />
            <div className="space-y-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonText key={i} size="sm" width="full" />
              ))}
            </div>
          </SkeletonCard>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-center"
      >
        <SkeletonButton size="lg" className="mx-auto" />
      </motion.div>
    </div>
  );
}
