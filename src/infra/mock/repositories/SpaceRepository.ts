import { ISpaceRepository } from '@/application/ports/ISpaceRepository';
import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';

export class SpaceRepository extends BaseRepository<any> implements ISpaceRepository {
    constructor(db: MockDB) {
        super(db.nunuProfiles as any, db);
    }

    getNunuProfileByUserId(userId: string): any {
        return this.db.nunuProfiles.findFirst({ where: { userId } });
    }

    getNunuStats(profileId: string): any {
        return this.db.nunuStats.findById(profileId);
    }

    getUserCourseEnrollmentCount(userId: string, month: number): number {
        return this.db.userCourseEnrollments.findMany({
            where: (e) => (e.userId === userId && e.isCompleted && e.completedAt?.getMonth() === month) || false
        }).length;
    }
}
