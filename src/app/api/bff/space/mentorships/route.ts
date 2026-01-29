import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// In-memory store for mentorships
const mentorships: Record<string, any> = {};

/**
 * BFF Endpoint for Mentorships
 * GET /api/bff/space/mentorships?userId={id}&role={nunu|vava} - Get user's mentorships
 * POST /api/bff/space/mentorships - Create mentorship
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const allMentorships = Object.values(mentorships);

        let filtered = allMentorships;
        if (role === 'nunu') {
            filtered = allMentorships.filter(m => m.nunuId === userId);
        } else if (role === 'vava') {
            filtered = allMentorships.filter(m => m.vavaId === userId);
        } else {
            // Both roles
            filtered = allMentorships.filter(m => m.nunuId === userId || m.vavaId === userId);
        }

        return NextResponse.json(filtered);
    } catch (error) {
        console.error('Error fetching mentorships:', error);
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
        const { nunuId, vavaId } = body;

        if (!nunuId || !vavaId) {
            return NextResponse.json({ error: 'nunuId and vavaId required' }, { status: 400 });
        }

        const newMentorship = {
            id: `mentorship-${Date.now()}`,
            nunuId,
            vavaId,
            status: 'active',
            sessionCount: 0,
            months: [],
            createdAt: new Date().toISOString(),
        };

        mentorships[newMentorship.id] = newMentorship;

        return NextResponse.json(newMentorship, { status: 201 });
    } catch (error) {
        console.error('Error creating mentorship:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
