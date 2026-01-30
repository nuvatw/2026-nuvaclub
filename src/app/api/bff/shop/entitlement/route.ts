import { NextResponse } from 'next/server';
import { shopService } from '@/app/api/bff/composition';
import type { DuoVariant } from '@/features/shop/types';

async function getUserHelper() {
    // In a real app, verify session here.
    // For ANTIGRAVITY Phase 1, we simulate a user.
    return 'user-1';
}

export async function GET() {
    const userId = await getUserHelper();
    try {
        const entitlement = await shopService.getEntitlement(userId);
        return NextResponse.json(entitlement);
    } catch (error) {
        console.error('BFF Entitlement GET failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    const userId = await getUserHelper();
    try {
        await shopService.cancelDuoTicket(userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('BFF Entitlement DELETE failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserHelper();
    try {
        const body = await request.json();
        const { variant } = body as { variant: DuoVariant };

        if (!variant) {
            return NextResponse.json({ error: 'Variant is required' }, { status: 400 });
        }

        const entitlement = await shopService.purchaseDuoTicket(userId, variant);
        return NextResponse.json(entitlement);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to process purchase';
        return NextResponse.json({ error: message }, { status: error instanceof Error && error.message === 'Invalid variant' ? 400 : 500 });
    }
}
