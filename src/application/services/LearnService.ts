import { getAllCourses, getRecentCourses } from '@/lib/legacy-db-shim';

export class LearnService {
    async getAllCourses() {
        return getAllCourses();
    }

    async getRecentCourses() {
        return getRecentCourses();
    }
}

export const learnService = new LearnService();
