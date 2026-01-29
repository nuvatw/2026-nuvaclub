/**
 * Database - Mock Data Layer
 *
 * This is the single source of truth for all mock data in the application.
 * Import from this module for access to all tables and utilities.
 *
 * @example
 * import { UsersTable, getUserById, CoursesTable } from '@/lib/legacy-db-shim';
 */

// ============================================================
// Tables
// ============================================================

// Users
export {
  UsersTable,
  getUserById,
  getUsersByIds,
  getCanonicalUsers,
  getExtendedUsers,
  getAllUsers,
  MOCK_USERS,
} from '@/lib/types/legacy-tables/users';
export type { User, UserIdentity, MockUser } from '@/lib/types/legacy-tables/users';

// Seasons
export {
  SeasonsTable,
  getSeasonById,
  getActiveSeason,
  getCurrentSeason,
  getActiveSeasons,
  getPastSeasons,
  getSeasonsByYear,
  getRecentSeasons,
  getAllSeasons,
  MOCK_SEASONS,
} from '@/lib/types/legacy-tables/seasons';
export type { Season } from '@/lib/types/legacy-tables/seasons';

// Companions
export {
  CompanionsTable,
  getCompanionById,
  getCompanionsByType,
  getAvailableCompanions,
  getNunuCompanions,
  getCertifiedNunuCompanions,
  getShangzheCompanion,
  getAllCompanions,
  MOCK_COMPANIONS,
} from '@/lib/types/legacy-tables/companions';
export type { Companion, CompanionType } from '@/lib/types/legacy-tables/companions';

// Plans
export {
  PlansTable,
  getPlanById,
  getPlanByType,
  getFreePlan,
  getPaidPlans,
  getAllPlans,
  getYearlySavings,
  getYearlyMonthlyEquivalent,
  formatPrice,
  PLANS,
  MOCK_PLANS,
} from '@/lib/types/legacy-tables/plans';
export type { PlanProduct, PlanType, BillingCycle } from '@/lib/types/legacy-tables/plans';

// Merchandise
export {
  MerchandiseTable,
  getMerchandiseById,
  getAllMerchandise,
  getMerchandiseInStock,
  MOCK_MERCHANDISE,
  MERCHANDISE,
} from '@/lib/types/legacy-tables/merchandise';
export type { MerchandiseProduct, MerchandiseVariant } from '@/lib/types/legacy-tables/merchandise';

// Forum Posts
export {
  ForumPostsTable,
  getPostById,
  getPinnedPosts,
  getRecentPosts,
  getPostsByCategory,
  getPostsByTag,
  searchPosts,
  getAllPosts,
  MOCK_POSTS,
} from '@/lib/types/legacy-tables/forumPosts';
export type { ForumPost, Post, PostAuthor, PostCategory } from '@/lib/types/legacy-tables/forumPosts';

// Comments
export {
  CommentsTable,
  getCommentById,
  getCommentsByPostId,
  getReplies,
  getTopLevelComments,
  getCommentCount,
  getAllComments,
  MOCK_COMMENTS,
} from '@/lib/types/legacy-tables/comments';
export type { Comment, CommentAuthor } from '@/lib/types/legacy-tables/comments';

// Events
export {
  EventsTable,
  getEventById,
  getUpcomingEvents,
  getEventsByType,
  getFreeEvents,
  getAvailableEvents,
  getPastEvents,
  getInPersonEvents,
  getOnlineEvents,
  getEventsSorted,
  searchAndFilterEvents,
  getAllEvents,
  MOCK_EVENTS,
  EVENTS,
} from '@/lib/types/legacy-tables/events';
export type {
  EventProduct,
  EventType,
  EventAgendaItem,
  EventFAQItem,
  EventSortBy,
} from '@/lib/types/legacy-tables/events';

// Duo Products
export {
  DuoProductsTable,
  getDuoProductById,
  getDuoProductByVariant,
  getMatchAccessForVariant,
  canAccessTier,
  getAllDuoProducts,
  NUNU_TIER_LABELS,
  NUNU_TIER_COLORS,
  DUO_VARIANT_LABELS,
  DUO_VARIANT_COLORS,
  DUO_PRODUCTS,
} from '@/lib/types/legacy-tables/duo';
export type { DuoProduct, DuoVariant, NunuTier } from '@/lib/types/legacy-tables/duo';

// Courses
export {
  CoursesTable,
  COURSE_CATEGORIES,
  REQUIRED_SERIES_ORDER,
  getCourseById,
  getCoursesByCategory,
  getCoursesByLevel,
  getFreeCourses,
  getFeaturedCourses,
  getAllCourses,
  getRecentCourses,
  searchCourses,
  getCourseLessons,
  getSeriesCourses,
  getCoursesBySeriesOrder,
  getFreeCoursesBySeries,
  getNunuCourses,
  getVavaCourses,
  getFreeVavaCourses,
  getAllToolTags,
  getVavaCoursesByToolTag,
  getVerifiedRequiredCourses,
  getCoursesByTrack,
  MOCK_COURSES,
  courses,
} from '@/lib/types/legacy-tables/courses';
export type { Course, CourseCategory, CourseLevel, CourseType, CourseTrack, Chapter, Lesson, Trailer } from '@/lib/types/legacy-tables/courses';

// Sprints & Projects
// Note: MOCK_SEASONS already exported from seasons.ts, Season type exported there too
export {
  SprintsTable,
  ProjectsTable,
  MOCK_SPRINTS,
  MOCK_PROJECTS,
  PROJECT_DATA,
  getSprintById,
  getSprintsBySeasonId,
  getProjectById,
  getProjectsBySprintId,
  getProjectsBySeasonId,
  getProjectsWithSeasonInfo,
  getAllPastProjects,
  formatSeasonDateRange,
} from '@/lib/types/legacy-tables/sprints';
export type { Sprint, Project } from '@/lib/types/legacy-tables/sprints';

// Shop Products (Aggregator)
// Note: EVENTS, MERCHANDISE, DUO_PRODUCTS already exported from their respective tables
// Note: EventProduct, MerchandiseProduct, DuoProduct types already exported
export {
  getAllProducts,
  getAllShopProducts,
  toShopProduct,
  getProductsByCategory,
  getShopEventById,
  getShopProductById,
} from '@/lib/types/legacy-tables/products';
export type { Product, ShopProduct, ProductCategory } from '@/lib/types/legacy-tables/products';

// ============================================================
// Config
// ============================================================
export * from '@/lib/config';

// ============================================================
// Content
// ============================================================
export * from '@/content';

// ============================================================
// User State
// ============================================================
export * from '@/lib/types/legacy-user-state';

// ============================================================
// Utilities
// ============================================================
export {
  findById,
  findByIds,
  filterBy,
  sortBy,
  paginate,
  groupBy,
} from '@/lib/utils/legacy-db';
