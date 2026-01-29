'use client';

import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
import { FOUNDER_VIDEO_CONTENT } from '@/content/home-content';

interface FounderVideoSectionProps {
  videoRef: React.RefObject<HTMLElement | null>;
}

export function FounderVideoSection({ videoRef }: FounderVideoSectionProps) {
  return (
    <section ref={videoRef} className="py-20 bg-neutral-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="primary" className="mb-4">
            {FOUNDER_VIDEO_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {FOUNDER_VIDEO_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
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
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_CONTENT.videoId}?rel=0&modestbranding=1`}
              title="創辦人的話"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
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
          <h3 className="text-neutral-400 text-sm mb-4 text-center">影片章節</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {FOUNDER_VIDEO_CONTENT.chapters.map((chapter) => (
              <div
                key={chapter.time}
                className="bg-neutral-800 px-4 py-2 rounded-lg text-sm"
              >
                <span className="text-primary-400 font-mono mr-2">
                  {chapter.time}
                </span>
                <span className="text-neutral-300">{chapter.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
