/**
 * NuvaClub Mock Data - Central Export
 *
 * This is the single entry point for all mock data in the application.
 * Import from '@/mocks' for centralized access to all mock data.
 */

// ============================================================
// ENTITIES
// ============================================================
export * from './entities/users.mock';
export * from './entities/posts.mock';
export * from './entities/comments.mock';
export * from './entities/companions.mock';
export * from './entities/seasons.mock';
export * from './entities/sprints.mock';

// Projects - re-exported from original location due to complex generation logic
export {
  MOCK_PROJECTS,
  PROJECT_DATA,
  getProjectById,
  getProjectsBySprintId,
  getProjectsBySeasonId,
  getProjectsWithSeasonInfo,
  getAllPastProjects,
  formatSeasonDateRange,
} from '@/features/sprint/data/sprints';

export * from './entities/plans.mock';
export * from './entities/products.mock';
export * from './entities/events.mock';

// Note: Courses are re-exported from the original location for now
// to avoid breaking changes. Will be migrated in a future update.
export {
  MOCK_COURSES,
  COURSE_CATEGORIES,
  getCourseById,
  getCoursesByCategory,
  getCoursesByLevel,
  getFreeCourses,
  getFeaturedCourses,
  getAllCourses,
  getRecentCourses,
  searchCourses,
  getCourseLessons,
} from '@/features/learn/data/courses';

// ============================================================
// USER STATE
// ============================================================
export * from './user-state/progress.mock';
export * from './user-state/favorites.mock';

// ============================================================
// CONFIG
// ============================================================
export * from './config/permissions.mock';
export * from './config/identities.mock';
export * from './config/levels.mock';
export * from './config/comparisons.mock';

// ============================================================
// CONTENT
// ============================================================
export * from './content/youtube-pool';
