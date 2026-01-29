import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// In-memory store for matching comments
const comments: Record<string, any[]> = {};

/**
 * BFF Endpoint for Matching Post Comments
 * GET /api/bff/space/matching/comments?postId={id} - Get comments for post
 * POST /api/bff/space/matching/comments - Create comment
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'postId required' }, { status: 400 });
    }

    try {
        const postComments = comments[postId] || [];
        return NextResponse.json(postComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
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
        const { postId, content } = body;

        if (!postId || !content) {
            return NextResponse.json({ error: 'postId and content required' }, { status: 400 });
        }

        const newComment = {
            id: `comment-${Date.now()}`,
            postId,
            authorId: userId,
            content,
            createdAt: new Date().toISOString(),
        };

        if (!comments[postId]) {
            comments[postId] = [];
        }
        comments[postId].push(newComment);

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
