'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';
import type { LevelInfo } from '../types';
import { getLevelColor, getLevelBgColor, formatDuration } from '../constants';

interface TestLevelCardProps {
  levelInfo: LevelInfo;
  onClick: () => void;
}

export function TestLevelCard({ levelInfo, onClick }: TestLevelCardProps) {
  const { level, status, bestScore, attempts, durationMinutes, questionTypes, passed } = levelInfo;

  const isLocked = status === 'locked';
  const isAvailable = status === 'available';
  const isPassed = status === 'passed';

  return (
    <div
      className={cn(
        'relative rounded-xl border p-6 transition-all',
        isLocked && 'opacity-50 cursor-not-allowed bg-neutral-900/50 border-neutral-800',
        isAvailable && 'bg-neutral-900 border-neutral-700 hover:border-neutral-600 cursor-pointer',
        isPassed && getLevelBgColor(level)
      )}
      onClick={isLocked ? undefined : onClick}
    >
      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute top-4 right-4">
          <svg
            className="w-5 h-5 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}

      {/* Pass Mark */}
      {isPassed && (
        <div className="absolute top-4 right-4">
          <svg
            className={cn('w-6 h-6', getLevelColor(level))}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
      )}

      {/* Level Title */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            'text-2xl font-bold',
            isLocked ? 'text-neutral-600' : getLevelColor(level)
          )}
        >
          Lv.{level}
        </span>
      </div>

      {/* Question Types and Time */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>{questionTypes}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatDuration(durationMinutes)}</span>
        </div>
      </div>

      {/* Statistics */}
      {(attempts > 0 || bestScore !== null) && (
        <div className="flex items-center gap-4 mb-4 text-sm">
          {bestScore !== null && (
            <div className="text-neutral-300">
              Best: <span className={cn('font-medium', passed ? 'text-green-500' : 'text-neutral-200')}>{bestScore}</span>
            </div>
          )}
          {attempts > 0 && (
            <div className="text-neutral-400">
              Attempts: {attempts}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {!isLocked && (
        <Button
          variant={isPassed ? 'outline' : 'primary'}
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {isPassed ? 'Try Again' : 'Start Test'}
        </Button>
      )}
    </div>
  );
}
