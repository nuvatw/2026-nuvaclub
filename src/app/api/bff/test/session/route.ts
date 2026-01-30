import { NextResponse } from 'next/server';
import { testService } from '../../composition';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

/**
 * BFF Endpoint for Test Sessions
 * GET /api/bff/test/session?sessionId={id} - Get session details
 * GET /api/bff/test/session?userId={id}&active=true - Get active session
 * POST /api/bff/test/session - Create/start new session
 * PUT /api/bff/test/session - Submit answer or complete session
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    // Note: userId/active logic is simplified to use testService

    try {
        if (sessionId) {
            const session = await testService.getSessionResults(sessionId);
            if (!session) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }
            return NextResponse.json(session);
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        console.error('Error fetching session:', error);
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
        const { level } = body;

        if (!level) {
            return NextResponse.json({ error: 'level required' }, { status: 400 });
        }

        const session = await testService.startSession(userId, parseInt(level));
        return NextResponse.json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { sessionId, action, questionId, answer } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }

        if (action === 'answer') {
            if (!questionId || !answer) {
                return NextResponse.json({ error: 'questionId and answer required' }, { status: 400 });
            }
            await testService.submitAnswer(sessionId, questionId, answer);
            return NextResponse.json({ success: true });
        } else if (action === 'complete') {
            const completedSession = await testService.completeSession(sessionId);
            return NextResponse.json(completedSession);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
