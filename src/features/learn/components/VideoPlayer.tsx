'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Course, Lesson } from '../types';

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
  setOption: (module: string, option: string, value: unknown) => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

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

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerId = 'youtube-player-container';

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
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.PLAYING) {
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
        case 'Escape':
          if (isFullscreen) {
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const selectEpisode = (index: number) => {
    setCurrentLessonIndex(index);
    setShowEpisodes(false);
    // In a real app, you'd load the episode's video
    // For now, we just track the selection
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
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black"
        onMouseMove={handleMouseMove}
        onClick={() => !showEpisodes && togglePlay()}
      >
        {/* Video Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
              <div className="w-12 h-12 border-3 border-neutral-700 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
          <div id={playerContainerId} className="w-full h-full" />
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

                {/* Current Episode Title */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-neutral-400 text-sm">{course.title}</p>
                  <p className="text-white font-medium">
                    {course.lessons[currentLessonIndex]?.title || 'Now Playing'}
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
                <div className="flex items-center justify-center gap-6">
                  {/* Rewind 10s */}
                  <ControlButton onClick={seekBackward} label="Rewind 10 seconds">
                    <Rewind10Icon className="w-7 h-7" />
                  </ControlButton>

                  {/* Play/Pause */}
                  <ControlButton
                    onClick={togglePlay}
                    label={isPlaying ? 'Pause' : 'Play'}
                    size="lg"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-10 h-10" />
                    ) : (
                      <PlayIcon className="w-10 h-10" />
                    )}
                  </ControlButton>

                  {/* Forward 10s */}
                  <ControlButton onClick={seekForward} label="Forward 10 seconds">
                    <Forward10Icon className="w-7 h-7" />
                  </ControlButton>

                  <div className="w-px h-8 bg-neutral-700 mx-2" />

                  {/* Episodes */}
                  <ControlButton
                    onClick={() => setShowEpisodes(!showEpisodes)}
                    label="Episodes"
                    active={showEpisodes}
                  >
                    <EpisodeIcon className="w-6 h-6" />
                  </ControlButton>

                  {/* Captions */}
                  <ControlButton
                    onClick={toggleCaptions}
                    label="Captions"
                    active={captionsEnabled}
                  >
                    <CaptionsIcon className="w-6 h-6" />
                  </ControlButton>

                  {/* Fullscreen */}
                  <ControlButton
                    onClick={toggleFullscreen}
                    label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <ExitFullscreenIcon className="w-6 h-6" />
                    ) : (
                      <FullscreenIcon className="w-6 h-6" />
                    )}
                  </ControlButton>
                </div>
              </div>

              {/* Episode Drawer */}
              <AnimatePresence>
                {showEpisodes && (
                  <EpisodeDrawer
                    lessons={course.lessons}
                    currentIndex={currentLessonIndex}
                    onSelect={selectEpisode}
                    onClose={() => setShowEpisodes(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
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
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  size?: 'md' | 'lg';
  active?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'rounded-full transition-all hover:scale-110 active:scale-95 text-white',
          size === 'lg'
            ? 'p-4 bg-white/20 hover:bg-white/30'
            : 'p-3 hover:bg-white/10',
          active && 'text-primary-400'
        )}
      >
        {children}
      </button>
      <AnimatePresence>
        {showTooltip && (
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

// Episode Drawer Component
function EpisodeDrawer({
  lessons,
  currentIndex,
  onSelect,
  onClose,
}: {
  lessons: Lesson[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
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

      <div className="overflow-y-auto h-[calc(100%-65px)] p-4 space-y-2">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            onClick={() => onSelect(index)}
            className={cn(
              'w-full text-left p-4 rounded-lg transition-colors',
              index === currentIndex
                ? 'bg-primary-500/20 border border-primary-500/50'
                : 'bg-neutral-800/50 hover:bg-neutral-800 border border-transparent'
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-neutral-500 font-mono text-sm mt-0.5">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-medium truncate',
                    index === currentIndex ? 'text-primary-400' : 'text-white'
                  )}
                >
                  {lesson.title}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  {Math.floor(lesson.duration / 60)} min
                </p>
              </div>
              {index === currentIndex && (
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse" />
              )}
            </div>
          </button>
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
