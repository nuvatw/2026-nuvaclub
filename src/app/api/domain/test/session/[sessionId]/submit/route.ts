import { NextResponse } from 'next/server';
import { testEngine } from '@/domain/test/TestEngine';
import { TestDifficulty } from '@/domain/test/types';

export async function POST(request: Request, props: { params: Promise<{ sessionId: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { answers } = body;

        // TODO: Retrieve test/session context to get maxScore/difficulty from DB
        // details = await testService.getSession(params.sessionId);

        // Mock context
        const mockMaxScore = 100;
        const mockDifficulty: TestDifficulty = 'medium';
        // Mock scoring logic (replace with real one)
        const mockScore = 80;

        const result = testEngine.evaluateSubmission(mockScore, mockMaxScore, mockDifficulty);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
