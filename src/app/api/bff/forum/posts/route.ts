import { NextResponse } from 'next/server';
import {
    getAllPosts,
    getPostById,
    getPinnedPosts,
    getRecentPosts,
    getPostsByCategory
} from '@/lib/legacy-db-shim';

/**
 * BFF Endpoint for Forum Posts
 * GET /api/bff/forum/posts - List posts with optional filters
 * GET /api/bff/forum/posts?id={id} - Get single post by ID
 * GET /api/bff/forum/posts?pinned=true - Get pinned posts
 * GET /api/bff/forum/posts?recent=true - Get recent posts
 * GET /api/bff/forum/posts?category={category} - Get posts by category
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const pinned = searchParams.get('pinned');
    const recent = searchParams.get('recent');
    const category = searchParams.get('category');

    try {
        // Single post by ID
        if (id) {
            const post = getPostById(id);
            return post
                ? NextResponse.json(post)
                : NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Pinned posts
        if (pinned === 'true') {
            const posts = getPinnedPosts();
            return NextResponse.json(posts);
        }

        // Recent posts
        if (recent === 'true') {
            const posts = getRecentPosts();
            return NextResponse.json(posts);
        }

        // Posts by category
        if (category) {
            const posts = getPostsByCategory(category as any); // Accept string, shim handles it
            return NextResponse.json(posts);
        }

        // All posts
        const posts = getAllPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
