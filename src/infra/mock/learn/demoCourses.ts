import type {
    CourseRecord,
    LessonRecord,
    ChapterRecord,
    InstructorRecord,
    CourseCategoryRecord
} from '../schema';

export interface DemoCourseData {
    course: CourseRecord;
    chapters: (ChapterRecord & { lessons: LessonRecord[] })[];
    category: CourseCategoryRecord;
    instructor: InstructorRecord;
    tags: string[];
}

const now = new Date();

export const DEMO_COURSES: Record<string, DemoCourseData> = {
    'demo2k7': {
        course: {
            id: 'course-1',
            title: 'AI Social Media Copywriter',
            slug: 'demo2k7',
            subtitle: 'Write menu items, food stories, and event promotions like a pro',
            description: 'Transform "I don\'t know what to write, can\'t write anything unique, no one reads what I write" into a reusable copywriting workflow. From product positioning and target audience analysis to copywriting, systematically improve your copywriting skills.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
            trailerUrl: 'dLRdaUda8Ho',
            categoryId: 'cat-1',
            instructorId: 'instructor-1',
            level: 4,
            totalDurationSeconds: 7200,
            lessonCount: 3,
            isFeatured: true,
            isPublished: true,
            publishedAt: new Date('2026-01-01'),
            createdAt: new Date('2026-01-01'),
            updatedAt: now,
        },
        category: {
            id: 'cat-1',
            name: 'AI Basics',
            slug: 'ai-basics',
            description: 'Foundational AI knowledge',
            sortOrder: 1,
            isActive: true,
            createdAt: now,
            updatedAt: now
        },
        instructor: {
            id: 'instructor-1',
            name: 'Luna',
            avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=luna&top=longHairStraight',
            bio: 'AI content specialist with 5 years experience',
            isActive: true,
            createdAt: now,
            updatedAt: now
        },
        tags: ['Copywriting', 'ChatGPT', 'Marketing'],
        chapters: [
            {
                id: 'ch-1',
                courseId: 'course-1',
                title: 'Introduction',
                sortOrder: 1,
                createdAt: now,
                updatedAt: now,
                lessons: [
                    {
                        id: 'l1-1',
                        courseId: 'course-1',
                        chapterId: 'ch-1',
                        title: 'Course Introduction',
                        description: 'Introduction to AI copywriting',
                        durationSeconds: 300,
                        videoUrl: 'dLRdaUda8Ho',
                        sortOrder: 1,
                        isPublished: true,
                        hasResources: false,
                        createdAt: now,
                        updatedAt: now
                    }
                ]
            },
            {
                id: 'ch-2',
                courseId: 'course-1',
                title: 'Core Concepts',
                sortOrder: 2,
                createdAt: now,
                updatedAt: now,
                lessons: [
                    {
                        id: 'l1-2',
                        courseId: 'course-1',
                        chapterId: 'ch-2',
                        title: 'AI Copywriting Fundamentals',
                        description: 'Learn the basics of AI-assisted writing',
                        durationSeconds: 900,
                        videoUrl: 'dLRdaUda8Ho',
                        sortOrder: 1,
                        isPublished: true,
                        hasResources: true,
                        createdAt: now,
                        updatedAt: now
                    },
                    {
                        id: 'l1-3',
                        courseId: 'course-1',
                        chapterId: 'ch-2',
                        title: 'Product Positioning Analysis',
                        description: 'How to analyze and position your products',
                        durationSeconds: 1200,
                        videoUrl: 'dLRdaUda8Ho',
                        sortOrder: 2,
                        isPublished: true,
                        hasResources: true,
                        createdAt: now,
                        updatedAt: now
                    }
                ]
            }
        ]
    }
};
