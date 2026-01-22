'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import {
  HoverPreviewTrigger,
  useHoverPreviewContext,
} from '@/components/organisms/HoverPreviewPanel';
import { VideoPlayer } from './VideoPlayer';
import type { Course } from '@/features/learn/types';
import { LEVEL_LABELS, LEVEL_BADGE_VARIANTS } from '@/features/learn/types';
import { cn } from '@/lib/utils';

// Extract YouTube video ID from URL or return as-is if already an ID
function getYouTubeVideoId(urlOrId: string): string {
  if (!urlOrId) return '';
  // If it's already just an ID (no slashes or special chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  // Extract from various YouTube URL formats
  const match = urlOrId.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : urlOrId;
}

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { state } = useHoverPreviewContext<Course>();
  const isExpanded = state.data?.id === course.id;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlayerOpen(true);
  };

  const trailerVideoId = getYouTubeVideoId(course.trailer || '');

  return (
    <>
      <HoverPreviewTrigger
        id={course.id}
        item={course}
        className="relative flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
      >
        {/* Base Card */}
        <motion.div
          className={cn(
            'relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer',
            'transition-shadow duration-200',
            isHovered && 'shadow-lg shadow-black/40'
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
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Play button overlay on hover */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Level Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={LEVEL_BADGE_VARIANTS[course.level]} size="sm">
              {LEVEL_LABELS[course.level]}
            </Badge>
          </div>

          {/* Title on card */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-semibold text-white line-clamp-2">{course.title}</h3>
          </div>
        </motion.div>
      </HoverPreviewTrigger>

      {/* Video Player */}
      {trailerVideoId && (
        <VideoPlayer
          course={course}
          videoId={trailerVideoId}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
        />
      )}
    </>
  );
}
