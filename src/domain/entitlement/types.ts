import { EntitlementId, UserId } from '../shared/ids';

export type EntitlementType = 'duo_month_pass' | 'annual_pass' | 'sprint_entry';

export interface Entitlement {
    id: EntitlementId;
    userId: UserId;
    type: EntitlementType;
    grantedAt: Date;
    expiresAt: Date | null;
    isActive: boolean;
}

export interface EntitlementStatus {
    hasEntitlement: boolean;
    remainingDays: number;
    expiresAt: Date | null;
}
