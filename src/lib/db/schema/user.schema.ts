import type { IdentityType } from '@/features/auth/types';

// ==========================================
// Users Table
// ==========================================
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string; // Self-introduction (visible on profile)
  discordId?: string; // Discord username for contact
  identityType: IdentityType;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ==========================================
// User Subscriptions Table
// ==========================================
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type PlanType = 'explorer' | 'traveler';
export type BillingCycle = 'monthly' | 'yearly';

export interface UserSubscriptionRecord {
  id: string;
  userId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  createdAt: Date;
}

// ==========================================
// Duo Tickets Table
// ==========================================
export type DuoTicketType = 'go' | 'run' | 'fly';
export type DuoTicketStatus = 'active' | 'expired' | 'cancelled';

export interface DuoTicketRecord {
  id: string;
  userId: string;
  ticketType: DuoTicketType;
  status: DuoTicketStatus;
  validFrom: Date;
  validUntil: Date;
  purchasedAt: Date;
  orderId?: string;
}

// ==========================================
// User Favorites Table
// ==========================================
export type FavoriteItemType = 'course' | 'post' | 'companion' | 'product';

export interface UserFavoriteRecord {
  id: string;
  userId: string;
  itemType: FavoriteItemType;
  itemId: string;
  addedAt: Date;
}

// ==========================================
// User Activities Table (for analytics)
// ==========================================
export type ActivityType = 'view' | 'like' | 'comment' | 'purchase' | 'complete' | 'submit';
export type ActivityTargetType = 'course' | 'lesson' | 'post' | 'project' | 'product';

export interface UserActivityRecord {
  id: string;
  userId: string;
  activityType: ActivityType;
  targetType: ActivityTargetType;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
