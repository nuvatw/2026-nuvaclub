'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import { ArrowRightIcon, PlayIcon } from '@/components/icons';
import {
  CAMPAIGN_CONFIG,
  HERO_CONTENT,
  HERO_VIDEO_ID,
  STATS,
} from '@/content/home-content';
import { CountdownTimer } from './CountdownTimer';

interface HeroSectionProps {
  onScrollToTiers: () => void;
  onScrollToVideo: () => void;
}

export function HeroSection({
  onScrollToTiers,
  onScrollToVideo,
}: HeroSectionProps) {
  const [videoReady, setVideoReady] = useState(false);

  // Preload video by waiting for iframe to be ready
  useEffect(() => {
    // Give the video a moment to start loading, then fade in
    const timer = setTimeout(() => setVideoReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      {/* Video Background - hidden until ready, no visible loading state */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Poster/placeholder that matches the gradient overlay - ensures no CLS */}
        <div className="absolute inset-0 bg-neutral-950" />
        {/* Video iframe - starts invisible, fades in when ready */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <iframe
            className="w-full h-[150%] -translate-y-[25%] object-cover scale-125"
            src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_VIDEO_ID}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
            title="Hero Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: 'none' }}
          />
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/85 to-neutral-950 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <Badge variant="warning" className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm" dot>
              {HERO_CONTENT.badge}
            </Badge>
          </motion.div>

          {/* Headline - optimized for mobile */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.2] sm:leading-tight">
            {HERO_CONTENT.headline.line1}
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {HERO_CONTENT.headline.line2}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-neutral-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
            {HERO_CONTENT.subheadline}
          </p>

          {/* Dual CTAs - optimized for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-row items-center gap-3 sm:gap-4 mb-4"
          >
            <Button
              size="lg"
              className="text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4 h-auto flex-1 sm:flex-none"
              onClick={onScrollToTiers}
            >
              {HERO_CONTENT.primaryCta}
              <ArrowRightIcon size="sm" className="ml-1.5 sm:ml-2 hidden sm:block" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4 h-auto flex-1 sm:flex-none"
              onClick={onScrollToVideo}
            >
              <PlayIcon size="sm" className="mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">{HERO_CONTENT.secondaryCta}</span>
              <span className="sm:hidden">創辦人的話</span>
            </Button>
          </motion.div>

          {/* Countdown Timer */}
          <CountdownTimer targetDate={CAMPAIGN_CONFIG.countdownEndDate} />
        </motion.div>

        {/* Stats Row - optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-16 grid grid-cols-4 gap-2 sm:gap-8"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                {stat.value}
              </div>
              <div className="text-neutral-400 text-[10px] sm:text-sm leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-neutral-500 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-neutral-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
