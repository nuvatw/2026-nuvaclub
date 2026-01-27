/**
 * @deprecated Import from '@/Database' or '@/Database/tables/courses' instead.
 *
 * This file is a compatibility re-export. All course data now lives in Database/tables/courses.ts.
 *
 * Migration guide:
 *   // Old
 *   import { MOCK_COURSES, getCourseById } from '@/features/learn/data/courses';
 *
 *   // New
 *   import { CoursesTable, getCourseById } from '@/Database';
 */

export * from '@/Database/tables/courses';
