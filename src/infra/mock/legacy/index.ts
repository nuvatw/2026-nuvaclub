/**
 * Database - Mock Data Layer
 *
 * This is the single source of truth for all mock data in the application.
 * Import from this module for access to all tables and utilities.
 *
 * @example
 * import { UsersTable, getUserById, CoursesTable } from '@/infra/mock/legacy';
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
} from '@/infra/mock/data/users';
export type { User, UserIdentity, MockUser } from '@/infra/mock/data/users';

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
} from '@/infra/mock/data/seasons';
export type { Season } from '@/infra/mock/data/seasons';

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
} from '@/infra/mock/data/companions';
export type { Companion, CompanionType } from '@/infra/mock/data/companions';

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
} from '@/infra/mock/data/plans';
export type { PlanProduct, PlanType, BillingCycle } from '@/infra/mock/data/plans';

// Merchandise
export {
  MerchandiseTable,
  getMerchandiseById,
  getAllMerchandise,
  getMerchandiseInStock,
  MOCK_MERCHANDISE,
  MERCHANDISE,
} from '@/infra/mock/data/merchandise';
export type { MerchandiseProduct, MerchandiseVariant } from '@/infra/mock/data/merchandise';

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
} from '@/infra/mock/data/forumPosts';
export type { ForumPost, Post, PostAuthor, PostCategory } from '@/infra/mock/data/forumPosts';

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
} from '@/infra/mock/data/comments';
export type { Comment, CommentAuthor } from '@/infra/mock/data/comments';

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
} from '@/infra/mock/data/events';
export type {
  EventProduct,
  EventType,
  EventAgendaItem,
  EventFAQItem,
  EventSortBy,
} from '@/infra/mock/data/events';

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
} from '@/infra/mock/data/duo';
export type { DuoProduct, DuoVariant, NunuTier } from '@/infra/mock/data/duo';

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
} from '@/infra/mock/data/courses';
export type { Course, CourseCategory, CourseLevel, CourseType, CourseTrack, Chapter, Lesson, Trailer } from '@/infra/mock/data/courses';

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
} from '@/infra/mock/data/sprints';
// Re-export relational types for compatibility
export type { SeasonWithSprints, SprintWithProjects, ProjectWithRelations } from '@/infra/mock/repositories/SprintRepository';
export type { Sprint, Project } from '@/infra/mock/data/sprints';

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
} from '@/infra/mock/data/products';
export type { Product, ShopProduct, ProductCategory } from '@/infra/mock/data/products';

// Tests
export {
  getQuestionsForLevel,
  getQuestionById,
  getAllTestLevels,
  getTestLevelByNumber,
} from '@/infra/mock/data/test';

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
} from '@/infra/mock/utils/legacy-db';
