import { getAllCourses, getRecentCourses } from '@/Database';

export class LearnService {
    async getAllCourses() {
        return getAllCourses();
    }

    async getRecentCourses() {
        return getRecentCourses();
    }
}

export const learnService = new LearnService();
