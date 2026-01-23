'use client';

import { useCart } from './CartProvider';
import { cn } from '@/lib/utils';

export function CartIcon() {
  const { cart, toggleCart } = useCart();
  const hasItems = cart.totalItems > 0;

  return (
    <button
      onClick={toggleCart}
      className={cn(
        'relative p-2 transition-colors',
        hasItems
          ? 'text-white'
          : 'text-neutral-500 hover:text-white'
      )}
      aria-label={`Shopping cart with ${cart.totalItems} items`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {hasItems && (
        <span className="absolute top-0.5 right-0.5 bg-red-500 rounded-full w-2.5 h-2.5" />
      )}
    </button>
  );
}
