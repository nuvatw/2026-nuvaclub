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
export {
  useMentorshipAgreements,
  useNunuEarnings,
  useVavaSpending,
  type MentorshipAgreementWithRelations,
  type AgreementFilters,
} from './useMentorshipAgreements';

// Forum - Points & Trending hooks
export { useTrendingPosts } from './useTrendingPosts';
export {
  usePostsFiltered,
  type SortOption,
  type TimeFilter,
} from './usePostsFiltered';
export { useBookmark } from './useBookmark';
export { useTrackView } from './useTrackView';
export { useShare } from './useShare';
export { useUserPoints, useLeaderboard } from './useUserPoints';

// Learn - Video Progress hooks
export {
  useVideoProgress,
  getVideoResumePoint,
  type LessonProgress,
  type TrailerProgress,
  type ResumePoint,
} from './useVideoProgress';

// Duo - Month Pass hooks
export {
  useDuoMonthPasses,
  type DuoMonthPassWithMeta,
} from '@/features/duo/hooks/useDuoMonthPasses';
