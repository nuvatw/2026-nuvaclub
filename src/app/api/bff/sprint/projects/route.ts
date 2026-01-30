import { NextResponse } from 'next/server';
import { getProjectsWithSeasonInfo } from '@/infra/mock/legacy';

/**
 * BFF Endpoint for Sprint Projects
 * GET /api/bff/sprint/projects - List all projects with season info
 */
export async function GET() {
    try {
        const projects = getProjectsWithSeasonInfo();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching sprint projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
