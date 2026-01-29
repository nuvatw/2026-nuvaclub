import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { DuoMonthPassRecord } from '@/infra/mock/schema/user.schema';

// Import the DB singleton and utilities
// Note: In production, this would use a proper database
// For this implementation, we use localStorage-synced MockDB

/**
 * GET /api/duo-pass/entitlements
 *
 * Query params:
 * - userId: string (required)
 * - fromYear: number (optional, defaults to current year)
 * - toYear: number (optional, defaults to current year + 1)
 *
 * Returns all active duo month passes for the specified user and year range.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const fromYear = parseInt(searchParams.get('fromYear') || String(new Date().getFullYear()), 10);
    const toYear = parseInt(searchParams.get('toYear') || String(new Date().getFullYear() + 1), 10);

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Since MockDB uses localStorage which is client-only,
    // we need to return a response that indicates the client should fetch locally.
    // In a real app, this would query a database.
    //
    // For this implementation, we return a special response that tells the client
    // to use its local DB hook.

    return NextResponse.json({
      message: 'Use client-side useDuoMonthPasses hook for data',
      params: { userId, fromYear, toYear },
      // In a real implementation with a server-side DB:
      // passes: await db.duoMonthPasses.findMany({ where: { userId } })
    });
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
