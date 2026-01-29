export type MembershipLevel = 'BASIC' | 'EXPLORER' | 'TRAVELER' | 'PRO';

export interface MembershipGateStatus {
    canViewForum: boolean;
    canViewLearn: boolean;
    canJoinSprint: boolean;
    canAccessSpace: boolean;
}

export interface MembershipNextAction {
    type: 'UPGRADE' | 'RENEW' | 'VERIFY_EMAIL' | 'NONE';
    message: string;
}

export interface MembershipSummaryDTO {
    userId: string;
    level: MembershipLevel;
    validUntil: string | null; // ISO Date string
    isActive: boolean;
    gates: MembershipGateStatus;
    nextAction?: MembershipNextAction;
}
