// ==========================================
// Products Table (polymorphic base)
// ==========================================
export type ProductType = 'plan' | 'duo-ticket' | 'event' | 'merchandise';

export interface ProductRecord {
  id: string;
  type: ProductType;
  name: string;
  description: string;
  price: number; // in smallest currency unit (e.g., cents or TWD)
  imageUrl: string;
  isActive: boolean;
  avgRating: number; // 0-5
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Plan Products Table
// ==========================================
export type PlanProductType = 'explorer' | 'traveler';
export type PlanBillingCycle = 'monthly' | 'yearly';

export interface PlanProductRecord {
  id: string;
  productId: string;
  planType: PlanProductType;
  billingCycle: PlanBillingCycle;
  features: string[];
  isPopular: boolean;
}

// ==========================================
// Duo Ticket Products Table
// ==========================================
export type DuoTicketProductType = 'go' | 'run' | 'fly';
export type DuoTicketDuration = 'month' | 'quarter';

export interface DuoTicketProductRecord {
  id: string;
  productId: string;
  ticketType: DuoTicketProductType;
  duration: DuoTicketDuration;
  benefits: string[];
}

// ==========================================
// Event Products Table
// ==========================================
export type EventType = 'in-person' | 'online';

export interface EventProductRecord {
  id: string;
  productId: string;
  eventType: EventType;
  date: Date;
  endDate?: Date;
  location: string;
  capacity: number;
  remainingSeats: number;
  overview: string;
  whatYouWillLearn: string[];
  whoIsItFor: string[];
  isLiveQA: boolean;
}

// ==========================================
// Event Agenda Items Table
// ==========================================
export interface EventAgendaItemRecord {
  id: string;
  eventProductId: string;
  time: string; // e.g., "09:00"
  title: string;
  description?: string;
  sortOrder: number;
}

// ==========================================
// Event FAQs Table
// ==========================================
export interface EventFAQRecord {
  id: string;
  eventProductId: string;
  question: string;
  answer: string;
  sortOrder: number;
}

// ==========================================
// Merchandise Products Table
// ==========================================
export interface MerchandiseProductRecord {
  id: string;
  productId: string;
}

// ==========================================
// Merchandise Variants Table
// ==========================================
export interface MerchandiseVariantRecord {
  id: string;
  merchandiseProductId: string;
  name: string; // e.g., "S", "M", "L"
  stock: number;
  sku?: string;
}

// ==========================================
// Product Reviews Table
// ==========================================
export interface ProductReviewRecord {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
}

// ==========================================
// Carts Table
// ==========================================
export interface CartRecord {
  id: string;
  userId?: string; // null for guest carts
  sessionId?: string; // for guest carts
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // for guest cart cleanup
}

// ==========================================
// Cart Items Table
// ==========================================
export interface CartItemRecord {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  selectedVariant?: string; // for merchandise
  selectedPeriod?: string; // for duo tickets
  addedAt: Date;
}

// ==========================================
// Orders Table
// ==========================================
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface OrderRecord {
  id: string;
  userId: string;
  orderNumber: string; // e.g., "ORD-2026-00001"
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string; // e.g., "TWD"
  paymentMethod?: string;
  paidAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Order Items Table
// ==========================================
export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  productName: string; // snapshot at time of order
  productType: ProductType; // snapshot
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariant?: string;
  selectedPeriod?: string;
}
