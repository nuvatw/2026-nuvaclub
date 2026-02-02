import { MembershipId, OrderId, UserId } from '../shared/ids';

export type MembershipTier = 'free' | 'explorer' | 'traveler' | 'pro' | 'tier-1' | 'tier-2' | 'tier-3';
export type MembershipStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface MemberCard {
    memberNo: string;
    tier: MembershipTier;
    fullName: string;
    email: string;
    issueDate: Date;
}

export class Membership {
    constructor(
        public readonly id: MembershipId,
        public readonly memberNo: string,
        public readonly orderId: OrderId,
        public readonly tier: MembershipTier,
        public readonly validUntil: Date,
        private _status: MembershipStatus,
        public readonly userId?: UserId,
        public readonly cardMetadata?: MemberCard,
        public readonly createdAt: Date = new Date()
    ) { }

    get status(): MembershipStatus {
        return this._status;
    }

    isActive(): boolean {
        return this._status === 'ACTIVE' && this.validUntil > new Date();
    }

    cancel(): void {
        this._status = 'CANCELLED';
    }

    expire(): void {
        this._status = 'EXPIRED';
    }

    static create(
        id: MembershipId,
        memberNo: string,
        orderId: OrderId,
        tier: MembershipTier,
        months: number,
        fullName: string,
        email: string,
        userId?: UserId
    ): Membership {
        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + months);

        const cardMetadata: MemberCard = {
            memberNo,
            tier,
            fullName,
            email,
            issueDate: new Date()
        };

        return new Membership(
            id,
            memberNo,
            orderId,
            tier,
            validUntil,
            'ACTIVE',
            userId,
            cardMetadata
        );
    }
}

export interface MembershipRepository {
    save(membership: Membership): Promise<void>;
    saveAll(memberships: Membership[]): Promise<void>;
    findByMemberNo(memberNo: string): Promise<Membership | null>;
    findByEmail(email: string): Promise<Membership[]>;
    count(): Promise<number>;
    deleteAll(): Promise<void>;
}
