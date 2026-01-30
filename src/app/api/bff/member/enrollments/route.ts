import { NextResponse } from 'next/server';
import { memberService } from '../../composition';

/**
 * BFF Endpoint for Member Enrollments
 * GET /api/bff/member/enrollments?userId={id}
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        const enrollments = await memberService.getEnrollments(userId);
        return NextResponse.json(enrollments);
    } catch (error) {
        console.error('BFF Enrollments GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
