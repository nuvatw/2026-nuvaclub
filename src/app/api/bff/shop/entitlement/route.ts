
import { NextResponse } from 'next/server';
import { MockDB } from '@/infra/mock/core/MockDB';
import { UserRepository } from '@/infra/mock/repositories/UserRepository';
import type { DuoVariant, NunuTier, DuoEntitlement } from '@/features/shop/types';

const DUO_ACCESS_MAP: Record<DuoVariant, NunuTier[]> = {
    'go': ['nunu'],
    'run': ['nunu', 'verified_nunu'],
    'fly': ['nunu', 'verified_nunu', 'super_nunu']
};

async function getUserHelper() {
    // In a real app, verify session here.
    // For ANTIGRAVITY Phase 1, we simulate a user.
    // Using 'user-1' as the pilot user.
    // Ideally, read from headers: const userId = request.headers.get('x-user-id') || 'user-1';
    return 'user-1';
}

export async function GET() {
    const userId = await getUserHelper();

    const db = MockDB.getInstance();
    await db.initialize();
    const userRepo = new UserRepository(db);

    const ticket = userRepo.getActiveDuoTicket(userId);

    if (!ticket) {
        return NextResponse.json(null);
    }

    const variant = ticket.tier as DuoVariant;

    const entitlement: DuoEntitlement = {
        variant: variant,
        purchasedAt: ticket.purchasedAt.toISOString(),
        matchAccess: DUO_ACCESS_MAP[variant] || []
    };

    return NextResponse.json(entitlement);
}


export async function DELETE() {
    const userId = await getUserHelper();
    const db = MockDB.getInstance();
    await db.initialize();

    const existing = db.userDuoTickets.findFirst({
        where: t => t.userId === userId && t.status === 'active'
    });

    if (existing) {
        db.userDuoTickets.update(existing.id, {
            status: 'expired'
        });
        await db.persist();
    }

    return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
    const userId = await getUserHelper();
    const body = await request.json();
    const { variant } = body as { variant: DuoVariant };

    if (!variant || !DUO_ACCESS_MAP[variant]) {
        return NextResponse.json({ error: 'Invalid variant' }, { status: 400 });
    }

    const db = MockDB.getInstance();
    await db.initialize();

    // Logic: Create or Update Duo Ticket
    // We access collection directly for simplicity in this BFF pilot
    const existing = db.userDuoTickets.findFirst({
        where: t => t.userId === userId && t.status === 'active'
    });

    if (existing) {
        // Upgrade or Replace
        db.userDuoTickets.update(existing.id, {
            status: 'expired'
        });
    }

    // Create new
    db.userDuoTickets.create({
        userId,
        tier: variant,
        status: 'active',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days example
        purchasedAt: new Date(),
        createdAt: new Date()
    });

    await db.persist();

    const entitlement: DuoEntitlement = {
        variant,
        purchasedAt: new Date().toISOString(),
        matchAccess: DUO_ACCESS_MAP[variant]
    };

    return NextResponse.json(entitlement);
}
