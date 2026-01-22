'use client';

import { cn } from '@/lib/utils';
import { getLevelColor, getLevelTier, TOTAL_LEVELS } from '../constants';
import type { LevelInfo } from '../types';

interface TestLevelProgressBarProps {
  levels: LevelInfo[];
  onSelectLevel: (level: number) => void;
  currentViewLevel?: number;
}

export function TestLevelProgressBar({
  levels,
  onSelectLevel,
  currentViewLevel,
}: TestLevelProgressBarProps) {
  const passedCount = levels.filter((l) => l.status === 'passed').length;

  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <p className="text-sm text-neutral-400">
            {passedCount} of {TOTAL_LEVELS} levels completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-400">
            {Math.round((passedCount / TOTAL_LEVELS) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress Bar with Clickable Levels */}
      <div className="relative">
        {/* Background track */}
        <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(passedCount / TOTAL_LEVELS) * 100}%` }}
          />
        </div>

        {/* Level dots */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-0">
          {levels.map((levelInfo) => {
            const { level, status, passed } = levelInfo;
            const isPassed = status === 'passed';
            const isSelected = currentViewLevel === level;
            const tier = getLevelTier(level);

            // Calculate position percentage
            const position = ((level - 1) / (TOTAL_LEVELS - 1)) * 100;

            return (
              <button
                key={level}
                onClick={() => onSelectLevel(level)}
                className="relative group"
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Dot */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all duration-200',
                    'hover:scale-125 cursor-pointer',
                    isPassed && 'bg-current border-current',
                    !isPassed && 'bg-neutral-900 border-neutral-600 hover:border-neutral-400',
                    isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900',
                    tier === 'basic' && isPassed && 'text-green-500',
                    tier === 'intermediate' && isPassed && 'text-blue-500',
                    tier === 'advanced' && isPassed && 'text-purple-500',
                    tier === 'expert' && isPassed && 'text-amber-500'
                  )}
                >
                  {isPassed && (
                    <svg
                      className="w-full h-full p-0.5 text-neutral-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Tooltip */}
                <div
                  className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded',
                    'bg-neutral-800 text-xs text-white whitespace-nowrap',
                    'opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
                    'border border-neutral-700'
                  )}
                >
                  <span className={cn('font-medium', getLevelColor(level))}>Lv.{level}</span>
                  <span className="text-neutral-400 ml-1">
                    {isPassed ? '(Passed)' : '(Available)'}
                  </span>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier Labels */}
      <div className="flex justify-between mt-6 text-xs">
        <div className="text-center">
          <span className="text-green-400 font-medium">Beginner</span>
          <span className="text-neutral-500 block">Lv.1-3</span>
        </div>
        <div className="text-center">
          <span className="text-blue-400 font-medium">Intermediate</span>
          <span className="text-neutral-500 block">Lv.4-6</span>
        </div>
        <div className="text-center">
          <span className="text-purple-400 font-medium">Advanced</span>
          <span className="text-neutral-500 block">Lv.7-9</span>
        </div>
        <div className="text-center">
          <span className="text-amber-400 font-medium">Expert</span>
          <span className="text-neutral-500 block">Lv.10-12</span>
        </div>
      </div>
    </div>
  );
}
