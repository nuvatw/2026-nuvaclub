'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { RatingStars } from '@/components/molecules';
import { useCart } from '@/features/shop/components/cart';
import type { ShopProduct, ProductCategory } from '@/features/shop/types';
import { cn } from '@/lib/utils';

interface ShopProductCardProps {
  product: ShopProduct;
  onBuyNow?: () => void;
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  plan: 'Plan',
  event: 'Event',
  merchant: 'Merchandise',
};

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  plan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  event: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  merchant: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

export function ShopProductCard({ product, onBuyNow }: ShopProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, product.type);
  };

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(product.id, product.type);
    }
    onBuyNow?.();
  };

  // Determine if this card should link to a detail page
  const isEvent = product.category === 'event';
  const cardHref = isEvent ? `/shop/events/${product.id}` : undefined;

  const imageContent = (
    <>
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={cn(
            'inline-block px-2.5 py-1 text-xs font-medium rounded-full',
            CATEGORY_COLORS[product.category]
          )}
        >
          {CATEGORY_LABELS[product.category]}
        </span>
      </div>

      {/* Product Image */}
      {product.imageUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--shop-text-muted)]">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )}
    </>
  );

  const titleContent = (
    <h3 className="font-semibold text-[var(--shop-text)] line-clamp-1 group-hover:text-primary-500 transition-colors">
      {product.name}
    </h3>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="group bg-[var(--shop-card)] rounded-2xl border border-[var(--shop-border)] overflow-hidden hover:shadow-lg hover:border-[var(--shop-border-hover)] transition-all duration-300">
        {/* Image Section */}
        {cardHref ? (
          <Link href={cardHref} className="block relative aspect-square p-6 bg-[var(--shop-bg)]">
            {imageContent}
          </Link>
        ) : (
          <div className="block relative aspect-square p-6 bg-[var(--shop-bg)]">
            {imageContent}
          </div>
        )}

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          {cardHref ? (
            <Link href={cardHref}>{titleContent}</Link>
          ) : (
            titleContent
          )}

          {/* Rating & Price Row */}
          <div className="flex items-center justify-between">
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
            <span className="font-bold text-[var(--shop-text)]">
              {product.price === 0 ? 'Free' : `$${product.price.toLocaleString()}`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={inCart}
            >
              {inCart ? 'In Cart' : 'Add to Cart'}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-(--shop-text) text-(--shop-card) hover:opacity-90"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
