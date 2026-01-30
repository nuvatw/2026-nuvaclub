import { ISpaceRepository } from '../ports';
import { SprintAggregate, NunuLevel } from '@/domain/sprint/SprintAggregate';

export class SprintService {
    constructor(private spaceRepository: ISpaceRepository) { }

    async getMemberSprintStatus(userId: string) {
        const profile = this.spaceRepository.getNunuProfileByUserId(userId);
        const stats = profile ? this.spaceRepository.getNunuStats(profile.id) : null;

        // Fetch monthly activity via repository
        const coursesThisMonth = this.spaceRepository.getUserCourseEnrollmentCount(userId, new Date().getMonth());

        // Reconstitute aggregate
        const aggregate = SprintAggregate.reconstitute({
            userId,
            currentNunuLevel: this.mapInfraToDomainLevel(profile?.level),
            vavaLevel: 5, // Should come from a 'LevelRecord' or 'UserPointsRecord'
            totalMentored: stats?.totalMentorships || 0,
            missionStreak: 3, // Mocked for now, should come from historical mission completion records
            coursesCompletedThisMonth: coursesThisMonth,
            forumPostsThisMonth: 0,
            forumCommentsThisMonth: 0,
            activeMenteesCount: stats?.currentVavaCount || 0,
        });

        return {
            ...aggregate.toJSON(),
            isEligible: aggregate.canUnlockNext(),
            eligibilityResults: {
                'Nx': aggregate.getApplicationRequirements('Nx'),
                'N-5': aggregate.getApplicationRequirements('N-5'),
                'N-4': aggregate.getApplicationRequirements('N-4'),
                'N-3': aggregate.getApplicationRequirements('N-3'),
                'N-2': aggregate.getApplicationRequirements('N-2'),
                'N-1': aggregate.getApplicationRequirements('N-1'),
            },
            missionStatus: {
                'Nx': aggregate.getMissionStatus('Nx'),
                'N-5': aggregate.getMissionStatus('N-5'),
                'N-4': aggregate.getMissionStatus('N-4'),
                'N-3': aggregate.getMissionStatus('N-3'),
                'N-2': aggregate.getMissionStatus('N-2'),
                'N-1': aggregate.getMissionStatus('N-1'),
            }
        };
    }

    private mapInfraToDomainLevel(level?: string): NunuLevel | null {
        if (!level) return null;
        if (level === 'N5') return 'N-5';
        if (level === 'N4') return 'N-4';
        if (level === 'N3') return 'N-3';
        if (level === 'N2') return 'N-2';
        if (level === 'N1') return 'N-1';
        return null;
    }
}
