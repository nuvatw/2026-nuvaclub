import { ICourseRepository, ILearnRepository } from '../ports';
import { LearnAggregate } from '@/domain/learn/LearnAggregate';
import { Course } from '@/domain/types/learn';

export class LearnService {
    constructor(
        private courseRepository: ICourseRepository,
        private learnRepository: ILearnRepository
    ) { }

    async getAllCourses() {
        await (this.courseRepository as any).db?.initialize();
        const rawCourses = await this.courseRepository.findAll();
        return rawCourses.map(c => (this.courseRepository as any).enrichCourse?.(c) || c);
    }

    async getCourseById(id: string) {
        return this.courseRepository.findById(id);
    }

    async getFeaturedCourses() {
        return this.courseRepository.findFeatured();
    }

    async getFreeCourses() {
        return this.courseRepository.findFree();
    }

    async getCoursesByCategory(categoryId: string) {
        return this.courseRepository.findByCategory(categoryId);
    }

    async getRecentCourses(limit: number = 10) {
        // Assume repository handles enrichment if necessary
        return this.courseRepository.findMany({
            where: { isPublished: true },
            orderBy: { field: 'createdAt', direction: 'desc' },
            limit
        });
    }

    async getCourseProgress(userId: string, courseId: string) {
        const lessons = this.learnRepository.getLessonProgress(userId, courseId);
        const trailer = this.learnRepository.getTrailerProgress(userId, courseId);
        const enrollment = this.learnRepository.getCourseEnrollment(userId, courseId);

        const lessonProgress: Record<string, any> = {};
        lessons.forEach(p => {
            lessonProgress[p.id] = {
                lessonId: p.lessonId,
                watchedSeconds: p.watchedSeconds,
                totalDuration: (p.watchedSeconds / (p.progressPercent / 100)) || 0,
                progressPercent: p.progressPercent,
                isCompleted: p.isCompleted,
                lastWatchedAt: p.lastWatchedAt.toISOString(),
            };
        });

        return {
            courseId,
            lessons: lessonProgress,
            trailer: trailer ? {
                watchedSeconds: trailer.watchedSeconds,
                totalDuration: (trailer.watchedSeconds / (trailer.progressPercent / 100)) || 0,
                progressPercent: trailer.progressPercent,
                isCompleted: trailer.isCompleted,
                lastWatchedAt: trailer.lastWatchedAt.toISOString(),
            } : null,
            lastWatched: enrollment?.currentLessonId ? {
                lessonId: enrollment.currentLessonId,
                timestamp: enrollment.lastAccessedAt.toISOString()
            } : null
        };
    }

    async saveProgress(userId: string, data: {
        courseId: string,
        lessonId?: string,
        watchedSeconds: number,
        totalDuration: number,
        type?: 'trailer' | 'lesson'
    }) {
        const { courseId, lessonId, watchedSeconds, totalDuration, type } = data;
        const now = new Date();
        const progressPercent = totalDuration > 0 ? Math.min(100, (watchedSeconds / totalDuration) * 100) : 0;
        const isCompleted = progressPercent >= 90;

        // Upsert enrollment
        let enrollment = this.learnRepository.getCourseEnrollment(userId, courseId);
        if (!enrollment) {
            enrollment = this.learnRepository.upsertEnrollment(userId, courseId, {
                progressPercent: 0,
                isCompleted: false,
                enrolledAt: now,
                lastAccessedAt: now,
                updatedAt: now
            });
        }

        if (type === 'trailer') {
            this.learnRepository.upsertTrailerProgress(userId, courseId, {
                watchedSeconds,
                progressPercent,
                isCompleted,
                lastWatchedAt: now,
                updatedAt: now
            });
        } else if (lessonId) {
            this.learnRepository.upsertLessonProgress(userId, lessonId, enrollment.id, {
                watchedSeconds,
                progressPercent,
                isCompleted,
                lastWatchedAt: now,
                updatedAt: now
            });

            // Update enrollment last accessed
            this.learnRepository.upsertEnrollment(userId, courseId, {
                currentLessonId: lessonId,
                lastAccessedAt: now,
                updatedAt: now
            });
        }

        return this.getCourseProgress(userId, courseId);
    }

    async getLearnHomeData(userId?: string) {
        // Ensure Database is initialized (especially on server-side/BFF)
        await (this.courseRepository as any).db?.initialize();

        const rawCourses = await this.courseRepository.findAll();
        // Enrich courses with relations (trailer, chapters, etc.)
        const courses = rawCourses.map(c => (this.courseRepository as any).enrichCourse?.(c) || c);

        const enrollments = userId ? await this.learnRepository.getUserEnrollments(userId) : [];

        const aggregate = new LearnAggregate(courses as any, enrollments);

        const REQUIRED_SERIES_ORDER = [
            'ChatGPT',
            'Make',
            'n8n',
            'Midjourney',
            'Stable Diffusion',
            'Gemini'
        ];

        return {
            heroCourse: aggregate.getHeroCourse(),
            sections: aggregate.getSections(REQUIRED_SERIES_ORDER)
        };
    }

    async resetProgress(userId: string, courseId: string) {
        this.learnRepository.deleteProgress(userId, courseId);
    }
}
