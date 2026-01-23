import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  CourseRecord,
  LessonRecord,
  CourseCategoryRecord,
  InstructorRecord,
  CourseTagRecord,
} from '../schema';

export interface CourseWithRelations extends CourseRecord {
  lessons?: LessonRecord[];
  category?: CourseCategoryRecord;
  instructor?: InstructorRecord;
  tags?: string[];
}

export class CourseRepository extends BaseRepository<CourseRecord> {
  constructor(db: MockDB) {
    super(db.courses, db);
  }

  /**
   * Find course with all relations
   */
  findByIdWithRelations(id: string): CourseWithRelations | undefined {
    const course = this.findById(id);
    if (!course) return undefined;

    return this.enrichCourse(course);
  }

  /**
   * Find all courses with relations
   */
  findAllWithRelations(): CourseWithRelations[] {
    const courses = this.findAll();
    return courses.map((c) => this.enrichCourse(c));
  }

  /**
   * Find featured courses
   */
  findFeatured(): CourseWithRelations[] {
    const courses = this.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
    return courses.map((c) => this.enrichCourse(c));
  }

  /**
   * Find courses by category
   */
  findByCategory(categoryId: string): CourseWithRelations[] {
    const courses = this.findMany({
      where: { categoryId, isPublished: true },
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
    return courses.map((c) => this.enrichCourse(c));
  }

  /**
   * Find free courses (level 1 courses are free)
   */
  findFree(): CourseWithRelations[] {
    const courses = this.findMany({
      where: (c) => c.level === 1 && c.isPublished,
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
    return courses.map((c) => this.enrichCourse(c));
  }

  /**
   * Search courses by title or description
   */
  search(query: string): CourseWithRelations[] {
    const lowerQuery = query.toLowerCase();
    const courses = this.findMany({
      where: (c) =>
        c.isPublished &&
        (c.title.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery)),
    });
    return courses.map((c) => this.enrichCourse(c));
  }

  /**
   * Get all categories
   */
  getCategories(): CourseCategoryRecord[] {
    return this.db.courseCategories.findMany({
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });
  }

  /**
   * Get lessons for a course
   */
  getLessons(courseId: string): LessonRecord[] {
    return this.db.lessons.findMany({
      where: { courseId },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });
  }

  /**
   * Enrich course with relations
   */
  private enrichCourse(course: CourseRecord): CourseWithRelations {
    const lessons = this.db.lessons.findMany({
      where: { courseId: course.id },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });

    const category = this.db.courseCategories.findById(course.categoryId);
    const instructor = this.db.instructors.findById(course.instructorId);

    const tagRecords = this.db.courseTags.findMany({
      where: { courseId: course.id },
    });
    const tags = tagRecords.map((t) => t.tag);

    return {
      ...course,
      lessons,
      category,
      instructor,
      tags,
    };
  }
}
