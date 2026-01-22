export type CourseAccessLevel = 'first-chapter' | 'free' | 'paid';

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  accessLevel: CourseAccessLevel;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  trailer?: string;
  category: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
  };
  accessLevel: CourseAccessLevel;
  lessons: Lesson[];
  totalDuration: number;
  lessonCount: number;
  isFeatured: boolean;
  createdAt: Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}
