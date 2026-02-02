import { NextResponse } from 'next/server';
import { campaignService } from '@/app/api/bff/composition';

/**
 * BFF Endpoint for Campaign Benefit Calculation
 * GET /api/bff/campaign/calculate?amount={n}
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const amountStr = searchParams.get('amount');

    if (!amountStr) {
        return NextResponse.json({ error: 'amount required' }, { status: 400 });
    }

    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) {
        return NextResponse.json({ error: 'invalid amount' }, { status: 400 });
    }

    try {
        const benefits = campaignService.calculateBenefits(amount);
        return NextResponse.json(benefits);
    } catch (error) {
        console.error('Error calculating benefits:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
