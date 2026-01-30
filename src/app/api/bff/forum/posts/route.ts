import { NextResponse } from 'next/server';
import { forumService } from '@/app/api/bff/composition';

/**
 * BFF Endpoint for Forum Posts
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const recent = searchParams.get('recent');

    try {
        // For now, refactoring the most common path: recent posts
        if (recent === 'true') {
            const posts = await forumService.getRecentPosts();
            return NextResponse.json(posts);
        }

        // Default to recent posts via service
        const posts = await forumService.getRecentPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const post = await forumService.createPost(body);
        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
