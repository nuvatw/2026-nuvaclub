'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/features/shop/types';
import { useCart } from './CartProvider';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--shop-border)]">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--shop-border)]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--shop-text-muted)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[var(--shop-text)] truncate">{item.name}</h4>
        {(item.selectedVariant || item.selectedPeriod) && (
          <p className="text-sm text-[var(--shop-text-muted)] mt-0.5">
            {item.selectedVariant && <span>{item.selectedVariant}</span>}
            {item.selectedVariant && item.selectedPeriod && <span> / </span>}
            {item.selectedPeriod && <span>{item.selectedPeriod}</span>}
          </p>
        )}
        <p className="text-sm font-semibold text-[var(--shop-text)] mt-1">
          ${item.price.toLocaleString()}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--shop-border)] text-[var(--shop-text-muted)] hover:bg-[var(--shop-border)] transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm font-medium text-[var(--shop-text)] min-w-[2ch] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--shop-border)] text-[var(--shop-text-muted)] hover:bg-[var(--shop-border)] transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => removeFromCart(item.productId)}
            className="ml-auto text-[var(--shop-text-muted)] hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
