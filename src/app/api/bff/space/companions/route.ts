import { NextResponse } from 'next/server';

/**
 * BFF Endpoint for Companions (Vava companions)
 * GET /api/bff/space/companions?userId={id} - Get user's companions
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        // Return empty array for now (stub)
        // In real implementation, would fetch from repository
        return NextResponse.json([]);
    } catch (error) {
        console.error('Error fetching companions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
