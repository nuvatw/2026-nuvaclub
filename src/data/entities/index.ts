/**
 * Entity Re-exports
 *
 * This file re-exports from @/Database for backward compatibility.
 * New code should import directly from '@/Database'.
 *
 * @deprecated Import from '@/Database' instead
 */

// Courses - still in original location (not yet migrated to Database)
export {
  MOCK_COURSES,
  COURSE_CATEGORIES,
  getFeaturedCourses,
  getCoursesByCategory,
  getCourseById,
} from '@/features/learn/data/courses';

// Forum - from Database
export { MOCK_POSTS, getPinnedPosts, getRecentPosts } from '@/Database';

// Companions - from Database
export { MOCK_COMPANIONS } from '@/Database';

// Seasons - from Database
export { MOCK_SEASONS } from '@/Database';

// Shop - from Database
export { MOCK_PLANS, PLANS } from '@/Database';
export { MOCK_MERCHANDISE, MERCHANDISE } from '@/Database';
export { getAllProducts } from '@/mocks/entities/products.mock';
export { MOCK_EVENTS, EVENTS } from '@/Database';
