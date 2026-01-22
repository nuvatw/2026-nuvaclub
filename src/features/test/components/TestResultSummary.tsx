'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';
import { formatTime, getLevelColor } from '../constants';

interface TestResultSummaryProps {
  level: number;
  score: number;
  maxScore: number;
  passed: boolean;
  timeSpent: number;
  passingScore: number;
  onRetry: () => void;
  onBackToLevels: () => void;
  onReviewAnswers?: () => void;
}

export function TestResultSummary({
  level,
  score,
  maxScore,
  passed,
  timeSpent,
  passingScore,
  onRetry,
  onBackToLevels,
  onReviewAnswers,
}: TestResultSummaryProps) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="max-w-lg mx-auto">
      <div className={cn(
        'rounded-2xl p-8 text-center',
        passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
      )}>
        {/* Result Icon */}
        <div className={cn(
          'w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center',
          passed ? 'bg-green-500/20' : 'bg-red-500/20'
        )}>
          {passed ? (
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Result Title */}
        <h2 className={cn(
          'text-3xl font-bold mb-2',
          passed ? 'text-green-400' : 'text-red-400'
        )}>
          {passed ? 'Congratulations!' : 'Keep Trying'}
        </h2>

        <p className="text-neutral-400 mb-6">
          Level {level} {passed ? 'Test Passed' : 'Test Not Passed'}
        </p>

        {/* Score Display */}
        <div className="bg-neutral-800/50 rounded-xl p-6 mb-6">
          <div className="text-5xl font-bold mb-2">
            <span className={passed ? 'text-green-400' : 'text-red-400'}>{score}</span>
            <span className="text-neutral-500 text-2xl"> / {maxScore}</span>
          </div>
          <div className="text-neutral-400">
            Score Rate <span className={cn('font-medium', passed ? 'text-green-400' : 'text-red-400')}>{percentage}%</span>
            <span className="text-neutral-500 ml-2">(Pass: {Math.round((passingScore / maxScore) * 100)}%)</span>
          </div>
        </div>

        {/* Time Spent */}
        <div className="flex items-center justify-center gap-2 text-neutral-400 mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Time Spent: {formatTime(timeSpent)}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {passed && level < 12 && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onBackToLevels}
            >
              Challenge Next Level (Level {level + 1})
            </Button>
          )}

          {onReviewAnswers && (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onReviewAnswers}
            >
              View Answer Details
            </Button>
          )}

          <Button
            variant={passed ? 'ghost' : 'primary'}
            size="lg"
            className="w-full"
            onClick={onRetry}
          >
            {passed ? 'Try Again' : 'Retry'}
          </Button>

          {!passed && (
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={onBackToLevels}
            >
              Back to Level List
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
