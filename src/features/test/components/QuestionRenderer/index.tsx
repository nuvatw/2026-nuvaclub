'use client';

import type { QuestionRecord, QuestionType } from '@/lib/db/schema';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { EssayQuestion } from './EssayQuestion';
import { Badge } from '@/components/atoms';

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'true-false': 'True/False',
  'multiple-choice': 'Multiple Choice',
  'short-answer': 'Short Answer',
  'essay': 'Essay',
};

const QUESTION_TYPE_VARIANTS: Record<QuestionType, 'success' | 'primary' | 'warning' | 'error'> = {
  'true-false': 'success',
  'multiple-choice': 'primary',
  'short-answer': 'warning',
  'essay': 'error',
};

interface QuestionRendererProps {
  question: QuestionRecord;
  questionNumber: number;
  answer?: string;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export function QuestionRenderer({
  question,
  questionNumber,
  answer,
  onAnswer,
  showResult = false,
  disabled = false,
}: QuestionRendererProps) {
  const typeLabel = QUESTION_TYPE_LABELS[question.type] ?? question.type;
  const typeVariant = QUESTION_TYPE_VARIANTS[question.type] ?? 'default';

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-neutral-100">Q{questionNumber}</span>
        <Badge variant={typeVariant} size="sm">
          {typeLabel}
        </Badge>
        <span className="text-sm text-neutral-500">{question.points} pts</span>
      </div>

      {/* Question Content */}
      {question.type === 'true-false' && (
        <TrueFalseQuestion
          question={question}
          selectedAnswer={answer}
          onSelect={onAnswer}
          showResult={showResult}
          disabled={disabled}
        />
      )}

      {question.type === 'multiple-choice' && (
        <MultipleChoiceQuestion
          question={question}
          selectedAnswer={answer}
          onSelect={onAnswer}
          showResult={showResult}
          disabled={disabled}
        />
      )}

      {question.type === 'short-answer' && (
        <ShortAnswerQuestion
          question={question}
          answer={answer}
          onChange={onAnswer}
          showResult={showResult}
          disabled={disabled}
        />
      )}

      {question.type === 'essay' && (
        <EssayQuestion
          question={question}
          answer={answer}
          onChange={onAnswer}
          showResult={showResult}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export { TrueFalseQuestion } from './TrueFalseQuestion';
export { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
export { ShortAnswerQuestion } from './ShortAnswerQuestion';
export { EssayQuestion } from './EssayQuestion';
