import { NextResponse } from 'next/server';
import { learnService } from '@/app/api/bff/composition';
import { toCourseDTO } from '../mappers';

/**
 * BFF Endpoint for Courses
 * GET /api/bff/learn/courses - List courses with optional filters
 * GET /api/bff/learn/courses?id={id} - Get single course by ID
 * GET /api/bff/learn/courses?featured=true - Get featured courses
 * GET /api/bff/learn/courses?free=true - Get free courses
 * GET /api/bff/learn/courses?category={categoryId} - Get courses by category
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const featured = searchParams.get('featured');
    const free = searchParams.get('free');
    const category = searchParams.get('category');

    try {
        // Single course by ID
        if (id) {
            const course = await learnService.getCourseById(id);
            return course
                ? NextResponse.json(toCourseDTO(course))
                : NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Featured courses
        if (featured === 'true') {
            const courses = await learnService.getFeaturedCourses();
            return NextResponse.json(courses.map(toCourseDTO));
        }

        // Free courses
        if (free === 'true') {
            const courses = await learnService.getFreeCourses();
            return NextResponse.json(courses.map(toCourseDTO));
        }

        // Courses by category
        if (category) {
            const courses = await learnService.getCoursesByCategory(category);
            return NextResponse.json(courses.map(toCourseDTO));
        }

        // All courses
        const courses = await learnService.getAllCourses();
        return NextResponse.json(courses.map(toCourseDTO));
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
