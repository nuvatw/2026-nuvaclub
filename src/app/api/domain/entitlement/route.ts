import { NextResponse } from 'next/server';
import { entitlementService } from '@/domain/entitlement/EntitlementService';
import { EntitlementType } from '@/domain/entitlement/types';
import { Ids } from '@/domain/shared/ids';

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1'; // Mock
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as EntitlementType;

    if (!type) {
        return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
    }

    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const status = await entitlementService.getEntitlementStatus(Ids.User(userId), type);
        return NextResponse.json(status);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
