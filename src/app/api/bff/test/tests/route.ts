import { NextResponse } from 'next/server';
import {
    getQuestionsForLevel
} from '@/infra/mock/legacy';
import { getLevelDuration } from '@/features/test/constants';

/**
 * BFF Endpoint for Tests
 * GET /api/bff/test/tests?level={n} - Get questions for level
 * GET /api/bff/test/tests - Get all level configs
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    try {
        if (level) {
            // Get questions for specific level (stub)
            // In real implementation, would call repository
            return NextResponse.json([]);
        }

        // Get all level configurations
        const configs = [];
        for (let lvl = 1; lvl <= 12; lvl++) {
            const duration = getLevelDuration(lvl);

            let questionTypes: string;
            if (lvl <= 3) {
                questionTypes = 'True/False + Multiple Choice';
            } else if (lvl <= 6) {
                questionTypes = 'Multiple Choice + Short Answer';
            } else if (lvl <= 9) {
                questionTypes = 'Short Answer + Essay';
            } else {
                questionTypes = 'Essay';
            }

            configs.push({
                level: lvl,
                durationMinutes: duration,
                questionTypes,
                questionCount: 10, // Placeholder
            });
        }

        return NextResponse.json(configs);
    } catch (error) {
        console.error('Error fetching tests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
