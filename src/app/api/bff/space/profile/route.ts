import { NextResponse } from 'next/server';
import { sprintService } from '../../composition';

// Mock Auth
async function getUserId(request: Request): Promise<string | null> {
    return 'user-1';
}

/**
 * BFF Endpoint for Nunu Profiles
 * GET /api/bff/space/profile?userId={id} - Get Nunu profile with eligibility stats
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }

        const sprintStatus = await sprintService.getMemberSprintStatus(userId);
        if (!sprintStatus) {
            return NextResponse.json(null);
        }

        // Map domain-centric status back to UI-centric profile expectations
        // This keeps the BFF as a thin translation layer
        return NextResponse.json({
            ...sprintStatus,
            level: sprintStatus.currentNunuLevel || 'Nx',
            currentVavaCount: sprintStatus.activeMenteesCount,
            maxVavas: 3, // Logic could eventually move to aggregate
            isAvailable: true,
            expertise: [],
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    // PUT remains a placeholder or directed to a service later
    return NextResponse.json({ success: true });
}
