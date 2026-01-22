'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonBadge,
  SkeletonCard,
  SkeletonCircle,
} from '@/components/atoms/Skeleton';

function CommentSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="flex gap-4 py-4 border-b border-neutral-800 last:border-b-0"
    >
      <SkeletonCircle size="md" className="flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <SkeletonText size="sm" width="1/6" />
          <SkeletonBadge width="sm" />
          <SkeletonText size="xs" width="1/8" />
        </div>
        <SkeletonText size="sm" width="full" className="mb-1" />
        <SkeletonText size="sm" width="3/4" className="mb-3" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-6 h-6 rounded" />
          <SkeletonText size="xs" width="1/12" />
        </div>
      </div>
    </motion.div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-6"
      >
        <Skeleton className="w-5 h-5 rounded" />
        <SkeletonText size="sm" width="1/12" />
      </motion.div>

      {/* Post Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <SkeletonCard className="mb-8">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <SkeletonBadge width="md" />
            <SkeletonBadge width="sm" />
          </div>

          {/* Title */}
          <SkeletonText size="2xl" width="3/4" className="mb-4" />

          {/* Author info */}
          <div className="flex items-center gap-3 mb-6">
            <SkeletonCircle size="md" />
            <div>
              <div className="flex items-center gap-2">
                <SkeletonText size="sm" width="1/2" />
                <SkeletonBadge width="sm" />
              </div>
              <SkeletonText size="xs" width="1/3" className="mt-1" />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 space-y-2">
            <SkeletonText size="base" width="full" />
            <SkeletonText size="base" width="full" />
            <SkeletonText size="base" width="full" />
            <SkeletonText size="base" width="full" />
            <SkeletonText size="base" width="2/3" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[...Array(4)].map((_, index) => (
              <SkeletonBadge key={index} width="md" />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded" />
              <SkeletonText size="sm" width="1/4" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <SkeletonText size="sm" width="1/4" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <SkeletonText size="sm" width="1/4" />
            </div>
          </div>
        </SkeletonCard>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SkeletonCard>
          {/* Comments header */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-800">
            <Skeleton className="w-5 h-5 rounded" />
            <SkeletonText size="lg" width="1/6" />
          </div>

          {/* Comment input */}
          <div className="mb-6">
            <Skeleton className="w-full h-24 rounded-lg mb-2" />
            <div className="flex justify-end">
              <SkeletonButton size="sm" />
            </div>
          </div>

          {/* Comments list */}
          {[...Array(4)].map((_, index) => (
            <CommentSkeleton key={index} delay={0.15 + index * 0.05} />
          ))}
        </SkeletonCard>
      </motion.div>
    </div>
  );
}
