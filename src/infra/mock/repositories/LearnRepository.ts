import { ILearnRepository } from '@/application/ports/ILearnRepository';
import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type { UserCourseEnrollment, UserLessonProgress, UserTrailerProgress } from '@/domain/types/learn';

export class LearnRepository extends BaseRepository<any> implements ILearnRepository {
    constructor(db: MockDB) {
        super(db.userCourseEnrollments as any, db);
    }

    getLessonProgress(userId: string, courseId: string): UserLessonProgress[] {
        return this.db.userLessonProgress.findMany({
            where: (p) => p.userId === userId && p.lessonId.startsWith(courseId),
        }) as any;
    }

    getTrailerProgress(userId: string, courseId: string): UserTrailerProgress | undefined {
        return this.db.userTrailerProgress.findFirst({
            where: { userId, courseId },
        }) as any;
    }

    getCourseEnrollment(userId: string, courseId: string): UserCourseEnrollment | undefined {
        return this.db.userCourseEnrollments.findFirst({
            where: { userId, courseId },
        }) as any;
    }

    getUserEnrollments(userId: string): UserCourseEnrollment[] {
        return this.db.userCourseEnrollments.findMany({
            where: { userId },
        }) as any;
    }

    upsertEnrollment(userId: string, courseId: string, data: Partial<UserCourseEnrollment>): UserCourseEnrollment {
        const existing = this.getCourseEnrollment(userId, courseId);
        if (existing) {
            const updated = this.db.userCourseEnrollments.update(existing.id, data as any);
            this.persist();
            return updated as any;
        } else {
            const created = this.db.userCourseEnrollments.create({
                ...data,
                userId,
                courseId,
            } as any);
            this.persist();
            return created as any;
        }
    }

    upsertLessonProgress(userId: string, lessonId: string, enrollmentId: string, data: Partial<UserLessonProgress>): UserLessonProgress {
        const existing = this.db.userLessonProgress.findFirst({
            where: { userId, lessonId },
        });
        if (existing) {
            const updated = this.db.userLessonProgress.update(existing.id, data as any);
            this.persist();
            return updated as any;
        } else {
            const created = this.db.userLessonProgress.create({
                ...data,
                userId,
                lessonId,
                enrollmentId,
            } as any);
            this.persist();
            return created as any;
        }
    }

    upsertTrailerProgress(userId: string, courseId: string, data: Partial<UserTrailerProgress>): UserTrailerProgress {
        const existing = this.getTrailerProgress(userId, courseId);
        if (existing) {
            const updated = this.db.userTrailerProgress.update((existing as any).id, data as any);
            this.persist();
            return updated as any;
        } else {
            const created = this.db.userTrailerProgress.create({
                ...data,
                userId,
                courseId,
            } as any);
            this.persist();
            return created as any;
        }
    }

    deleteProgress(userId: string, courseId: string): void {
        this.db.userLessonProgress.deleteMany((p) => p.userId === userId && p.lessonId.startsWith(courseId));
        const trailer = this.db.userTrailerProgress.findFirst({ where: { userId, courseId } });
        if (trailer) this.db.userTrailerProgress.delete(trailer.id);
        const enrollment = this.db.userCourseEnrollments.findFirst({ where: { userId, courseId } });
        if (enrollment) this.db.userCourseEnrollments.delete(enrollment.id);
        this.persist();
    }
}
