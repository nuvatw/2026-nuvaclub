'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonBadge,
  SkeletonCard,
  SkeletonSprintCard,
} from '@/components/atoms/Skeleton';

export function SprintPageSkeleton() {
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
        <SkeletonText size="base" width="1/3" className="mx-auto" />
      </motion.div>

      {/* Current Season Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-12"
      >
        {/* Season header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SkeletonText size="2xl" width="1/4" />
            <SkeletonBadge width="sm" />
          </div>
          <SkeletonText size="sm" width="1/6" />
        </div>

        {/* Sprint cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
            >
              <SkeletonSprintCard />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Past Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <SkeletonText size="2xl" width="1/8" />
          <div className="flex gap-4">
            <SkeletonButton size="sm" />
            <SkeletonButton size="sm" />
          </div>
        </div>

        {/* Archived projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 + index * 0.03 }}
            >
              <SkeletonCard>
                <Skeleton className="w-full aspect-video rounded-lg mb-3" />
                <SkeletonText size="base" width="3/4" className="mb-2" />
                <div className="flex items-center gap-2">
                  <SkeletonBadge width="sm" />
                  <SkeletonText size="xs" width="1/3" />
                </div>
              </SkeletonCard>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
