
import type {
    UserPoints,
    PointTransaction,
    PointActionType
} from '@/domain/types';

export interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar?: string;
    identityType: string;
    totalPoints: number;
    learningPoints: number;
    communityPoints: number;
}

export interface IPointsRepository {
    /**
     * Get or create user points record
     */
    getOrCreateUserPoints(userId: string): UserPoints | Promise<UserPoints>;

    /**
     * Award points to a user with cap enforcement
     */
    awardPoints(
        userId: string,
        actionType: PointActionType,
        target?: { type: string; id: string }
    ): { pointsAwarded: number; wasCapped: boolean } | Promise<{ pointsAwarded: number; wasCapped: boolean }>;

    /**
     * Get user's total points
     */
    getUserTotalPoints(userId: string): number | Promise<number>;

    /**
     * Get leaderboard (top contributors by total points)
     */
    getLeaderboard(limit?: number): LeaderboardEntry[] | Promise<LeaderboardEntry[]>;

    /**
     * Get user's transaction history
     */
    getTransactionHistory(
        userId: string,
        limit?: number
    ): PointTransaction[] | Promise<PointTransaction[]>;
}
