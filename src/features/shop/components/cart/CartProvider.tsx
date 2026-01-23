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
import type { Cart, CartItem, ProductType } from '@/features/shop/types';
import { getProductById } from '@/features/shop/data/products';

const CART_STORAGE_KEY = 'nuvaclub_cart';

interface CartContextType {
  cart: Cart;
  addToCart: (
    productId: string,
    productType: ProductType,
    options?: { variant?: string; period?: string; quantity?: number; months?: string[] }
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
      options?: { variant?: string; period?: string; quantity?: number; months?: string[] }
    ) => {
      const product = getProductById(productId);
      if (!product) return;

      setCart((prev) => {
        // For duo tickets with months, check if same product with same months exists
        const existingIndex = prev.items.findIndex((item) => {
          if (item.productId !== productId) return false;
          if (item.selectedVariant !== options?.variant) return false;
          if (item.selectedPeriod !== options?.period) return false;

          // For duo tickets, compare months arrays
          if (options?.months && item.selectedMonths) {
            const sortedNew = [...options.months].sort();
            const sortedExisting = [...item.selectedMonths].sort();
            return JSON.stringify(sortedNew) === JSON.stringify(sortedExisting);
          }
          return !options?.months && !item.selectedMonths;
        });

        let newItems: CartItem[];

        if (existingIndex >= 0 && !options?.months) {
          // Update quantity of existing item (not for month-based items)
          newItems = prev.items.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + (options?.quantity ?? 1) }
              : item
          );
        } else {
          // For duo tickets with months, calculate price based on number of months
          let itemPrice = product.price;
          let itemQuantity = options?.quantity ?? 1;

          if (options?.months && options.months.length > 0) {
            // Price is per month for duo tickets
            itemQuantity = options.months.length;
          }

          // Add new item
          const newItem: CartItem = {
            productId,
            productType,
            name: product.name,
            price: itemPrice,
            imageUrl: 'imageUrl' in product ? product.imageUrl : '',
            quantity: itemQuantity,
            selectedVariant: options?.variant,
            selectedPeriod: options?.period,
            selectedMonths: options?.months,
          };
          newItems = [...prev.items, newItem];
        }

        const { totalItems, totalPrice } = calculateTotals(newItems);
        return { items: newItems, totalItems, totalPrice };
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.productId !== productId);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
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
