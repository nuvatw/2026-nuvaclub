'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useDuoMonthPasses } from '@/features/duo/hooks/useDuoMonthPasses';
import { useMentorships } from '../hooks';
import { getCurrentMonth } from '@/features/duo/utils/month-utils';
import type { DuoTier } from '@/features/duo/types';

// Color configuration for each tier
const TIER_COLORS: Record<DuoTier, { bg: string; border: string; text: string; glow: string }> = {
  go: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  run: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  fly: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    glow: 'shadow-red-500/20',
  },
};

const NO_PASS_COLORS = {
  bg: 'bg-neutral-700/50',
  border: 'border-neutral-600/50',
  text: 'text-neutral-400',
  glow: '',
};

interface DuoStatusBarProps {
  onFindNunu?: () => void;
}

export function DuoStatusBar({ onFindNunu }: DuoStatusBarProps) {
  const { user } = useAuth();
  const { getPassForMonth, passesWithMeta } = useDuoMonthPasses();
  const { hasNunu, myNunu } = useMentorships(user?.id);

  const currentMonth = getCurrentMonth();
  const currentPass = getPassForMonth(currentMonth);

  // Get the current tier colors
  const colors = currentPass ? TIER_COLORS[currentPass.tier] : NO_PASS_COLORS;

  // Get tier display name
  const tierDisplayName = useMemo(() => {
    if (!currentPass) return null;
    switch (currentPass.tier) {
      case 'go': return 'Duo Go';
      case 'run': return 'Duo Run';
      case 'fly': return 'Duo Fly';
      default: return null;
    }
  }, [currentPass]);

  const handleFindNunu = () => {
    onFindNunu?.();
    const boardSection = document.getElementById('matching-board');
    boardSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border p-4 mb-6',
        colors.bg,
        colors.border,
        currentPass && 'shadow-lg',
        currentPass && colors.glow
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side - Duo Pass Status */}
        <div className="flex items-center gap-4">
          {/* Tier Badge */}
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg',
              currentPass ? colors.bg : 'bg-neutral-700',
              currentPass ? colors.text : 'text-neutral-500',
              'border-2',
              currentPass ? colors.border : 'border-neutral-600'
            )}
          >
            {currentPass ? (
              currentPass.tier === 'go' ? 'Go' : currentPass.tier === 'run' ? 'Run' : 'Fly'
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>

          {/* Status Text */}
          <div>
            <h3 className={cn('font-semibold', currentPass ? colors.text : 'text-neutral-400')}>
              {tierDisplayName || 'No Active Pass'}
            </h3>
            <p className="text-sm text-neutral-400">
              {currentPass ? (
                <>
                  {currentMonth.replace('-', '/')} &middot; {currentPass.currentCompanions}/{currentPass.maxCompanions >= 999 ? '∞' : currentPass.maxCompanions} slots used
                </>
              ) : (
                'Purchase a Duo pass to enter Space'
              )}
            </p>
          </div>
        </div>

        {/* Right side - Nunu Booking Status */}
        <div className="flex items-center gap-3">
          {currentPass ? (
            hasNunu && myNunu ? (
              // Has a Nunu booked
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-green-500/30">
                  {myNunu.avatar ? (
                    <img src={myNunu.avatar} alt={myNunu.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                      {myNunu.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Your Nunu</p>
                  <p className="text-sm font-medium text-green-400">{myNunu.name}</p>
                </div>
                <svg className="w-5 h-5 text-green-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              // No Nunu booked - show find button
              <button
                onClick={handleFindNunu}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium">Find a Nunu</span>
              </button>
            )
          ) : (
            // No pass - link to shop
            <Link
              href="/shop?category=duo"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Get Duo Pass
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
