import type { IdentityType } from '@/features/auth/types';

export type SubscriptionPlan = 'explorer' | 'traveler' | 'voyager';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type BillingCycle = 'monthly' | 'yearly';
export type DuoTicketTier = 'go' | 'run' | 'fly';
export type DuoTicketStatus = 'active' | 'expired' | 'cancelled';
export type DuoMonthPassStatus = 'active' | 'expired' | 'upgraded' | 'refunded';
export type FavoriteItemType = 'course' | 'post' | 'companion' | 'product';
export type ActivityType = 'view' | 'like' | 'comment' | 'purchase' | 'complete' | 'submit';
export type ActivityTargetType = 'course' | 'lesson' | 'post' | 'project' | 'product';

/**
 * Core User entity
 */
export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    avatar?: string;
    bio?: string;
    discordId?: string;
    githubUsername?: string;
    identityType: IdentityType;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}

export interface UserSubscription {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    periodStart: Date;
    periodEnd: Date;
    yearlyStartDate?: Date;
    yearlyEndDate?: Date;
    monthsIncluded?: number;
    autoRenew: boolean;
    renewalPrice: number;
    nextBillingDate?: Date;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserDuoTicket {
    id: string;
    userId: string;
    orderId?: string;
    tier: DuoTicketTier;
    status: DuoTicketStatus;
    validFrom: Date;
    validUntil: Date;
    purchasedAt: Date;
    createdAt: Date;
}

export interface DuoMonthPass {
    id: string;
    userId: string;
    orderId?: string;
    month: string;
    tier: DuoTicketTier;
    status: DuoMonthPassStatus;
    upgradedToId?: string;
    maxCompanions: number;
    currentCompanions: number;
    purchasedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserFavorite {
    id: string;
    userId: string;
    itemType: FavoriteItemType;
    itemId: string;
    createdAt: Date;
}

export interface UserActivity {
    id: string;
    userId: string;
    activityType: ActivityType;
    targetType: ActivityTargetType;
    targetId: string;
    metadata?: {
        duration?: number;
        progress?: number;
        source?: string;
        referrer?: string;
    };
    createdAt: Date;
}

export interface UserPoints {
    id: string;
    userId: string;
    totalPoints: number;
    learningPoints: number;
    communityPoints: number;
    dailyLearningPoints: number;
    dailyCommunityPoints: number;
    dailyUpvotePoints: number;
    lastDailyReset: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type PointCategory = 'learning' | 'community';
export type PointActionType =
    | 'post_create'
    | 'reply_create'
    | 'upvote_received'
    | 'downvote_received'
    | 'lesson_complete'
    | 'course_complete'
    | 'quiz_pass';

export interface PointTransaction {
    id: string;
    userId: string;
    category: PointCategory;
    actionType: PointActionType;
    points: number;
    targetType?: string;
    targetId?: string;
    wasCapped: boolean;
    createdAt: Date;
}

export type DuoTransactionType = 'charge' | 'refund' | 'upgrade_charge';

export interface DuoTransaction {
    id: string;
    userId: string;
    passId?: string;
    type: DuoTransactionType;
    amount: number;
    currency: 'TWD';
    month: string;
    tier: DuoTicketTier;
    reason?: string;
    createdAt: Date;
}

export interface MonthlyMatchStatus {
    id: string;
    userId: string;
    month: string;
    matched: boolean;
    matchedAt?: Date;
    matchedWithUserId?: string;
    createdAt: Date;
    updatedAt: Date;
}
