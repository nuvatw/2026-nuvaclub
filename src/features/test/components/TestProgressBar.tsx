'use client';

import { cn } from '@/lib/utils';

interface TestProgressBarProps {
  current: number;
  total: number;
  answered: number;
  className?: string;
}

export function TestProgressBar({ current, total, answered, className }: TestProgressBarProps) {
  const progress = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-400">
          Question {current} / {total}
        </span>
        <span className="text-neutral-400">
          {answered} Answered
        </span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answeredQuestions: Set<string>;
  questionIds: string[];
  onNavigate: (index: number) => void;
}

export function QuestionNavigator({
  total,
  current,
  answeredQuestions,
  questionIds,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }, (_, i) => {
        const questionId = questionIds[i];
        const isAnswered = questionId ? answeredQuestions.has(questionId) : false;
        const isCurrent = i === current;

        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-medium transition-all',
              isCurrent && 'ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-900',
              isAnswered && !isCurrent && 'bg-green-500/20 text-green-400 border border-green-500/30',
              !isAnswered && !isCurrent && 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
