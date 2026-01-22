import type { ModuleType, ItemType } from './common';

export interface WatchProgress {
  itemId: string;
  itemType: 'course' | 'lesson' | 'sprint-project';
  userId: string;
  progressPercent: number;
  currentPosition: number;
  totalDuration: number;
  lastWatchedAt: Date;
  completedAt?: Date;
}

export interface UserFavorite {
  userId: string;
  itemId: string;
  itemType: ItemType;
  addedAt: Date;
}

export interface UserActivity {
  userId: string;
  type: 'view' | 'like' | 'comment' | 'purchase' | 'complete';
  targetType: ItemType;
  targetId: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}
