'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  PlaySolidIcon,
  PauseIcon as PauseIconGlobal,
  VolumeUpIcon,
  VolumeOffIcon,
  MenuIcon,
} from '@/components/icons';
import type { Course } from '../types';
import { getAllLessons } from '../types';

// Import extracted components
import type { YTPlayer, PlaybackSpeed } from '../types/video-player';
import { PLAYBACK_SPEEDS, REPORT_CATEGORIES } from '../types/video-player';
import {
  Rewind10Icon,
  Forward10Icon,
  CaptionsIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
  PrevEpisodeIcon,
  NextEpisodeIcon,
} from './VideoPlayerIcons';
import { CloseButton, ControlButton, ReportButton, SpeedButton } from './VideoControls';
import { EpisodeDrawer } from './EpisodeDrawer';
import { ReportModal } from './ReportModal';

interface VideoPlayerProps {
  course: Course;
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  initialLessonIndex?: number;
  initialStartSeconds?: number;
  onProgressUpdate?: (lessonIndex: number, currentSeconds: number, totalDuration: number) => void;
}

export function VideoPlayer({
  course,
  videoId,
  isOpen,
  onClose,
  initialLessonIndex = 0,
  initialStartSeconds = 0,
  onProgressUpdate,
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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [bufferedProgress, setBufferedProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevEpisodeTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialSeekedRef = useRef(false);
  const playerContainerId = 'youtube-player-container';

  // Get all lessons for navigation
  const allLessons = getAllLessons(course);
  const totalEpisodes = allLessons.length;
  const hasTrailer = !!course.trailer?.youtubeId;

  // Calculate prev/next availability
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
            if (initialStartSeconds > 0 && !hasInitialSeekedRef.current) {
              event.target.seekTo(initialStartSeconds, true);
              hasInitialSeekedRef.current = true;
            }
            event.target.playVideo();
          },
          onStateChange: (event) => {
            const playing = event.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
            if (playing) {
              setIsLoading(false);
              startProgressTracking(event.target);
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (progressSaveIntervalRef.current) clearInterval(progressSaveIntervalRef.current);
    };
  }, [isOpen, videoId, captionsEnabled, initialStartSeconds]);

  // Progress tracking
  const startProgressTracking = useCallback((ytPlayer: YTPlayer) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (progressSaveIntervalRef.current) clearInterval(progressSaveIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      if (ytPlayer && ytPlayer.getCurrentTime) {
        setCurrentTime(ytPlayer.getCurrentTime());
        if (ytPlayer.getVideoLoadedFraction) {
          setBufferedProgress(ytPlayer.getVideoLoadedFraction() * 100);
        }
      }
    }, 500);

    progressSaveIntervalRef.current = setInterval(() => {
      if (ytPlayer && ytPlayer.getCurrentTime && onProgressUpdate) {
        const currentSeconds = ytPlayer.getCurrentTime();
        const totalDuration = ytPlayer.getDuration();
        onProgressUpdate(currentLessonIndex, currentSeconds, totalDuration);
      }
    }, 5000);
  }, [currentLessonIndex, onProgressUpdate]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowEpisodes(false);
        setShowSpeedPicker(false);
      }
    }, 3000);
  }, [isPlaying]);

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
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-10);
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
  }, [isOpen, player, isFullscreen, isPlaying, showReportModal, showSpeedPicker]);

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
      containerRef.current.requestFullscreen?.().catch(() => {});
    }
  }, [isOpen]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen && player) {
      if (onProgressUpdate) {
        try {
          const currentSeconds = player.getCurrentTime();
          const totalDuration = player.getDuration();
          if (currentSeconds > 0 && totalDuration > 0) {
            onProgressUpdate(currentLessonIndex, currentSeconds, totalDuration);
          }
        } catch {
          // Player might be destroyed
        }
      }
      player.destroy();
      setPlayer(null);
      setIsLoading(true);
      hasInitialSeekedRef.current = false;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (progressSaveIntervalRef.current) clearInterval(progressSaveIntervalRef.current);
    }
  }, [isOpen, currentLessonIndex, onProgressUpdate]);

  // Player control functions
  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
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

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  const adjustVolume = (delta: number) => {
    if (!player) return;
    const newVolume = Math.max(0, Math.min(100, volume + delta));
    setVolume(newVolume);
    player.setVolume(newVolume);
    if (newVolume === 0) setIsMuted(true);
    else if (isMuted) {
      player.unMute();
      setIsMuted(false);
    }
    resetControlsTimeout();
  };

  const changePlaybackSpeed = (speed: PlaybackSpeed) => {
    if (player) player.setPlaybackRate(speed);
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

  const goToPrevEpisode = () => {
    if (!canGoPrev) return;
    const RESTART_THRESHOLD = 10;
    if (currentTime > RESTART_THRESHOLD && prevEpisodeTapCount === 0) {
      if (player) {
        player.seekTo(0, true);
        setCurrentTime(0);
      }
      setPrevEpisodeTapCount(1);
      if (prevEpisodeTapTimeoutRef.current) clearTimeout(prevEpisodeTapTimeoutRef.current);
      prevEpisodeTapTimeoutRef.current = setTimeout(() => setPrevEpisodeTapCount(0), 2000);
    } else {
      setPrevEpisodeTapCount(0);
      if (prevEpisodeTapTimeoutRef.current) clearTimeout(prevEpisodeTapTimeoutRef.current);
      selectEpisode(currentLessonIndex - 1);
    }
    resetControlsTimeout();
  };

  const goToNextEpisode = () => {
    if (!canGoNext) return;
    selectEpisode(currentLessonIndex + 1);
    resetControlsTimeout();
  };

  const openReportModal = () => {
    setWasPlayingBeforeReport(isPlaying);
    if (player && isPlaying) player.pauseVideo();
    setShowReportModal(true);
    setReportCategory('');
    setReportDescription('');
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    if (wasPlayingBeforeReport && player) player.playVideo();
  };

  const submitReport = () => {
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
    console.log('Report submitted:', reportPayload);
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
    if (player && onProgressUpdate) {
      try {
        const currentSeconds = player.getCurrentTime();
        const totalDuration = player.getDuration();
        if (currentSeconds > 0 && totalDuration > 0) {
          onProgressUpdate(currentLessonIndex, currentSeconds, totalDuration);
        }
      } catch {
        // Player might not be ready
      }
    }

    if (index === -1) {
      const trailerVideoId = course.trailer?.youtubeId;
      if (trailerVideoId && player) {
        setCurrentLessonIndex(-1);
        setShowEpisodes(false);
        setIsLoading(true);
        player.loadVideoById(trailerVideoId);
        setTimeout(() => {
          if (player && playbackSpeed !== 1) player.setPlaybackRate(playbackSpeed);
        }, 500);
      }
      return;
    }

    const lesson = allLessons[index];
    if (lesson?.videoUrl) {
      setCurrentLessonIndex(index);
      setShowEpisodes(false);
      setIsLoading(true);
      const lessonVideoId = getYouTubeVideoId(lesson.videoUrl);
      if (lessonVideoId && player) {
        player.loadVideoById(lessonVideoId);
        setTimeout(() => {
          if (player && playbackSpeed !== 1) player.setPlaybackRate(playbackSpeed);
        }, 500);
      }
    }
  };

  const getYouTubeVideoId = (urlOrId: string): string => {
    if (!urlOrId) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    const match = urlOrId.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : urlOrId;
  };

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
            <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
              <CloseButton onClick={handleClose} />
              <ReportButton onClick={openReportModal} />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center">
                <p className="text-neutral-400 text-base">{course.title}</p>
                <p className="text-white font-semibold text-lg">
                  {currentLessonIndex === -1
                    ? (course.trailer?.title || 'Trailer')
                    : (allLessons[currentLessonIndex]?.title || 'Now Playing')}
                </p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 pb-8 px-8 pointer-events-auto">
              {/* Progress Bar */}
              <div
                className="relative h-1.5 bg-neutral-700 rounded-full mb-5 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div className="absolute h-full bg-neutral-500 rounded-full" style={{ width: `${bufferedProgress}%` }} />
                <div className="absolute h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(currentTime / duration) * 100}%` }} />
                <div
                  className="absolute w-4 h-4 bg-primary-500 rounded-full -top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
                />
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-between mb-4 text-base text-neutral-300">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                {/* Left side controls */}
                <div className="flex items-center gap-4">
                  <ControlButton onClick={togglePlay} label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
                    {isPlaying ? <PauseIconGlobal size="lg" className="w-8 h-8" /> : <PlaySolidIcon size="lg" className="w-8 h-8" />}
                  </ControlButton>
                  <ControlButton onClick={seekBackward} label="Rewind 10s (←)">
                    <Rewind10Icon className="w-7 h-7" />
                  </ControlButton>
                  <ControlButton onClick={seekForward} label="Forward 10s (→)">
                    <Forward10Icon className="w-7 h-7" />
                  </ControlButton>
                  <ControlButton onClick={toggleMute} label={isMuted ? 'Unmute (M)' : 'Mute (M)'}>
                    {isMuted || volume === 0 ? <VolumeOffIcon size="lg" className="w-7 h-7" /> : <VolumeUpIcon size="lg" className="w-7 h-7" />}
                  </ControlButton>
                </div>

                {/* Center: Prev + Episode Title + Next */}
                <div className="hidden sm:flex items-center gap-4">
                  <ControlButton onClick={goToPrevEpisode} label="Previous episode (P)" disabled={!canGoPrev}>
                    <PrevEpisodeIcon className="w-6 h-6" />
                  </ControlButton>
                  <div className="text-center min-w-[160px]">
                    <p className="text-base text-white font-medium truncate max-w-[220px]">
                      {currentLessonIndex === -1 ? 'Trailer' : allLessons[currentLessonIndex]?.title || 'Now Playing'}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {currentLessonIndex === -1 ? course.title : `Episode ${currentLessonIndex + 1} of ${totalEpisodes}`}
                    </p>
                  </div>
                  <ControlButton onClick={goToNextEpisode} label="Next episode (N)" disabled={!canGoNext}>
                    <NextEpisodeIcon className="w-6 h-6" />
                  </ControlButton>
                </div>

                {/* Mobile: Prev/Next only */}
                <div className="flex sm:hidden items-center gap-3">
                  <ControlButton onClick={goToPrevEpisode} label="Previous" disabled={!canGoPrev}>
                    <PrevEpisodeIcon className="w-6 h-6" />
                  </ControlButton>
                  <ControlButton onClick={goToNextEpisode} label="Next" disabled={!canGoNext}>
                    <NextEpisodeIcon className="w-6 h-6" />
                  </ControlButton>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-4">
                  <SpeedButton
                    speed={playbackSpeed}
                    isOpen={showSpeedPicker}
                    onToggle={() => setShowSpeedPicker(!showSpeedPicker)}
                    onSelect={changePlaybackSpeed}
                  />
                  <ControlButton onClick={() => setShowEpisodes(!showEpisodes)} label="Episodes" active={showEpisodes}>
                    <MenuIcon size="lg" />
                  </ControlButton>
                  <ControlButton onClick={toggleCaptions} label="Captions (C)" active={captionsEnabled}>
                    <CaptionsIcon className="w-6 h-6" />
                  </ControlButton>
                  <ControlButton onClick={toggleFullscreen} label={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}>
                    {isFullscreen ? <ExitFullscreenIcon className="w-6 h-6" /> : <FullscreenIcon className="w-6 h-6" />}
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
