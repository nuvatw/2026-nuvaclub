'use client';

import { Modal, Button } from '@/components/atoms';

interface TestSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  remainingTime: string;
}

export function TestSubmitModal({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
  remainingTime,
}: TestSubmitModalProps) {
  const unansweredCount = totalQuestions - answeredCount;
  const hasUnanswered = unansweredCount > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Submission" size="sm">
      <div className="space-y-4">
        <div className="text-center">
          {hasUnanswered ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-neutral-100 mb-2">
                {unansweredCount} questions unanswered
              </p>
              <p className="text-neutral-400 text-sm">
                Are you sure you want to submit now? Unanswered questions will not be scored.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-neutral-100 mb-2">
                All questions completed
              </p>
              <p className="text-neutral-400 text-sm">
                Are you sure you want to submit? Answers cannot be changed after submission.
              </p>
            </>
          )}
        </div>

        <div className="bg-neutral-800 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between text-neutral-400">
            <span>Answered</span>
            <span className="text-neutral-200">{answeredCount} / {totalQuestions} questions</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Time Remaining</span>
            <span className="text-neutral-200">{remainingTime}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Continue
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={onConfirm}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
