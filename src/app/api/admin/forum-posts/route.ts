import { NextRequest, NextResponse } from 'next/server';
import {
  getDeletedForumPosts,
  deleteForumPost,
  restoreForumPost,
} from '@/lib/admin-db';

// Validate admin auth (simplified - checks header)
function isAdmin(request: NextRequest): boolean {
  const adminHeader = request.headers.get('x-admin-user');
  return adminHeader === 'test-admin';
}

// GET /api/admin/forum-posts - Get list of deleted forum post IDs
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedPosts = await getDeletedForumPosts();
    return NextResponse.json({ deletedPosts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deleted posts' }, { status: 500 });
  }
}

// DELETE /api/admin/forum-posts - Mark a forum post as deleted
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await deleteForumPost(postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

// POST /api/admin/forum-posts - Restore a deleted forum post
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { postId, action } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    if (action === 'restore') {
      await restoreForumPost(postId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore post' }, { status: 500 });
  }
}
