'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
} from '@/components/atoms/Skeleton';

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
      >
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 z-0 bg-neutral-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-neutral-950/80 to-neutral-950 z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-20">
          <div className="text-center">
            {/* Title skeleton */}
            <SkeletonText size="3xl" width="1/2" className="mx-auto mb-6" />
            {/* Subtitle skeletons */}
            <SkeletonText size="lg" width="1/3" className="mx-auto mb-2" />
            <SkeletonText size="lg" width="1/4" className="mx-auto mb-8" />
            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-4">
              <SkeletonButton size="lg" />
              <SkeletonButton size="lg" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section Skeleton */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <SkeletonText size="2xl" width="1/4" className="mx-auto mb-4" />
          <SkeletonText size="base" width="1/5" className="mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <SkeletonCard className="h-full">
                {/* Icon placeholder */}
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                {/* Title */}
                <SkeletonText size="lg" width="1/2" className="mb-2" />
                {/* Description */}
                <SkeletonText size="sm" width="full" className="mb-1" />
                <SkeletonText size="sm" width="3/4" />
              </SkeletonCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Identity Section Skeleton */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <SkeletonText size="2xl" width="1/6" className="mx-auto mb-4" />
          <SkeletonText size="base" width="1/3" className="mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
            >
              <SkeletonCard className="h-full">
                {/* Color dot */}
                <Skeleton className="w-3 h-3 rounded-full mb-4" />
                {/* Title */}
                <SkeletonText size="lg" width="1/2" className="mb-1" />
                {/* Description */}
                <SkeletonText size="sm" width="2/3" className="mb-4" />
                {/* Features list */}
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <SkeletonText size="sm" width="3/4" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section Skeleton */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <SkeletonCard className="text-center py-12 px-6 bg-neutral-900/50">
          <SkeletonText size="2xl" width="1/3" className="mx-auto mb-4" />
          <SkeletonText size="base" width="1/2" className="mx-auto mb-2" />
          <SkeletonText size="base" width="2/5" className="mx-auto mb-8" />
          <SkeletonButton size="lg" className="mx-auto" />
        </SkeletonCard>
      </motion.section>
    </div>
  );
}
