import { NextResponse } from 'next/server';
import { memberService } from '@/app/api/bff/composition';

/**
 * BFF Endpoint for Member Profile
 * GET /api/bff/member/profile?userId={id}
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const profile = await memberService.getProfile(userId);
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        return NextResponse.json(profile);
    } catch (error) {
        console.error('BFF Profile GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
