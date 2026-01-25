import { NextRequest, NextResponse } from 'next/server';
import {
  getDeletedMatchingPosts,
  deleteMatchingPost,
  restoreMatchingPost,
} from '@/lib/admin-db';

// Validate admin auth (simplified - checks header)
function isAdmin(request: NextRequest): boolean {
  const adminHeader = request.headers.get('x-admin-user');
  return adminHeader === 'test-admin';
}

// GET /api/admin/matching-posts - Get list of deleted matching post IDs
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedPosts = await getDeletedMatchingPosts();
    return NextResponse.json({ deletedPosts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deleted posts' }, { status: 500 });
  }
}

// DELETE /api/admin/matching-posts - Mark a matching post as deleted
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

    await deleteMatchingPost(postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

// POST /api/admin/matching-posts - Restore a deleted matching post
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
      await restoreMatchingPost(postId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore post' }, { status: 500 });
  }
}
