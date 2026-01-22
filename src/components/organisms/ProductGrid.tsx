'use client';

import { ShopProductCard } from '@/features/shop/components/ShopProductCard';
import type { ShopProduct } from '@/features/shop/types';

interface ProductGridProps {
  products: ShopProduct[];
  onBuyNow?: (product: ShopProduct) => void;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  onBuyNow,
  emptyMessage = 'No products found',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-[var(--shop-text-muted)] mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-[var(--shop-text-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ShopProductCard
          key={product.id}
          product={product}
          onBuyNow={onBuyNow ? () => onBuyNow(product) : undefined}
        />
      ))}
    </div>
  );
}
