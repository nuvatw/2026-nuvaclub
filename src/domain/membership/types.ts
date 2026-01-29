import { PlanId, UserId } from '../shared/ids';

export type MembershipTier = 'free' | 'explorer' | 'traveler' | 'pro';

export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'none';

export interface MembershipInfo {
    userId: UserId;
    tier: MembershipTier;
    planId?: PlanId;
    status: MembershipStatus;
    validUntil: Date | null;
    isPro: boolean;
}

export interface MembershipServiceInterface {
    getMembership(userId: UserId): Promise<MembershipInfo>;
    hasActivePlan(userId: UserId): Promise<boolean>;
}
