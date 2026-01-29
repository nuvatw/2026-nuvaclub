import { NextResponse } from 'next/server';
import { getAllCourses, getCourseById, getFeaturedCourses, getFreeCourses, getCoursesByCategory } from '@/lib/legacy-db-shim';

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
            const course = getCourseById(id);
            return course
                ? NextResponse.json(course)
                : NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Featured courses
        if (featured === 'true') {
            const courses = getFeaturedCourses();
            return NextResponse.json(courses);
        }

        // Free courses
        if (free === 'true') {
            const courses = getFreeCourses();
            return NextResponse.json(courses);
        }

        // Courses by category
        if (category) {
            const courses = getCoursesByCategory(category);
            return NextResponse.json(courses);
        }

        // All courses
        const courses = getAllCourses();
        return NextResponse.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
