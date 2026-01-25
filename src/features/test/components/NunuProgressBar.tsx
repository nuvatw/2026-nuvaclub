'use client';

import { cn } from '@/lib/utils';
import { CheckIcon, SparklesIcon } from '@/components/icons';
import {
  NUNU_LEVELS,
  getNunuLevelIndex,
  getNunuLevelColor,
  type NunuLevel,
} from '../data/nunu-rules';

interface NunuProgressBarProps {
  /** Current user's Nunu level (null if not yet certified) */
  currentLevel: NunuLevel | null;
  /** Whether user has Verified status */
  isVerified: boolean;
  /** Currently selected level for viewing details */
  selectedLevel: NunuLevel | 'verified' | null;
  /** Callback when a level is selected */
  onSelectLevel: (level: NunuLevel | 'verified') => void;
}

/**
 * Nunu certification progress bar
 * Shows: N-Test → N-5 → N-4 → N-3 → N-2 → N-1 + Verified badge
 */
export function NunuProgressBar({
  currentLevel,
  isVerified,
  selectedLevel,
  onSelectLevel,
}: NunuProgressBarProps) {
  const currentIndex = getNunuLevelIndex(currentLevel);
  const passedCount = currentIndex + 1;

  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-white">Nunu Certification</h3>
          <p className="text-sm text-neutral-400">
            {currentLevel
              ? `Current level: ${currentLevel}`
              : 'Start your journey to become a Nunu mentor'}
            {isVerified && ' (Verified)'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-purple-400">
            {passedCount > 0 ? `${passedCount}/6` : '0/6'}
          </span>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center w-full gap-1">
        {NUNU_LEVELS.map((level, index) => {
          const isPassed = index <= currentIndex && currentIndex >= 0;
          const isSelected = selectedLevel === level;
          const isLast = index === NUNU_LEVELS.length - 1;

          // Determine colors
          const levelColor = getNunuLevelColor(level);
          const bgColor = isPassed
            ? levelColor.replace('text-', 'bg-').replace('-400', '-500')
            : 'bg-neutral-700';

          return (
            <div key={level} className={cn('flex items-center', !isLast && 'flex-1')}>
              {/* Level Node */}
              <button
                onClick={() => onSelectLevel(level)}
                className={cn(
                  'relative flex items-center justify-center rounded-full transition-all duration-200',
                  'w-10 h-10 sm:w-12 sm:h-12',
                  'font-bold text-xs sm:text-sm',
                  'focus:outline-none cursor-pointer',
                  // Passed state
                  isPassed && bgColor,
                  isPassed && 'text-white',
                  // Not passed state
                  !isPassed && 'bg-neutral-800 text-neutral-400 border-2 border-neutral-600',
                  // Selected ring
                  isSelected && isPassed && 'ring-4 ring-white/30',
                  isSelected && !isPassed && 'ring-4 ring-purple-500/50',
                  // Hover
                  'hover:scale-110 hover:z-10'
                )}
                aria-label={`${level}${isPassed ? ' (Passed)' : ''}`}
                aria-pressed={isSelected}
              >
                {isPassed ? (
                  <CheckIcon size="sm" className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="leading-none">{level.replace('N-', '')}</span>
                )}
              </button>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 mx-1 sm:mx-2">
                  <div
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      index < currentIndex ? 'bg-purple-500' : 'bg-neutral-700'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Verified Badge (separate from main progression) */}
        <div className="ml-4 pl-4 border-l border-neutral-700">
          <button
            onClick={() => onSelectLevel('verified')}
            className={cn(
              'relative flex items-center justify-center rounded-full transition-all duration-200',
              'w-10 h-10 sm:w-12 sm:h-12',
              'font-bold text-xs',
              'focus:outline-none cursor-pointer',
              isVerified
                ? 'bg-amber-500 text-white'
                : 'bg-neutral-800 text-neutral-400 border-2 border-amber-500/50',
              selectedLevel === 'verified' && 'ring-4 ring-amber-500/50',
              'hover:scale-110 hover:z-10'
            )}
            aria-label={`Verified${isVerified ? ' (Achieved)' : ''}`}
            aria-pressed={selectedLevel === 'verified'}
          >
            {isVerified ? (
              <SparklesIcon size="sm" className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <span>V</span>
            )}
          </button>
        </div>
      </div>

      {/* Level Labels */}
      <div className="flex mt-6">
        <div className="flex-1 flex justify-around items-end">
          {NUNU_LEVELS.map((level) => (
            <div key={level} className="text-center min-w-[48px]">
              <span className={cn('text-xs font-medium', getNunuLevelColor(level))}>
                {level}
              </span>
            </div>
          ))}
        </div>
        <div className="ml-4 pl-4 border-l border-neutral-700 min-w-[48px] text-center">
          <span className="text-xs font-medium text-amber-400">Verified</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-500">
          Complete requirements and pass exams to advance. Verified is a special certification
          that can be added to any N-level.
        </p>
      </div>
    </div>
  );
}
