'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
// Use shim for types to avoid direct infra/domain imports
import type { ShopProduct } from '@/lib/legacy-db-shim';

export type ProductType = 'plan' | 'event' | 'merchandise';
export type PlanProductType = 'explorer' | 'traveler';

/**
 * Hook to access product data via BFF
 */
export function useProducts() {
  const [allProducts, setAllProducts] = useState<ShopProduct[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/bff/shop/products')
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setAllProducts(Array.isArray(data) ? data : []);
          setIsReady(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        if (mounted) setIsReady(true);
      });
    return () => { mounted = false; };
  }, []);

  const products = allProducts;

  const plans = useMemo(() =>
    products.filter(p => p.type === 'plan'),
    [products]
  );

  const events = useMemo(() =>
    products.filter(p => p.type === 'event'),
    [products]
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return products.filter(p => {
      // Best effort future check (assuming date field present or logic handled by backend API in future)
      // For mock, just filtering by type 'event' is a safe fallback or checking extended props if available
      if (p.type !== 'event') return false;
      // We can iterate generic properties if needed, but for now simple filter
      return true;
    });
  }, [products]);

  const merchandise = useMemo(() =>
    products.filter(p => p.type === 'merchandise'),
    [products]
  );

  // Helper functions
  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getProductsByType = useCallback((type: ProductType) => {
    return products.filter(p => p.type === type);
  }, [products]);

  const searchProducts = useCallback((query: string) => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [products]);

  const getPlanByType = useCallback((planType: 'explorer' | 'traveler') => {
    // Logic from repository: plans are distinguished by their ID usually or metadata
    return plans.find(p => p.id.includes(planType));
  }, [plans]);

  return {
    products,
    plans,
    events,
    upcomingEvents,
    merchandise,
    isReady,
    getProductById,
    getProductsByType,
    searchProducts,
    getPlanByType,
  };
}

/**
 * Hook to get a single product by ID via BFF
 */
export function useProduct(productId: string) {
  const [product, setProduct] = useState<ShopProduct | null>(null);

  useEffect(() => {
    if (!productId) return;
    let mounted = true;
    fetch(`/api/bff/shop/products?id=${productId}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (mounted && data) setProduct(data);
      })
      .catch(err => console.error(err));
    return () => { mounted = false; };
  }, [productId]);

  return product;
}
