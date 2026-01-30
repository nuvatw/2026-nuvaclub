'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/atoms';
import { VideoPlayer } from './VideoPlayer';
import { PlaySolidIcon, InformationCircleIcon } from '@/components/icons';
import type { Course } from '@/features/learn/types';
import { LEVEL_BADGE_VARIANTS, getAllLessons } from '@/features/learn/types';
import { getLvLabel } from '@/lib/utils/level';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useVideoProgress } from '../hooks';

interface VideoHeroProps {
  course: Course;
  videoId?: string; // YouTube video ID for background
}

export function VideoHero({ course, videoId }: VideoHeroProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerLessonIndex, setPlayerLessonIndex] = useState(-1);
  const [playerStartSeconds, setPlayerStartSeconds] = useState(0);

  const { currentAccountId } = useAuth();

  // Video progress hook
  const userId = currentAccountId !== 'guest' ? currentAccountId : null;
  const {
    getResumePoint,
    saveTrailerProgress,
    saveLessonProgress,
    getCourseProgress,
  } = useVideoProgress(userId);

  // Get all lessons for progress saving
  const allLessons = useMemo(() => getAllLessons(course), [course]);

  // Calculate course progress
  const courseProgress = getCourseProgress(course.id, allLessons.length);

  // Get video ID based on lesson index
  const getVideoId = useCallback(
    (lessonIndex: number): string => {
      if (lessonIndex === -1) {
        return course.trailer?.youtubeId || '';
      }
      return allLessons[lessonIndex]?.videoUrl || course.trailer?.youtubeId || '';
    },
    [course.trailer?.youtubeId, allLessons]
  );

  // Get trailer video ID for background
  const backgroundVideoId = videoId || course.trailer?.youtubeId || '0kARDVL2nZg';

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

  // Start Learning with resume functionality
  const handleStartLearning = () => {
    const resumePoint = getResumePoint(course.id, course.trailer?.duration || 120);
    setPlayerLessonIndex(resumePoint.lessonIndex);
    setPlayerStartSeconds(resumePoint.startSeconds);
    setIsPlayerOpen(true);
  };

  // Determine button text based on progress
  const getButtonText = () => {
    const resumePoint = getResumePoint(course.id, course.trailer?.duration || 120);
    if (!resumePoint.hasAnyProgress) return 'Start Learning';
    if (courseProgress === 100) return 'Watch Again';
    return 'Continue Learning';
  };

  // Current video ID for the player
  const currentVideoId = getVideoId(playerLessonIndex);

  return (
    <>
      {/* Large hero - only 1 row visible below */}
      <div className="relative h-[65vh] min-h-[450px] max-h-[650px] overflow-hidden">
        {/* YouTube Video Background - Priority loading */}
        <div className="absolute inset-0">
          <iframe
            className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src={`https://www.youtube.com/embed/${backgroundVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${backgroundVideoId}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&start=0`}
            title="Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="eager"
            style={{ border: 'none' }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-neutral-950/30" />
        </div>

        {/* Content - uses app gutter for consistent left alignment with header brand */}
        <div
          className="relative h-full w-full flex items-center"
          style={{ paddingLeft: 'var(--app-gutter)', paddingRight: 'var(--app-gutter)' }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{course.category || '未分類'}</Badge>
              <Badge variant={LEVEL_BADGE_VARIANTS[course.level]} size="md">
                {getLvLabel(course.level)}
              </Badge>
              {course.level === 1 && (
                <Badge variant="success">Free</Badge>
              )}
              {courseProgress > 0 && courseProgress < 100 && (
                <Badge variant="default">{courseProgress}% Complete</Badge>
              )}
              {courseProgress === 100 && (
                <Badge variant="success">Completed</Badge>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {course.title}
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 mb-6">
              {course.subtitle}
            </p>

            <p className="text-neutral-400 mb-8 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handleStartLearning}
                leftIcon={<PlaySolidIcon size="md" />}
              >
                {getButtonText()}
              </Button>
              <Link href={`/learn/${course.id}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<InformationCircleIcon size="md" />}
                >
                  Course Details
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{course.instructor.name}</span>
              </div>
              <span>•</span>
              <span>{course.lessonCount} lessons</span>
              <span>•</span>
              <span>{Math.round(course.totalDuration / 60)} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Player with resume functionality */}
      {currentVideoId && (
        <VideoPlayer
          course={course}
          videoId={currentVideoId}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          initialLessonIndex={playerLessonIndex}
          initialStartSeconds={playerStartSeconds}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </>
  );
}
