'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonBadge,
  SkeletonPostCard,
} from '@/components/atoms/Skeleton';

export function ForumPageSkeleton() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <SkeletonText size="3xl" width="1/6" className="mb-2" />
        <SkeletonText size="base" width="1/3" />
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {[...Array(5)].map((_, index) => (
          <SkeletonButton key={index} size="sm" />
        ))}
      </motion.div>

      {/* Sort Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <SkeletonBadge width="md" />
        <SkeletonBadge width="md" />
        <SkeletonBadge width="lg" />
      </motion.div>

      {/* Pinned Posts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-4 h-4 rounded" />
          <SkeletonText size="lg" width="1/6" />
        </div>
        <SkeletonPostCard />
      </motion.div>

      {/* Posts Grid */}
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <SkeletonPostCard />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
