import { NextResponse } from 'next/server';
import { getMembershipSummaryService } from '@/application/services/GetMembershipSummaryService';

// Mock Auth - real implementation would get from session
async function getAuthenticatedUserId(): Promise<string | null> {
    return 'user-1';
}

export async function GET() {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const summary = await getMembershipSummaryService.execute(userId);
        return NextResponse.json(summary);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
