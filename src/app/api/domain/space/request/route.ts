import { NextResponse } from 'next/server';
import { spaceService } from '@/domain/space/SpaceService';
import { Ids } from '@/domain/shared/ids';

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1'; // Mock
}

export async function POST(request: Request) {
    try {
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { targetUserId, type, message } = body;

        const result = await spaceService.requestRelationship(Ids.User(userId), {
            targetUserId: Ids.User(targetUserId),
            type,
            message
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error.message }, { status: 400 }); // Or appropriate code
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
