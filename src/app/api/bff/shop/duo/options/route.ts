import { NextResponse } from 'next/server';
import { shopService } from '@/app/api/bff/composition';
import { DuoTier } from '@/domain/duo/DuoTier';

/**
 * BFF Endpoint for Duo Purchase Options
 * GET /api/bff/shop/duo/options?userId=...&year=...&tier=...
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = parseInt(searchParams.get('year') || '', 10);
    const tier = searchParams.get('tier') as DuoTier;

    if (!userId || !year || !tier) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const options = await shopService.getDuoPurchaseOptions(userId, year, tier);
        return NextResponse.json(options);
    } catch (error) {
        console.error('Error fetching duo purchase options:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
