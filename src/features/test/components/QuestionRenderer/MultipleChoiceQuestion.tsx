'use client';

import { cn } from '@/lib/utils';
import type { QuestionRecord } from '@/lib/db/schema';

interface MultipleChoiceQuestionProps {
  question: QuestionRecord;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResult = false,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  const options = question.options ?? [];

  return (
    <div className="space-y-4">
      <p className="text-lg text-neutral-100">{question.content}</p>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = question.correctAnswer === option;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={option}
              onClick={() => !disabled && onSelect(option)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-4 py-3 px-4 rounded-xl text-left transition-all border-2',
                !isSelected && !showResult && 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600',
                isSelected && !showResult && 'bg-primary-500/20 border-primary-500 text-primary-400',
                showCorrect && 'bg-green-500/20 border-green-500 text-green-400',
                showWrong && 'bg-red-500/20 border-red-500 text-red-400',
                disabled && 'cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                  !isSelected && !showResult && 'bg-neutral-700 text-neutral-400',
                  isSelected && !showResult && 'bg-primary-500 text-white',
                  showCorrect && 'bg-green-500 text-white',
                  showWrong && 'bg-red-500 text-white'
                )}
              >
                {OPTION_LABELS[index]}
              </span>
              <span className="flex-1">{option}</span>
              {showCorrect && (
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
              {showWrong && (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showResult && question.correctAnswer && selectedAnswer !== question.correctAnswer && (
        <p className="text-sm text-neutral-400">
          Correct Answer: <span className="text-green-400">{question.correctAnswer}</span>
        </p>
      )}
    </div>
  );
}
