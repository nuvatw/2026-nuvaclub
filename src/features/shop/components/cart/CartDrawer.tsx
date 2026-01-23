'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartProvider';
import { CartItem } from './CartItem';
import { Button, Modal } from '@/components/atoms';
import { useEscapeKey, useBodyScrollLock } from '@/hooks';
import { XIcon, ShoppingBagIcon, TrashIcon } from '@/components/icons';

export function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, closeCart, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEscapeKey(closeCart, isCartOpen);
  useBodyScrollLock(isCartOpen);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold text-white">
                Shopping Cart ({cart.totalItems})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
                aria-label="Close cart"
              >
                <XIcon size="lg" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBagIcon className="w-16 h-16 text-neutral-600 mb-4" />
                  <p className="text-neutral-400">Your cart is empty</p>
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
              <div className="border-t border-neutral-800 p-4 space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-sm text-neutral-400 hover:text-red-400 transition-colors"
                >
                  Clear Cart
                </button>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-xl font-bold text-white">
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

                <p className="text-xs text-center text-neutral-500">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Shopping Cart"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              leftIcon={<TrashIcon size="sm" />}
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </>
        }
      >
        <p className="text-neutral-300">
          Are you sure you want to remove all {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} from your cart?
        </p>
      </Modal>
    </AnimatePresence>
  );
}
