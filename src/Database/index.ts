/**
 * Database - Mock Data Layer
 *
 * This is the single source of truth for all mock data in the application.
 * Import from this module for access to all tables and utilities.
 *
 * @example
 * import { UsersTable, getUserById, CoursesTable } from '@/Database';
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
} from './tables/users';
export type { User, UserIdentity, MockUser } from './tables/users';

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
} from './tables/seasons';
export type { Season } from './tables/seasons';

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
} from './tables/companions';
export type { Companion, CompanionType } from './tables/companions';

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
} from './tables/plans';
export type { PlanProduct, PlanType, BillingCycle } from './tables/plans';

// Merchandise
export {
  MerchandiseTable,
  getMerchandiseById,
  getAllMerchandise,
  getMerchandiseInStock,
  MOCK_MERCHANDISE,
  MERCHANDISE,
} from './tables/merchandise';
export type { MerchandiseProduct, MerchandiseVariant } from './tables/merchandise';

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
} from './tables/forumPosts';
export type { ForumPost, Post, PostAuthor, PostCategory } from './tables/forumPosts';

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
} from './tables/comments';
export type { Comment, CommentAuthor } from './tables/comments';

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
} from './tables/events';
export type {
  EventProduct,
  EventType,
  EventAgendaItem,
  EventFAQItem,
  EventSortBy,
} from './tables/events';

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
} from './tables/duo';
export type { DuoProduct, DuoVariant, NunuTier } from './tables/duo';

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
} from './tables/courses';
export type { Course, CourseCategory, CourseLevel, CourseType, CourseTrack, Chapter, Lesson, Trailer } from './tables/courses';

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
} from './tables/sprints';
export type { Sprint, Project } from './tables/sprints';

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
} from './tables/products';
export type { Product, ShopProduct, ProductCategory } from './tables/products';

// ============================================================
// Config
// ============================================================
export * from './config';

// ============================================================
// Content
// ============================================================
export * from '@/content';

// ============================================================
// User State
// ============================================================
export * from './user-state';

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
} from './utils';
