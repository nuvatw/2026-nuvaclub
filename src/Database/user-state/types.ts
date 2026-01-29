/**
 * User State Types
 *
 * Types for user progress, favorites, and activity tracking.
 * Migrated from data/types/user.ts, data/types/common.ts, data/types/sections.ts
 */

// Re-export core types from the canonical source
export type { BaseEntity, Timestamps } from '@/infra/mock/core/types';

// ==================== COMMON TYPES ====================

export interface Authored {
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Categorized {
  category: string;
  tags: string[];
}

export type ModuleType = 'learn' | 'forum' | 'space' | 'sprint' | 'shop';

export type ItemType = 'course' | 'lesson' | 'post' | 'project' | 'companion' | 'product';

// ==================== USER TYPES ====================

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

// ==================== SECTION TYPES ====================

export type SectionType =
  | 'continue-watching'
  | 'free-content'
  | 'recommendations'
  | 'category'
  | 'featured'
  | 'trending';

export interface ContinueWatchingItem {
  id: string;
  type: 'course' | 'sprint-project';
  title: string;
  thumbnailUrl: string;
  progress: WatchProgress;
  subtitle?: string;
  instructor?: { name: string; avatar: string };
  category?: string;
}

export interface FreeItem {
  id: string;
  type: 'course' | 'event' | 'post';
  title: string;
  description: string;
  thumbnailUrl: string;
  accessLevel: 'free';
  metadata: {
    category?: string;
    tags?: string[];
    instructor?: { name: string; avatar: string };
    date?: Date;
    duration?: number;
  };
}

export interface RecommendationScore {
  userId: string;
  itemId: string;
  itemType: 'course' | 'post' | 'sprint-project' | 'companion';
  score: number;
  reasons: RecommendationReason[];
}

export type RecommendationReason =
  | { type: 'category-match'; category: string }
  | { type: 'tag-match'; tags: string[] }
  | { type: 'trending'; viewCount: number }
  | { type: 'completion-based'; completedItemId: string };

export interface CategoryGroup<T = unknown> {
  id: string;
  name: string;
  slug: string;
  description?: string;
  itemCount: number;
  items: T[];
}

export interface Section<T = unknown> {
  id: string;
  title: string;
  subtitle?: string;
  type: SectionType;
  items: T[];
  viewAllHref?: string;
  emptyState?: {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
  };
}

export const FREE_CONTENT_TITLES: Record<ModuleType, string> = {
  learn: 'Free Courses',
  forum: 'Free Discussions',
  space: 'Free Space',
  sprint: 'Free Challenges',
  shop: 'Free Products',
};
