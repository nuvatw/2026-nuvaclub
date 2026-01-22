'use client';

import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { NunuApplicationStatus } from '@/features/space/types';
import {
  NUNU_APPLICATION_STATUS_LABELS,
  NUNU_APPLICATION_STATUS_COLORS,
} from '@/features/space/types';

interface NunuApplicationCardProps {
  status: NunuApplicationStatus | null;
  submittedAt?: Date;
  rejectionReason?: string;
  onApply?: () => void;
  onReapply?: () => void;
}

export function NunuApplicationCard({
  status,
  submittedAt,
  rejectionReason,
  onApply,
  onReapply,
}: NunuApplicationCardProps) {
  // Not applied yet
  if (!status) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'p-6 rounded-xl',
          'bg-gradient-to-br from-green-900/20 to-neutral-900',
          'border border-green-800/30'
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-2">Become a Nunu</h4>
            <p className="text-sm text-neutral-400 mb-4">
              Do you want to help others learn AI? Apply to become a Nunu and start mentoring learners!
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300">
                Share knowledge
              </span>
              <span className="px-2 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300">
                Build community
              </span>
              <span className="px-2 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-300">
                Level up
              </span>
            </div>

            <Button onClick={onApply}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Apply Now
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Pending application
  if (status === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'p-6 rounded-xl',
          'bg-neutral-900 border border-neutral-800'
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-600/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-yellow-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-white">Application Under Review</h4>
              <Badge className={NUNU_APPLICATION_STATUS_COLORS[status]} size="sm">
                {NUNU_APPLICATION_STATUS_LABELS[status]}
              </Badge>
            </div>
            <p className="text-sm text-neutral-400 mb-2">
              Your Nunu application has been submitted and is currently being reviewed. We will notify you once a decision is made.
            </p>
            {submittedAt && (
              <p className="text-xs text-neutral-500">
                Submitted: {new Date(submittedAt).toLocaleDateString('en-US')}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Rejected application
  if (status === 'rejected') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'p-6 rounded-xl',
          'bg-neutral-900 border border-red-900/30'
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-white">Application Not Approved</h4>
              <Badge className={NUNU_APPLICATION_STATUS_COLORS[status]} size="sm">
                {NUNU_APPLICATION_STATUS_LABELS[status]}
              </Badge>
            </div>

            {rejectionReason && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-900/30 mb-4">
                <p className="text-sm text-red-300">{rejectionReason}</p>
              </div>
            )}

            <p className="text-sm text-neutral-400 mb-4">
              Don&apos;t worry! You can reapply after improving your application based on the feedback provided.
            </p>

            <Button variant="outline" onClick={onReapply}>
              Reapply
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
