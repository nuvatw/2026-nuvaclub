/**
 * Database Schema
 *
 * Re-exports all types from the Database tables.
 * Use this for type-only imports.
 *
 * @example
 * import type { User, Course, ForumPost } from '@/Database/schema';
 */

// Users
export type { User, UserIdentity, MockUser } from './tables/users';

// Seasons
export type { Season } from './tables/seasons';

// Companions
export type { Companion, CompanionType } from './tables/companions';

// Plans
export type { PlanProduct, PlanType, BillingCycle } from './tables/plans';

// Merchandise
export type { MerchandiseProduct, MerchandiseVariant } from './tables/merchandise';

// Forum Posts
export type { ForumPost, Post, PostAuthor, PostCategory } from './tables/forumPosts';

// Comments
export type { Comment, CommentAuthor } from './tables/comments';

// Events
export type {
  EventProduct,
  EventType,
  EventAgendaItem,
  EventFAQItem,
  EventSortBy,
} from './tables/events';

// Duo Products
export type { DuoProduct, DuoVariant, NunuTier } from './tables/duo';
