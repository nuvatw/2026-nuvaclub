'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartProvider';
import { CartItem } from './CartItem';
import { Button } from '@/components/atoms';
import { useEscapeKey, useBodyScrollLock } from '@/hooks';
import { CloseIcon, ShoppingBagIcon } from '@/components/icons';

export function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, closeCart, clearCart } = useCart();

  useEscapeKey(closeCart, isCartOpen);
  useBodyScrollLock(isCartOpen);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--shop-card)] shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--shop-border)]">
              <h2 className="text-lg font-semibold text-[var(--shop-text)]">
                Shopping Cart ({cart.totalItems})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-[var(--shop-text-muted)] hover:text-[var(--shop-text)] transition-colors"
                aria-label="Close cart"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBagIcon className="w-16 h-16 text-[var(--shop-text-muted)] mb-4" />
                  <p className="text-[var(--shop-text-muted)]">Your cart is empty</p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-0">
                  {cart.items.map((item) => (
                    <CartItem key={`${item.productId}-${item.selectedVariant || ''}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-[var(--shop-border)] p-4 space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-sm text-[var(--shop-text-muted)] hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-[var(--shop-text-muted)]">Subtotal</span>
                  <span className="text-xl font-bold text-[var(--shop-text)]">
                    ${cart.totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>

                <p className="text-xs text-center text-[var(--shop-text-muted)]">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
