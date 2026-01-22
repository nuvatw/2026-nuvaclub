'use client';

import { cn } from '@/lib/utils';
import { getLevelTier, TOTAL_LEVELS } from '../constants';
import type { LevelInfo } from '../types';

interface TestLevelProgressBarProps {
  levels: LevelInfo[];
  onSelectLevel: (level: number) => void;
  currentViewLevel?: number;
}

// Get tier colors
function getTierColors(level: number) {
  const tier = getLevelTier(level);
  const colors = {
    basic: { bg: 'bg-green-500', text: 'text-green-500', ring: 'ring-green-500/50' },
    intermediate: { bg: 'bg-blue-500', text: 'text-blue-500', ring: 'ring-blue-500/50' },
    advanced: { bg: 'bg-purple-500', text: 'text-purple-500', ring: 'ring-purple-500/50' },
    expert: { bg: 'bg-amber-500', text: 'text-amber-500', ring: 'ring-amber-500/50' },
  };
  return colors[tier];
}

export function TestLevelProgressBar({
  levels,
  onSelectLevel,
  currentViewLevel,
}: TestLevelProgressBarProps) {
  const passedCount = levels.filter((l) => l.status === 'passed').length;
  const selectedLevel = currentViewLevel ?? 1;

  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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

      {/* Stepper */}
      <ol className="flex items-center w-full">
        {levels.map((levelInfo, index) => {
          const { level, status } = levelInfo;
          const isPassed = status === 'passed';
          const isSelected = selectedLevel === level;
          const isInPreviewZone = level <= selectedLevel && level > passedCount;
          const isLast = index === levels.length - 1;
          const colors = getTierColors(level);

          // Determine line color (connecting to next step)
          const nextLevel = level + 1;
          const isNextPassed = nextLevel <= passedCount;
          const isNextInPreview = nextLevel <= selectedLevel && nextLevel > passedCount;

          return (
            <li
              key={level}
              className={cn('flex items-center', !isLast && 'flex-1')}
            >
              {/* Step Circle */}
              <button
                onClick={() => onSelectLevel(level)}
                className={cn(
                  'relative flex items-center justify-center rounded-full transition-all duration-200',
                  'w-8 h-8 sm:w-10 sm:h-10',
                  'font-semibold text-sm',
                  'focus:outline-none cursor-pointer',
                  // Passed: colored background
                  isPassed && colors.bg,
                  isPassed && 'text-white',
                  // Preview zone (selected ahead): grey
                  !isPassed && isInPreviewZone && 'bg-neutral-500 text-white',
                  // Future: dark with border
                  !isPassed && !isInPreviewZone && 'bg-neutral-800 text-neutral-400 border-2 border-neutral-600',
                  // Selected: ring highlight
                  isSelected && isPassed && `ring-4 ${colors.ring}`,
                  isSelected && !isPassed && 'ring-4 ring-white/40',
                  // Hover
                  'hover:scale-110'
                )}
              >
                {isPassed ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{level}</span>
                )}
              </button>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 mx-1 sm:mx-2">
                  <div
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      // Line is colored if next step is passed
                      isNextPassed && getTierColors(level).bg,
                      // Line is grey if in preview zone
                      !isNextPassed && isNextInPreview && 'bg-neutral-500',
                      // Line is dark if future
                      !isNextPassed && !isNextInPreview && 'bg-neutral-700'
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Tier Labels */}
      <div className="flex mt-6">
        <div className="flex-[3] flex justify-center">
          <div className="text-center">
            <span className="text-green-400 text-xs font-medium">Beginner</span>
            <span className="text-neutral-500 text-xs block">1-3</span>
          </div>
        </div>
        <div className="flex-[3] flex justify-center">
          <div className="text-center">
            <span className="text-blue-400 text-xs font-medium">Intermediate</span>
            <span className="text-neutral-500 text-xs block">4-6</span>
          </div>
        </div>
        <div className="flex-[3] flex justify-center">
          <div className="text-center">
            <span className="text-purple-400 text-xs font-medium">Advanced</span>
            <span className="text-neutral-500 text-xs block">7-9</span>
          </div>
        </div>
        <div className="flex-[3] flex justify-center">
          <div className="text-center">
            <span className="text-amber-400 text-xs font-medium">Expert</span>
            <span className="text-neutral-500 text-xs block">10-12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
