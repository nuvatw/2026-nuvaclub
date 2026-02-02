import { NextResponse } from 'next/server';
import { CampaignService } from '@/application/services/CampaignService';
import { PrismaOrderRepository } from '@/infra/persistence/prisma/PrismaOrderRepository';
import { PrismaMembershipRepository } from '@/infra/persistence/prisma/PrismaMembershipRepository';

export async function POST() {
    // Basic security check: Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ ok: false, msg: 'Not allowed in production' }, { status: 403 });
    }

    try {
        const orderRepo = new PrismaOrderRepository();
        const membershipRepo = new PrismaMembershipRepository();
        const campaignService = new CampaignService(orderRepo, membershipRepo);

        const result = await campaignService.resetCampaign();

        if (result.ok) {
            return NextResponse.json({ ok: true });
        } else {
            return NextResponse.json({ ok: false, msg: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('[BFF Reset] Failed to reset:', error);
        return NextResponse.json(
            { ok: false, msg: 'Internal server error' },
            { status: 500 }
        );
    }
}
