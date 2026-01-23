// Course levels from 1 (beginner) to 10 (expert)
export type CourseLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Trailer {
  title: string;
  youtubeId: string;
  duration: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  trailer: Trailer;
  category: string;
  tags: string[];
  level: CourseLevel;
  instructor: {
    name: string;
    avatar: string;
  };
  chapters: Chapter[];
  totalDuration: number;
  lessonCount: number;
  isFeatured: boolean;
  createdAt: Date;
}

// Helper to get all lessons from a course (flattens chapters)
export function getAllLessons(course: Course): Lesson[] {
  return course.chapters.flatMap((chapter) => chapter.lessons);
}

// Helper to get lesson by flat index
export function getLessonByIndex(course: Course, index: number): Lesson | undefined {
  const lessons = getAllLessons(course);
  return lessons[index];
}

// Helper to get chapter and lesson index from flat index
export function getChapterAndLessonIndex(
  course: Course,
  flatIndex: number
): { chapterIndex: number; lessonIndex: number } | undefined {
  let count = 0;
  for (let chapterIndex = 0; chapterIndex < course.chapters.length; chapterIndex++) {
    const chapter = course.chapters[chapterIndex];
    for (let lessonIndex = 0; lessonIndex < chapter.lessons.length; lessonIndex++) {
      if (count === flatIndex) {
        return { chapterIndex, lessonIndex };
      }
      count++;
    }
  }
  return undefined;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

// Level labels and colors
export const LEVEL_LABELS: Record<CourseLevel, string> = {
  1: 'Lv.1 Beginner',
  2: 'Lv.2 Basic',
  3: 'Lv.3 Elementary',
  4: 'Lv.4 Intermediate',
  5: 'Lv.5 Upper-Int',
  6: 'Lv.6 Advanced',
  7: 'Lv.7 Proficient',
  8: 'Lv.8 Expert',
  9: 'Lv.9 Master',
  10: 'Lv.10 Grandmaster',
};

export const LEVEL_COLORS: Record<CourseLevel, string> = {
  1: 'bg-green-500',
  2: 'bg-green-600',
  3: 'bg-blue-500',
  4: 'bg-blue-600',
  5: 'bg-purple-500',
  6: 'bg-purple-600',
  7: 'bg-orange-500',
  8: 'bg-orange-600',
  9: 'bg-red-500',
  10: 'bg-red-600',
};

export const LEVEL_BADGE_VARIANTS: Record<CourseLevel, 'success' | 'primary' | 'warning' | 'error' | 'default'> = {
  1: 'success',
  2: 'success',
  3: 'primary',
  4: 'primary',
  5: 'default',
  6: 'default',
  7: 'warning',
  8: 'warning',
  9: 'error',
  10: 'error',
};

// Helper to check if course is free (level 1)
export function isFreeCourse(course: Course): boolean {
  return course.level === 1;
}

// Legacy exports for backward compatibility
export type CourseAccessLevel = 'first-chapter' | 'free' | 'paid';
export const ACCESS_LABELS: Record<CourseAccessLevel, string> = {
  'first-chapter': 'First Chapter Free',
  free: 'Free',
  paid: 'Premium',
};
export const ACCESS_BADGE_VARIANTS: Record<CourseAccessLevel, 'default' | 'success' | 'warning'> = {
  'first-chapter': 'default',
  free: 'success',
  paid: 'warning',
};
