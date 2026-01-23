// ============================================================================
// LEARNING MODULE - Database Schema
// Following 3NF Normalization Principles
// ============================================================================

import type { CourseLevel } from '@/features/learn/types';

// ==========================================
// ENUMS & TYPES
// ==========================================
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// ==========================================
// INSTRUCTORS TABLE
// Course instructors/teachers
// ==========================================
export interface InstructorRecord {
  // Primary Key
  id: string;

  // Profile Information
  name: string;
  avatar: string;
  bio?: string;

  // Social/Contact Links
  discordId?: string;
  linkedinUrl?: string;
  websiteUrl?: string;

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: isActive

// ==========================================
// INSTRUCTOR EXPERTISE TABLE (Junction)
// Normalized from embedded array - 1NF compliance
// ==========================================
export interface InstructorExpertiseRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  instructorId: string; // FK -> instructors.id

  // Data
  expertise: string;
  sortOrder: number;
}

// Unique Index: (instructorId, expertise)
// Index: instructorId

// ==========================================
// COURSE CATEGORIES TABLE
// Hierarchical course organization
// ==========================================
export interface CourseCategoryRecord {
  // Primary Key
  id: string;

  // Category Information
  name: string;
  slug: string;
  description?: string;

  // Hierarchy (self-referential for subcategories)
  parentId?: string; // FK -> course_categories.id

  // Display Order
  sortOrder: number;

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: slug
// Index: parentId, sortOrder

// ==========================================
// COURSES TABLE
// Main course entity
// ==========================================
export interface CourseRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  categoryId: string; // FK -> course_categories.id
  instructorId: string; // FK -> instructors.id

  // Course Information
  title: string;
  subtitle: string;
  description: string;

  // Media
  thumbnailUrl: string;
  previewVideoUrl?: string;
  trailerUrl?: string;

  // Access Level (1=free, 2-10=premium tiers)
  level: CourseLevel;

  // Metadata (computed/denormalized for performance)
  totalDurationSeconds: number;
  lessonCount: number;

  // Publishing Status
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: categoryId, instructorId, level, isPublished, isFeatured

// ==========================================
// COURSE TAGS TABLE (Junction)
// Many-to-many relationship for course tagging
// ==========================================
export interface CourseTagRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  courseId: string; // FK -> courses.id

  // Data
  tag: string;
}

// Unique Index: (courseId, tag)
// Index: courseId, tag

// ==========================================
// LESSONS TABLE
// Individual course lessons/videos
// ==========================================
export interface LessonRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  courseId: string; // FK -> courses.id

  // Lesson Information
  title: string;
  description?: string;
  durationSeconds: number;

  // Media
  videoUrl: string;
  thumbnailUrl?: string;

  // Resources (normalized from embedded)
  hasResources: boolean;

  // Ordering
  sortOrder: number;

  // Status
  isPublished: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Index: courseId, sortOrder, isPublished

// ==========================================
// LESSON RESOURCES TABLE
// Downloadable resources for lessons
// ==========================================
export interface LessonResourceRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  lessonId: string; // FK -> lessons.id

  // Resource Information
  title: string;
  type: 'pdf' | 'code' | 'link' | 'file';
  url: string;
  fileSize?: number; // bytes

  // Ordering
  sortOrder: number;

  // Timestamps
  createdAt: Date;
}

// Index: lessonId, sortOrder

// ==========================================
// USER COURSE ENROLLMENTS TABLE
// Tracks user enrollment and progress in courses
// ==========================================
export interface UserCourseEnrollmentRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  courseId: string; // FK -> courses.id

  // Progress Tracking
  currentLessonId?: string; // FK -> lessons.id
  progressPercent: number; // 0-100, computed from completed lessons

  // Completion Status
  isCompleted: boolean;
  completedAt?: Date;

  // Timestamps
  enrolledAt: Date;
  lastAccessedAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, courseId)
// Index: userId, courseId, isCompleted

// ==========================================
// USER LESSON PROGRESS TABLE
// Detailed progress for each lesson
// ==========================================
export interface UserLessonProgressRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  lessonId: string; // FK -> lessons.id
  enrollmentId: string; // FK -> user_course_enrollments.id

  // Progress Tracking
  watchedSeconds: number; // How far they've watched
  progressPercent: number; // 0-100

  // Completion
  isCompleted: boolean;
  completedAt?: Date;

  // Timestamps
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, lessonId)
// Index: enrollmentId, isCompleted

// ==========================================
// USER COMPLETED LESSONS TABLE (Junction)
// Normalized tracking of completed lessons
// Replaces completedLessonIds array for 1NF compliance
// ==========================================
export interface UserCompletedLessonRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  lessonId: string; // FK -> lessons.id
  enrollmentId: string; // FK -> user_course_enrollments.id

  // Timestamps
  completedAt: Date;
}

// Unique Index: (userId, lessonId)
// Index: enrollmentId

// ==========================================
// COURSE REVIEWS TABLE
// User reviews for courses
// ==========================================
export interface CourseReviewRecord {
  // Primary Key
  id: string;

  // Foreign Keys
  userId: string; // FK -> users.id
  courseId: string; // FK -> courses.id

  // Review Content
  rating: number; // 1-5
  title?: string;
  content?: string;

  // Verification
  isVerifiedEnrollment: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Unique Index: (userId, courseId) - one review per user per course
// Index: courseId, rating
