/**
 * Compatibility layer for gradual migration
 *
 * This module provides functions that convert between the old data format
 * and the new database schema format, allowing existing components to
 * work while new components use the database directly.
 */

import type { Course, Lesson, Chapter, Trailer, CourseCategory, CourseLevel } from '@/features/learn/types';
import type { Post, Comment } from '@/features/forum/types';
import type { Companion } from '@/features/space/types';
import type { Season, Sprint, Project } from '@/features/sprint/types';

import type {
  CourseRecord,
  LessonRecord,
  CourseCategoryRecord,
  InstructorRecord,
  ForumPostRecord,
  ForumCommentRecord,
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

// Legacy type aliases for backward compatibility
export type PostRecord = ForumPostRecord;
export type CommentRecord = ForumCommentRecord;

// ==========================================
// LEARN MODULE CONVERTERS
// ==========================================

/**
 * Convert database course record to Course format with chapters
 */
export function dbCourseToLegacy(course: CourseWithRelations): Course {
  const categoryNames: Record<string, string> = {
    'cat-1': 'AI Fundamentals',
    'cat-2': 'Advanced Applications',
    'cat-3': 'Practical Projects',
    'cat-4': 'Tools & Techniques',
    'cat-5': 'Free Courses',
  };

  // Convert flat lessons to chapters (group by 5 lessons each)
  const lessons = (course.lessons ?? []).map(dbLessonToLegacy);
  const chapters: Chapter[] = [];
  const lessonsPerChapter = 5;

  for (let i = 0; i < lessons.length; i += lessonsPerChapter) {
    const chapterLessons = lessons.slice(i, i + lessonsPerChapter);
    const chapterIndex = Math.floor(i / lessonsPerChapter) + 1;
    chapters.push({
      id: `${course.id}-ch${chapterIndex}`,
      title: `Chapter ${chapterIndex}`,
      lessons: chapterLessons,
    });
  }

  // If no lessons, create empty default chapter
  if (chapters.length === 0) {
    chapters.push({
      id: `${course.id}-ch1`,
      title: 'Chapter 1',
      lessons: [],
    });
  }

  // Create trailer object from trailerUrl
  const trailer: Trailer = {
    title: 'Course Trailer',
    youtubeId: course.trailerUrl ?? '',
    duration: 120,
  };

  // Determine course type from category or track
  const categoryName = course.category?.name ?? categoryNames[course.categoryId] ?? '';
  const isNunuCourse = categoryName === 'Nunu Training' || course.tags?.includes('Nunu');

  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    trailer,
    previewVideoUrl: course.previewVideoUrl,
    category: categoryName,
    tags: course.tags ?? [],
    instructor: course.instructor
      ? { name: course.instructor.name, avatar: course.instructor.avatar }
      : { name: 'Unknown', avatar: '' },
    level: course.level,
    chapters,
    totalDuration: course.totalDurationSeconds,
    lessonCount: course.lessonCount,
    isFeatured: course.isFeatured,
    createdAt: course.createdAt,
    // New fields for Vava/Nunu course type system
    courseType: isNunuCourse ? 'nunu' : 'vava',
    toolTags: isNunuCourse ? undefined : [categoryName],
    isFree: course.level === 1,
  };
}

/**
 * Convert database lesson record to legacy Lesson format
 */
export function dbLessonToLegacy(lesson: LessonRecord): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.durationSeconds,
    videoUrl: lesson.videoUrl,
    order: lesson.sortOrder,
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
    score: post.stats?.score ?? 0,
    upvotes: post.stats?.upvotes ?? 0,
    downvotes: post.stats?.downvotes ?? 0,
    commentCount: post.stats?.commentCount ?? 0,
    viewCount: post.stats?.viewCount ?? 0,
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
    score: comment.stats?.score ?? 0,
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
    matchCount: companion.stats?.matchCount ?? 0,
    rating: companion.stats?.avgRating ?? 0,
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
    projectCount: sprint.stats?.projectCount ?? 0,
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
    voteCount: project.stats?.voteCount ?? 0,
    viewCount: project.stats?.viewCount ?? 0,
    starCount: project.stats?.starCount ?? 0,
    rank: project.rank,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
