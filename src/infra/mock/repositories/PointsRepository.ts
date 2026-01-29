import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  UserPointsRecord,
  PointTransactionRecord,
  PointCategory,
  PointActionType,
} from '../schema/user.schema';
import {
  getPointValue,
  getCategoryForAction,
  isUpvoteAction,
  calculatePointsWithCap,
  needsDailyReset,
  getStartOfUTCDay,
  DAILY_CAPS,
} from '@/features/forum/utils/userPoints';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  identityType: string;
  totalPoints: number;
  learningPoints: number;
  communityPoints: number;
}

export class PointsRepository extends BaseRepository<UserPointsRecord> {
  constructor(db: MockDB) {
    super(db.userPoints, db);
  }

  /**
   * Get or create user points record
   */
  getOrCreateUserPoints(userId: string): UserPointsRecord {
    let points = this.findFirst({ where: { userId } });

    if (!points) {
      const now = new Date();
      points = this.create({
        userId,
        totalPoints: 0,
        learningPoints: 0,
        communityPoints: 0,
        dailyLearningPoints: 0,
        dailyCommunityPoints: 0,
        dailyUpvotePoints: 0,
        lastDailyReset: getStartOfUTCDay(),
        createdAt: now,
        updatedAt: now,
      });
    }

    // Check if daily reset is needed
    return this.maybeResetDaily(points);
  }

  /**
   * Award points to a user with cap enforcement
   */
  awardPoints(
    userId: string,
    actionType: PointActionType,
    target?: { type: string; id: string }
  ): { pointsAwarded: number; wasCapped: boolean } {
    const userPoints = this.getOrCreateUserPoints(userId);
    const basePoints = getPointValue(actionType);
    const category = getCategoryForAction(actionType);

    // Calculate daily cap based on category and action type
    let dailyCap: number;
    let currentDailyPoints: number;

    if (category === 'learning') {
      dailyCap = DAILY_CAPS.learning;
      currentDailyPoints = userPoints.dailyLearningPoints;
    } else {
      // Community category - check for upvote sub-cap
      if (isUpvoteAction(actionType)) {
        // Upvote actions have their own sub-cap
        dailyCap = DAILY_CAPS.upvotes;
        currentDailyPoints = userPoints.dailyUpvotePoints;
      } else {
        dailyCap = DAILY_CAPS.community;
        currentDailyPoints = userPoints.dailyCommunityPoints;
      }
    }

    // Calculate actual points with cap
    const { actualPoints, wasCapped } = calculatePointsWithCap(
      basePoints,
      currentDailyPoints,
      dailyCap
    );

    // If no points to award, skip the rest
    if (actualPoints === 0 && basePoints > 0) {
      return { pointsAwarded: 0, wasCapped: true };
    }

    // Create transaction record
    this.db.pointTransactions.create({
      userId,
      category,
      actionType,
      points: actualPoints,
      targetType: target?.type,
      targetId: target?.id,
      wasCapped,
      createdAt: new Date(),
    });

    // Update user points
    const updates: Partial<UserPointsRecord> = {
      totalPoints: userPoints.totalPoints + actualPoints,
      updatedAt: new Date(),
    };

    if (category === 'learning') {
      updates.learningPoints = userPoints.learningPoints + actualPoints;
      updates.dailyLearningPoints = userPoints.dailyLearningPoints + Math.max(0, actualPoints);
    } else {
      updates.communityPoints = userPoints.communityPoints + actualPoints;
      updates.dailyCommunityPoints = userPoints.dailyCommunityPoints + Math.max(0, actualPoints);
      if (isUpvoteAction(actionType)) {
        updates.dailyUpvotePoints = userPoints.dailyUpvotePoints + Math.max(0, actualPoints);
      }
    }

    this.update(userPoints.id, updates);

    return { pointsAwarded: actualPoints, wasCapped };
  }

  /**
   * Get user's total points
   */
  getUserTotalPoints(userId: string): number {
    const points = this.findFirst({ where: { userId } });
    return points?.totalPoints ?? 0;
  }

  /**
   * Get leaderboard (top contributors by total points)
   */
  getLeaderboard(limit = 10): LeaderboardEntry[] {
    const allPoints = this.findAll();

    // Sort by total points descending
    const sorted = allPoints.sort((a, b) => b.totalPoints - a.totalPoints);

    // Get top entries with user info
    return sorted.slice(0, limit).map((points) => {
      const user = this.db.users.findById(points.userId);
      return {
        userId: points.userId,
        name: user?.name ?? 'Unknown User',
        avatar: user?.avatar,
        identityType: user?.identityType ?? 'explorer',
        totalPoints: points.totalPoints,
        learningPoints: points.learningPoints,
        communityPoints: points.communityPoints,
      };
    });
  }

  /**
   * Get user's transaction history
   */
  getTransactionHistory(
    userId: string,
    limit = 50
  ): PointTransactionRecord[] {
    return this.db.pointTransactions.findMany({
      where: { userId },
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit,
    });
  }

  /**
   * Reset daily points if needed
   */
  private maybeResetDaily(points: UserPointsRecord): UserPointsRecord {
    if (needsDailyReset(points.lastDailyReset)) {
      const updated = this.update(points.id, {
        dailyLearningPoints: 0,
        dailyCommunityPoints: 0,
        dailyUpvotePoints: 0,
        lastDailyReset: getStartOfUTCDay(),
        updatedAt: new Date(),
      });
      return updated ?? points;
    }
    return points;
  }
}
