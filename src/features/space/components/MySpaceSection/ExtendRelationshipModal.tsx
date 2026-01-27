'use client';

import { useState } from 'react';
import { Modal, ModalActions, Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface ExtendRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  nunuName: string;
  currentMonths: string[];
  onSubmit: (extensionMonths: number, message: string) => void;
}

const EXTENSION_OPTIONS = [
  { months: 1, label: '+1 month' },
  { months: 2, label: '+2 months' },
  { months: 3, label: '+3 months' },
];

/**
 * Format months array to readable range
 * e.g., ['2026-02', '2026-03', '2026-04'] -> "Feb – Apr 2026"
 */
function formatMonthRange(months: string[]): string {
  if (!months || months.length === 0) return 'No dates set';

  const sortedMonths = [...months].sort();
  const firstMonth = sortedMonths[0];
  const lastMonth = sortedMonths[sortedMonths.length - 1];

  const formatMonth = (monthStr: string, includeYear: boolean = true) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      ...(includeYear ? { year: 'numeric' } : {}),
    });
  };

  if (sortedMonths.length === 1) {
    return formatMonth(firstMonth);
  }

  const sameYear = firstMonth.split('-')[0] === lastMonth.split('-')[0];
  const startStr = formatMonth(firstMonth, !sameYear);
  const endStr = formatMonth(lastMonth, true);

  return `${startStr} – ${endStr}`;
}

export function ExtendRelationshipModal({
  isOpen,
  onClose,
  nunuName,
  currentMonths,
  onSubmit,
}: ExtendRelationshipModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit(selectedMonths, message);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Close modal after showing success
    setTimeout(() => {
      setShowSuccess(false);
      setMessage('');
      setSelectedMonths(1);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting && !showSuccess) {
      setMessage('');
      setSelectedMonths(1);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Extend Relationship"
      description={`Request more time with ${nunuName}`}
      size="md"
    >
      {showSuccess ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Request Sent!</h3>
          <p className="text-sm text-neutral-400">
            Your extension request has been sent to {nunuName}.
          </p>
        </div>
      ) : (
        <>
          {/* Current relationship info */}
          <div className="mb-6 p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
            <div className="text-sm text-neutral-400 mb-1">Current period</div>
            <div className="text-white font-medium">
              {formatMonthRange(currentMonths)}
            </div>
          </div>

          {/* Extension duration options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Extension duration
            </label>
            <div className="flex gap-2">
              {EXTENSION_OPTIONS.map((option) => (
                <button
                  key={option.months}
                  type="button"
                  onClick={() => setSelectedMonths(option.months)}
                  className={cn(
                    'flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all',
                    selectedMonths === option.months
                      ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional message */}
          <div className="mb-6">
            <label
              htmlFor="extension-message"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Message (optional)
            </label>
            <textarea
              id="extension-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share why you'd like to extend your mentorship..."
              rows={3}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'bg-neutral-800 border border-neutral-700',
                'text-white placeholder-neutral-500',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'resize-none'
              )}
            />
          </div>

          {/* Actions */}
          <ModalActions>
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Send Request
            </Button>
          </ModalActions>
        </>
      )}
    </Modal>
  );
}
