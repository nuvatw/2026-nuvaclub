'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { formatTime } from '../constants';

interface TestTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  className?: string;
}

export function TestTimer({ initialSeconds, onTimeUp, isPaused = false, className }: TestTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, remainingSeconds, onTimeUp]);

  const isWarning = remainingSeconds <= 60; // Last 1 minute warning
  const isCritical = remainingSeconds <= 30; // Last 30 seconds critical

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg',
        !isWarning && 'bg-neutral-800 text-neutral-200',
        isWarning && !isCritical && 'bg-amber-500/20 text-amber-400',
        isCritical && 'bg-red-500/20 text-red-400 animate-pulse',
        className
      )}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formatTime(remainingSeconds)}</span>
    </div>
  );
}

/**
 * Hook to manage timer state
 */
export function useTestTimer(durationSeconds: number, onTimeUp: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isPaused || isExpired) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isExpired, onTimeUp]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const reset = useCallback(() => {
    setRemainingSeconds(durationSeconds);
    setIsExpired(false);
    setIsPaused(false);
  }, [durationSeconds]);

  return {
    remainingSeconds,
    isPaused,
    isExpired,
    pause,
    resume,
    reset,
    formattedTime: formatTime(remainingSeconds),
  };
}
