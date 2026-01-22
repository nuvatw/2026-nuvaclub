'use client';

import { useCart } from './CartProvider';

export function CartIcon() {
  const { cart, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-neutral-300 hover:text-white transition-colors"
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
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {cart.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cart.totalItems > 99 ? '99+' : cart.totalItems}
        </span>
      )}
    </button>
  );
}
