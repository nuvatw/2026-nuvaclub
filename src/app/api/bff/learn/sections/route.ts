import { NextResponse } from 'next/server';
import { learnService } from '@/app/api/bff/composition';
import { toCourseDTO } from '../mappers';

/**
 * BFF Endpoint for Learn Home Sections
 * GET /api/bff/learn/sections
 * 
 * Returns organized sections (Hero, Continue Learning, Series)
 * for the Learn homepage, enforcing architectural boundaries.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1';

    try {
        const homeData = await learnService.getLearnHomeData(userId);

        // Map to DTOs
        const dtoData = {
            heroCourse: homeData.heroCourse ? toCourseDTO(homeData.heroCourse) : null,
            sections: homeData.sections.map(section => ({
                ...section,
                courses: section.courses.map(toCourseDTO)
            }))
        };

        return NextResponse.json(dtoData);
    } catch (error) {
        console.error('Error fetching learn home data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
