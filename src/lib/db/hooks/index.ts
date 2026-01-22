// Export all database hooks

export { useCourses, useCourse, useCourseCategories } from './useCourses';
export { usePosts, usePost } from './usePosts';
export { useCompanions, useCompanion } from './useCompanions';
export { useSprints, useSeason, useSprint } from './useSprints';
export { useProducts, useProduct } from './useProducts';
export {
  useTests,
  useTestSession,
  useUserTestProgress,
  useLevelStats,
  useActiveTestSession,
  useLevelConfigs,
  type LevelConfig,
} from './useTests';

// Space - Nunu & Matching Board hooks
export {
  useNunuProfile,
  useNunuProfiles,
  useNunuApplications,
  type NunuApplicationWithUser,
  type NunuProfileWithUser,
} from './useNunuProfile';
export {
  useMentorships,
  useAllMentorships,
  useMentorship,
  type MentorshipWithRelations,
} from './useMentorships';
export {
  useMatchingPosts,
  useMatchingPost,
  useMatchingPostLimits,
  type MatchingPostWithRelations,
  type MatchingPostFilters,
  type MatchingPostSortBy,
} from './useMatchingPosts';
export {
  useMatchingComments,
  useUserMatchingComments,
  type MatchingCommentWithRelations,
} from './useMatchingComments';
