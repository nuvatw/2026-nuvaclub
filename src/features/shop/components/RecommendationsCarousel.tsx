'use client';

import { useRef } from 'react';
import { ShopProductCard } from './ShopProductCard';
import type { ShopProduct } from '@/features/shop/types';
import { useScrollNavigation } from '@/hooks';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface RecommendationsCarouselProps {
  title?: string;
  products: ShopProduct[];
  onBuyNow?: (product: ShopProduct) => void;
}

export function RecommendationsCarousel({
  title = 'Explore our recommendations',
  products,
  onBuyNow,
}: RecommendationsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useScrollNavigation(
    scrollContainerRef,
    640 // Scroll 2 cards width (320px * 2)
  );

  if (products.length === 0) return null;

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--shop-text)]">
          {title}
        </h2>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border border-[var(--shop-border)] transition-all ${
              canScrollLeft
                ? 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
                : 'text-[var(--shop-text-muted)] opacity-50 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border border-[var(--shop-border)] transition-all ${
              canScrollRight
                ? 'text-[var(--shop-text)] hover:bg-[var(--shop-border)]'
                : 'text-[var(--shop-text-muted)] opacity-50 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Fades */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--shop-bg)] to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--shop-bg)] to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px]">
              <ShopProductCard
                product={product}
                onBuyNow={onBuyNow ? () => onBuyNow(product) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
