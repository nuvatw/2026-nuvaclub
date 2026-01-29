import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// In-memory store for mentorship agreements
const agreements: Record<string, any> = {};

/**
 * BFF Endpoint for Mentorship Agreements
 * GET /api/bff/space/agreements?mentorshipId={id} - Get agreement
 * POST /api/bff/space/agreements - Create/update agreement
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mentorshipId = searchParams.get('mentorshipId');

    if (!mentorshipId) {
        return NextResponse.json({ error: 'mentorshipId required' }, { status: 400 });
    }

    try {
        const agreement = agreements[mentorshipId] || null;
        return NextResponse.json(agreement);
    } catch (error) {
        console.error('Error fetching agreement:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { mentorshipId, terms } = body;

        if (!mentorshipId || !terms) {
            return NextResponse.json({ error: 'mentorshipId and terms required' }, { status: 400 });
        }

        const newAgreement = {
            id: `agreement-${Date.now()}`,
            mentorshipId,
            terms,
            createdAt: new Date().toISOString(),
            signedByNunu: false,
            signedByVava: false,
        };

        agreements[mentorshipId] = newAgreement;

        return NextResponse.json(newAgreement, { status: 201 });
    } catch (error) {
        console.error('Error creating agreement:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
