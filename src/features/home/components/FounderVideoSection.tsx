'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import { useHomeContent } from '@/features/home';
import { cn } from '@/lib/utils';

// Simplified YT Player interface based on what we need here
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
}

interface FounderVideoSectionProps {
  videoRef: React.RefObject<HTMLElement | null>;
}

export function FounderVideoSection({ videoRef }: FounderVideoSectionProps) {
  const { founder: FOUNDER_VIDEO_CONTENT } = useHomeContent();
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerContainerId = 'founder-youtube-player';
  const playerRef = useRef<YTPlayer | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
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
      // @ts-expect-error - window.YT is added by the script
      playerRef.current = new window.YT.Player(playerContainerId, {
        videoId: FOUNDER_VIDEO_CONTENT.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            setPlayer(event.target);
            setIsPlayerReady(true);
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [FOUNDER_VIDEO_CONTENT.videoId]);

  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const handleChapterClick = (time: string) => {
    if (player && isPlayerReady) {
      const seconds = timeToSeconds(time);
      player.seekTo(seconds, true);
      player.playVideo();
    }
  };

  return (
    <section ref={videoRef} className="py-12 sm:py-20 bg-neutral-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <Badge variant="primary" className="mb-4">
            {FOUNDER_VIDEO_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {FOUNDER_VIDEO_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            {FOUNDER_VIDEO_CONTENT.subheadline}
          </p>
        </motion.div>

        {/* Video Embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-video rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700">
            <div id={playerContainerId} className="w-full h-full" />
          </div>

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm pointer-events-none">
            {FOUNDER_VIDEO_CONTENT.duration}
          </div>
        </motion.div>

        {/* Video Chapters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-neutral-400 text-sm mb-4 text-center">{FOUNDER_VIDEO_CONTENT.chapterTitle}</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {FOUNDER_VIDEO_CONTENT.chapters.map((chapter) => (
              <button
                key={chapter.time}
                onClick={() => handleChapterClick(chapter.time)}
                className={cn(
                  "bg-neutral-800 hover:bg-neutral-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm transition-colors",
                  "border border-white/5 hover:border-white/10 active:scale-95 duration-200"
                )}
              >
                <span className="text-primary-400 font-mono mr-2">
                  {chapter.time}
                </span>
                <span className="text-neutral-300">{chapter.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
