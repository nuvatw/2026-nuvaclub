'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import { PointsRepository, type LeaderboardEntry } from '@/infra/mock/repositories/PointsRepository';
import type { UserPointsRecord } from '@/infra/mock/schema/user.schema';

/**
 * Hook to get a user's points
 */
export function useUserPoints(userId: string | null) {
  const db = useDB();

  const { points, isLoading } = useMemo(() => {
    if (!db || !userId) {
      return { points: null as UserPointsRecord | null, isLoading: !db };
    }
    const repo = new PointsRepository(db);
    const userPoints = repo.getOrCreateUserPoints(userId);
    return { points: userPoints, isLoading: false };
  }, [db, userId]);

  return { points, isLoading };
}

/**
 * Hook to get the leaderboard
 */
export function useLeaderboard(limit = 10) {
  const db = useDB();

  const { entries, isLoading } = useMemo(() => {
    if (!db) {
      return { entries: [] as LeaderboardEntry[], isLoading: true };
    }
    const repo = new PointsRepository(db);
    const leaderboard = repo.getLeaderboard(limit);
    return { entries: leaderboard, isLoading: false };
  }, [db, limit]);

  return { entries, isLoading };
}
