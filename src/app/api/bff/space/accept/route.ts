import { NextResponse } from 'next/server';
import { Ids } from '@/domain/shared/ids';

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { relationshipId } = body;

        // TODO: Call SpaceService.acceptRelationship
        // await spaceService.acceptRelationship(Ids.User(userId), Ids.Space(relationshipId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
