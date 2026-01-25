'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { XIcon as CloseIcon } from '@/components/icons';
import type { Chapter } from '../types';

interface EpisodeDrawerProps {
  trailer?: { title: string; youtubeId: string; duration: number };
  chapters: Chapter[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function EpisodeDrawer({
  trailer,
  chapters,
  currentIndex,
  onSelect,
  onClose,
}: EpisodeDrawerProps) {
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
          <CloseIcon size="md" className="text-neutral-400 hover:text-white transition-colors" />
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
