'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { QuestionRecord } from '@/lib/db/schema';

interface EssayQuestionProps {
  question: QuestionRecord;
  answer?: string;
  onChange: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export function EssayQuestion({
  question,
  answer = '',
  onChange,
  showResult = false,
  disabled = false,
}: EssayQuestionProps) {
  const [localAnswer, setLocalAnswer] = useState(answer);

  useEffect(() => {
    setLocalAnswer(answer);
  }, [answer]);

  const handleBlur = () => {
    if (localAnswer !== answer) {
      onChange(localAnswer);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg text-neutral-100">{question.content}</p>

      {question.rubric && (
        <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
          <p className="text-sm text-neutral-400">
            <span className="font-medium text-neutral-300">Grading Criteria: </span>
            {question.rubric}
          </p>
        </div>
      )}

      <textarea
        value={localAnswer}
        onChange={(e) => setLocalAnswer(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Please explain your viewpoint and reasoning in detail..."
        className={cn(
          'w-full h-64 px-4 py-3 rounded-xl resize-y transition-all',
          'bg-neutral-800 border-2 border-neutral-700 text-neutral-100 placeholder-neutral-500',
          'focus:outline-none focus:border-primary-500',
          disabled && 'cursor-not-allowed opacity-70'
        )}
      />

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>Characters: {localAnswer.length}</span>
        <span>Recommended 300-800 characters</span>
      </div>

      {showResult && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-400 font-medium">
            Essay questions require manual grading. This is a reference score.
          </p>
        </div>
      )}
    </div>
  );
}
