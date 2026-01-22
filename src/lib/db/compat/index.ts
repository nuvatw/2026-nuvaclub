/**
 * Compatibility layer for gradual migration
 *
 * This module provides functions that convert between the old data format
 * and the new database schema format, allowing existing components to
 * work while new components use the database directly.
 */

import type { Course, Lesson, CourseCategory } from '@/features/learn/types';
import type { Post, Comment } from '@/features/forum/types';
import type { Companion } from '@/features/space/types';
import type { Season, Sprint, Project } from '@/features/sprint/types';

import type {
  CourseRecord,
  LessonRecord,
  CourseCategoryRecord,
  InstructorRecord,
  PostRecord,
  CommentRecord,
  CompanionRecord,
  SeasonRecord,
  SprintRecord,
  ProjectRecord,
  UserRecord,
} from '../schema';

import type { CourseWithRelations } from '../repositories/CourseRepository';
import type { PostWithRelations, CommentWithAuthor } from '../repositories/PostRepository';
import type { CompanionWithRelations } from '../repositories/CompanionRepository';
import type { SeasonWithSprints, SprintWithProjects, ProjectWithRelations } from '../repositories/SprintRepository';

// ==========================================
// LEARN MODULE CONVERTERS
// ==========================================

/**
 * Convert database course record to legacy Course format
 */
export function dbCourseToLegacy(course: CourseWithRelations): Course {
  const categoryNames: Record<string, string> = {
    'cat-1': 'AI Fundamentals',
    'cat-2': 'Advanced Applications',
    'cat-3': 'Practical Projects',
    'cat-4': 'Tools & Techniques',
    'cat-5': 'Free Courses',
  };

  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    trailer: course.trailerUrl,
    previewVideoUrl: course.previewVideoUrl,
    category: course.category?.name ?? categoryNames[course.categoryId] ?? '',
    tags: course.tags ?? [],
    instructor: course.instructor
      ? { name: course.instructor.name, avatar: course.instructor.avatar }
      : { name: 'Unknown', avatar: '' },
    accessLevel: course.accessLevel,
    lessons: (course.lessons ?? []).map(dbLessonToLegacy),
    totalDuration: course.totalDuration,
    lessonCount: course.lessonCount,
    isFeatured: course.isFeatured,
    createdAt: course.createdAt,
  };
}

/**
 * Convert database lesson record to legacy Lesson format
 */
export function dbLessonToLegacy(lesson: LessonRecord): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    videoUrl: lesson.videoUrl,
    accessLevel: lesson.accessLevel,
    order: lesson.order,
  };
}

/**
 * Convert database category record to legacy CourseCategory format
 */
export function dbCategoryToLegacy(category: CourseCategoryRecord): CourseCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

// ==========================================
// FORUM MODULE CONVERTERS
// ==========================================

/**
 * Convert database post record to legacy Post format
 */
export function dbPostToLegacy(post: PostWithRelations): Post {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: {
      id: post.author?.id ?? '',
      name: post.author?.name ?? 'Unknown',
      avatar: post.author?.avatar,
      identity: (post.author?.identityType ?? 'guest') as Post['author']['identity'],
    },
    category: post.category,
    tags: post.tags ?? [],
    score: post.score,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    isPinned: post.isPinned,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

/**
 * Convert database comment record to legacy Comment format
 */
export function dbCommentToLegacy(comment: CommentWithAuthor): Comment {
  return {
    id: comment.id,
    postId: comment.postId,
    content: comment.content,
    author: {
      id: comment.author?.id ?? '',
      name: comment.author?.name ?? 'Unknown',
      avatar: comment.author?.avatar,
    },
    score: comment.score,
    parentId: comment.parentId,
    createdAt: comment.createdAt,
  };
}

// ==========================================
// SPACE MODULE CONVERTERS
// ==========================================

/**
 * Convert database companion record to legacy Companion format
 */
export function dbCompanionToLegacy(companion: CompanionWithRelations): Companion {
  return {
    id: companion.id,
    name: companion.name,
    avatar: companion.avatar,
    type: companion.type,
    bio: companion.bio,
    expertise: companion.expertise ?? [],
    discordId: companion.discordId,
    isAvailable: companion.isAvailable,
    matchCount: companion.matchCount,
    rating: companion.avgRating,
  };
}

// ==========================================
// SPRINT MODULE CONVERTERS
// ==========================================

/**
 * Convert database season record to legacy Season format
 */
export function dbSeasonToLegacy(season: SeasonWithSprints): Season {
  const now = new Date();
  return {
    id: season.id,
    name: season.name,
    description: season.description,
    startDate: season.startDate,
    endDate: season.endDate,
    isActive: season.isActive ?? (season.startDate <= now && season.endDate >= now),
  };
}

/**
 * Convert database sprint record to legacy Sprint format
 */
export function dbSprintToLegacy(sprint: SprintWithProjects): Sprint {
  return {
    id: sprint.id,
    seasonId: sprint.seasonId,
    title: sprint.title,
    description: sprint.description,
    theme: sprint.theme,
    thumbnailUrl: sprint.thumbnailUrl,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    votingStartDate: sprint.votingStartDate,
    projectCount: sprint.projectCount,
    isVotingOpen: sprint.isVotingOpen ?? false,
  };
}

/**
 * Convert database project record to legacy Project format
 */
export function dbProjectToLegacy(project: ProjectWithRelations): Project {
  return {
    id: project.id,
    sprintId: project.sprintId,
    title: project.title,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl,
    videoUrl: project.videoUrl,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    techStack: project.techStack ?? [],
    author: {
      id: project.author?.id ?? '',
      name: project.author?.name ?? 'Unknown',
      avatar: project.author?.avatar,
    },
    voteCount: project.voteCount,
    viewCount: project.viewCount ?? 0,
    starCount: project.starCount ?? 0,
    rank: project.rank,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
