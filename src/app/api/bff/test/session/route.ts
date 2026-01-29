import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// Simple in-memory store for test sessions
const sessions: Record<string, any> = {};
const answers: Record<string, Record<string, string>> = {}; // sessionId -> questionId -> answer

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
    const userId = searchParams.get('userId');
    const active = searchParams.get('active');

    try {
        if (sessionId) {
            // Get specific session
            const session = sessions[sessionId];
            if (!session) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }
            return NextResponse.json({
                ...session,
                answers: answers[sessionId] || {},
            });
        }

        if (userId && active === 'true') {
            // Get active session for user
            const userSessions = Object.values(sessions).filter(
                s => s.userId === userId && s.status === 'in_progress'
            );
            const activeSession = userSessions[0] || null;
            return NextResponse.json(activeSession);
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

        // Create new session
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const duration = 30; // Default 30 minutes
        const expiresAt = new Date(Date.now() + duration * 60 * 1000);

        const session = {
            id: sessionId,
            userId,
            level,
            levelId: `level-${level}`,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
        };

        sessions[sessionId] = session;
        answers[sessionId] = {};

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

        const session = sessions[sessionId];
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (action === 'answer') {
            // Submit answer
            if (!questionId || !answer) {
                return NextResponse.json({ error: 'questionId and answer required' }, { status: 400 });
            }
            if (!answers[sessionId]) answers[sessionId] = {};
            answers[sessionId][questionId] = answer;
            return NextResponse.json({ success: true });
        } else if (action === 'complete') {
            // Complete session
            session.status = 'completed';
            session.completedAt = new Date().toISOString();
            session.score = Object.keys(answers[sessionId] || {}).length * 10; // Simple scoring
            return NextResponse.json(session);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
