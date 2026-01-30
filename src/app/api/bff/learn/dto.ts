export type CourseLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type CourseType = 'vava' | 'nunu';

export interface LessonDTO {
    id: string;
    title: string;
    duration: number;
    videoUrl: string;
    order: number;
}

export interface ChapterDTO {
    id: string;
    title: string;
    lessons: LessonDTO[];
}

export interface TrailerDTO {
    title: string;
    youtubeId: string;
    duration: number;
}

export interface CourseDTO {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    thumbnailUrl: string;
    previewVideoUrl?: string;
    trailer: TrailerDTO;
    category: string;
    tags: string[];
    level: CourseLevel;
    instructor: {
        name: string;
        avatar: string;
    };
    chapters: ChapterDTO[];
    totalDuration: number;
    lessonCount: number;
    isFeatured: boolean;
    createdAt: string; // ISO string for JSON
    courseType: CourseType;
    toolTags?: string[];
    isFree: boolean;
    verifiedRequired?: boolean;
}

// --- DTO Enforcement ---
type Primitive = string | number | boolean | null | undefined;

type AssertDTO<T> = {
    [K in keyof T]: T[K] extends Primitive
    ? T[K]
    : T[K] extends Primitive[]
    ? T[K]
    : T[K] extends object
    ? T[K] extends Array<infer U>
    ? AssertDTO<U>[]
    : AssertDTO<T[K]>
    : never;
};

// Compile-time check: If this fails, a non-primitive has leaked into CourseDTO
type _CourseDTOCheck = AssertDTO<CourseDTO>;
