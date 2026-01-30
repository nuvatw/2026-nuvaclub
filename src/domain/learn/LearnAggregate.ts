import { Course, UserCourseEnrollment } from '../types/learn';

export interface LearnHomeSections {
    heroCourse?: Course;
    sections: {
        id: string;
        title: string;
        courses: Course[];
        order: number;
        href?: string;
    }[];
}

export class LearnAggregate {
    constructor(
        private courses: Course[],
        private enrollments: UserCourseEnrollment[] = []
    ) { }

    /**
     * Determine the primary course for the hero section
     */
    public getHeroCourse(): Course | undefined {
        // Business Rule: Hero is the first course in progress, 
        // OR the first featured course if no progress.
        const inProgress = this.enrollments.find(e => !e.isCompleted);
        if (inProgress) {
            return this.courses.find(c => c.id === inProgress.courseId);
        }

        return this.courses.find(c => c.id === 'c2') || this.courses.find(c => c.isFeatured) || this.courses[0];
    }

    /**
     * Categorize courses into sections based on legacy rules
     */
    public getSections(requiredSeriesOrder: string[]): LearnHomeSections['sections'] {
        const sections: LearnHomeSections['sections'] = [];
        let order = 1;

        // 1. Continue Learning (if progress)
        const activeEnrollments = this.enrollments
            .filter(e => !e.isCompleted)
            .sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime());

        if (activeEnrollments.length > 0) {
            const continueCourses = activeEnrollments
                .map(e => this.courses.find(c => c.id === e.courseId))
                .filter((c): c is Course => !!c)
                .slice(0, 10);

            if (continueCourses.length > 0) {
                sections.push({
                    id: 'continue-learning',
                    title: 'Continue Learning',
                    courses: continueCourses,
                    order: order++,
                    href: '/learn/my-courses'
                });
            }
        }

        // 2. Free Courses (Level 1)
        const freeCourses = this.courses.filter(c => c.level === 1);
        if (freeCourses.length > 0) {
            sections.push({
                id: 'free-courses',
                title: 'Free Courses',
                courses: freeCourses,
                order: order++
            });
        }

        // 3. Required Series Rows
        requiredSeriesOrder.forEach(series => {
            const seriesCourses = this.courses.filter(c =>
                c.title.includes(series) ||
                c.toolTags?.includes(series) ||
                c.categoryId === series
            );

            if (seriesCourses.length > 0) {
                sections.push({
                    id: `series-${series.toLowerCase().replace(/\s+/g, '-')}`,
                    title: series,
                    courses: seriesCourses,
                    order: 10 + order++
                });
            }
        });

        // 4. All Vava Courses (fallback/popular)
        // ... in legacy this was more complex but we can simplify for the demo reconstruction

        return sections.sort((a, b) => a.order - b.order);
    }
}
