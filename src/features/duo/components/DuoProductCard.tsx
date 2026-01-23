'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { RatingStars } from '@/components/molecules';
import { useCart } from '@/features/shop/components/cart';
import { cn } from '@/lib/utils';
import type { DuoTicketProduct } from '@/features/shop/types';
import { DuoMonthSelector } from './DuoMonthSelector';
import type { DuoTier } from '../types';
import { DUO_TIER_CONFIG } from '../types';

interface DuoProductCardProps {
  product: DuoTicketProduct;
  onBuyNow?: () => void;
}

export function DuoProductCard({ product, onBuyNow }: DuoProductCardProps) {
  const { addToCart, isInCart, openCart } = useCart();
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const inCart = isInCart(product.id);

  const tier = product.ticketType as DuoTier;
  const tierConfig = DUO_TIER_CONFIG[tier];

  const handleAddToCart = () => {
    setShowMonthSelector(true);
  };

  const handleMonthsSelected = (months: string[]) => {
    addToCart(product.id, product.type, { months });
    setShowMonthSelector(false);
    openCart();
  };

  const handleBuyNow = () => {
    if (!inCart) {
      setShowMonthSelector(true);
    } else {
      onBuyNow?.();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={cn(
            'group rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300',
            'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          )}
        >
          {/* Image Section */}
          <div
            className={cn(
              'relative aspect-[4/3] p-6',
              tierConfig.bgColor
            )}
          >
            {/* Tier Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-full',
                  tierConfig.bgColor,
                  tierConfig.color,
                  'border',
                  tierConfig.borderColor
                )}
              >
                {tierConfig.name}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white font-bold">
                {product.price.toLocaleString()} TWD/mo
              </span>
            </div>

            {/* Product Image */}
            {product.imageUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className={cn('w-20 h-20', tierConfig.color)}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-4">
            {/* Product Name & Description */}
            <div>
              <h3 className="font-bold text-lg text-white mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-400 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-1.5">
              {product.benefits.slice(0, 3).map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <svg
                    className={cn('w-4 h-4 shrink-0', tierConfig.color)}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-300">{benefit}</span>
                </div>
              ))}
              {product.benefits.length > 3 && (
                <p className="text-xs text-neutral-500 pl-6">
                  +{product.benefits.length - 3} more benefits
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between">
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
              <div
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded',
                  tierConfig.bgColor,
                  tierConfig.color
                )}
              >
                {tier === 'go'
                  ? 'Regular Nunu'
                  : tier === 'run'
                    ? 'Certified Nunu'
                    : 'Shangzhe Access'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleAddToCart}
              >
                {inCart ? 'Add More Months' : 'Select Months'}
              </Button>
              <Button
                size="sm"
                className={cn(
                  'flex-1',
                  tierConfig.bgColor,
                  tierConfig.color,
                  'hover:opacity-90 border',
                  tierConfig.borderColor
                )}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Month Selector Modal */}
      {showMonthSelector && (
        <DuoMonthSelector
          tier={tier}
          onConfirm={handleMonthsSelected}
          onCancel={() => setShowMonthSelector(false)}
        />
      )}
    </>
  );
}

export default DuoProductCard;
