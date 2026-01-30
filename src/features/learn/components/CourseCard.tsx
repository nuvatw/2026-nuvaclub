'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import {
  HoverPreviewTrigger,
  useHoverPreviewContext,
} from '@/components/organisms/HoverPreviewPanel';
import { VideoPlayer } from './VideoPlayer';
import type { Course } from '@/features/learn/types';
import { getAllLessons, isNunuCourse } from '@/features/learn/types';
import { getLvLabel } from '@/lib/utils/level';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useVideoProgress } from '../hooks';

interface CourseCardProps {
  course: Course;
  index?: number;
  onStartLearning?: (course: Course) => void;
}

export function CourseCard({
  course,
  index = 0,
  onStartLearning,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerLessonIndex, setPlayerLessonIndex] = useState(-1);
  const [playerStartSeconds, setPlayerStartSeconds] = useState(0);

  const { state } = useHoverPreviewContext<Course>();
  // Use itemId (original course ID) for expansion check, not instanceId
  const isExpanded = state.data?.itemId === course.id;
  const { currentAccountId } = useAuth();

  // Video progress hook - use currentAccountId as userId
  const userId = currentAccountId !== 'guest' ? currentAccountId : null;
  const {
    getResumePoint,
    saveTrailerProgress,
    saveLessonProgress,
    getCourseProgress,
  } = useVideoProgress(userId);

  // Get all lessons for progress saving
  const allLessons = useMemo(() => getAllLessons(course), [course]);

  // Calculate course progress percentage
  const progressPercent = useMemo(
    () => getCourseProgress(course.id, allLessons.length),
    [getCourseProgress, course.id, allLessons.length]
  );

  // Get video ID based on resume point
  const getVideoId = useCallback(
    (lessonIndex: number): string => {
      if (lessonIndex === -1) {
        return course.trailer?.youtubeId || '';
      }
      return allLessons[lessonIndex]?.videoUrl || course.trailer?.youtubeId || '';
    },
    [course.trailer?.youtubeId, allLessons]
  );

  // Handle progress updates from VideoPlayer
  const handleProgressUpdate = useCallback(
    (lessonIndex: number, currentSeconds: number, totalDuration: number) => {
      if (lessonIndex === -1) {
        // Trailer progress
        saveTrailerProgress(course.id, currentSeconds, totalDuration);
      } else {
        // Lesson progress
        const lesson = allLessons[lessonIndex];
        if (lesson) {
          saveLessonProgress(course.id, lesson.id, lessonIndex, currentSeconds, totalDuration);
        }
      }
    },
    [course.id, allLessons, saveTrailerProgress, saveLessonProgress]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onStartLearning) {
      onStartLearning(course);
    } else {
      // Get resume point for this course
      const resumePoint = getResumePoint(course.id, course.trailer?.duration || 120);
      setPlayerLessonIndex(resumePoint.lessonIndex);
      setPlayerStartSeconds(resumePoint.startSeconds);
      setIsPlayerOpen(true);
    }
  };

  // Current video ID for the player
  const currentVideoId = getVideoId(playerLessonIndex);

  return (
    <>
      <HoverPreviewTrigger
        id={course.id}
        item={course}
        className="relative w-full"
      >
        {/* Base Card - Larger with better visual impact */}
        <motion.div
          className={cn(
            'relative aspect-video rounded-xl overflow-hidden cursor-pointer',
            'transition-shadow duration-200',
            isHovered && 'shadow-lg shadow-black/30'
          )}
          animate={{
            scale: isExpanded ? 1.03 : 1,
            opacity: isExpanded ? 0.7 : 1,
          }}
          transition={{ duration: 0.15 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 260px, 280px"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Progress bar (if user has progress) */}
          {progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Badges - Level (hidden for Nunu courses) and optionally Verified Required */}
          <div className="absolute top-2 right-2 flex gap-1">
            {course.verifiedRequired && (
              <Badge variant="primary" size="sm" className="bg-purple-600/90 text-white">
                Verified
              </Badge>
            )}
            {!isNunuCourse(course) && (
              <Badge
                variant="default"
                size="md"
                className="bg-neutral-900/90 text-white font-semibold backdrop-blur-sm"
              >
                {getLvLabel(course.level)}
              </Badge>
            )}
          </div>

          {/* Title on card */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">{course.title}</h3>
          </div>
        </motion.div>
      </HoverPreviewTrigger>

      {/* Video Player with resume functionality */}
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
