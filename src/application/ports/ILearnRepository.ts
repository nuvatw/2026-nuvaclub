import { UserCourseEnrollment, UserLessonProgress, UserTrailerProgress } from '@/domain/types/learn';

export interface ILearnRepository {
    getLessonProgress(userId: string, courseId: string): UserLessonProgress[];
    getTrailerProgress(userId: string, courseId: string): UserTrailerProgress | undefined;
    getCourseEnrollment(userId: string, courseId: string): UserCourseEnrollment | undefined;
    getUserEnrollments(userId: string): UserCourseEnrollment[];

    upsertEnrollment(userId: string, courseId: string, data: Partial<UserCourseEnrollment>): UserCourseEnrollment;
    upsertLessonProgress(userId: string, lessonId: string, enrollmentId: string, data: Partial<UserLessonProgress>): UserLessonProgress;
    upsertTrailerProgress(userId: string, courseId: string, data: Partial<UserTrailerProgress>): UserTrailerProgress;

    deleteProgress(userId: string, courseId: string): void;
}
