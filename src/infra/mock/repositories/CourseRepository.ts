import { ICourseRepository } from '@/application/ports/ICourseRepository';
import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import { Course } from '@/domain/types/learn';
import type { QueryOptions, PaginatedResult } from '../core/types';
import type {
  CourseRecord,
  LessonRecord,
  CourseCategoryRecord,
  InstructorRecord,
  CourseTagRecord,
} from '../schema';
import { DEMO_COURSES } from '../learn/demoCourses';



export interface CourseWithRelations extends CourseRecord {
  lessons: LessonRecord[];
  chapters: any[];
  category: CourseCategoryRecord;
  instructor: InstructorRecord;
  tags: string[];
  trailer: {
    title: string;
    youtubeId: string;
    duration: number;
  };
  totalDuration: number;
  courseType: 'vava' | 'nunu';
  isFree: boolean;
  verifiedRequired?: boolean;
}

export class CourseRepository extends BaseRepository<CourseRecord> implements ICourseRepository {
  constructor(db: MockDB) {
    super(db.courses, db);
  }

  /**
   * Find an entity by ID
   */
  override findById(id: string): Course | any {
    const record = super.findById(id);
    if (!record) {
      // Check if ID is actually a demo slug or ID
      const demoResult = this.findBySlug(id);
      if (demoResult) return demoResult;
    }
    return record ? this.enrichCourse(record) : undefined;
  }

  /**
   * Find all entities
   */
  override findAll(): Course[] {
    const records = super.findAll();
    return records.map((r) => this.enrichCourse(r));
  }

  /**
   * Find entities matching query options
   */
  override findMany(options?: QueryOptions<Course>): Course[] {
    // We cast options to any because QueryOptions<Course> might not perfectly match QueryOptions<CourseRecord>
    // but the underlying Collection.findMany will handle it based on the actual record properties.
    const records = super.findMany(options as any);
    return records.map((r) => this.enrichCourse(r));
  }

  /**
   * Find the first entity matching query options
   */
  override findFirst(options?: QueryOptions<Course>): Course | undefined {
    const record = super.findFirst(options as any);
    return record ? this.enrichCourse(record) : undefined;
  }

  /**
   * Get paginated results
   */
  override findPaginated(
    page: number,
    pageSize: number,
    options?: Omit<QueryOptions<Course>, 'limit' | 'offset'>
  ): PaginatedResult<Course> {
    const paginatedRecords = super.findPaginated(page, pageSize, options as any);
    return {
      ...paginatedRecords,
      items: paginatedRecords.items.map((r) => this.enrichCourse(r)),
    };
  }

  /**
   * Count entities matching optional where clause
   */
  override count(where?: QueryOptions<Course>['where']): number {
    return super.count(where as any);
  }

  /**
   * Check if an entity exists
   */
  override exists(id: string): boolean {
    return super.exists(id);
  }

  /**
   * Create a new entity
   */
  override create(data: Omit<Course, 'id'> & { id?: string }): Course {
    const record = this.mapToRecord(data);
    const created = super.create(record as any);
    return this.enrichCourse(created);
  }

  /**
   * Create multiple entities
   */
  override createMany(data: Array<Omit<Course, 'id'> & { id?: string }>): Course[] {
    const records = data.map(d => this.mapToRecord(d));
    const created = super.createMany(records as any);
    return created.map(r => this.enrichCourse(r));
  }

  /**
   * Update an entity by ID
   */
  override update(id: string, data: Partial<Course>): Course | undefined {
    // We map only the fields that are present in data
    const recordUpdate = this.mapToRecord(data as any);
    const updated = super.update(id, recordUpdate as any);
    return updated ? this.enrichCourse(updated) : undefined;
  }

  /**
   * Upsert - create or update
   */
  override upsert(id: string, data: Omit<Course, 'id'>): Course {
    const record = this.mapToRecord(data);
    const upserted = super.upsert(id, record as any);
    return this.enrichCourse(upserted);
  }

  /**
   * Map domain Course-like object to persistence CourseRecord-like object
   */
  private mapToRecord(data: any): Partial<CourseRecord> {
    const record: any = { ...data };

    // Map totalDuration back to totalDurationSeconds if needed
    if (data.totalDuration !== undefined) {
      record.totalDurationSeconds = data.totalDuration;
    }

    // Remove fields that don't exist in the pure CourseRecord
    // but we keep some of them if we added them to the interface above
    delete record.chapters;
    delete record.lessons;
    delete record.category;
    delete record.instructor;
    delete record.tags;
    delete record.trailer;

    return record;
  }

  /**
   * Find course with all relations
   */
  findByIdWithRelations(id: string): CourseWithRelations | undefined {
    return this.findById(id);
  }

  /**
   * Find course by slug
   */
  findBySlug(slug: string): CourseWithRelations | undefined {
    const course = this.findFirst({ where: { slug } });
    if (!course) {
      // Fallback for demo data
      const demoData = (DEMO_COURSES as any)[slug];
      if (demoData) {
        return {
          ...demoData.course,
          chapters: demoData.chapters,
          lessons: demoData.chapters.flatMap((ch: any) => ch.lessons),
          category: demoData.category,
          instructor: demoData.instructor,
          tags: demoData.tags,
          trailer: {
            title: 'Course Trailer',
            youtubeId: demoData.course.trailerUrl || '',
            duration: 120,
          },
          totalDuration: demoData.course.totalDurationSeconds,
          courseType: (demoData.course as any).courseType || 'vava',
          isFree: demoData.course.level === 1,
        };
      }
      return undefined;
    }

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
    const chapters = this.db.chapters.findMany({
      where: { courseId: course.id },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });

    const lessons = this.db.lessons.findMany({
      where: { courseId: course.id },
      orderBy: { field: 'sortOrder', direction: 'asc' },
    });

    // Nest lessons into chapters
    const chaptersWithLessons = chapters.map(chapter => ({
      ...chapter,
      lessons: lessons.filter(l => l.chapterId === chapter.id)
    }));

    // For backward compatibility / edge cases where lessons exist without chapters (shouldn't happen with new seed)
    // we could check for orphaned lessons, but for now we assume the seed is correct.

    const category = this.db.courseCategories.findById(course.categoryId);
    const instructor = this.db.instructors.findById(course.instructorId);

    const tagRecords = this.db.courseTags.findMany({
      where: { courseId: course.id },
    });
    const tags = tagRecords.map((t) => t.tag);

    return {
      ...course,
      chapters: chaptersWithLessons, // Return the nested structure needed by frontend
      lessons, // Keep flat lessons if needed by other components, or for easy counting
      category: category!,
      instructor: instructor!,
      tags,
      trailer: {
        title: 'Course Trailer',
        youtubeId: course.trailerUrl || '',
        duration: 120,
      },
      // Map totalDurationSeconds back to totalDuration for legacy compatibility
      totalDuration: course.totalDurationSeconds,
      courseType: (course as any).courseType || 'vava',
      isFree: course.level === 1,
    };
  }
}
