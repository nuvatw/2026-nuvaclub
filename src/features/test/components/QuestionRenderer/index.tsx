'use client';

import type { QuestionRecord } from '@/lib/db/schema';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { EssayQuestion } from './EssayQuestion';
import { Badge } from '@/components/atoms';

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
  const getTypeLabel = () => {
    switch (question.type) {
      case 'true-false':
        return 'True/False';
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'short-answer':
        return 'Short Answer';
      case 'essay':
        return 'Essay';
      default:
        return question.type;
    }
  };

  const getTypeVariant = () => {
    switch (question.type) {
      case 'true-false':
        return 'success';
      case 'multiple-choice':
        return 'primary';
      case 'short-answer':
        return 'warning';
      case 'essay':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-neutral-100">Q{questionNumber}</span>
        <Badge variant={getTypeVariant() as 'default' | 'primary' | 'success' | 'warning' | 'error'} size="sm">
          {getTypeLabel()}
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
