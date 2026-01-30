/**
 * Shop Feature Types
 *
 * Re-exports entity types from Database (canonical source)
 * and defines feature-specific types and UI helpers.
 */

// Import types for local use
// Product entity types (localized from infra to ensure boundary integrity)
export type EventType = 'online' | 'in-person';

export interface EventAgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface EventFAQItem {
  question: string;
  answer: string;
}

export interface EventProduct {
  id: string;
  type: 'event';
  eventType: EventType;
  isLiveQA?: boolean;
  name: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  price: number;
  capacity: number;
  remainingSeats: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  hotScore?: number;
  overview: string;
  whatYouWillLearn: string[];
  whoIsItFor: string[];
  agenda: EventAgendaItem[];
  faqs?: EventFAQItem[];
}

export type EventSortBy = 'hot' | 'date' | 'price-low' | 'price-high';

export type PlanType = 'explorer' | 'traveler' | 'voyager' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanProduct {
  id: string;
  type: 'plan';
  planType: PlanType;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  billingCycle: BillingCycle;
  features: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  ctaText: string;
  ctaLink?: string;
  ctaExternal?: boolean;
  isPopular?: boolean;
  badge?: string;
  promoted?: boolean;
}

export interface MerchandiseVariant {
  name: string;
  stock: number;
}

export interface MerchandiseProduct {
  id: string;
  type: 'merchandise';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  variants?: MerchandiseVariant[];
}

export type DuoVariant = 'go' | 'run' | 'fly';
export type NunuTier = 'nunu' | 'verified_nunu' | 'super_nunu';

export interface DuoProduct {
  id: string;
  type: 'duo';
  duoVariant: DuoVariant;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  matchAccess: NunuTier[];
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

// Product type discriminators
export type ProductType = 'plan' | 'event' | 'merchandise' | 'duo';
export type ProductCategory = 'plan' | 'event' | 'merchant' | 'duo';

// Union type for all products
export type Product = PlanProduct | EventProduct | MerchandiseProduct | DuoProduct;

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
