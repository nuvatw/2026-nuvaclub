'use client';

import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface TestNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  className?: string;
}

export function TestNavigation({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  canSubmit,
  className,
}: TestNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirst}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {!isLast ? (
          <Button onClick={onNext}>
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            Submit Test
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
