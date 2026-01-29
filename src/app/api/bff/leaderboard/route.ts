import { NextResponse } from 'next/server';
import { MockDB } from '@/infra/mock/core/MockDB';
import { PointsRepository } from '@/infra/mock/repositories/PointsRepository';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    try {
        const db = MockDB.getInstance();
        await db.initialize();
        const repo = new PointsRepository(db);
        const leaderboard = repo.getLeaderboard(limit);
        return NextResponse.json(leaderboard);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
