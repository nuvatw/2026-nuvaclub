'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Question } from '../../types';

interface ShortAnswerQuestionProps {
  question: Question;
  answer?: string;
  onChange: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export function ShortAnswerQuestion({
  question,
  answer = '',
  onChange,
  showResult = false,
  disabled = false,
}: ShortAnswerQuestionProps) {
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

      <textarea
        value={localAnswer}
        onChange={(e) => setLocalAnswer(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Enter your answer..."
        className={cn(
          'w-full h-32 px-4 py-3 rounded-xl resize-none transition-all',
          'bg-neutral-800 border-2 border-neutral-700 text-neutral-100 placeholder-neutral-500',
          'focus:outline-none focus:border-primary-500',
          disabled && 'cursor-not-allowed opacity-70'
        )}
      />

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>Characters: {localAnswer.length}</span>
        <span>Recommended 50-200 characters</span>
      </div>

      {showResult && question.correctAnswer && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <p className="text-sm text-green-400 font-medium mb-2">Reference Answer:</p>
          <p className="text-neutral-300 text-sm">{question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
