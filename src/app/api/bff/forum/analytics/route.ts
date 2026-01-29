import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// Simple in-memory store for analytics
const analytics: Record<string, any> = {};

/**
 * BFF Endpoint for Forum Analytics
 * POST /api/bff/forum/analytics - Track view, share, bookmark
 */
export async function POST(request: Request) {
    const userId = await getUserId(request);

    try {
        const body = await request.json();
        const { action, postId, sessionId } = body;

        if (!action || !postId) {
            return NextResponse.json({ error: 'action and postId required' }, { status: 400 });
        }

        const key = `${action}-${postId}-${userId || sessionId || 'anon'}`;

        // Simple deduplication
        if (analytics[key]) {
            return NextResponse.json({ success: false, reason: 'already_tracked' });
        }

        analytics[key] = {
            action,
            postId,
            userId,
            sessionId,
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
