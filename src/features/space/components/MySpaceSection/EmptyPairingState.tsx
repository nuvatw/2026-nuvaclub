'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface EmptyPairingStateProps {
  type: 'nunu' | 'vava';
  onAction?: () => void;
}

export function EmptyPairingState({ type, onAction }: EmptyPairingStateProps) {
  const isLookingForNunu = type === 'nunu';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-xl text-center',
        'bg-neutral-900/50 border border-dashed border-neutral-700'
      )}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
        {isLookingForNunu ? (
          <svg
            className="w-8 h-8 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )}
      </div>

      <h4 className="text-lg font-medium text-white mb-2">
        {isLookingForNunu ? 'Not Matched with Nunu Yet' : 'No Vava Recruited Yet'}
      </h4>

      <p className="text-sm text-neutral-400 mb-4 max-w-xs mx-auto">
        {isLookingForNunu
          ? 'Go to the Matching Board to find a suitable Nunu mentor and start your learning journey!'
          : 'Go to the Matching Board to post a recruitment article and find Vavas to mentor!'}
      </p>

      {onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
        >
          {isLookingForNunu ? 'Go Find a Nunu' : 'Post Recruitment Article'}
        </Button>
      )}
    </motion.div>
  );
}
