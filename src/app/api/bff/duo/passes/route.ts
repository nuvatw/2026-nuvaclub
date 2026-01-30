import { NextResponse } from 'next/server';
import { duoRepository } from '@/app/api/bff/composition';
import { getEffectiveUserId } from '@/features/auth/components/AuthProvider';

/**
 * BFF Endpoint for Duo Month Passes
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const accountId = searchParams.get('accountId');

    const targetUserId = userId || (accountId ? getEffectiveUserId(accountId) : null);

    if (!targetUserId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
        const passes = duoRepository.getPassesByUserId(targetUserId);
        const transactions = duoRepository.getTransactionsByUserId(targetUserId);
        const matchStatuses = duoRepository.getMatchStatusesByUserId(targetUserId);

        return NextResponse.json({
            passes,
            transactions,
            matchStatuses
        });
    } catch (error) {
        console.error('Error fetching duo data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Simplified: this would call a DuoService in real app
        // For now we just mock success if it's a purchase
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
