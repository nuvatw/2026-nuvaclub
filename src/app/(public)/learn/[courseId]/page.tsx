'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { getCourseById } from '@/features/learn/data/courses';
import { VideoPlayer } from '@/features/learn/components/VideoPlayer';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { CourseDetailSkeleton } from '@/components/skeletons';
import { LEVEL_LABELS, LEVEL_BADGE_VARIANTS, getAllLessons } from '@/features/learn/types';

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const { courseId } = use(params);
  const course = getCourseById(courseId);
  const { identity } = useAuth();

  // Video player state
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(-1); // -1 = trailer

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <Link href="/learn">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get all lessons from chapters
  const allLessons = getAllLessons(course);

  // Derive access level from course level (level 1 = free, others = paid)
  const isFreeCourse = course.level === 1;
  const courseAccessLevel = isFreeCourse ? 'free' : 'paid';

  // Check if user can access lesson
  // Level 1 courses: all lessons free
  // Level 2+ courses: first lesson free (preview), rest require subscription
  const canAccessLesson = (lessonIndex: number) => {
    if (isFreeCourse) return true; // Level 1 courses are fully free
    if (lessonIndex === 0) return true; // First lesson always available as preview
    // Paid content requires subscription
    return ['solo-traveler', 'duo-go', 'duo-run', 'duo-fly'].includes(identity);
  };

  // Handle lesson click
  const handleLessonClick = (lessonIndex: number) => {
    if (!canAccessLesson(lessonIndex)) return;
    setSelectedLessonIndex(lessonIndex);
    setIsPlayerOpen(true);
  };

  // Handle start learning (plays trailer first)
  const handleStartLearning = () => {
    setSelectedLessonIndex(-1); // -1 = trailer
    setIsPlayerOpen(true);
  };

  // Get current video ID based on selected index (-1 = trailer)
  const currentVideoId = selectedLessonIndex === -1
    ? (course.trailer?.youtubeId || allLessons[0]?.videoUrl || '')
    : (allLessons[selectedLessonIndex]?.videoUrl || '');

  return (
    <PageTransition skeleton={<CourseDetailSkeleton />}>
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="primary">{course.category}</Badge>
                <Badge variant={LEVEL_BADGE_VARIANTS[course.level]}>
                  {LEVEL_LABELS[course.level]}
                </Badge>
                {isFreeCourse && (
                  <Badge variant="success">Free</Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                {course.title}
              </h1>

              <p className="text-lg text-neutral-300 mb-4">{course.subtitle}</p>

              <div className="flex items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>{course.instructor.name}</span>
                </div>
                <span>•</span>
                <span>{course.lessonCount} lessons</span>
                <span>•</span>
                <span>{Math.round(course.totalDuration / 60)} mins</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Description
                </h2>
                <p className="text-neutral-300 leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            {/* Lessons - organized by chapters */}
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Curriculum
                </h2>
                <div className="space-y-6">
                  {(() => {
                    let flatIndex = 0;
                    return course.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-2">
                        {/* Chapter Header */}
                        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide px-2">
                          {chapter.title}
                        </h3>

                        {/* Lessons in Chapter */}
                        {chapter.lessons.map((lesson) => {
                          const currentIndex = flatIndex++;
                          const hasAccess = canAccessLesson(currentIndex);
                          const isPreview = !isFreeCourse && currentIndex === 0;

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleLessonClick(currentIndex)}
                              className={cn(
                                'flex items-center gap-4 p-4 rounded-lg',
                                'bg-neutral-800/50 border border-neutral-800',
                                'transition-colors duration-150',
                                hasAccess
                                  ? 'hover:bg-neutral-800 cursor-pointer'
                                  : 'opacity-60 cursor-not-allowed'
                              )}
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-medium text-neutral-300">
                                {currentIndex + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium truncate">
                                    {lesson.title}
                                  </span>
                                  {isPreview && (
                                    <Badge variant="default" size="sm">
                                      Preview
                                    </Badge>
                                  )}
                                  {isFreeCourse && (
                                    <Badge variant="success" size="sm">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-neutral-400">
                                  {Math.round(lesson.duration / 60)} mins
                                </span>
                              </div>
                              <div className="flex-shrink-0">
                                {hasAccess ? (
                                  <svg
                                    className="w-5 h-5 text-primary-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-5 h-5 text-neutral-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <Card className="sticky top-24">
              <CardContent>
                <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="p-4 rounded-full bg-white/90">
                      <svg
                        className="w-8 h-8 text-neutral-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {!isFreeCourse && identity !== 'solo-traveler' && !identity.startsWith('duo') ? (
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-400 text-center">
                      Upgrade to Traveler to watch the full course
                    </p>
                    <Link href="/shop">
                      <Button className="w-full">Upgrade Plan</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={handleStartLearning}
                    >
                      Start Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" onClick={handleStartLearning}>
                      Start Learning
                    </Button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Lessons</span>
                    <span className="text-white">{course.lessonCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Total Duration</span>
                    <span className="text-white">
                      {Math.round(course.totalDuration / 60)} mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Instructor</span>
                    <span className="text-white">{course.instructor.name}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs bg-neutral-800 text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>

      {/* Video Player Modal */}
      {currentVideoId && (
        <VideoPlayer
          course={course}
          videoId={currentVideoId}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          initialLessonIndex={selectedLessonIndex}
        />
      )}
    </PageTransition>
  );
}
