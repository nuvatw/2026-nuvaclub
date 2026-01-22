'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
  SkeletonProductCard,
  SkeletonBadge,
} from '@/components/atoms/Skeleton';

export function ShopPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* VideoHero Skeleton */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full aspect-[21/9] max-h-[400px] bg-neutral-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-center">
          <SkeletonText size="3xl" width="1/4" className="mx-auto mb-4" />
          <SkeletonText size="lg" width="1/3" className="mx-auto" />
        </div>
      </motion.section>

      {/* Shop Header - Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <SkeletonText size="xl" width="1/4" />
          <Skeleton className="w-full sm:w-80 h-10 rounded-lg" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <SkeletonCard className="sticky top-24">
              {/* Categories */}
              <SkeletonText size="lg" width="1/2" className="mb-4" />
              <div className="space-y-3 mb-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <SkeletonText size="sm" width="1/2" />
                    <SkeletonBadge width="sm" />
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="border-t border-neutral-800 pt-4">
                <SkeletonText size="lg" width="1/3" className="mb-4" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <SkeletonText size="sm" width="2/3" />
                    </div>
                  ))}
                </div>
              </div>
            </SkeletonCard>
          </motion.aside>

          {/* Product Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <SkeletonText size="sm" width="1/6" />
              <SkeletonButton size="sm" />
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + Math.floor(index / 3) * 0.05 }}
                >
                  <SkeletonProductCard />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <SkeletonButton size="sm" />
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-10 h-10 rounded" />
              ))}
              <SkeletonButton size="sm" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommendations Carousel */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-neutral-900/50 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonText size="xl" width="1/6" className="mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <SkeletonProductCard />
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
