import type { MockDB } from '../core/MockDB';
import { CoursesTable } from '../data/courses';
import type {
  InstructorRecord,
  CourseCategoryRecord,
  CourseRecord,
  ChapterRecord,
  LessonRecord,
  CourseTagRecord
} from '../schema/learn.schema';

/**
 * Seed learn module data
 * Following 3NF normalization with proper junction tables
 * Populated from legacy CoursesTable (Single Source of Truth)
 */
export async function seedLearn(db: MockDB): Promise<void> {
  const now = new Date();

  // Maps to track existing entities (normalization)
  const instructorMap = new Map<string, string>(); // Name -> ID
  const categoryMap = new Map<string, string>(); // Name -> ID

  // Arrays for bulk creation
  const instructors: InstructorRecord[] = [];
  const categories: CourseCategoryRecord[] = [];
  const courses: CourseRecord[] = [];
  const chapters: ChapterRecord[] = [];
  const lessons: LessonRecord[] = [];
  const courseTags: CourseTagRecord[] = [];
  const instructorExpertise: any[] = []; // Using any to simplify for now

  let instructorCounter = 1;
  let categoryCounter = 1;

  // Process each course from the legacy data
  for (const sourceCourse of CoursesTable) {
    // 1. Handle Instructor
    const instructorName = sourceCourse.instructor.name;
    let instructorId = instructorMap.get(instructorName);

    if (!instructorId) {
      instructorId = `instructor-${instructorCounter++}`;
      instructorMap.set(instructorName, instructorId);

      instructors.push({
        id: instructorId,
        name: instructorName,
        avatar: sourceCourse.instructor.avatar,
        bio: `Expert instructor for ${sourceCourse.category}`,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      // Add dummy expertise
      instructorExpertise.push({
        id: `ie-${instructorId}-1`,
        instructorId,
        expertise: sourceCourse.category,
        sortOrder: 1
      });
    }

    // 2. Handle Category
    const categoryName = sourceCourse.category;
    let categoryId = categoryMap.get(categoryName);

    if (!categoryId) {
      categoryId = `cat-${categoryCounter++}`;
      categoryMap.set(categoryName, categoryId);

      categories.push({
        id: categoryId,
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
        description: `${categoryName} courses`,
        sortOrder: categoryCounter,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. Create Course Record
    courses.push({
      id: sourceCourse.id,
      categoryId,
      instructorId,
      title: sourceCourse.title,
      slug: sourceCourse.id, // Using ID as slug for simplicity or use title-based slug
      subtitle: sourceCourse.subtitle,
      description: sourceCourse.description,
      thumbnailUrl: sourceCourse.thumbnailUrl,
      previewVideoUrl: sourceCourse.previewVideoUrl,
      trailerUrl: sourceCourse.trailer?.youtubeId, // Assuming ID is URL or similar, simplified
      level: sourceCourse.level,
      totalDurationSeconds: sourceCourse.totalDuration,
      lessonCount: sourceCourse.lessonCount,
      isFeatured: sourceCourse.isFeatured,
      isPublished: true,
      publishedAt: sourceCourse.createdAt,
      createdAt: sourceCourse.createdAt,
      updatedAt: now,
    });

    // 4. Handle Tags
    sourceCourse.tags.forEach((tag, idx) => {
      courseTags.push({
        id: `tag-${sourceCourse.id}-${idx}`,
        courseId: sourceCourse.id,
        tag: tag,
      });
    });

    // 5. Handle Chapters & Lessons
    sourceCourse.chapters.forEach((sourceChapter, chIdx) => {
      const chapterId = sourceChapter.id || `${sourceCourse.id}-ch${chIdx + 1}`; // Ensure ID

      chapters.push({
        id: chapterId,
        courseId: sourceCourse.id,
        title: sourceChapter.title,
        description: '',
        sortOrder: chIdx + 1,
        createdAt: now,
        updatedAt: now,
      });

      sourceChapter.lessons.forEach((sourceLesson, lIdx) => {
        lessons.push({
          id: sourceLesson.id,
          courseId: sourceCourse.id,
          chapterId: chapterId,
          title: sourceLesson.title,
          description: '',
          durationSeconds: sourceLesson.duration,
          videoUrl: sourceLesson.videoUrl,
          sortOrder: lIdx + 1,
          isPublished: true,
          hasResources: false,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
  }

  // Bulk Insert
  console.log(`[SeedLearn] Seeding from CourseTable: ${courses.length} courses, ${chapters.length} chapters, ${lessons.length} lessons`);

  db.instructors.createMany(instructors);
  db.courseCategories.createMany(categories);
  db.instructorExpertise.createMany(instructorExpertise);
  db.courses.createMany(courses);
  db.courseTags.createMany(courseTags);
  db.chapters.createMany(chapters);
  db.lessons.createMany(lessons);

  // Seed sample enrollments (simplified)
  db.userCourseEnrollments.createMany([
    {
      id: 'enroll-1',
      userId: 'user-1',
      courseId: 'c2', // ChatGPT for Beginners
      progressPercent: 0,
      isCompleted: false,
      enrolledAt: now,
      lastAccessedAt: now,
      updatedAt: now
    }
  ]);

  // Seed sample reviews
  db.courseReviews.createMany([
    {
      id: 'review-1',
      userId: 'user-1',
      courseId: 'c2',
      rating: 5,
      title: 'Great start!',
      content: 'Perfect for beginners.',
      isVerifiedEnrollment: true,
      createdAt: now,
      updatedAt: now
    }
  ]);
}
