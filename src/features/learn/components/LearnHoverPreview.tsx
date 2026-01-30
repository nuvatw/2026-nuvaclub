'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/atoms';
import {
  HoverPreviewPanel,
  type PreviewAction,
} from '@/components/organisms/HoverPreviewPanel';
import {
  PlaySolidIcon,
  InformationCircleIcon,
  PlusIcon,
  CheckIcon,
} from '@/components/icons';
import type { Course } from '@/features/learn/types';
import { isNunuCourse } from '@/features/learn/types';
import { getLvLabel } from '@/lib/utils/level';
import { useLearnVideoPlayer } from '@/features/learn/context/LearnVideoPlayerContext';

// Lazy loaded video component with loading state
function LazyTrailerVideo({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Small delay before loading video to prioritize other content
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-600 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}
      {showVideo && (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          style={{ pointerEvents: 'none' }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </>
  );
}

function getYouTubeVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  // If it's already an 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  // Otherwise try to extract from URL
  const match = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export function LearnHoverPreview() {
  const router = useRouter();
  const { openPlayer } = useLearnVideoPlayer();
  const [savedCourses, setSavedCourses] = useState<Set<string>>(new Set());
  const [savingCourse, setSavingCourse] = useState<string | null>(null);

  // Open video player directly with smart resume logic
  const handleStartLearning = (course: Course) => {
    openPlayer(course);
  };

  const handleCourseDetails = (course: Course) => {
    router.push(`/learn/${course.id}`);
  };

  const handleAddToList = async (course: Course) => {
    setSavingCourse(course.id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSavedCourses((prev) => {
        const next = new Set(prev);
        if (next.has(course.id)) {
          next.delete(course.id);
        } else {
          next.add(course.id);
        }
        return next;
      });
    } finally {
      setSavingCourse(null);
    }
  };

  const getActions = (course: Course): PreviewAction[] => [
    {
      id: 'start',
      label: 'Start Learning',
      icon: <PlaySolidIcon size="sm" />,
      variant: 'primary',
      onClick: () => handleStartLearning(course),
    },
    {
      id: 'details',
      label: 'Course Details',
      icon: <InformationCircleIcon size="sm" />,
      variant: 'secondary',
      onClick: () => handleCourseDetails(course),
    },
    {
      id: 'add',
      label: 'Add',
      activeLabel: 'Added',
      icon: <PlusIcon size="sm" />,
      activeIcon: <CheckIcon size="sm" />,
      variant: 'icon',
      onClick: () => handleAddToList(course),
      isActive: savedCourses.has(course.id),
      isLoading: savingCourse === course.id,
    },
  ];

  const renderMedia = (course: Course) => {
    const videoId = course.trailer?.youtubeId ? getYouTubeVideoId(course.trailer.youtubeId) : null;

    return (
      <>
        {/* Clickable video area - plays trailer (same as Start Learning) */}
        <button
          type="button"
          className="absolute inset-0 w-full h-full z-10 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleStartLearning(course);
          }}
          aria-label={`Play ${course.title} trailer`}
        />
        {videoId ? (
          <LazyTrailerVideo videoId={videoId} title={course.title} />
        ) : (
          <>
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-transparent to-transparent" />
          </>
        )}

        {/* Level Badge - hidden for Nunu courses, consistent color for visibility */}
        {!isNunuCourse(course) && (
          <div className="absolute top-2 right-2 z-20">
            <Badge
              variant="default"
              size="md"
              className="bg-neutral-900/90 text-white font-semibold backdrop-blur-sm"
            >
              {getLvLabel(course.level)}
            </Badge>
          </div>
        )}
      </>
    );
  };

  const renderContent = (course: Course) => (
    <>
      {/* Meta Info */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
        <span className="text-green-400 font-semibold">{course.lessonCount} lessons</span>
        <span>•</span>
        <span>{Math.round(course.totalDuration / 60)} mins</span>
        <span>•</span>
        <span>{course.instructor.name}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white text-base mb-1 line-clamp-1">{course.title}</h3>

      {/* Description */}
      <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{course.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {course.tags.slice(0, 3).map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-300 border border-neutral-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <HoverPreviewPanel<Course>
      renderMedia={renderMedia}
      renderContent={renderContent}
      actions={getActions}
      onPanelClick={handleCourseDetails}
    />
  );
}
