import { NextResponse } from 'next/server';
import { sprintPolicy } from '@/domain/sprint/SprintPolicy';
import { Ids } from '@/domain/shared/ids';

// Mock DB fetch
async function getSprint(id: string) {
    return {
        id: Ids.Sprint(id),
        status: 'active' as const,
        startDate: new Date(),
        endDate: new Date()
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sprintId = searchParams.get('sprintId');

    if (!sprintId) {
        return NextResponse.json({ error: 'Missing sprintId' }, { status: 400 });
    }

    try {
        const sprint = await getSprint(sprintId);
        const isActive = sprintPolicy.isActive(sprint);
        const canSubmit = sprintPolicy.canSubmit(sprint);

        return NextResponse.json({ isActive, canSubmit });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
