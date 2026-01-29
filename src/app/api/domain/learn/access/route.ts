import { NextResponse } from 'next/server';
import { learnAccessPolicy } from '@/domain/learn/LearnAccessPolicy';
import { Ids } from '@/domain/shared/ids';

// Mock DB fetch
async function getCourse(id: string) {
    return { id: Ids.Course(id), isFree: false, requiredLevel: 1 };
}

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1'; // Mock
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
        return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
    }

    const userId = await getUserId(request);
    const domainUserId = userId ? Ids.User(userId) : null;

    try {
        const course = await getCourse(courseId);
        // Note: LearnAccessPolicy.canViewCourse is synchronous in my implementation, 
        // but typically might need async data loading. I'll use it as is.
        const result = learnAccessPolicy.canViewCourse(domainUserId, course);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
