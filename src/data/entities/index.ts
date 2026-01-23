/**
 * Entity Re-exports
 *
 * This file re-exports from @/mocks for backward compatibility.
 * New code should import directly from '@/mocks'.
 *
 * @deprecated Import from '@/mocks' instead
 */

// Courses - still in original location
export {
  MOCK_COURSES,
  COURSE_CATEGORIES,
  getFeaturedCourses,
  getCoursesByCategory,
  getCourseById,
} from '@/features/learn/data/courses';

// Forum - from mocks
export { MOCK_POSTS, getPinnedPosts, getRecentPosts } from '@/mocks/entities/posts.mock';

// Companions - from mocks
export { MOCK_COMPANIONS } from '@/mocks/entities/companions.mock';

// Seasons - from mocks
export { MOCK_SEASONS } from '@/mocks/entities/seasons.mock';

// Shop - from mocks
export { MOCK_PLANS, PLANS } from '@/mocks/entities/plans.mock';
export { MOCK_MERCHANDISE, MERCHANDISE, getAllProducts } from '@/mocks/entities/products.mock';
export { MOCK_EVENTS, EVENTS } from '@/mocks/entities/events.mock';
