import { NextResponse } from 'next/server';
import { learnService } from '@/app/api/bff/composition';
import { toCourseDTO } from '../mappers';
import { getLocaleFromHeaders } from '@/content/i18n';
import { contentService } from '@/content/services/ContentService';

/**
 * BFF Endpoint for Courses
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const featured = searchParams.get('featured');
    const free = searchParams.get('free');
    const category = searchParams.get('category');

    const locale = getLocaleFromHeaders(new Headers(request.headers));

    try {
        // Single course by ID
        if (id) {
            const course = await learnService.getCourseById(id);
            if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

            // Attempt to get localized content
            const localizedContent = await contentService.getContent<any>(`course.${course.slug || id}`, locale);
            const dto = toCourseDTO(course);

            if (localizedContent) {
                dto.title = localizedContent.title || dto.title;
                dto.description = localizedContent.description || dto.description;
            }

            return NextResponse.json(dto);
        }

        // Handle list of courses (batch localization if needed)
        let courses = [];
        if (featured === 'true') {
            courses = await learnService.getFeaturedCourses();
        } else if (free === 'true') {
            courses = await learnService.getFreeCourses();
        } else if (category) {
            courses = await learnService.getCoursesByCategory(category);
        } else {
            courses = await learnService.getAllCourses();
        }

        const dtos = await Promise.all(courses.map(async (course) => {
            const dto = toCourseDTO(course);
            const localizedContent = await contentService.getContent<any>(`course.${course.slug || course.id}`, locale);
            if (localizedContent) {
                dto.title = localizedContent.title || dto.title;
                dto.description = localizedContent.description || dto.description;
            }
            return dto;
        }));

        return NextResponse.json(dtos);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
