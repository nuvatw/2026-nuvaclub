import { NextResponse } from 'next/server';
import {
    getAllSeasons,
    getSeasonById,
    getActiveSeason,
    getSprintById,
    getSprintsBySeasonId,
    getProjectById,
    getProjectsBySprintId
} from '@/infra/mock/legacy';

/**
 * BFF Endpoint for Sprint/Seasons
 * GET /api/bff/sprint/sprints - List all seasons with sprints
 * GET /api/bff/sprint/sprints?seasonId={id} - Get season by ID
 * GET /api/bff/sprint/sprints?sprintId={id} - Get sprint by ID
 * GET /api/bff/sprint/sprints?active=true - Get active season
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId');
    const sprintId = searchParams.get('sprintId');
    const projectId = searchParams.get('projectId');
    const active = searchParams.get('active');

    try {
        // Project by ID
        if (projectId) {
            const project = getProjectById(projectId);
            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }
            return NextResponse.json(project);
        }

        // Season by ID
        if (seasonId) {
            const season = getSeasonById(seasonId);
            if (!season) {
                return NextResponse.json({ error: 'Season not found' }, { status: 404 });
            }
            // Enrich with sprints
            const sprints = getSprintsBySeasonId(seasonId);
            return NextResponse.json({ ...season, sprints });
        }

        // Active season
        if (active === 'true') {
            const season = getActiveSeason();
            if (season) {
                const sprints = getSprintsBySeasonId(season.id);
                return NextResponse.json({ ...season, sprints });
            }
            return NextResponse.json(null);
        }

        // All seasons
        const seasons = getAllSeasons();
        return NextResponse.json(seasons);
    } catch (error) {
        console.error('Error fetching sprints:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
