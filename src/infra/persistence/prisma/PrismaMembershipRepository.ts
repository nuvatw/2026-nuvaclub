import { Membership, MembershipRepository } from '../../../domain/membership/Membership';
import { prisma } from './client';
import { Ids } from '../../../domain/shared/ids';

export class PrismaMembershipRepository implements MembershipRepository {
    async save(membership: Membership): Promise<void> {
        await prisma.membership.upsert({
            where: { memberNo: membership.memberNo },
            update: {
                status: membership.status,
                validUntil: membership.validUntil,
                cardMetadata: membership.cardMetadata as any,
                userId: membership.userId,
            },
            create: {
                id: membership.id,
                memberNo: membership.memberNo,
                orderId: membership.orderId,
                tier: membership.tier,
                validUntil: membership.validUntil,
                status: membership.status,
                userId: membership.userId,
                cardMetadata: membership.cardMetadata as any,
                createdAt: membership.createdAt,
            },
        });
    }

    async saveAll(memberships: Membership[]): Promise<void> {
        // Simple implementation using map and Promise.all for now
        // In production, we might want to use createMany or a transaction
        await Promise.all(memberships.map(m => this.save(m)));
    }

    async findByMemberNo(memberNo: string): Promise<Membership | null> {
        const data = await prisma.membership.findUnique({
            where: { memberNo },
        });

        if (!data) return null;

        return new Membership(
            Ids.Membership(data.id),
            data.memberNo,
            Ids.Order(data.orderId),
            data.tier as any,
            data.validUntil,
            data.status as any,
            (data.userId as any) || undefined,
            (data.cardMetadata as any) || undefined,
            data.createdAt
        );
    }
}
