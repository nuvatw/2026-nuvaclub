import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// In-memory store for Nunu profiles
const profiles: Record<string, any> = {};

/**
 * BFF Endpoint for Nunu Profiles
 * GET /api/bff/space/profile?userId={id} - Get Nunu profile
 * PUT /api/bff/space/profile - Update Nunu profile
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const profile = profiles[userId] || null;
        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const updatedProfile = {
            ...profiles[userId],
            ...body,
            userId,
            updatedAt: new Date().toISOString(),
        };

        profiles[userId] = updatedProfile;

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
