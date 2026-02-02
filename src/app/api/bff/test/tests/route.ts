import { NextResponse } from 'next/server';
import { testService } from '@/app/api/bff/composition';

/**
 * BFF Endpoint for Tests
 * GET /api/bff/test/tests?level={n} - Get questions for level
 * GET /api/bff/test/tests - Get all level configs
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const userId = searchParams.get('userId') || 'user-1'; // Default for demo

    try {
        if (level) {
            // Get questions for specific level (stub)
            return NextResponse.json([]);
        }

        // Get all level configurations with user-specific progress and UI state
        const configs = await testService.getLevelsForUser(userId);
        return NextResponse.json(configs);
    } catch (error) {
        console.error('Error fetching tests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
