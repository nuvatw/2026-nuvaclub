'use client';

import { useState, useMemo } from 'react';
import {
  AnimatedSearchIcon,
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
import { SearchIcon } from '@/components/icons';

export default function LearnPage() {
  const { sections, isHydrated } = useLearnSections();
  const featuredCourses = getFeaturedCourses();
  const [searchQuery, setSearchQuery] = useState('');

  // Use "ChatGPT Complete Beginner's Guide" as the hero course
  const heroCourse = getCourseById('course-2') || featuredCourses[0];

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return sections;
    }

    const query = searchQuery.toLowerCase().trim();

    return sections
      .map((section) => ({
        ...section,
        courses: section.courses.filter((course) =>
          course.title.toLowerCase().includes(query) ||
          course.subtitle.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query) ||
          course.tags.some((tag) => tag.toLowerCase().includes(query))
        ),
      }))
      .filter((section) => section.courses.length > 0);
  }, [sections, searchQuery]);

  const totalFilteredCourses = filteredSections.reduce(
    (sum, section) => sum + section.courses.length,
    0
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <PageTransition skeleton={<LearnPageSkeleton />}>
      <HoverPreviewProvider<Course> config={{ width: 400, maxHeight: 480 }}>
        <div className="min-h-screen bg-neutral-950">
          {/* Video Hero with Search Icon */}
          <div className="relative">
            <VideoHero course={heroCourse} videoId="0kARDVL2nZg" />

            {/* Animated Search Icon - Top right of hero section */}
            <div className="absolute top-24 right-6 z-20">
              <AnimatedSearchIcon
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search courses..."
              />
            </div>
          </div>

          {/* Course Rows - Dynamically ordered based on user identity and progress */}
          <div className="relative -mt-20 z-10 pb-16">
            {/* Search Results Info */}
            {isSearching && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex items-center justify-between bg-neutral-900/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-neutral-800">
                  <p className="text-sm text-neutral-300">
                    Found <span className="text-white font-medium">{totalFilteredCourses}</span> course{totalFilteredCourses !== 1 ? 's' : ''} matching "<span className="text-primary-400">{searchQuery}</span>"
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Course Sections */}
            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <CourseRow
                    key={section.id}
                    title={section.title}
                    courses={section.courses}
                    href={section.href}
                  />
                ))
              ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                      <SearchIcon size="lg" className="text-neutral-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No courses found
                    </h3>
                    <p className="text-neutral-400 max-w-md mb-4">
                      We couldn't find any courses matching "{searchQuery}". Try adjusting your search terms.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New hover preview panel with scroll-pinned behavior */}
          <LearnHoverPreview />
        </div>
      </HoverPreviewProvider>
    </PageTransition>
  );
}
