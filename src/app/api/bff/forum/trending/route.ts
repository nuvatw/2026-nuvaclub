import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/legacy-db-shim';

/**
 * BFF Endpoint for Trending Posts
 * GET /api/bff/forum/trending?limit={n} - Get trending posts
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    try {
        // Get all posts and sort by engagement (views + upvotes + comments)
        const allPosts = getAllPosts();

        const scored = allPosts.map(post => ({
            ...post,
            score: ((post as any).views || 0) + (post.upvotes || 0) * 10 + ((post as any).comments?.length || 0) * 5
        }));

        const trending = scored
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return NextResponse.json(trending);
    } catch (error) {
        console.error('Error fetching trending posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
