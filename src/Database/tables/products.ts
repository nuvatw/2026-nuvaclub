/**
 * Products Table - Shop Aggregator
 *
 * Combines all shop product types (plans, events, merchandise, duo) and provides
 * unified access helpers.
 *
 * Migrated from features/shop/data/products.ts
 */

import type {
  EventProduct,
  Product,
  ShopProduct,
  ProductCategory,
} from '@/features/shop/types';
import { PLANS } from './plans';
import { DUO_PRODUCTS } from './duo';
import { EVENTS } from './events';
import { MERCHANDISE } from './merchandise';

// Re-export for convenience (data lives in respective tables)
export { EVENTS } from './events';
export { MERCHANDISE } from './merchandise';

// Helper function to get all products
export function getAllProducts(): Product[] {
  return [...PLANS, ...EVENTS, ...MERCHANDISE, ...DUO_PRODUCTS];
}

// Re-export Duo products
export { DUO_PRODUCTS } from './duo';

// IDs for products with special filter flags
const NEW_ARRIVAL_IDS = ['event-1', 'event-4', 'merch-7'];
const DISCOUNT_IDS = ['event-6']; // Free webinar

// Convert any product to ShopProduct format for unified display
export function toShopProduct(product: Product): ShopProduct {
  const categoryMap: Record<string, ProductCategory> = {
    'plan': 'plan',
    'event': 'event',
    'merchandise': 'merchant',
    'duo': 'duo',
  };

  const rating = 'rating' in product ? product.rating : 0;

  return {
    id: product.id,
    type: product.type,
    category: categoryMap[product.type],
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: 'imageUrl' in product ? product.imageUrl : '',
    rating,
    reviewCount: 'reviewCount' in product ? product.reviewCount : 0,
    // Filter flags
    isNew: NEW_ARRIVAL_IDS.includes(product.id),
    isBestSeller: rating >= 4.8,
    isOnDiscount: DISCOUNT_IDS.includes(product.id) || product.price === 0,
  };
}

// Get all products as ShopProduct format
export function getAllShopProducts(): ShopProduct[] {
  return getAllProducts().map(toShopProduct);
}

// Get products by category
export function getProductsByCategory(category: ProductCategory): Product[] {
  const all = getAllProducts();
  const categoryMap: Record<ProductCategory, string> = {
    'plan': 'plan',
    'event': 'event',
    'merchant': 'merchandise',
    'duo': 'duo',
  };
  return all.filter((p) => p.type === categoryMap[category]);
}

// Get event by ID (uses events table)
export function getShopEventById(id: string): EventProduct | undefined {
  return EVENTS.find((event) => event.id === id);
}

// Get product by ID
export function getShopProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

// Re-export types
export type { Product, ShopProduct, ProductCategory };
