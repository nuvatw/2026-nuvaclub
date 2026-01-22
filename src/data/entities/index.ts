// Re-export from existing feature modules
export {
  MOCK_COURSES,
  COURSE_CATEGORIES,
  getFeaturedCourses,
  getCoursesByCategory,
  getCourseById,
} from '@/features/learn/data/courses';

export { MOCK_POSTS, getPinnedPosts, getRecentPosts } from '@/features/forum/data/posts';

export { MOCK_COMPANIONS } from '@/features/space/data/companions';

export { MOCK_SEASONS } from '@/features/sprint/data/sprints';

export { PLANS } from '@/features/shop/data/plans';

export {
  DUO_TICKETS,
  EVENTS,
  MERCHANDISE,
  getAllProducts,
} from '@/features/shop/data/products';
