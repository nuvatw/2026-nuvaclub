// Product type discriminators
export type ProductType = 'plan' | 'duo-ticket' | 'event' | 'merchandise';
export type ProductCategory = 'plan' | 'duo' | 'event' | 'merchant';

// Plan product (Explorer, Traveler)
export interface PlanProduct {
  id: string;
  type: 'plan';
  planType: 'explorer' | 'traveler';
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
}

// Duo ticket product (Go, Run, Fly)
export interface DuoTicketProduct {
  id: string;
  type: 'duo-ticket';
  ticketType: 'go' | 'run' | 'fly';
  name: string;
  description: string;
  price: number;
  duration: 'month' | 'quarter';
  availablePeriods: string[];
  benefits: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
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

// Union type for all products
export type Product = PlanProduct | DuoTicketProduct | EventProduct | MerchandiseProduct;

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
}

// Cart types
export interface CartItem {
  productId: string;
  productType: ProductType;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedVariant?: string;
  selectedPeriod?: string;
  // For Duo tickets - array of YYYY-MM month strings
  selectedMonths?: string[];
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
export interface PlanFeature {
  feature: string;
  explorer: boolean;
  traveler: boolean;
}

export interface DuoFeature {
  feature: string;
  solo: boolean;
  go: boolean;
  run: boolean;
  fly: boolean;
}

export type PlanType = 'explorer' | 'traveler';
export type DuoType = 'solo' | 'go' | 'run' | 'fly';
