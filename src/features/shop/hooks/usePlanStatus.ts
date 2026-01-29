'use client';

import { useBffMembership } from '@/lib/hooks/domain/useBffMembership';
// We should eventually remove dependency on useAuth if identity comes from domain
import { useAuth } from '@/features/auth/components/AuthProvider';

export function usePlanStatus() {
  const { summary, loading } = useBffMembership();
  const { identity } = useAuth(); // Keep for backward compat if purely UI logic needs identity string

  // UI Rule: Render only from DTO. Never recompute gates.
  // We map DTO level back to internal UI flags if needed for legacy components,
  // but ideally components should just use specific gate flags.

  return {
    identity,
    currentPlan: summary?.level === 'BASIC' ? null : summary?.level.toLowerCase(),
    isGuest: !summary || summary.level === 'BASIC',

    // New: Direct DTO properties
    level: summary?.level,
    gates: summary?.gates,
    nextAction: summary?.nextAction,

    // Legacy flags (computed from DTO, not domain rules)
    isPlanExplorer: summary?.level === 'EXPLORER',
    isTraveler: summary?.level === 'TRAVELER',
    isVoyager: summary?.level === 'PRO',
    isEnterprise: false,

    loading
  };
}
