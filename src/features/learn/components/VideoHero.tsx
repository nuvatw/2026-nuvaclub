'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/atoms';
import { VideoPlayer } from './VideoPlayer';
import type { Course } from '@/features/learn/types';
import { LEVEL_LABELS, LEVEL_BADGE_VARIANTS } from '@/features/learn/types';

interface VideoHeroProps {
  course: Course;
  videoId?: string; // YouTube video ID
}

export function VideoHero({ course, videoId = '0kARDVL2nZg' }: VideoHeroProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleStartLearning = () => {
    setIsPlayerOpen(true);
  };

  return (
    <>
      <div className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        {/* YouTube Video Background - Priority loading */}
        <div className="absolute inset-0">
          <iframe
            className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&start=0`}
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

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{course.category}</Badge>
              <Badge variant={LEVEL_BADGE_VARIANTS[course.level]}>
                {LEVEL_LABELS[course.level]}
              </Badge>
              {course.level === 1 && (
                <Badge variant="success">Free</Badge>
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
                leftIcon={
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                Start Learning
              </Button>
              <Link href={`/learn/${course.id}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
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

      {/* Fullscreen Video Player */}
      <VideoPlayer
        course={course}
        videoId={videoId}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}
