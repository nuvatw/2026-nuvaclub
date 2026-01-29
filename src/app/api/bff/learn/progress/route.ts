import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// Simple in-memory store (replace with real persistence later)
const progressStore: Record<string, any> = {};

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
        if (courseId) {
            // Get progress for specific course
            const key = `${userId}-${courseId}`;
            const progress = progressStore[key] || {
                courseId,
                lessons: {},
                trailer: null,
                lastWatched: null,
            };
            return NextResponse.json(progress);
        }

        // Get all progress for user
        const userProgress = Object.entries(progressStore)
            .filter(([key]) => key.startsWith(`${userId}-`))
            .map(([_, value]) => value);

        return NextResponse.json(userProgress);
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

        const key = `${userId}-${courseId}`;
        const existing = progressStore[key] || {
            courseId,
            lessons: {},
            trailer: null,
            lastWatched: null,
        };

        const progressPercent = totalDuration > 0
            ? Math.min(100, (watchedSeconds / totalDuration) * 100)
            : 0;
        const isCompleted = progressPercent >= 90;
        const now = new Date().toISOString();

        if (type === 'trailer') {
            // Save trailer progress
            existing.trailer = {
                watchedSeconds,
                totalDuration,
                progressPercent,
                isCompleted,
                lastWatchedAt: now,
            };
        } else if (lessonId) {
            // Save lesson progress
            existing.lessons[lessonId] = {
                lessonId,
                watchedSeconds,
                totalDuration,
                progressPercent,
                isCompleted,
                lastWatchedAt: now,
            };
            existing.lastWatched = { lessonId, timestamp: now };
        }

        progressStore[key] = existing;

        return NextResponse.json({ success: true, progress: existing });
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
        const key = `${userId}-${courseId}`;
        delete progressStore[key];
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
