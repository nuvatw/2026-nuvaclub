
import { IPointsRepository, LeaderboardEntry } from '../ports';
import type { UserPoints, PointActionType, PointTransaction } from '@/domain/types';

export class PointsService {
    constructor(private pointsRepository: IPointsRepository) { }

    getOrCreateUserPoints(userId: string): Promise<UserPoints> | UserPoints {
        return this.pointsRepository.getOrCreateUserPoints(userId);
    }

    awardPoints(
        userId: string,
        actionType: PointActionType,
        target?: { type: string; id: string }
    ): Promise<{ pointsAwarded: number; wasCapped: boolean }> | { pointsAwarded: number; wasCapped: boolean } {
        return this.pointsRepository.awardPoints(userId, actionType, target);
    }

    getUserTotalPoints(userId: string): Promise<number> | number {
        return this.pointsRepository.getUserTotalPoints(userId);
    }

    getLeaderboard(limit?: number): Promise<LeaderboardEntry[]> | LeaderboardEntry[] {
        return this.pointsRepository.getLeaderboard(limit);
    }

    getTransactionHistory(userId: string, limit?: number): Promise<PointTransaction[]> | PointTransaction[] {
        return this.pointsRepository.getTransactionHistory(userId, limit);
    }
}
