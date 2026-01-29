import { MembershipSummaryDTO } from '../dtos/MembershipSummaryDTO';
import { Ids } from '@/domain/shared/ids';
import { membershipService } from '@/domain/membership/MembershipService';

// In a real implementation, this would inject repositories
export class GetMembershipSummaryService {
    async execute(userId: string): Promise<MembershipSummaryDTO> {
        const domainUserId = Ids.User(userId);
        const membership = await membershipService.getMembership(domainUserId);

        // Map Domain Entity -> Application DTO
        // This isolates the UI from Domain structure changes

        // Simple mapping logic for Phase 1
        // (In future this would use GateEngine to determine gates)
        const levelMap: Record<string, MembershipSummaryDTO['level']> = {
            'free': 'BASIC',
            'explorer': 'EXPLORER',
            'traveler': 'TRAVELER',
            'pro': 'PRO'
        };

        const level = levelMap[membership.tier] || 'BASIC';
        const isActive = membership.status === 'active';

        return {
            userId: membership.userId,
            level,
            validUntil: membership.validUntil ? membership.validUntil.toISOString() : null,
            isActive,
            gates: {
                canViewForum: level !== 'BASIC',
                canViewLearn: true, // Everyone sees Learn, content is gated inside
                canJoinSprint: level === 'PRO' || level === 'TRAVELER',
                canAccessSpace: isActive
            },
            nextAction: isActive
                ? undefined
                : { type: 'UPGRADE', message: 'Upgrade to join the club' }
        };
    }
}

export const getMembershipSummaryService = new GetMembershipSummaryService();
