import { UserId } from '../shared/ids';
import { EntitlementStatus, EntitlementType } from './types';
import { now, isExpired } from '../shared/time';

export class EntitlementService {
    async getEntitlementStatus(userId: UserId, type: EntitlementType): Promise<EntitlementStatus> {
        // TODO: Fetch entitlements from DB

        // Mock response
        return {
            hasEntitlement: false,
            remainingDays: 0,
            expiresAt: null
        };
    }
}

export const entitlementService = new EntitlementService();
