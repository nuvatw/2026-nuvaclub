import { NextResponse } from 'next/server';
import { spaceService } from '@/domain/space/SpaceService';
import { Ids } from '@/domain/shared/ids';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get('spaceId');

    if (!spaceId) {
        return NextResponse.json({ error: 'Missing spaceId' }, { status: 400 });
    }

    try {
        const relationship = await spaceService.getRelationship(Ids.Space(spaceId));
        if (!relationship) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(relationship);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
