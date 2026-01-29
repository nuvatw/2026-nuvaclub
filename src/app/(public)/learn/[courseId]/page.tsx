'use client';

import { use, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { PlaySolidIcon, PlayIcon, LockIcon, CheckIcon } from '@/components/icons';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { getCourseById } from '@/lib/legacy-db-shim';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { CourseDetailSkeleton } from '@/components/skeletons';
import { LEVEL_BADGE_VARIANTS, getAllLessons } from '@/features/learn/types';
import { getLvLabel } from '@/lib/utils/level';
import { useVideoProgress } from '@/lib/db/hooks';

// Dynamic import for VideoPlayer - defers loading until needed
const VideoPlayer = dynamic(
  () => import('@/features/learn/components/VideoPlayer').then((mod) => mod.VideoPlayer),
  { ssr: false }
);

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const { courseId } = use(params);
  const course = getCourseById(courseId);
  const { identity, currentAccountId } = useAuth();

  // Video player state
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(-1);
  const [playerStartSeconds, setPlayerStartSeconds] = useState(0);

  // Video progress hook
  const userId = currentAccountId !== 'guest' ? currentAccountId : null;
  const {
    getResumePoint,
    getTrailerProgress,
    saveTrailerProgress,
    saveLessonProgress,
    getLessonProgressByIndex,
    isLessonCompleted,
    isTrailerCompleted,
    getCourseProgress,
  } = useVideoProgress(userId);

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

  // Calculate course progress
  const courseProgress = getCourseProgress(course.id, allLessons.length);
  const trailerCompleted = isTrailerCompleted(course.id);

  // Derive access level from course level (level 1 = free, others = paid)
  const isFreeCourse = course.level === 1;

  // Check if user can access lesson
  const canAccessLesson = (lessonIndex: number) => {
    if (isFreeCourse) return true;
    if (lessonIndex === 0) return true;
    return ['solo-traveler', 'duo-go', 'duo-run', 'duo-fly'].includes(identity);
  };

  // Handle progress updates from VideoPlayer
  const handleProgressUpdate = useCallback(
    (lessonIndex: number, currentSeconds: number, totalDuration: number) => {
      if (lessonIndex === -1) {
        saveTrailerProgress(course.id, currentSeconds, totalDuration);
      } else {
        const lesson = allLessons[lessonIndex];
        if (lesson) {
          saveLessonProgress(course.id, lesson.id, lessonIndex, currentSeconds, totalDuration);
        }
      }
    },
    [course.id, allLessons, saveTrailerProgress, saveLessonProgress]
  );

  // Handle trailer click
  const handleTrailerClick = () => {
    const trailerProgress = getTrailerProgress(course.id);
    const startSeconds = trailerProgress && !trailerProgress.isCompleted
      ? Math.max(0, trailerProgress.watchedSeconds - 5)
      : 0;

    setSelectedLessonIndex(-1); // -1 = trailer
    setPlayerStartSeconds(startSeconds);
    setIsPlayerOpen(true);
  };

  // Handle lesson click
  const handleLessonClick = (lessonIndex: number) => {
    if (!canAccessLesson(lessonIndex)) return;
    const lesson = allLessons[lessonIndex];
    // Check if there's progress for this specific lesson
    const lessonProgress = lesson ? getLessonProgressByIndex(course.id, lesson.id) : 0;
    const startSeconds = lessonProgress > 0 && lessonProgress < 90 ? Math.max(0, (lessonProgress / 100) * lesson.duration - 5) : 0;

    setSelectedLessonIndex(lessonIndex);
    setPlayerStartSeconds(startSeconds);
    setIsPlayerOpen(true);
  };

  // Handle start learning with resume functionality
  const handleStartLearning = () => {
    const resumePoint = getResumePoint(course.id, course.trailer?.duration || 120);
    setSelectedLessonIndex(resumePoint.lessonIndex);
    setPlayerStartSeconds(resumePoint.startSeconds);
    setIsPlayerOpen(true);
  };

  // Get current video ID based on selected index
  const currentVideoId = selectedLessonIndex === -1
    ? (course.trailer?.youtubeId || allLessons[0]?.videoUrl || '')
    : (allLessons[selectedLessonIndex]?.videoUrl || '');

  // Determine button text based on progress
  const getButtonText = () => {
    const resumePoint = getResumePoint(course.id, course.trailer?.duration || 120);
    if (!resumePoint.hasAnyProgress) return 'Start Learning';
    if (courseProgress === 100) return 'Watch Again';
    return 'Continue Learning';
  };

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
                <Badge variant={LEVEL_BADGE_VARIANTS[course.level]} size="md">
                  {getLvLabel(course.level)}
                </Badge>
                {isFreeCourse && (
                  <Badge variant="success">Free</Badge>
                )}
                {courseProgress > 0 && courseProgress < 100 && (
                  <Badge variant="default">{courseProgress}% Complete</Badge>
                )}
                {courseProgress === 100 && (
                  <Badge variant="success">Completed</Badge>
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
                  {/* Trailer Section */}
                  {course.trailer && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide px-2">
                        Introduction
                      </h3>
                      <div
                        onClick={handleTrailerClick}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-lg relative overflow-hidden',
                          'bg-neutral-800/50 border border-neutral-800',
                          'transition-colors duration-150',
                          'hover:bg-neutral-800 cursor-pointer'
                        )}
                      >
                        {/* Progress bar for trailer */}
                        {(() => {
                          const trailerProgress = getTrailerProgress(course.id);
                          const progressPercent = trailerProgress?.progressPercent || 0;
                          if (progressPercent > 0 && progressPercent < 100) {
                            return (
                              <div
                                className="absolute bottom-0 left-0 h-1 bg-primary-500/50 transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            );
                          }
                          return null;
                        })()}

                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          trailerCompleted
                            ? "bg-primary-500 text-white"
                            : "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                        )}>
                          {trailerCompleted ? (
                            <CheckIcon size="sm" />
                          ) : (
                            <PlayIcon size="sm" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium truncate",
                              trailerCompleted ? "text-neutral-400" : "text-white"
                            )}>
                              {course.trailer.title || 'Course Trailer'}
                            </span>
                            <Badge variant="primary" size="sm">
                              Trailer
                            </Badge>
                            {trailerCompleted && (
                              <Badge variant="success" size="sm">
                                Watched
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-neutral-400">
                            {Math.round((course.trailer.duration || 120) / 60)} mins
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <PlaySolidIcon size="md" className={trailerCompleted ? "text-neutral-500" : "text-primary-500"} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chapters */}
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
                          const lessonCompleted = isLessonCompleted(course.id, lesson.id);
                          const lessonProgress = getLessonProgressByIndex(course.id, lesson.id);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleLessonClick(currentIndex)}
                              className={cn(
                                'flex items-center gap-4 p-4 rounded-lg relative overflow-hidden',
                                'bg-neutral-800/50 border border-neutral-800',
                                'transition-colors duration-150',
                                hasAccess
                                  ? 'hover:bg-neutral-800 cursor-pointer'
                                  : 'opacity-60 cursor-not-allowed'
                              )}
                            >
                              {/* Progress bar background */}
                              {lessonProgress > 0 && lessonProgress < 100 && (
                                <div
                                  className="absolute bottom-0 left-0 h-1 bg-primary-500/50 transition-all"
                                  style={{ width: `${lessonProgress}%` }}
                                />
                              )}

                              <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                lessonCompleted
                                  ? "bg-primary-500 text-white"
                                  : "bg-neutral-700 text-neutral-300"
                              )}>
                                {lessonCompleted ? (
                                  <CheckIcon size="sm" />
                                ) : (
                                  currentIndex + 1
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-medium truncate",
                                    lessonCompleted ? "text-neutral-400" : "text-white"
                                  )}>
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
                                  {lessonCompleted && (
                                    <Badge variant="success" size="sm">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-neutral-400">
                                  {Math.round(lesson.duration / 60)} mins
                                </span>
                              </div>
                              <div className="flex-shrink-0">
                                {hasAccess ? (
                                  <PlaySolidIcon size="md" className={lessonCompleted ? "text-neutral-500" : "text-primary-500"} />
                                ) : (
                                  <LockIcon size="md" className="text-neutral-500" />
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
                      <PlaySolidIcon size="lg" className="w-8 h-8 text-neutral-900" />
                    </div>
                  </div>
                  {/* Course progress bar on thumbnail */}
                  {courseProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                      <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${courseProgress}%` }}
                      />
                    </div>
                  )}
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
                      {getButtonText()}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" onClick={handleStartLearning}>
                      {getButtonText()}
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
                  {courseProgress > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400">Your Progress</span>
                      <span className="text-primary-400">{courseProgress}%</span>
                    </div>
                  )}
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

      {/* Video Player Modal with progress tracking */}
      {currentVideoId && (
        <VideoPlayer
          course={course}
          videoId={currentVideoId}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          initialLessonIndex={selectedLessonIndex}
          initialStartSeconds={playerStartSeconds}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </PageTransition>
  );
}
