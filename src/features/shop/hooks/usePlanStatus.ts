'use client';

import { useDomainMembership } from '@/lib/hooks/domain/useDomainMembership';
// We should eventually remove dependency on useAuth if identity comes from domain
// But for now, user might still be needed for other things, or we use membership.userId
import { useAuth } from '@/features/auth/components/AuthProvider';

export function usePlanStatus() {
  const { membership, loading } = useDomainMembership();
  const { identity } = useAuth(); // Keep for backward compat if purely UI needs it

  // If loading, we might want to return a safe default or loading state
  // Here we default to falsy/safe values to prevent flashing access

  const tier = membership?.tier;

  return {
    identity, // Preserved for compatibility
    currentPlan: tier === 'free' ? null : tier, // Mapping 'free' to null to match old expectation if needed, or update consumers
    isGuest: !membership || membership.status === 'none',
    isPlanExplorer: tier === 'explorer',
    isTraveler: tier === 'traveler',
    isVoyager: tier === 'pro', // Assuming 'pro' maps to voyager in new domain, or update MembershipTier
    // Enterprise is handled separately
    isEnterprise: false,
    loading
  };
}
