// ============================================================================
// USER MODULE - Database Schema
// Following 3NF Normalization Principles
// ============================================================================

import type { IdentityType } from '@/features/auth/types';

// ==========================================
// ENUMS & TYPES
// ==========================================
export type SubscriptionPlan = 'explorer' | 'traveler' | 'voyager';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type BillingCycle = 'monthly' | 'yearly';
export type DuoTicketTier = 'go' | 'run' | 'fly';
export type DuoTicketStatus = 'active' | 'expired' | 'cancelled';
export type DuoMonthPassStatus = 'active' | 'expired' | 'upgraded' | 'refunded';
export type FavoriteItemType = 'course' | 'post' | 'companion' | 'product';
export type ActivityType = 'view' | 'like' | 'comment' | 'purchase' | 'complete' | 'submit';
export type ActivityTargetType = 'course' | 'lesson' | 'post' | 'project' | 'product';

// ==========================================
// USERS TABLE
// Primary user entity - core identity information
// ==========================================
export interface UserRecord {
  // Primary Key
  id: string;

  // Authentication
  email: string;
  emailVerified: boolean;

  // Profile Information
  name: string;
  avatar?: string;
  bio?: string;

  // Social Links
  discordId?: string;
  githubUsername?: string;

  // Membership Level (derived from active subscription/ticket)
  identityType: IdentityType;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// Index: email (unique), identityType, createdAt

// ==========================================
// USER SUBSCRIPTIONS TABLE
// Tracks subscription plans (Explorer/Traveler/Voyager)
// ==========================================
export interface UserSubscriptionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Subscription Details
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;

  // Billing Period
  periodStart: Date;
  periodEnd: Date;

  // For yearly subscriptions
  yearlyStartDate?: Date;
  yearlyEndDate?: Date;
  monthsIncluded?: number; // 12 for yearly

  // Renewal tracking
  autoRenew: boolean;
  renewalPrice: number;
  nextBillingDate?: Date;

  // Lifecycle Timestamps
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Index: userId, status, periodEnd

// ==========================================
// USER DUO TICKETS TABLE
// Tracks Duo membership tickets (Go/Run/Fly)
// ==========================================
export interface UserDuoTicketRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  orderId?: string; // FK -> orders.id

  // Ticket Details
  tier: DuoTicketTier;
  status: DuoTicketStatus;

  // Validity Period
  validFrom: Date;
  validUntil: Date;

  // Timestamps
  purchasedAt: Date;
  createdAt: Date;
}

// Index: userId, status, tier, validUntil

// ==========================================
// DUO MONTH PASSES TABLE
// Tracks Duo passes for specific months
// ==========================================
export interface DuoMonthPassRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  orderId?: string; // FK -> orders.id

  // Month specification (YYYY-MM format)
  month: string; // e.g., "2026-03"

  // Tier for this specific month
  tier: DuoTicketTier;

  // Status
  status: DuoMonthPassStatus;

  // If upgraded, reference to new pass
  upgradedToId?: string;

  // Matching capacity for this month
  maxCompanions: number; // Based on tier: 1/5/999 (999 for unlimited)
  currentCompanions: number;

  // Timestamps
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Index: userId, month, tier, status
// Unique Index: (userId, month) - one pass per month per user (latest tier wins)

// ==========================================
// USER FAVORITES TABLE
// Junction table for user favorited items
// ==========================================
export interface UserFavoriteRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Polymorphic Reference
  itemType: FavoriteItemType;
  itemId: string; // FK -> respective table based on itemType

  // Timestamps
  createdAt: Date;
}

// Unique Index: (userId, itemType, itemId)
// Index: userId, itemType

// ==========================================
// USER ACTIVITIES TABLE
// Analytics and activity tracking
// ==========================================
export interface UserActivityRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Activity Details
  activityType: ActivityType;
  targetType: ActivityTargetType;
  targetId: string; // FK -> respective table based on targetType

  // Additional Context (structured)
  metadata?: {
    duration?: number; // Time spent in seconds
    progress?: number; // Progress percentage
    source?: string; // Where the activity originated
    referrer?: string; // Previous page/action
  };

  // Timestamps
  createdAt: Date;
}

// Index: userId, activityType, targetType, createdAt

// ==========================================
// USER POINTS TABLE
// Tracks user reputation and points
// ==========================================
export interface UserPointsRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Accumulated Points
  totalPoints: number;
  learningPoints: number;
  communityPoints: number;

  // Daily Caps (reset at midnight UTC)
  dailyLearningPoints: number;
  dailyCommunityPoints: number;
  dailyUpvotePoints: number; // Sub-cap of community points

  // Last daily reset timestamp
  lastDailyReset: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: userId (unique), totalPoints

// ==========================================
// POINT TRANSACTIONS TABLE
// Audit log for all point changes
// ==========================================
export type PointCategory = 'learning' | 'community';
export type PointActionType =
  | 'post_create'
  | 'reply_create'
  | 'upvote_received'
  | 'downvote_received'
  | 'lesson_complete'
  | 'course_complete'
  | 'quiz_pass';

export interface PointTransactionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Transaction Details
  category: PointCategory;
  actionType: PointActionType;
  points: number; // Can be negative for downvotes

  // Target Reference (what triggered the transaction)
  targetType?: string; // 'post', 'comment', 'lesson', 'course', 'quiz'
  targetId?: string;

  // Capping info
  wasCapped: boolean;

  // Timestamps
  createdAt: Date;
}

// Index: userId, category, actionType, createdAt

// ==========================================
// DUO TRANSACTIONS TABLE
// Simulated charge/refund ledger for Duo Pass purchases
// ==========================================
export type DuoTransactionType = 'charge' | 'refund' | 'upgrade_charge';

export interface DuoTransactionRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  passId?: string; // FK -> duoMonthPasses.id

  // Transaction Details
  type: DuoTransactionType;
  amount: number; // Integer (NT$)
  currency: 'TWD';

  // Context
  month: string; // YYYY-MM
  tier: DuoTicketTier;
  reason?: string; // e.g., "Automatic refund - no match before month start"

  // Timestamps
  createdAt: Date;
}

// Index: userId, type, month, createdAt

// ==========================================
// MONTHLY MATCH STATUS TABLE
// Tracks whether user has a valid match for each purchased month
// Used for automatic refund processing
// ==========================================
export interface MonthlyMatchStatusRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id

  // Month specification
  month: string; // YYYY-MM

  // Match status
  matched: boolean;
  matchedAt?: Date; // When the match was confirmed
  matchedWithUserId?: string; // FK -> users.id (the Nunu)

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, month)
// Index: userId, matched, month
