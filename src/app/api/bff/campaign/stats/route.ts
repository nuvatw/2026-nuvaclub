import { NextResponse } from 'next/server';
import { CampaignService } from '@/application/services/CampaignService';
import { PrismaOrderRepository } from '@/infra/persistence/prisma/PrismaOrderRepository';
import { PrismaMembershipRepository } from '@/infra/persistence/prisma/PrismaMembershipRepository';

export async function GET() {
    try {
        const orderRepo = new PrismaOrderRepository();
        const membershipRepo = new PrismaMembershipRepository();
        const campaignService = new CampaignService(orderRepo, membershipRepo);

        const stats = await campaignService.getCampaignStats();

        return NextResponse.json({
            ok: true,
            totalRaised: stats.totalRaised,
            backerCount: stats.backerCount,
        });
    } catch (error) {
        console.error('[BFF Stats] Failed to fetch stats:', error);
        return NextResponse.json(
            { ok: false, msg: 'Internal server error' },
            { status: 500 }
        );
    }
}
