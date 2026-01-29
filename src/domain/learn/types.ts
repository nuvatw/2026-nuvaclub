import { ChapterId, CourseId, LessonId } from '../shared/ids';

export interface LearnResource {
    courseId: CourseId;
    chapterId?: ChapterId;
    lessonId?: LessonId;
}

// Placeholder for full course entity which would likely be in core/schema but domain needs interfaces
export interface Course {
    id: CourseId;
    isFree: boolean;
    requiredLevel: number;
}
