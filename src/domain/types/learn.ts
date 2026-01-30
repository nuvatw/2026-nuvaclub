export type CourseLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Instructor {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    discordId?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface InstructorExpertise {
    id: string;
    instructorId: string;
    expertise: string;
    sortOrder: number;
}

export interface CourseCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Course {
    id: string;
    categoryId: string;
    instructorId: string;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    thumbnailUrl: string;
    previewVideoUrl?: string;
    trailerUrl?: string; // Legacy field
    trailer?: {          // New structured field
        title: string;
        youtubeId: string;
        duration: number;
    };
    level: CourseLevel;
    totalDuration: number; // Renamed for consistency with legacy
    totalDurationSeconds: number; // Required fallback for consistency with record.
    lessonCount: number;
    isFeatured: boolean;
    isPublished: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    courseType: 'vava' | 'nunu';
    toolTags?: string[];
    isFree: boolean;
    track?: string;
    verifiedRequired?: boolean;
}

export interface CourseTag {
    id: string;
    courseId: string;
    tag: string;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    durationSeconds: number;
    videoUrl: string;
    thumbnailUrl?: string;
    hasResources: boolean;
    sortOrder: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface LessonResource {
    id: string;
    lessonId: string;
    title: string;
    type: 'pdf' | 'code' | 'link' | 'file';
    url: string;
    fileSize?: number;
    sortOrder: number;
    createdAt: Date;
}

export interface UserCourseEnrollment {
    id: string;
    userId: string;
    courseId: string;
    currentLessonId?: string;
    progressPercent: number;
    isCompleted: boolean;
    completedAt?: Date;
    enrolledAt: Date;
    lastAccessedAt: Date;
    updatedAt: Date;
}

export interface UserLessonProgress {
    id: string;
    userId: string;
    lessonId: string;
    enrollmentId: string;
    watchedSeconds: number;
    progressPercent: number;
    isCompleted: boolean;
    completedAt?: Date;
    lastWatchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCompletedLesson {
    id: string;
    userId: string;
    lessonId: string;
    enrollmentId: string;
    completedAt: Date;
}

export interface CourseReview {
    id: string;
    userId: string;
    courseId: string;
    rating: number;
    title?: string;
    content?: string;
    isVerifiedEnrollment: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserTrailerProgress {
    id: string;
    userId: string;
    courseId: string;
    watchedSeconds: number;
    progressPercent: number;
    isCompleted: boolean;
    completedAt?: Date;
    lastWatchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// --- Extended Types (with relations for BFF/UI) ---

export interface LessonWithRelations extends Lesson {
    // No extra relations for lesson yet, but keeps pattern consistent
}

export interface ChapterWithRelations {
    id: string;
    title: string;
    lessons: LessonWithRelations[];
}

export interface CourseWithRelations extends Course {
    category?: CourseCategory;
    instructor?: Instructor;
    chapters?: ChapterWithRelations[];
    tags?: CourseTag[];
}
