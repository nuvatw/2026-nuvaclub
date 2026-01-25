'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { IdentityType } from '@/features/auth/types';
import type { PlanType } from '../types';

// Explicit mapping from identity type to plan type
// Note: 'solo-traveler' identity maps to 'traveler' plan
// Duo types are separate from the main plan hierarchy
const IDENTITY_TO_PLAN: Record<IdentityType, PlanType | null> = {
  guest: null,
  explorer: 'explorer',
  'solo-traveler': 'traveler',
  voyager: 'voyager',
  'duo-go': 'traveler', // Duo users have traveler-level access
  'duo-run': 'traveler',
  'duo-fly': 'voyager', // Duo Fly has voyager-level access
};

export function usePlanStatus() {
  const { identity } = useAuth();

  const currentPlan = useMemo<PlanType | null>(
    () => IDENTITY_TO_PLAN[identity],
    [identity]
  );

  return {
    identity,
    currentPlan,
    isGuest: identity === 'guest',
    isPlanExplorer: currentPlan === 'explorer',
    isTraveler: currentPlan === 'traveler',
    isVoyager: currentPlan === 'voyager',
    // Enterprise is handled separately via LINE contact, not through identity system
    isEnterprise: false,
  };
}
