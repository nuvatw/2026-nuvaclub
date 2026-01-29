import { UserId } from '../shared/ids';
import { MembershipInfo, MembershipServiceInterface } from './types';
import { now, isExpired } from '../shared/time';

// Default implementation
export class MembershipService implements MembershipServiceInterface {

    async getMembership(userId: UserId): Promise<MembershipInfo> {
        // TODO: Connect to real data source (Database/tables/users + Database/tables/plans)
        // For now, return a default 'free' membership
        return {
            userId,
            tier: 'free',
            status: 'none',
            validUntil: null,
            isPro: false,
        };
    }

    async hasActivePlan(userId: UserId): Promise<boolean> {
        const membership = await this.getMembership(userId);
        if (!membership) return false;

        if (membership.status !== 'active') return false;
        if (membership.validUntil && isExpired(membership.validUntil)) return false;

        return true;
    }
}

export const membershipService = new MembershipService();
