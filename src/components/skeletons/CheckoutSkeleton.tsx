'use client';

import { motion } from 'motion/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
} from '@/components/atoms/Skeleton';

function CartItemSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-4 py-4 border-b border-neutral-800 last:border-b-0"
    >
      {/* Product image */}
      <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />

      {/* Product info */}
      <div className="flex-1">
        <SkeletonText size="base" width="2/3" className="mb-1" />
        <SkeletonText size="sm" width="1/3" className="mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded" />
          <SkeletonText size="base" width="1/12" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <SkeletonText size="lg" width="1/2" className="ml-auto" />
      </div>

      {/* Remove button */}
      <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
    </motion.div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-8"
      >
        <SkeletonText size="3xl" width="1/6" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary (2/3) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <SkeletonCard>
            <SkeletonText size="xl" width="1/4" className="mb-4" />
            {[...Array(3)].map((_, index) => (
              <CartItemSkeleton key={index} delay={0.15 + index * 0.05} />
            ))}
          </SkeletonCard>
        </motion.div>

        {/* Payment Summary (1/3) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="lg:col-span-1"
        >
          <SkeletonCard className="sticky top-24">
            <SkeletonText size="xl" width="1/2" className="mb-6" />

            {/* Summary lines */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <SkeletonText size="sm" width="1/4" />
                <SkeletonText size="sm" width="1/6" />
              </div>
              <div className="flex items-center justify-between">
                <SkeletonText size="sm" width="1/5" />
                <SkeletonText size="sm" width="1/8" />
              </div>
              <div className="flex items-center justify-between">
                <SkeletonText size="sm" width="1/4" />
                <SkeletonText size="sm" width="1/6" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-800 my-4" />

            {/* Total */}
            <div className="flex items-center justify-between mb-6">
              <SkeletonText size="lg" width="1/4" />
              <SkeletonText size="xl" width="1/4" />
            </div>

            {/* Place Order Button */}
            <SkeletonButton fullWidth size="lg" className="mb-4" />

            {/* Disclaimer */}
            <SkeletonText size="xs" width="full" className="mb-1" />
            <SkeletonText size="xs" width="3/4" className="mx-auto" />
          </SkeletonCard>
        </motion.div>
      </div>
    </div>
  );
}
