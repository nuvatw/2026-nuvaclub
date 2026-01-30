'use client';

import { useState, useEffect } from 'react';
import type { UserPoints, PointsLeaderboardEntry } from '@/features/forum/types';

/**
 * Hook to get a user's points via BFF
 */
export function useUserPoints(userId: string | null) {
    const [points, setPoints] = useState<UserPoints | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setPoints(null);
            setIsLoading(false);
            return;
        }

        let mounted = true;
        setIsLoading(true);

        fetch('/api/bff/user/points')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch points');
                return res.json();
            })
            .then(data => {
                if (mounted) {
                    setPoints(data);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [userId]);

    return { points, isLoading };
}

/**
 * Hook to get the leaderboard via BFF
 */
export function useLeaderboard(limit = 10) {
    const [entries, setEntries] = useState<PointsLeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);

        fetch(`/api/bff/leaderboard?limit=${limit}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch leaderboard');
                return res.json();
            })
            .then(data => {
                if (mounted) {
                    setEntries(data);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [limit]);

    return { entries, isLoading };
}
