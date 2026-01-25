// Product type discriminators
export type ProductType = 'plan' | 'event' | 'merchandise' | 'duo';
export type ProductCategory = 'plan' | 'event' | 'merchant' | 'duo';

// Nunu tier types for Duo ticket matching access
export type NunuTier = 'nunu' | 'verified_nunu' | 'super_nunu';

// Duo ticket variants
export type DuoVariant = 'go' | 'run' | 'fly';

// Plan product (Explorer, Traveler, Voyager, Enterprise)
export interface PlanProduct {
  id: string;
  type: 'plan';
  planType: 'explorer' | 'traveler' | 'voyager' | 'enterprise';
  name: string;
  description: string;
  price: number; // Monthly price
  yearlyPrice: number; // Yearly price (pay 10 months, get 12 - 17% discount)
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  badge?: string; // e.g., "Most Recommended", "Popular"
  promoted?: boolean; // Visual emphasis (Voyager = true)
  ctaText?: string; // Custom CTA button text
  ctaLink?: string; // External link (Enterprise LINE)
  ctaExternal?: boolean; // Open in new tab
}

// Agenda item for events
export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
}

// FAQ item for events
export interface FAQ {
  question: string;
  answer: string;
}

// Event product (workshops, meetups, webinars)
export interface EventProduct {
  id: string;
  type: 'event';
  eventType: 'in-person' | 'online';
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
  hotScore?: number; // For hot/trending sorting
  // Detail page fields
  overview: string;
  whatYouWillLearn: string[];
  whoIsItFor: string[];
  agenda: AgendaItem[];
  faqs?: FAQ[];
  isLiveQA?: boolean;
}

// Merchandise product (hats, shirts, etc.)
export interface MerchandiseProduct {
  id: string;
  type: 'merchandise';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  variants?: { name: string; stock: number }[];
}

// Duo ticket product (Go, Run, Fly)
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
  // Tiers this ticket grants matching access to
  matchAccess: NunuTier[];
  features: string[];
  badge?: string;
  isPopular?: boolean;
}

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

export type PlanType = 'explorer' | 'traveler' | 'voyager' | 'enterprise';
