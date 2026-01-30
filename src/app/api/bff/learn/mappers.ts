import { CourseWithRelations } from '@/domain/types/learn';
import { CourseDTO, ChapterDTO, LessonDTO } from './dto';

export function toCourseDTO(course: CourseWithRelations): CourseDTO {
    const categoryName = course.category?.name || '未分類';

    return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        previewVideoUrl: course.previewVideoUrl,
        trailer: {
            title: course.trailer?.title || 'Course Trailer',
            youtubeId: course.trailer?.youtubeId || course.trailerUrl || '',
            duration: course.trailer?.duration || 0,
        },
        category: categoryName,
        tags: Array.from(new Set(
            (course.tags || [])
                .map(t => typeof t === 'string' ? t : (t as any).tag || (t as any).name)
                .filter(Boolean)
        )) as string[],
        level: course.level,
        instructor: {
            name: course.instructor?.name || '',
            avatar: course.instructor?.avatar || '',
        },
        chapters: (course.chapters || []).map((chapter): ChapterDTO => ({
            id: chapter.id,
            title: chapter.title,
            lessons: (chapter.lessons || []).map((lesson): LessonDTO => ({
                id: lesson.id,
                title: lesson.title,
                duration: lesson.durationSeconds || 0,
                videoUrl: lesson.videoUrl,
                order: lesson.sortOrder || 0,
            })),
        })),
        totalDuration: course.totalDuration || course.totalDurationSeconds || 0,
        lessonCount: course.lessonCount || 0,
        isFeatured: !!course.isFeatured,
        createdAt: course.createdAt instanceof Date
            ? course.createdAt.toISOString()
            : (course.createdAt as any || new Date().toISOString()),
        courseType: course.courseType || 'vava',
        toolTags: course.toolTags,
        isFree: !!(course.isFree || course.level === 1),
        verifiedRequired: !!course.verifiedRequired,
    };
}
