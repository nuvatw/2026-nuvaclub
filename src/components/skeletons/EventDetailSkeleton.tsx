'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
  SkeletonBadge,
} from '@/components/atoms/Skeleton';

export function EventDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Event Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-[400px] bg-neutral-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center gap-2 mb-6"
        >
          <SkeletonText size="sm" width="1/24" />
          <Skeleton className="w-4 h-4 rounded" />
          <SkeletonText size="sm" width="1/16" />
          <Skeleton className="w-4 h-4 rounded" />
          <SkeletonText size="sm" width="1/8" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <SkeletonCard>
                <SkeletonBadge width="md" className="mb-4" />
                <SkeletonText size="3xl" width="3/4" className="mb-4" />
                <SkeletonText size="base" width="full" className="mb-2" />
                <SkeletonText size="base" width="full" className="mb-2" />
                <SkeletonText size="base" width="2/3" />
              </SkeletonCard>
            </motion.div>

            {/* Overview Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <SkeletonCard>
                <SkeletonText size="xl" width="1/4" className="mb-4" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, index) => (
                    <SkeletonText key={index} size="base" width="full" />
                  ))}
                  <SkeletonText size="base" width="3/4" />
                </div>
              </SkeletonCard>
            </motion.div>

            {/* Agenda Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SkeletonCard>
                <SkeletonText size="xl" width="1/4" className="mb-6" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <SkeletonText size="lg" width="1/2" className="mb-2" />
                        <SkeletonText size="sm" width="3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </motion.div>

            {/* FAQ Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <SkeletonCard>
                <SkeletonText size="xl" width="1/6" className="mb-6" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="border-b border-neutral-800 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <SkeletonText size="base" width="2/3" />
                        <Skeleton className="w-5 h-5 rounded" />
                      </div>
                      <SkeletonText size="sm" width="full" className="mb-1" />
                      <SkeletonText size="sm" width="3/4" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </motion.div>
          </div>

          {/* Right Sidebar (1/3) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <SkeletonCard className="sticky top-24">
              {/* Price */}
              <SkeletonText size="3xl" width="1/2" className="mb-4" />

              {/* Date/Time */}
              <div className="space-y-3 mb-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
                    <SkeletonText size="sm" width="2/3" />
                  </div>
                ))}
              </div>

              {/* Register Button */}
              <SkeletonButton fullWidth size="lg" className="mb-6" />

              {/* Event Details */}
              <div className="border-t border-neutral-800 pt-4">
                <SkeletonText size="base" width="1/3" className="mb-4" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <SkeletonText size="sm" width="1/3" />
                      <SkeletonText size="sm" width="1/4" />
                    </div>
                  ))}
                </div>
              </div>
            </SkeletonCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
