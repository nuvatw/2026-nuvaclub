'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthProvider';
import { IDENTITY_LABELS, IDENTITY_COLORS, type IdentityType } from '@/features/auth/types';
import { cn } from '@/lib/utils';

const IDENTITIES: IdentityType[] = [
  'guest',
  'explorer',
  'solo-traveler',
];

export function IdentitySwitcher() {
  const { identity, setIdentity, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-2 p-2 bg-neutral-800 rounded-lg border border-neutral-700 shadow-xl min-w-[200px]"
          >
            <div className="text-xs text-neutral-400 px-2 py-1 mb-1">
              Switch Identity
            </div>
            {IDENTITIES.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setIdentity(id);
                  setIsOpen(false);
                }}
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-2 rounded text-sm text-left transition-colors',
                  identity === id
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-300 hover:bg-neutral-700/50'
                )}
              >
                <span
                  className={cn('w-2 h-2 rounded-full', IDENTITY_COLORS[id])}
                />
                {IDENTITY_LABELS[id]}
                {identity === id && (
                  <span className="ml-auto text-xs text-primary-400">Active</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
          'bg-neutral-900 border-neutral-700 hover:border-neutral-600',
          'text-sm font-medium shadow-lg'
        )}
      >
        <span className={cn('w-2 h-2 rounded-full', IDENTITY_COLORS[identity])} />
        <span className="text-neutral-200">{IDENTITY_LABELS[identity]}</span>
        <svg
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
}
