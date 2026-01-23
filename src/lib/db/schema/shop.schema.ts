// ============================================================================
// SHOP MODULE - Database Schema
// Products, orders, carts, and e-commerce functionality
// Following 3NF Normalization Principles
// ============================================================================

// ==========================================
// ENUMS & TYPES
// ==========================================
export type ProductType = 'plan' | 'duo-ticket' | 'event' | 'merchandise';
export type PlanProductType = 'explorer' | 'traveler';
export type PlanBillingCycle = 'monthly' | 'yearly';
export type DuoTicketProductType = 'go' | 'run' | 'fly';
export type DuoTicketDuration = 'month' | 'quarter';
export type EventType = 'in-person' | 'online';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'credit-card' | 'bank-transfer' | 'line-pay' | 'apple-pay';

// ==========================================
// PRODUCTS TABLE (Polymorphic Base)
// Base product information - type-specific details in separate tables
// ==========================================
export interface ProductRecord {
  // Primary Key
  id: string;

  // Product Type Discriminator
  type: ProductType;

  // Basic Information
  name: string;
  description: string;
  shortDescription?: string;

  // Pricing
  price: number; // In smallest currency unit (cents/TWD)
  originalPrice?: number; // For showing discounts
  currency: string; // e.g., "TWD"

  // Media
  imageUrl: string;
  galleryUrls?: string[]; // Additional images

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // SEO
  slug: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: slug
// Index: type, isActive, isFeatured

// ==========================================
// PRODUCT STATS TABLE
// Denormalized statistics for products
// ==========================================
export interface ProductStatsRecord {
  // Primary Key
  id: string; // Same as productId for 1:1 relationship

  // Foreign Keys
  productId: string; // FK -> products.id

  // Rating Statistics
  totalRatings: number;
  sumRatings: number;
  avgRating: number; // Computed: sumRatings / totalRatings

  // Sales Statistics
  totalSold: number;
  totalRevenue: number;

  // View Statistics
  viewCount: number;

  // Timestamps
  lastUpdatedAt: Date;
}

// Primary Key: productId

// ==========================================
// PLAN PRODUCTS TABLE
// Subscription plan details
// ==========================================
export interface PlanProductRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  productId: string; // FK -> products.id

  // Plan Details
  planType: PlanProductType;
  billingCycle: PlanBillingCycle;

  // Flags
  isPopular: boolean;
  isRecommended: boolean;
}

// Unique Index: (planType, billingCycle)
// Index: productId

// ==========================================
// PLAN PRODUCT FEATURES TABLE (Junction)
// Features included in plan - 1NF compliance
// ==========================================
export interface PlanProductFeatureRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  planProductId: string; // FK -> plan_products.id

  // Data
  feature: string;
  isHighlighted: boolean;
  sortOrder: number;
}

// Index: planProductId, sortOrder

// ==========================================
// DUO TICKET PRODUCTS TABLE
// Duo ticket details
// ==========================================
export interface DuoTicketProductRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  productId: string; // FK -> products.id

  // Ticket Details
  ticketType: DuoTicketProductType;
  duration: DuoTicketDuration;
  companionSlots: number; // Number of companions included
}

// Unique Index: (ticketType, duration)
// Index: productId

// ==========================================
// DUO TICKET PRODUCT BENEFITS TABLE (Junction)
// Benefits included in ticket - 1NF compliance
// ==========================================
export interface DuoTicketProductBenefitRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  duoTicketProductId: string; // FK -> duo_ticket_products.id

  // Data
  benefit: string;
  sortOrder: number;
}

// Index: duoTicketProductId, sortOrder

// ==========================================
// EVENT PRODUCTS TABLE
// Event/workshop details
// ==========================================
export interface EventProductRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  productId: string; // FK -> products.id

  // Event Details
  eventType: EventType;
  date: Date;
  endDate?: Date;
  location: string;
  timezone: string;

  // Capacity
  capacity: number;
  remainingSeats: number;

  // Content
  overview: string;
  isLiveQA: boolean;

  // Timestamps
  registrationDeadline?: Date;
}

// Index: productId, eventType, date

// ==========================================
// EVENT WHAT YOU WILL LEARN TABLE (Junction)
// Learning outcomes - 1NF compliance
// ==========================================
export interface EventLearningOutcomeRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  eventProductId: string; // FK -> event_products.id

  // Data
  outcome: string;
  sortOrder: number;
}

// Index: eventProductId, sortOrder

// ==========================================
// EVENT WHO IS IT FOR TABLE (Junction)
// Target audience - 1NF compliance
// ==========================================
export interface EventTargetAudienceRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  eventProductId: string; // FK -> event_products.id

  // Data
  audience: string;
  sortOrder: number;
}

// Index: eventProductId, sortOrder

// ==========================================
// EVENT AGENDA ITEMS TABLE
// Event schedule/agenda
// ==========================================
export interface EventAgendaItemRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  eventProductId: string; // FK -> event_products.id

  // Agenda Details
  time: string; // e.g., "09:00"
  endTime?: string; // e.g., "10:00"
  title: string;
  description?: string;
  speakerName?: string;

  // Ordering
  sortOrder: number;
}

// Index: eventProductId, sortOrder

// ==========================================
// EVENT FAQS TABLE
// Frequently asked questions
// ==========================================
export interface EventFAQRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  eventProductId: string; // FK -> event_products.id

  // FAQ Content
  question: string;
  answer: string;

  // Ordering
  sortOrder: number;
}

// Index: eventProductId, sortOrder

// ==========================================
// MERCHANDISE PRODUCTS TABLE
// Physical merchandise details
// ==========================================
export interface MerchandiseProductRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  productId: string; // FK -> products.id

  // Shipping Info
  weight?: number; // grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // Flags
  requiresShipping: boolean;
}

// Index: productId

// ==========================================
// MERCHANDISE VARIANTS TABLE
// Size/color variants for merchandise
// ==========================================
export interface MerchandiseVariantRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  merchandiseProductId: string; // FK -> merchandise_products.id

  // Variant Details
  name: string; // e.g., "S", "M", "L", "Red", "Blue"
  sku: string;
  stock: number;
  price?: number; // Override base price if different

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: sku
// Index: merchandiseProductId, isActive

// ==========================================
// PRODUCT REVIEWS TABLE
// User reviews for products
// ==========================================
export interface ProductReviewRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  productId: string; // FK -> products.id
  userId: string; // FK -> users.id
  orderId?: string; // FK -> orders.id (for verified purchase)

  // Review Content
  rating: number; // 1-5
  title?: string;
  content?: string;

  // Verification
  isVerifiedPurchase: boolean;

  // Moderation
  isApproved: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, productId) - one review per user per product
// Index: productId, rating, isApproved

// ==========================================
// CARTS TABLE
// Shopping carts for users and guests
// ==========================================
export interface CartRecord {
  // Primary Key
  id: string;

  // Owner (one of these should be set)
  userId?: string; // FK -> users.id (logged in user)
  sessionId?: string; // For guest carts

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For guest cart cleanup
}

// Index: userId, sessionId, isActive

// ==========================================
// CART ITEMS TABLE
// Items in shopping cart
// ==========================================
export interface CartItemRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  cartId: string; // FK -> carts.id
  productId: string; // FK -> products.id

  // Item Details
  quantity: number;

  // Variant Selection (for applicable products)
  variantId?: string; // FK -> merchandise_variants.id
  selectedPeriod?: string; // For duo tickets (month/quarter)

  // Price Snapshot (at time of adding)
  priceAtAdd: number;

  // Timestamps
  addedAt: Date;
  updatedAt: Date;
}

// Unique Index: (cartId, productId, variantId) - one entry per product variant
// Index: cartId

// ==========================================
// ORDERS TABLE
// Completed orders
// ==========================================
export interface OrderRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  cartId?: string; // FK -> carts.id (source cart)

  // Order Identification
  orderNumber: string; // e.g., "ORD-2026-00001"

  // Status
  status: OrderStatus;

  // Pricing
  subtotal: number;
  discount: number;
  discountCode?: string;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;

  // Payment
  paymentMethod?: PaymentMethod;
  paymentIntentId?: string; // External payment reference

  // Shipping (for merchandise)
  shippingAddress?: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };

  // Notes
  customerNotes?: string;
  internalNotes?: string;

  // Lifecycle Timestamps
  paidAt?: Date;
  processedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: orderNumber
// Index: userId, status, createdAt

// ==========================================
// ORDER ITEMS TABLE
// Line items in an order (snapshot at purchase time)
// ==========================================
export interface OrderItemRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  orderId: string; // FK -> orders.id
  productId: string; // FK -> products.id (reference)
  variantId?: string; // FK -> merchandise_variants.id (reference)

  // Product Snapshot (at time of order)
  productName: string;
  productType: ProductType;
  productImageUrl: string;

  // Variant Snapshot
  variantName?: string;

  // Pricing
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  // Selection Details
  selectedPeriod?: string; // For duo tickets

  // Timestamps
  createdAt: Date;
}

// Index: orderId, productId

// ==========================================
// DISCOUNT CODES TABLE
// Promotional discount codes
// ==========================================
export interface DiscountCodeRecord {
  // Primary Key
  id: string;

  // Code
  code: string;
  description?: string;

  // Discount Configuration
  discountType: 'percentage' | 'fixed';
  discountValue: number; // Percentage or fixed amount

  // Usage Limits
  maxUses?: number;
  usedCount: number;
  maxUsesPerUser?: number;

  // Restrictions
  minOrderAmount?: number;
  applicableProductTypes?: ProductType[];

  // Validity
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: code
// Index: isActive, validFrom, validUntil

// ==========================================
// DISCOUNT CODE USES TABLE
// Track usage of discount codes
// ==========================================
export interface DiscountCodeUseRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  discountCodeId: string; // FK -> discount_codes.id
  userId: string; // FK -> users.id
  orderId: string; // FK -> orders.id

  // Discount Applied
  discountAmount: number;

  // Timestamps
  usedAt: Date;
}

// Index: discountCodeId, userId
