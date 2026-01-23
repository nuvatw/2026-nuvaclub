'use client';

import { cn } from '@/lib/utils';
import type { QuestionWithOptions } from '@/lib/db/repositories/TestRepository';

interface TrueFalseQuestionProps {
  question: QuestionWithOptions;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export function TrueFalseQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResult = false,
  disabled = false,
}: TrueFalseQuestionProps) {
  const options = question.options?.map(o => o.optionText) ?? ['True', 'False'];

  return (
    <div className="space-y-4">
      <p className="text-lg text-neutral-100">{question.content}</p>

      <div className="flex gap-4">
        {options.map((optionText, index) => {
          const optionRecord = question.options?.[index];
          const isSelected = selectedAnswer === optionText;
          const isCorrect = optionRecord?.isCorrect ?? question.correctAnswer === optionText;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={optionText}
              onClick={() => !disabled && onSelect(optionText)}
              disabled={disabled}
              className={cn(
                'flex-1 py-4 px-6 rounded-xl text-lg font-medium transition-all border-2',
                !isSelected && !showResult && 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600',
                isSelected && !showResult && 'bg-primary-500/20 border-primary-500 text-primary-400',
                showCorrect && 'bg-green-500/20 border-green-500 text-green-400',
                showWrong && 'bg-red-500/20 border-red-500 text-red-400',
                disabled && 'cursor-not-allowed opacity-70'
              )}
            >
              {optionText}
            </button>
          );
        })}
      </div>

      {showResult && question.correctAnswer && (
        <p className="text-sm text-neutral-400">
          Correct Answer: <span className="text-green-400">{question.correctAnswer}</span>
        </p>
      )}
    </div>
  );
}
