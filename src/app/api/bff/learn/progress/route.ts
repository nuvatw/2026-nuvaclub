import { NextResponse } from 'next/server';
import { learnService } from '@/app/api/bff/composition';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    // In a real app, read from headers or session
    return 'user-1';
}

/**
 * BFF Endpoint for Video Progress
 * GET /api/bff/learn/progress?courseId={id} - Get progress for course
 * POST /api/bff/learn/progress - Save progress
 * DELETE /api/bff/learn/progress?courseId={id} - Reset course progress
 */
export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    try {
        if (!courseId) {
            return NextResponse.json({ error: 'courseId required' }, { status: 400 });
        }

        const progress = await learnService.getCourseProgress(userId, courseId);
        return NextResponse.json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { courseId, lessonId, watchedSeconds, totalDuration, type } = body;

        if (!courseId) {
            return NextResponse.json({ error: 'courseId required' }, { status: 400 });
        }

        const progress = await learnService.saveProgress(userId, {
            courseId,
            lessonId,
            watchedSeconds,
            totalDuration,
            type: type || 'lesson'
        });

        return NextResponse.json({ success: true, progress });
    } catch (error) {
        console.error('Error saving progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
        return NextResponse.json({ error: 'courseId required' }, { status: 400 });
    }

    try {
        await learnService.resetProgress(userId, courseId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
