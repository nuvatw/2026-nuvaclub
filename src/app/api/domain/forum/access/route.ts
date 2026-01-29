import { NextResponse } from 'next/server';
import { forumPolicy } from '@/domain/forum/ForumPolicy';
import { Ids } from '@/domain/shared/ids';
import { BoardType } from '@/domain/forum/types';

async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// Mock DB
async function getBoard(id: string) {
    return { id, type: 'public' as BoardType, requiresMembership: false };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    if (!boardId) {
        return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
    }

    const userId = await getUserId(request);
    const domainUserId = userId ? Ids.User(userId) : null;

    try {
        const board = await getBoard(boardId);
        const result = forumPolicy.canViewBoard(domainUserId, board);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
