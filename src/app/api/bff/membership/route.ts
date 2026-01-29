import { NextResponse } from 'next/server';
import { membershipService } from '@/domain/membership/MembershipService';
import { Ids } from '@/domain/shared/ids';

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1'; // Mock
}

export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const membership = await membershipService.getMembership(Ids.User(userId));
        return NextResponse.json(membership);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
