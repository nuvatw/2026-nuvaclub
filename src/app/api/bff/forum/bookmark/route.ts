import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// Simple bookmark store (userId -> Set<postId>)
const bookmarks: Record<string, Set<string>> = {};

/**
 * BFF Endpoint for Bookmarks
 * GET /api/bff/forum/bookmark?postId={id} - Check if bookmarked
 * POST /api/bff/forum/bookmark - Toggle bookmark
 */
export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ isBookmarked: false });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'postId required' }, { status: 400 });
    }

    const userBookmarks = bookmarks[userId] || new Set();
    return NextResponse.json({ isBookmarked: userBookmarks.has(postId) });
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json({ error: 'postId required' }, { status: 400 });
        }

        if (!bookmarks[userId]) {
            bookmarks[userId] = new Set();
        }

        const userBookmarks = bookmarks[userId];
        const isBookmarked = userBookmarks.has(postId);

        if (isBookmarked) {
            userBookmarks.delete(postId);
        } else {
            userBookmarks.add(postId);
        }

        return NextResponse.json({ isBookmarked: !isBookmarked, success: true });
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
