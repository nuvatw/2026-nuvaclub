import { NextResponse } from 'next/server';
import { authService } from '../../composition';

/**
 * BFF Endpoint for User Session
 * GET /api/bff/auth/session?userId={id}
 * POST /api/bff/auth/session - Update profile
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const user = await authService.getUserSession(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        console.error('BFF Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, ...data } = await request.json();
        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const updatedUser = await authService.updateProfile(userId, data);
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('BFF Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
