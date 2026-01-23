'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { PlanType } from '../types';

export function usePlanStatus() {
  const { identity } = useAuth();

  // Current Plan
  const currentPlan = useMemo<PlanType | null>(() => {
    if (identity === 'guest') return null;
    if (identity === 'explorer') return 'explorer';
    return 'traveler';
  }, [identity]);

  return {
    identity,
    currentPlan,
    isGuest: identity === 'guest',
    isPlanExplorer: currentPlan === 'explorer',
    isTraveler: currentPlan === 'traveler',
  };
}
