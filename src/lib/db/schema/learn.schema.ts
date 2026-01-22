// ==========================================
// Instructors Table
// ==========================================
export interface InstructorRecord {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  expertise: string[];
  createdAt: Date;
}

// ==========================================
// Course Categories Table
// ==========================================
export interface CourseCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

// ==========================================
// Courses Table
// ==========================================
export type CourseAccessLevel = 'first-chapter' | 'free' | 'paid';

export interface CourseRecord {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  trailerUrl?: string;
  categoryId: string;
  instructorId: string;
  accessLevel: CourseAccessLevel;
  totalDuration: number; // seconds
  lessonCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Course Tags Table (junction)
// ==========================================
export interface CourseTagRecord {
  id: string;
  courseId: string;
  tag: string;
}

// ==========================================
// Lessons Table
// ==========================================
export interface LessonRecord {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  duration: number; // seconds
  videoUrl: string;
  accessLevel: CourseAccessLevel;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// User Course Progress Table
// ==========================================
export interface UserCourseProgressRecord {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number; // 0-100
  currentLessonId?: string;
  completedLessonIds: string[];
  lastAccessedAt: Date;
  completedAt?: Date;
}

// ==========================================
// User Lesson Progress Table
// ==========================================
export interface UserLessonProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  progressPercent: number; // 0-100
  currentPosition: number; // seconds
  completedAt?: Date;
  lastWatchedAt: Date;
}
