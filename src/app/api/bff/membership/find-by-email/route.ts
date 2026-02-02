import { NextResponse } from 'next/server';
import { PrismaMembershipRepository } from '@/infra/persistence/prisma/PrismaMembershipRepository';

const membershipRepo = new PrismaMembershipRepository();

// Mapping tier keys to display names
const TIER_NAMES: Record<string, string> = {
    'tier-1': '買 2 送 1',
    'tier-2': '買 3 送 3',
    'tier-3': '買 5 送 7',
    'explorer': 'Explorer',
    'traveler': 'Traveler',
    'pro': 'Pro'
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const memberships = await membershipRepo.findByEmail(email);

        if (memberships.length === 0) {
            return NextResponse.json({ found: false });
        }

        // Return the first one for now
        const m = memberships[0];

        // Calculate months if possible, or use a default
        // In a real scenario, we might want to store the duration in cardMetadata
        const months = m.cardMetadata?.tier === 'tier-1' ? 3 :
            m.cardMetadata?.tier === 'tier-2' ? 6 :
                m.cardMetadata?.tier === 'tier-3' ? 12 : 0;

        return NextResponse.json({
            found: true,
            member: {
                id: m.id,
                email: m.cardMetadata?.email,
                name: m.cardMetadata?.fullName || 'Backer',
                backerNumber: parseInt(m.memberNo.replace('#', '')) || 0,
                tierName: TIER_NAMES[m.tier] || m.tier,
                months: months,
                joinDate: m.createdAt,
                status: m.status,
            }
        });
    } catch (error) {
        console.error('[Search API Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
