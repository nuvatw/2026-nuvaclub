'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Course, Lesson, Chapter } from '../types';
import { getAllLessons } from '../types';

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
  getAvailablePlaybackRates: () => number[];
  setOption: (module: string, option: string, value: unknown) => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

// Playback speed options
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3] as const;
type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

// Report categories
const REPORT_CATEGORIES = [
  { id: 'audio_sync', label: 'Audio out of sync' },
  { id: 'wrong_subtitles', label: 'Wrong subtitles' },
  { id: 'buffering', label: 'Video buffering / lag' },
  { id: 'wrong_content', label: 'Wrong episode content' },
  { id: 'offensive', label: 'Offensive / inappropriate content' },
  { id: 'other', label: 'Other' },
] as const;

interface VideoPlayerProps {
  course: Course;
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  initialLessonIndex?: number;
}

export function VideoPlayer({
  course,
  videoId,
  isOpen,
  onClose,
  initialLessonIndex = 0,
}: VideoPlayerProps) {
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState<string>('');
  const [reportDescription, setReportDescription] = useState('');
  const [wasPlayingBeforeReport, setWasPlayingBeforeReport] = useState(false);
  const [prevEpisodeTapCount, setPrevEpisodeTapCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevEpisodeTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerId = 'youtube-player-container';

  // Get all lessons for navigation
  const allLessons = getAllLessons(course);
  const totalEpisodes = allLessons.length;
  const hasTrailer = !!course.trailer?.youtubeId;

  // Calculate prev/next availability
  // -1 = trailer, 0+ = lesson index
  const canGoPrev = currentLessonIndex > (hasTrailer ? -1 : 0);
  const canGoNext = currentLessonIndex < totalEpisodes - 1;

  // Load YouTube IFrame API
  useEffect(() => {
    if (!isOpen) return;

    const loadYouTubeAPI = () => {
      if (window.YT) {
        initializePlayer();
        return;
      }

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    };

    const initializePlayer = () => {
      if (!document.getElementById(playerContainerId)) return;

      const ytPlayer = new window.YT.Player(playerContainerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          cc_load_policy: captionsEnabled ? 1 : 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setDuration(event.target.getDuration());
            setIsLoading(false);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            const isPlaying = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(isPlaying);
            if (isPlaying) {
              // Video started playing - hide loading overlay
              setIsLoading(false);
              startProgressTracking(event.target);
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isOpen, videoId, captionsEnabled]);

  // Progress tracking
  const startProgressTracking = useCallback((ytPlayer: YTPlayer) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(() => {
      if (ytPlayer && ytPlayer.getCurrentTime) {
        setCurrentTime(ytPlayer.getCurrentTime());
      }
    }, 500);
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowEpisodes(false);
        setShowSpeedPicker(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Handle mouse movement
  const handleMouseMove = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          seekBackward();
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          seekForward();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'c':
          e.preventDefault();
          toggleCaptions();
          break;
        case '[':
          e.preventDefault();
          cycleSpeedDown();
          break;
        case ']':
          e.preventDefault();
          cycleSpeedUp();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          goToNextEpisode();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          goToPrevEpisode();
          break;
        case 'Escape':
          if (showReportModal) {
            closeReportModal();
          } else if (showSpeedPicker) {
            setShowSpeedPicker(false);
          } else if (isFullscreen) {
            exitFullscreen();
          } else {
            onClose();
          }
          break;
      }
      resetControlsTimeout();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, player, isFullscreen, isPlaying]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Enter fullscreen on open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {
        // Fullscreen not supported or blocked
      });
    }
  }, [isOpen]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen && player) {
      player.destroy();
      setPlayer(null);
      setIsLoading(true);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const seekBackward = () => {
    if (!player) return;
    const newTime = Math.max(0, player.getCurrentTime() - 10);
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  const seekForward = () => {
    if (!player) return;
    const newTime = Math.min(duration, player.getCurrentTime() + 10);
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    }
  };

  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
    if (player) {
      player.setOption('captions', 'track', captionsEnabled ? {} : { languageCode: 'en' });
    }
  };

  // Playback speed control
  const changePlaybackSpeed = (speed: PlaybackSpeed) => {
    if (player) {
      player.setPlaybackRate(speed);
    }
    setPlaybackSpeed(speed);
    setShowSpeedPicker(false);
    resetControlsTimeout();
  };

  const cycleSpeedUp = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    if (currentIndex < PLAYBACK_SPEEDS.length - 1) {
      changePlaybackSpeed(PLAYBACK_SPEEDS[currentIndex + 1]);
    }
  };

  const cycleSpeedDown = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    if (currentIndex > 0) {
      changePlaybackSpeed(PLAYBACK_SPEEDS[currentIndex - 1]);
    }
  };

  // Previous episode logic
  const goToPrevEpisode = () => {
    if (!canGoPrev) return;

    const RESTART_THRESHOLD = 10; // seconds

    // If > 10s into current episode, first tap restarts, second tap goes prev
    if (currentTime > RESTART_THRESHOLD && prevEpisodeTapCount === 0) {
      // First tap: restart current episode
      if (player) {
        player.seekTo(0, true);
        setCurrentTime(0);
      }
      setPrevEpisodeTapCount(1);

      // Reset tap count after 2 seconds
      if (prevEpisodeTapTimeoutRef.current) {
        clearTimeout(prevEpisodeTapTimeoutRef.current);
      }
      prevEpisodeTapTimeoutRef.current = setTimeout(() => {
        setPrevEpisodeTapCount(0);
      }, 2000);
    } else {
      // Go to previous episode
      setPrevEpisodeTapCount(0);
      if (prevEpisodeTapTimeoutRef.current) {
        clearTimeout(prevEpisodeTapTimeoutRef.current);
      }
      selectEpisode(currentLessonIndex - 1);
    }
    resetControlsTimeout();
  };

  // Next episode logic
  const goToNextEpisode = () => {
    if (!canGoNext) return;
    selectEpisode(currentLessonIndex + 1);
    resetControlsTimeout();
  };

  // Report functionality
  const openReportModal = () => {
    setWasPlayingBeforeReport(isPlaying);
    if (player && isPlaying) {
      player.pauseVideo();
    }
    setShowReportModal(true);
    setReportCategory('');
    setReportDescription('');
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    if (wasPlayingBeforeReport && player) {
      player.playVideo();
    }
  };

  const submitReport = () => {
    // Build report payload
    const reportPayload = {
      course_id: course.id,
      episode_id: currentLessonIndex === -1
        ? course.trailer?.youtubeId
        : allLessons[currentLessonIndex]?.id,
      episode_index: currentLessonIndex,
      playback_position_ms: Math.round(currentTime * 1000),
      category: reportCategory,
      description: reportDescription || undefined,
      player_state: {
        speed: playbackSpeed,
        captions_enabled: captionsEnabled,
        is_fullscreen: isFullscreen,
      },
      timestamp: new Date().toISOString(),
    };

    // Log for now (replace with actual API call)
    console.log('Report submitted:', reportPayload);

    // Show toast (you could use a toast library here)
    // For now, we'll just close the modal
    closeReportModal();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const selectEpisode = (index: number) => {
    // Index -1 is the trailer
    if (index === -1) {
      const trailerVideoId = course.trailer?.youtubeId;
      if (trailerVideoId && player) {
        setCurrentLessonIndex(-1);
        setShowEpisodes(false);
        setIsLoading(true);
        player.loadVideoById(trailerVideoId);
        // Preserve playback speed
        setTimeout(() => {
          if (player && playbackSpeed !== 1) {
            player.setPlaybackRate(playbackSpeed);
          }
        }, 500);
      }
      return;
    }

    const lesson = allLessons[index];
    if (lesson?.videoUrl) {
      setCurrentLessonIndex(index);
      setShowEpisodes(false);
      setIsLoading(true);

      // Extract video ID from lesson URL
      const lessonVideoId = getYouTubeVideoId(lesson.videoUrl);
      if (lessonVideoId && player) {
        player.loadVideoById(lessonVideoId);
        // Preserve playback speed
        setTimeout(() => {
          if (player && playbackSpeed !== 1) {
            player.setPlaybackRate(playbackSpeed);
          }
        }, 500);
      }
    }
  };

  // Helper to extract YouTube video ID
  function getYouTubeVideoId(urlOrId: string): string {
    if (!urlOrId) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    const match = urlOrId.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : urlOrId;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().then(onClose);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={handleMouseMove}
      onClick={() => !showEpisodes && togglePlay()}
    >
      {/* Video Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div id={playerContainerId} className="w-full h-full" />
        {/* Loading overlay - positioned above the player */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 z-10">
            <div className="w-12 h-12 border-3 border-neutral-700 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
                {/* Close button */}
                <CloseButton onClick={handleClose} />

                {/* Report button - top right */}
                <ReportButton onClick={openReportModal} />

                {/* Current Episode Title */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-neutral-400 text-sm">{course.title}</p>
                  <p className="text-white font-medium">
                    {currentLessonIndex === -1
                      ? (course.trailer?.title || 'Trailer')
                      : (allLessons[currentLessonIndex]?.title || 'Now Playing')}
                  </p>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-6 px-6 pointer-events-auto">
                {/* Progress Bar */}
                <div
                  className="relative h-1 bg-neutral-700 rounded-full mb-4 cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  <div
                    className="absolute h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <div
                    className="absolute w-3 h-3 bg-primary-500 rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${(currentTime / duration) * 100}% - 6px)` }}
                  />
                </div>

                {/* Time Display */}
                <div className="flex items-center justify-between mb-4 text-sm text-neutral-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  {/* Left side controls */}
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <ControlButton
                      onClick={togglePlay}
                      label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <PauseIcon className="w-7 h-7" />
                      ) : (
                        <PlayIcon className="w-7 h-7" />
                      )}
                    </ControlButton>

                    {/* Rewind 10s */}
                    <ControlButton onClick={seekBackward} label="Rewind 10s (←)">
                      <Rewind10Icon className="w-6 h-6" />
                    </ControlButton>

                    {/* Forward 10s */}
                    <ControlButton onClick={seekForward} label="Forward 10s (→)">
                      <Forward10Icon className="w-6 h-6" />
                    </ControlButton>

                    <div className="w-px h-6 bg-neutral-700" />

                    {/* Previous Episode */}
                    <ControlButton
                      onClick={goToPrevEpisode}
                      label="Previous (P)"
                      disabled={!canGoPrev}
                    >
                      <PrevEpisodeIcon className="w-5 h-5" />
                    </ControlButton>

                    {/* Next Episode */}
                    <ControlButton
                      onClick={goToNextEpisode}
                      label="Next (N)"
                      disabled={!canGoNext}
                    >
                      <NextEpisodeIcon className="w-5 h-5" />
                    </ControlButton>
                  </div>

                  {/* Center: Episode info */}
                  <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-300">
                    <span className="text-neutral-500">
                      {currentLessonIndex === -1 ? 'Trailer' : `Episode ${currentLessonIndex + 1} of ${totalEpisodes}`}
                    </span>
                  </div>

                  {/* Right side controls */}
                  <div className="flex items-center gap-4">
                    {/* Playback Speed */}
                    <SpeedButton
                      speed={playbackSpeed}
                      isOpen={showSpeedPicker}
                      onToggle={() => setShowSpeedPicker(!showSpeedPicker)}
                      onSelect={changePlaybackSpeed}
                    />

                    {/* Episodes */}
                    <ControlButton
                      onClick={() => setShowEpisodes(!showEpisodes)}
                      label="Episodes"
                      active={showEpisodes}
                    >
                      <EpisodeIcon className="w-5 h-5" />
                    </ControlButton>

                    {/* Captions */}
                    <ControlButton
                      onClick={toggleCaptions}
                      label="Captions (C)"
                      active={captionsEnabled}
                    >
                      <CaptionsIcon className="w-5 h-5" />
                    </ControlButton>

                    {/* Fullscreen */}
                    <ControlButton
                      onClick={toggleFullscreen}
                      label={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
                    >
                      {isFullscreen ? (
                        <ExitFullscreenIcon className="w-5 h-5" />
                      ) : (
                        <FullscreenIcon className="w-5 h-5" />
                      )}
                    </ControlButton>
                  </div>
                </div>
              </div>

              {/* Episode Drawer */}
              <AnimatePresence>
                {showEpisodes && (
                  <EpisodeDrawer
                    trailer={course.trailer}
                    chapters={course.chapters}
                    currentIndex={currentLessonIndex}
                    onSelect={selectEpisode}
                    onClose={() => setShowEpisodes(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report Modal */}
        <AnimatePresence>
          {showReportModal && (
            <ReportModal
              categories={REPORT_CATEGORIES}
              selectedCategory={reportCategory}
              description={reportDescription}
              onCategoryChange={setReportCategory}
              onDescriptionChange={setReportDescription}
              onSubmit={submitReport}
              onClose={closeReportModal}
            />
          )}
        </AnimatePresence>
      </div>
  );
}

// Close Button with Tooltip
function CloseButton({ onClick }: { onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="absolute top-4 left-4">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-2 rounded-full bg-neutral-900/50 hover:bg-neutral-800 transition-colors"
      >
        <XIcon className="w-6 h-6 text-white" />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            Close (Esc)
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Control Button Component with Tooltip
function ControlButton({
  children,
  onClick,
  label,
  size = 'md',
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  size?: 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        aria-label={label}
        className={cn(
          'rounded-full transition-all text-white',
          size === 'lg'
            ? 'p-4 bg-white/20 hover:bg-white/30'
            : 'p-2.5 hover:bg-white/10',
          active && 'text-primary-400',
          disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95'
        )}
      >
        {children}
      </button>
      <AnimatePresence>
        {showTooltip && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Episode Drawer Component with Trailer and Chapter Support
function EpisodeDrawer({
  trailer,
  chapters,
  currentIndex,
  onSelect,
  onClose,
}: {
  trailer?: { title: string; youtubeId: string; duration: number };
  chapters: Chapter[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  // Calculate flat index for each lesson
  let flatIndex = 0;
  const isTrailerCurrent = currentIndex === -1;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 bottom-0 w-96 bg-neutral-900/95 backdrop-blur-lg border-l border-neutral-800 pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <h3 className="text-lg font-semibold text-white">Episodes</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5 text-neutral-400 hover:text-white transition-colors" />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-65px)] p-4 space-y-4">
        {/* Trailer - shown before chapters */}
        {trailer && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide px-2">
              Introduction
            </h4>
            <button
              onClick={() => onSelect(-1)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-colors',
                isTrailerCurrent
                  ? 'bg-primary-500/20 border border-primary-500/50'
                  : 'bg-neutral-800/50 hover:bg-neutral-800 border border-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-neutral-500 font-mono text-sm mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'font-medium truncate text-sm',
                      isTrailerCurrent ? 'text-primary-400' : 'text-white'
                    )}
                  >
                    {trailer.title || 'Course Trailer'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {Math.floor(trailer.duration / 60)} min
                  </p>
                </div>
                {isTrailerCurrent && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse" />
                )}
              </div>
            </button>
          </div>
        )}

        {/* Chapters */}
        {chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-2">
            {/* Chapter Header */}
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide px-2">
              {chapter.title}
            </h4>

            {/* Lessons in Chapter */}
            {chapter.lessons.map((lesson) => {
              const lessonFlatIndex = flatIndex++;
              const isCurrentLesson = lessonFlatIndex === currentIndex;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelect(lessonFlatIndex)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    isCurrentLesson
                      ? 'bg-primary-500/20 border border-primary-500/50'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border border-transparent'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-neutral-500 font-mono text-sm mt-0.5">
                      {String(lessonFlatIndex + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-medium truncate text-sm',
                          isCurrentLesson ? 'text-primary-400' : 'text-white'
                        )}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {Math.floor(lesson.duration / 60)} min
                      </p>
                    </div>
                    {isCurrentLesson && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Icons
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function Rewind10Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
      <text x="9" y="16" fontSize="7" fontWeight="bold" fill="currentColor">10</text>
    </svg>
  );
}

function Forward10Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
      <text x="9" y="16" fontSize="7" fontWeight="bold" fill="currentColor">10</text>
    </svg>
  );
}

function EpisodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function CaptionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
      />
    </svg>
  );
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
}

function ExitFullscreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 9V4H4m0 0l5 5m6-5h5v5m0 0l-5-5m-6 11v5H4m0 0l5-5m11 5h-5v-5m0 0l5 5"
      />
    </svg>
  );
}

function PrevEpisodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function NextEpisodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
      />
    </svg>
  );
}

// Report Button (Top Right)
function ReportButton({ onClick }: { onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Report issue"
        className="p-2 rounded-full bg-neutral-900/50 hover:bg-neutral-800 transition-colors"
      >
        <FlagIcon className="w-5 h-5 text-white" />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            Report issue
            <div className="absolute bottom-full right-4 border-4 border-transparent border-b-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Speed Button with Popover
function SpeedButton({
  speed,
  isOpen,
  onToggle,
  onSelect,
}: {
  speed: PlaybackSpeed;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (speed: PlaybackSpeed) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={`Playback speed: ${speed}x`}
        className={cn(
          'px-2.5 py-1.5 rounded-md text-sm font-medium transition-all',
          'hover:bg-white/10 active:scale-95',
          isOpen ? 'bg-white/20 text-primary-400' : 'text-white'
        )}
      >
        {speed}x
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {PLAYBACK_SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSelect(s)}
                  className={cn(
                    'w-full px-4 py-2 text-sm text-left transition-colors',
                    s === speed
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-white hover:bg-white/10'
                  )}
                >
                  {s}x {s === 1 && <span className="text-neutral-500 ml-1">(Normal)</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Report Modal
function ReportModal({
  categories,
  selectedCategory,
  description,
  onCategoryChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}: {
  categories: readonly { id: string; label: string }[];
  selectedCategory: string;
  description: string;
  onCategoryChange: (category: string) => void;
  onDescriptionChange: (desc: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/70 z-50"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h3 className="text-lg font-semibold text-white">Report an Issue</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">What&apos;s the issue?</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-primary-500/20 border border-primary-500/50'
                      : 'bg-neutral-800/50 hover:bg-neutral-800 border border-transparent'
                  )}
                >
                  <input
                    type="radio"
                    name="report-category"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() => onCategoryChange(cat.id)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      selectedCategory === cat.id
                        ? 'border-primary-500'
                        : 'border-neutral-500'
                    )}
                  >
                    {selectedCategory === cat.id && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-white">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">
              Additional details <span className="text-neutral-500">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!selectedCategory}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all',
              selectedCategory
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            )}
          >
            Submit Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
