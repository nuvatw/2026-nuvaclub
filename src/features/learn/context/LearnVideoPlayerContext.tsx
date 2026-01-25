'use client';

import { createContext, useContext } from 'react';
import type { Course } from '@/features/learn/types';

// ==========================================
// Video Player Context for Learn Page
// Allows child components (LearnHoverPreview) to open the VideoPlayer
// with smart resume logic handled at the page level
// ==========================================

export interface LearnVideoPlayerContextValue {
  openPlayer: (course: Course) => void;
}

export const LearnVideoPlayerContext = createContext<LearnVideoPlayerContextValue | null>(null);

export function useLearnVideoPlayer() {
  const context = useContext(LearnVideoPlayerContext);
  if (!context) {
    throw new Error('useLearnVideoPlayer must be used within LearnVideoPlayerContext.Provider');
  }
  return context;
}
