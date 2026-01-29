import { NextResponse } from 'next/server';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

// Simple in-memory store for user progress
const userProgress: Record<string, any> = {};
const levelHistory: Record<string, any[]> = {}; // userId-level -> attempts[]

/**
 * BFF Endpoint for User Test Progress
 * GET /api/bff/test/progress?userId={id} - Get user's overall progress
 * GET /api/bff/test/progress?userId={id}&level={n} - Get level stats
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const level = searchParams.get('level');

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    try {
        if (level) {
            // Get level stats
            const key = `${userId}-${level}`;
            const attempts = levelHistory[key] || [];
            const passed = attempts.some(a => a.passed);
            const bestScore = attempts.length > 0
                ? Math.max(...attempts.map(a => a.score || 0))
                : null;
            const avgTime = attempts.length > 0
                ? attempts.reduce((sum, a) => sum + (a.duration || 0), 0) / attempts.length
                : null;

            return NextResponse.json({
                attempts: attempts.length,
                bestScore,
                passed,
                averageTime: avgTime,
            });
        }

        // Get overall user progress
        const progress = userProgress[userId] || {
            userId,
            currentLevel: 1,
            highestUnlockedLevel: 1,
            totalAttempts: 0,
            passedLevels: [],
        };

        return NextResponse.json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
