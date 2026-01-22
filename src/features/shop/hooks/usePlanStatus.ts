'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { PlanType, DuoType } from '../types';

export function usePlanStatus() {
  const { identity } = useAuth();

  // Current Plan
  const currentPlan = useMemo<PlanType | null>(() => {
    if (identity === 'guest') return null;
    if (identity === 'explorer') return 'explorer';
    return 'traveler';
  }, [identity]);

  // Current Duo
  const currentDuo = useMemo<DuoType>(() => {
    if (identity === 'duo-go') return 'go';
    if (identity === 'duo-run') return 'run';
    if (identity === 'duo-fly') return 'fly';
    return 'solo';
  }, [identity]);

  return {
    identity,
    currentPlan,
    currentDuo,
    isGuest: identity === 'guest',
    isPlanExplorer: currentPlan === 'explorer',
    isTraveler: currentPlan === 'traveler',
    isSolo: currentDuo === 'solo',
    hasDuoAccess: currentDuo !== 'solo',
  };
}
