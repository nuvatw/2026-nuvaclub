import { NextResponse } from 'next/server';
import { pointsService } from '../../composition';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const points = await pointsService.getOrCreateUserPoints(userId);
        return NextResponse.json(points);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
