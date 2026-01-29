import { NextResponse } from 'next/server';
import { Ids } from '@/domain/shared/ids';

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // TODO: Fetch history from DB
        // const history = await testService.getHistory(Ids.User(userId));

        return NextResponse.json([
            { testId: 'test-1', score: 85, passed: true, date: new Date().toISOString() }
        ]);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
