import { NextResponse } from 'next/server';
import { pointsService } from '../composition';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    try {
        const leaderboard = await pointsService.getLeaderboard(limit);
        return NextResponse.json(leaderboard);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
