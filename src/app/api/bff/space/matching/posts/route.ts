import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

/**
 * BFF Endpoint for Matching Posts (Space Domain)
 * GET /api/bff/space/matching/posts - Get matching posts with filters
 * POST /api/bff/space/matching/posts - Create new matching post
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const authorId = searchParams.get('authorId');
    const isActive = searchParams.get('isActive');

    try {
        // Stub implementation - would fetch from repository
        const posts: any[] = [];

        // Return posts with basic stats
        const enrichedPosts = posts.map((post: any) => ({
            ...post,
            tags: [],
            commentCount: 0,
            viewCount: 0,
        }));

        return NextResponse.json(enrichedPosts);
    } catch (error) {
        console.error('Error fetching matching posts:', error);
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

        // Basic validation
        if (!body.type || !body.title || !body.description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // In real implementation, would call repository to create post
        const newPost = {
            id: `post-${Date.now()}`,
            ...body,
            authorId: userId,
            createdAt: new Date().toISOString(),
            isActive: true,
        };

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating matching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
