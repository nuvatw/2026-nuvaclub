'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CourseRow,
  HoverPreviewProvider,
  LearnHoverPreview,
  VideoHero,
  VideoPlayer,
} from '@/features/learn/components';
import { useLearnSections } from '@/features/learn/sections/useLearnSections';
import { useMediaPreloadGate, useProgressiveRowLoader } from '@/features/learn/hooks';
import type { Course } from '@/features/learn/types';
import { getAllLessons } from '@/features/learn/types';
import { getCourseById, getFeaturedCourses } from '@/lib/legacy-db-shim';
import { LearnPageSkeleton } from '@/components/skeletons';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useVideoProgress } from '@/lib/db/hooks';
import { LearnVideoPlayerContext } from '@/features/learn/context/LearnVideoPlayerContext';

// Constants for progressive rendering
// Show 1 row initially (Continue Watching or Most Popular)
const INITIAL_VISIBLE_ROWS = 1;

export default function LearnPage() {
  const { sections, isHydrated } = useLearnSections();
  const featuredCourses = getFeaturedCourses();

  // Progressive row display state - start with 3 rows for 2.5 visible effect
  const [visibleRowCount, setVisibleRowCount] = useState(INITIAL_VISIBLE_ROWS);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Video player state
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerCourse, setPlayerCourse] = useState<Course | null>(null);
  const [playerLessonIndex, setPlayerLessonIndex] = useState(-1);
  const [playerStartSeconds, setPlayerStartSeconds] = useState(0);

  // Video progress hook
  const { currentAccountId } = useAuth();
  const userId = currentAccountId !== 'guest' ? currentAccountId : null;
  const { getResumePoint, saveTrailerProgress, saveLessonProgress } = useVideoProgress(userId);

  // Use "ChatGPT Complete Beginner's Guide" as the hero course
  const heroCourse = getCourseById('c2') || featuredCourses[0];

  // Get first row thumbnail URLs for preloading
  const firstRowThumbnails = useMemo(() => {
    if (sections.length === 0) return [];
    const firstSection = sections[0];
    // Get first 6 course thumbnails (one row worth)
    return firstSection?.courses.slice(0, 6).map((c) => c.thumbnailUrl) || [];
  }, [sections]);

  // Media preload gate - waits for hero + first row thumbnails
  const { isReady: mediaReady } = useMediaPreloadGate({
    heroVideoId: 'dLRdaUda8Ho',
    thumbnailUrls: firstRowThumbnails,
    timeout: 2500,
  });

  // Prepare rows for progressive loading
  const rowMediaData = useMemo(() => {
    return sections.map((section) => ({
      thumbnailUrls: section.courses.slice(0, 6).map((c) => c.thumbnailUrl),
    }));
  }, [sections]);

  // Progressive row loader for background preloading
  const { loadedRows } = useProgressiveRowLoader({
    rows: rowMediaData,
    startFromRow: 1, // Skip first row (already preloaded)
    enabled: mediaReady && hasInitialized,
  });

  // Progressive row reveal after hydration
  // First row shown immediately, rest revealed with fast stagger
  useEffect(() => {
    if (isHydrated && !hasInitialized && sections.length > 0) {
      setHasInitialized(true);

      // Progressively reveal remaining rows (after initial 1)
      const revealRows = async () => {
        for (let i = INITIAL_VISIBLE_ROWS + 1; i <= sections.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 60)); // Fast stagger
          setVisibleRowCount(i);
        }
      };

      // Start revealing immediately
      revealRows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, sections.length]);

  // Open video player with smart resume logic
  const openPlayer = useCallback((course: Course) => {
    const resumePoint = getResumePoint(course.id, course.trailer?.duration || 120);
    setPlayerCourse(course);
    setPlayerLessonIndex(resumePoint.lessonIndex);
    setPlayerStartSeconds(resumePoint.startSeconds);
    setIsPlayerOpen(true);
  }, [getResumePoint]);

  // Handle progress updates from VideoPlayer
  const handleProgressUpdate = useCallback(
    (lessonIndex: number, currentSeconds: number, totalDuration: number) => {
      if (!playerCourse) return;

      if (lessonIndex === -1) {
        saveTrailerProgress(playerCourse.id, currentSeconds, totalDuration);
      } else {
        const allLessons = getAllLessons(playerCourse);
        const lesson = allLessons[lessonIndex];
        if (lesson) {
          saveLessonProgress(playerCourse.id, lesson.id, lessonIndex, currentSeconds, totalDuration);
        }
      }
    },
    [playerCourse, saveTrailerProgress, saveLessonProgress]
  );

  // Get current video ID for player
  const currentVideoId = useMemo(() => {
    if (!playerCourse) return '';
    if (playerLessonIndex === -1) {
      return playerCourse.trailer?.youtubeId || '';
    }
    const allLessons = getAllLessons(playerCourse);
    return allLessons[playerLessonIndex]?.videoUrl || playerCourse.trailer?.youtubeId || '';
  }, [playerCourse, playerLessonIndex]);

  // Context value for child components
  const videoPlayerContextValue = useMemo(() => ({ openPlayer }), [openPlayer]);


  // Determine which sections to display
  // All sections are now shown (no "Show More" button)
  const visibleSections = useMemo(() => {
    // Show all sections, using progressive reveal animation
    return sections.slice(0, visibleRowCount);
  }, [sections, visibleRowCount]);

  // Show skeleton only if data is not hydrated (brief SSR/hydration wait)
  // Once hydrated, show rows immediately - don't wait for media preload
  if (!isHydrated) {
    return <LearnPageSkeleton />;
  }

  return (
    <LearnVideoPlayerContext.Provider value={videoPlayerContextValue}>
      <HoverPreviewProvider<Course> config={{ width: 400, maxHeight: 480 }}>
        <div className="min-h-screen bg-neutral-950">
          {/* Video Hero */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <VideoHero course={heroCourse} videoId="dLRdaUda8Ho" />
          </motion.div>

          {/* Course Rows - Netflix-style layout with 2.5 rows visible on load */}
          <div className="relative -mt-16 z-10 pb-16">
            {/* Course Sections with Progressive Reveal - Tighter spacing for 2.5 rows visible */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {visibleSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.3,
                      delay: index === 0 ? 0 : 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <CourseRow
                      title={section.title}
                      courses={section.courses}
                      href={section.href}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

            </div>
          </div>

          {/* Hover preview panel with scroll-pinned behavior */}
          <LearnHoverPreview />
        </div>

        {/* Video Player Modal - controlled by context */}
        {playerCourse && currentVideoId && (
          <VideoPlayer
            course={playerCourse}
            videoId={currentVideoId}
            isOpen={isPlayerOpen}
            onClose={() => setIsPlayerOpen(false)}
            initialLessonIndex={playerLessonIndex}
            initialStartSeconds={playerStartSeconds}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </HoverPreviewProvider>
    </LearnVideoPlayerContext.Provider>
  );
}
