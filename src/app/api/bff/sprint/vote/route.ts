import { NextResponse } from 'next/server';

// Mock Auth  
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// In-memory store for votes
const votes: Record<string, any> = {};

/**
 * BFF Endpoint for Sprint Voting
 * POST /api/bff/sprint/vote - Toggle vote for project
 * DELETE /api/bff/sprint/vote - Remove vote
 */
export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { projectId, sprintId } = body;

        if (!projectId || !sprintId) {
            return NextResponse.json({ error: 'projectId and sprintId required' }, { status: 400 });
        }

        const voteKey = `${userId}-${projectId}`;

        // Check if already voted
        if (votes[voteKey]) {
            // Remove vote
            delete votes[voteKey];
            return NextResponse.json({ success: true, action: 'removed' });
        } else {
            // Add vote
            votes[voteKey] = {
                userId,
                projectId,
                sprintId,
                createdAt: new Date().toISOString(),
            };
            return NextResponse.json({ success: true, action: 'added' });
        }
    } catch (error) {
        console.error('Error toggling vote:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sprintId = searchParams.get('sprintId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const userVotes = Object.values(votes).filter(
            v => v.userId === userId && (!sprintId || v.sprintId === sprintId)
        );
        return NextResponse.json(userVotes);
    } catch (error) {
        console.error('Error fetching votes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
