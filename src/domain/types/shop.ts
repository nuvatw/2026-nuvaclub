export type ProductType = 'plan' | 'event' | 'merchandise';
export type PlanProductType = 'explorer' | 'traveler';
export type PlanBillingCycle = 'monthly' | 'yearly';
export type EventType = 'in-person' | 'online';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'credit-card' | 'bank-transfer' | 'line-pay' | 'apple-pay';

export interface Product {
    id: string;
    type: ProductType;
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    imageUrl: string;
    galleryUrls?: string[];
    isActive: boolean;
    isFeatured: boolean;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductStats {
    id: string;
    productId: string;
    totalRatings: number;
    sumRatings: number;
    avgRating: number;
    totalSold: number;
    totalRevenue: number;
    viewCount: number;
    lastUpdatedAt: Date;
}

export interface PlanProduct {
    id: string;
    productId: string;
    planType: PlanProductType;
    billingCycle: PlanBillingCycle;
    isPopular: boolean;
    isRecommended: boolean;
}

export interface PlanProductFeature {
    id: string;
    planProductId: string;
    feature: string;
    isHighlighted: boolean;
    sortOrder: number;
}

export interface EventProduct {
    id: string;
    productId: string;
    eventType: EventType;
    date: Date;
    endDate?: Date;
    location: string;
    timezone: string;
    capacity: number;
    remainingSeats: number;
    overview: string;
    isLiveQA: boolean;
    registrationDeadline?: Date;
}

export interface EventLearningOutcome {
    id: string;
    eventProductId: string;
    outcome: string;
    sortOrder: number;
}

export interface EventTargetAudience {
    id: string;
    eventProductId: string;
    audience: string;
    sortOrder: number;
}

export interface EventAgendaItem {
    id: string;
    eventProductId: string;
    time: string;
    endTime?: string;
    title: string;
    description?: string;
    speakerName?: string;
    sortOrder: number;
}

export interface EventFAQ {
    id: string;
    eventProductId: string;
    question: string;
    answer: string;
    sortOrder: number;
}

export interface MerchandiseProduct {
    id: string;
    productId: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    requiresShipping: boolean;
}

export interface MerchandiseVariant {
    id: string;
    merchandiseProductId: string;
    name: string;
    sku: string;
    stock: number;
    price?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductReview {
    id: string;
    productId: string;
    userId: string;
    orderId?: string;
    rating: number;
    title?: string;
    content?: string;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Cart {
    id: string;
    userId?: string;
    sessionId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    variantId?: string;
    selectedPeriod?: string;
    priceAtAdd: number;
    addedAt: Date;
    updatedAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    cartId?: string;
    orderNumber: string;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    discountCode?: string;
    tax: number;
    shippingCost: number;
    total: number;
    currency: string;
    paymentMethod?: PaymentMethod;
    paymentIntentId?: string;
    shippingAddress?: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
        country: string;
    };
    customerNotes?: string;
    internalNotes?: string;
    paidAt?: Date;
    processedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    refundedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    variantId?: string;
    productName: string;
    productType: ProductType;
    productImageUrl: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedPeriod?: string;
    createdAt: Date;
}

export interface DiscountCode {
    id: string;
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxUses?: number;
    usedCount: number;
    maxUsesPerUser?: number;
    minOrderAmount?: number;
    applicableProductTypes?: ProductType[];
    validFrom: Date;
    validUntil?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface DiscountCodeUse {
    id: string;
    discountCodeId: string;
    userId: string;
    orderId: string;
    discountAmount: number;
    usedAt: Date;
}
