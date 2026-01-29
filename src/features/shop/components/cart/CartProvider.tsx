'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Cart, CartItem, ProductType, CartItemIdentifier } from '@/features/shop/types';
import { cartItemsMatch, getCartItemKey } from '@/features/shop/types';
// import { getShopProductById as getProductById } from '@/lib/legacy-db-shim';
import { useShopCatalog } from '@/lib/hooks/domain/useShopCatalog';

const CART_STORAGE_KEY = 'nuvaclub_cart';

interface CartContextType {
  cart: Cart;
  addToCart: (
    productId: string,
    productType: ProductType,
    options?: { variant?: string; period?: string; quantity?: number }
  ) => void;
  removeFromCart: (identifier: CartItemIdentifier) => void;
  updateQuantity: (identifier: CartItemIdentifier, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { getProductById } = useShopCatalog(); // Hook usage

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCart(parsed);
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = useCallback(
    (
      productId: string,
      productType: ProductType,
      options?: { variant?: string; period?: string; quantity?: number }
    ) => {
      const product = getProductById(productId);
      if (!product) {
        console.warn('Product not found in catalog, cannot add to cart:', productId);
        return;
      }

      setCart((prev) => {
        const existingIndex = prev.items.findIndex((item) => {
          if (item.productId !== productId) return false;
          if (item.selectedVariant !== options?.variant) return false;
          if (item.selectedPeriod !== options?.period) return false;
          return true;
        });

        let newItems: CartItem[];

        if (existingIndex >= 0) {
          // Update quantity of existing item
          newItems = prev.items.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + (options?.quantity ?? 1) }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            productId,
            productType,
            name: product.name,
            price: product.price,
            imageUrl: 'imageUrl' in product ? product.imageUrl : '',
            quantity: options?.quantity ?? 1,
            selectedVariant: options?.variant,
            selectedPeriod: options?.period,
          };
          newItems = [...prev.items, newItem];
        }

        const { totalItems, totalPrice } = calculateTotals(newItems);
        return { items: newItems, totalItems, totalPrice };
      });
    },
    [getProductById]
  );

  const removeFromCart = useCallback((identifier: CartItemIdentifier) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => !cartItemsMatch(item, identifier));
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  }, []);

  const updateQuantity = useCallback((identifier: CartItemIdentifier, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(identifier);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        cartItemsMatch(item, identifier) ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart(emptyCart);
  }, []);

  const isInCart = useCallback(
    (productId: string) => cart.items.some((item) => item.productId === productId),
    [cart.items]
  );

  const getCartItem = useCallback(
    (productId: string) => cart.items.find((item) => item.productId === productId),
    [cart.items]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getCartItem,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getCartItem,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
