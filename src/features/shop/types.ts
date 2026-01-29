/**
 * Shop Feature Types
 *
 * Re-exports entity types from Database (canonical source)
 * and defines feature-specific types and UI helpers.
 */

// Import types for local use
import type {
  EventProduct as _EventProduct,
  PlanProduct as _PlanProduct,
  MerchandiseProduct as _MerchandiseProduct,
  DuoProduct as _DuoProduct,
  DuoVariant,
  NunuTier
} from '@/lib/types/legacy-shim';

// Re-export entity types from Database (canonical source)
export type {
  EventProduct,
  EventType,
  EventAgendaItem,
  EventFAQItem,
  EventSortBy,
  PlanProduct,
  PlanType,
  BillingCycle,
  MerchandiseProduct,
  MerchandiseVariant,
  DuoProduct,
  DuoVariant,
  NunuTier,
} from '@/lib/types/legacy-shim';

// Product type discriminators
export type ProductType = 'plan' | 'event' | 'merchandise' | 'duo';
export type ProductCategory = 'plan' | 'event' | 'merchant' | 'duo';

// Legacy aliases for backward compatibility
export type AgendaItem = import('@/lib/types/legacy-shim').EventAgendaItem;
export type FAQ = import('@/lib/types/legacy-shim').EventFAQItem;

// Union type for all products
export type Product = _PlanProduct | _EventProduct | _MerchandiseProduct | _DuoProduct;

// Unified shop product interface for display purposes
export interface ShopProduct {
  id: string;
  type: ProductType;
  category: ProductCategory;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  // Filter flags
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnDiscount?: boolean;
  // Event-specific fields for filtering/sorting
  eventType?: 'in-person' | 'online';
  date?: Date;
  hotScore?: number;
}

// Cart types

/** Unique identifier for a cart item (productId + variant + period) */
export interface CartItemIdentifier {
  productId: string;
  selectedVariant?: string;
  selectedPeriod?: string;
}

/** Generate a stable key string for a cart item */
export function getCartItemKey(item: CartItemIdentifier): string {
  return `${item.productId}|${item.selectedVariant ?? ''}|${item.selectedPeriod ?? ''}`;
}

/** Check if two cart item identifiers match */
export function cartItemsMatch(a: CartItemIdentifier, b: CartItemIdentifier): boolean {
  return (
    a.productId === b.productId &&
    a.selectedVariant === b.selectedVariant &&
    a.selectedPeriod === b.selectedPeriod
  );
}

export interface CartItem {
  productId: string;
  productType: ProductType;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedVariant?: string;
  selectedPeriod?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Helper type for category counts
export interface CategoryCount {
  category: ProductCategory;
  label: string;
  count: number;
}

// Plan comparison types
export type FeatureCategory = 'learn' | 'test' | 'forum' | 'sprint' | 'space' | 'extras';

export interface PlanFeature {
  feature: string;
  category: FeatureCategory;
  explorer: boolean | string;
  traveler: boolean | string;
  voyager: boolean | string;
}

// Entitlement types
export interface DuoEntitlement {
  variant: DuoVariant;
  purchasedAt: string; // ISO date string
  matchAccess: NunuTier[];
}

// PlanType is re-exported from Database above
