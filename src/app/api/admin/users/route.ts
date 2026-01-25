import { NextRequest, NextResponse } from 'next/server';
import {
  getUserRelationships,
  updateUserRelationship,
} from '@/lib/admin-db';

// Validate admin auth (simplified - checks header)
function isAdmin(request: NextRequest): boolean {
  const adminHeader = request.headers.get('x-admin-user');
  return adminHeader === 'test-admin';
}

// GET /api/admin/users - Get user relationships
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const relationships = await getUserRelationships();
    return NextResponse.json({ relationships });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
  }
}

// PUT /api/admin/users - Update a user's relationship
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, nunuId, vavaIds } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const relationship = await updateUserRelationship(userId, {
      nunuId,
      vavaIds,
    });

    return NextResponse.json({ relationship });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update relationship' }, { status: 500 });
  }
}
