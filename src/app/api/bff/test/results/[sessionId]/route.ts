import { NextResponse } from 'next/server';
import { testService } from '../../../composition';

/**
 * BFF Endpoint for Test Results
 * GET /api/bff/test/results/[sessionId]
 */
export async function GET(
    request: Request,
    { params }: { params: { sessionId: string } }
) {
    const { sessionId } = params;

    if (!sessionId) {
        return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    try {
        const results = await testService.getSessionResults(sessionId);
        if (!results) {
            return NextResponse.json({ error: 'Test session not found' }, { status: 404 });
        }
        return NextResponse.json(results);
    } catch (error) {
        console.error('BFF Test Results GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
