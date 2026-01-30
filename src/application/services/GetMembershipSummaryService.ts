import { MembershipSummaryDTO } from '../dtos/MembershipSummaryDTO';
import { IUserRepository } from '../ports';

export class GetMembershipSummaryService {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<MembershipSummaryDTO> {
        const user = this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const subscription = this.userRepository.getActiveSubscription(userId);
        const DuoTicket = this.userRepository.getActiveDuoTicket(userId);

        // Simple mapping logic for Phase 1
        const levelMap: Record<string, MembershipSummaryDTO['level']> = {
            'explorer': 'EXPLORER',
            'traveler': 'TRAVELER',
            'pro': 'PRO'
        };

        const level = subscription ? (levelMap[subscription.plan] || 'BASIC') : 'BASIC';
        const isActive = !!subscription && subscription.status === 'active';

        return {
            userId: user.id,
            level,
            validUntil: subscription?.periodEnd ? subscription.periodEnd.toISOString() : null,
            isActive,
            gates: {
                canViewForum: level !== 'BASIC',
                canViewLearn: true, // Everyone sees Learn, content is gated inside
                canJoinSprint: level === 'PRO' || level === 'TRAVELER',
                canAccessSpace: isActive || !!DuoTicket
            },
            nextAction: (isActive || !!DuoTicket)
                ? undefined
                : { type: 'UPGRADE', message: 'Upgrade to join the club' }
        };
    }
}
