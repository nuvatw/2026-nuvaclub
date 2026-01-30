import { NextResponse } from 'next/server';
import { accessService } from '../composition';
import { GateAction, GateResource } from '@/domain/gate/types';
import { Ids } from '@/domain/shared/ids';

// Mock auth helper - replace with actual auth logic
async function getUserId(request: Request): Promise<string | null> {
    // TODO: Extract from session/cookie
    return 'user-1'; // Mock user
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { resource, action, resourceId } = body;

        if (!resource || !action) {
            return NextResponse.json({ error: 'Missing resource or action' }, { status: 400 });
        }

        const userId = await getUserId(request);
        const domainUserId = userId ? Ids.User(userId) : null;

        const result = await accessService.evaluateAccess(
            domainUserId,
            resource as GateResource,
            action as GateAction,
            resourceId
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('BFF check-access failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
