'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/atoms';
import {
  HoverPreviewPanel,
  type PreviewAction,
} from '@/components/organisms/HoverPreviewPanel';
import type { Course } from '@/features/learn/types';
import { LEVEL_LABELS, LEVEL_BADGE_VARIANTS } from '@/features/learn/types';

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

// Icons
const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export function LearnHoverPreview() {
  const router = useRouter();
  const [savedCourses, setSavedCourses] = useState<Set<string>>(new Set());
  const [savingCourse, setSavingCourse] = useState<string | null>(null);

  const handleWatchTrailer = (course: Course) => {
    if (course.trailer) {
      router.push(`/learn/${course.id}?trailer=1`);
    }
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
      id: 'trailer',
      label: 'Watch Trailer',
      icon: <PlayIcon />,
      variant: 'primary',
      onClick: () => handleWatchTrailer(course),
      disabled: !course.trailer,
    },
    {
      id: 'details',
      label: 'Course Details',
      icon: <InfoIcon />,
      variant: 'secondary',
      onClick: () => handleCourseDetails(course),
    },
    {
      id: 'add',
      label: 'Add',
      activeLabel: 'Added',
      icon: <PlusIcon />,
      activeIcon: <CheckIcon />,
      variant: 'icon',
      onClick: () => handleAddToList(course),
      isActive: savedCourses.has(course.id),
      isLoading: savingCourse === course.id,
    },
  ];

  const renderMedia = (course: Course) => {
    const videoId = course.trailer ? getYouTubeVideoId(course.trailer) : null;

    return (
      <>
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

        {/* Level Badge */}
        <div className="absolute top-2 right-2 z-20">
          <Badge variant={LEVEL_BADGE_VARIANTS[course.level]} size="sm">
            {LEVEL_LABELS[course.level]}
          </Badge>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="p-4 rounded-full bg-white/90 shadow-lg">
            <svg className="w-8 h-8 text-neutral-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
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
        {course.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
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
