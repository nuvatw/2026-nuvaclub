'use client';

import {
  CourseRow,
  HoverPreviewProvider,
  LearnHoverPreview,
  VideoHero,
} from '@/features/learn/components';
import { useLearnSections } from '@/features/learn/sections/useLearnSections';
import type { Course } from '@/features/learn/types';
import { getCourseById, getFeaturedCourses } from '@/features/learn/data/courses';
import { PageTransition } from '@/components/molecules/PageTransition';
import { LearnPageSkeleton } from '@/components/skeletons';

export default function LearnPage() {
  const { sections, isHydrated } = useLearnSections();
  const featuredCourses = getFeaturedCourses();
  // Use "ChatGPT Complete Beginner's Guide" as the hero course
  const heroCourse = getCourseById('course-2') || featuredCourses[0];

  return (
    <PageTransition skeleton={<LearnPageSkeleton />}>
      <HoverPreviewProvider<Course> config={{ width: 400, maxHeight: 480 }}>
        <div className="min-h-screen bg-neutral-950">
          {/* Video Hero - Single course with video background */}
          <VideoHero course={heroCourse} videoId="0kARDVL2nZg" />

          {/* Course Rows - Dynamically ordered based on user identity and progress */}
          <div className="relative -mt-20 z-10 space-y-2 pb-16">
            {sections.map((section) => (
              <CourseRow
                key={section.id}
                title={section.title}
                courses={section.courses}
                href={section.href}
              />
            ))}
          </div>

          {/* New hover preview panel with scroll-pinned behavior */}
          <LearnHoverPreview />
        </div>
      </HoverPreviewProvider>
    </PageTransition>
  );
}
