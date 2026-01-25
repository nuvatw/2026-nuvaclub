import { NextRequest, NextResponse } from 'next/server';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/lib/admin-db';

// Validate admin auth (simplified - checks header)
function isAdmin(request: NextRequest): boolean {
  const adminHeader = request.headers.get('x-admin-user');
  return adminHeader === 'test-admin';
}

// GET /api/admin/courses - List all admin-created courses
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const courses = await getCourses();
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST /api/admin/courses - Create a new course
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, description, thumbnailUrl, level, isPublished } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const course = await createCourse({
      title,
      subtitle: subtitle || '',
      description,
      thumbnailUrl: thumbnailUrl || '',
      level: level || 1,
      isPublished: isPublished ?? true,
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

// PUT /api/admin/courses - Update a course
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    const course = await updateCourse(id, updates);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

// DELETE /api/admin/courses - Delete a course
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    const success = await deleteCourse(id);
    if (!success) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
