import { NextResponse } from 'next/server';
import { shopService } from '@/app/api/bff/composition';

export async function GET() {
    try {
        const events = shopService.getProductsByCategory('event');
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
