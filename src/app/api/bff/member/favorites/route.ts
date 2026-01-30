import { NextResponse } from 'next/server';
import { memberService } from '../../composition';

/**
 * BFF Endpoint for Member Favorites
 * GET /api/bff/member/favorites?userId={id}
 * DELETE /api/bff/member/favorites?favoriteId={id}
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const favorites = await memberService.getFavorites(userId);
        return NextResponse.json(favorites);
    } catch (error) {
        console.error('BFF Favorites GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get('favoriteId');

    if (!favoriteId) {
        return NextResponse.json({ error: 'favoriteId required' }, { status: 400 });
    }

    try {
        const success = await memberService.removeFavorite(favoriteId);
        return NextResponse.json({ success });
    } catch (error) {
        console.error('BFF Favorites DELETE Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
