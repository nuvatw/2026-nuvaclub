'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DuoVariant, NunuTier, DuoEntitlement } from '@/features/shop/types';

interface DuoEntitlementState {
  entitlement: DuoEntitlement | null;
  isLoading: boolean;
}

/**
 * Hook for managing Duo ticket entitlements
 * Refactored to fetch from BFF API instead of localStorage
 */
export function useDuoEntitlement() {
  const [state, setState] = useState<DuoEntitlementState>({
    entitlement: null,
    isLoading: true,
  });

  const fetchEntitlement = useCallback(async () => {
    try {
      const res = await fetch('/api/bff/shop/entitlement');
      if (res.ok) {
        const data = await res.json();
        setState({ entitlement: data, isLoading: false });
      } else {
        setState({ entitlement: null, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to fetch entitlement', e);
      setState({ entitlement: null, isLoading: false });
    }
  }, []);

  // Load entitlement from API on mount
  useEffect(() => {
    fetchEntitlement();
  }, [fetchEntitlement]);

  /**
   * Grant a Duo ticket entitlement (via BFF)
   */
  const grantEntitlement = useCallback(async (variant: DuoVariant) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/bff/shop/entitlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant })
      });

      if (res.ok) {
        const data = await res.json();
        setState({ entitlement: data, isLoading: false });
      } else {
        console.error('Failed to grant entitlement');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (e) {
      console.error('Error granting entitlement', e);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Upgrade to a higher tier (keeps the better one)
   */
  const upgradeEntitlement = useCallback(async (newVariant: DuoVariant) => {
    // Rely on server-side logic to handle upgrades, or check client-side first
    // For now, simple client-side check to mimic previous behavior
    const tierOrder: DuoVariant[] = ['go', 'run', 'fly'];
    const currentIndex = state.entitlement
      ? tierOrder.indexOf(state.entitlement.variant)
      : -1;
    const newIndex = tierOrder.indexOf(newVariant);

    if (newIndex > currentIndex) {
      await grantEntitlement(newVariant);
    }
  }, [state.entitlement, grantEntitlement]);

  /**
   * Revoke the current entitlement
   */
  const revokeEntitlement = useCallback(async () => {
    try {
      await fetch('/api/bff/shop/entitlement', { method: 'DELETE' });
      setState({ entitlement: null, isLoading: false });
    } catch (e) {
      console.error('Failed to revoke entitlement', e);
    }
  }, []);

  /**
   * Check if user has any Duo ticket
   */
  const hasDuoTicket = useMemo(() => {
    return state.entitlement !== null;
  }, [state.entitlement]);

  /**
   * Check if user can access a specific Nunu tier
   */
  const canAccessTier = useCallback((tier: NunuTier): boolean => {
    if (!state.entitlement) return false;
    return state.entitlement.matchAccess.includes(tier);
  }, [state.entitlement]);

  /**
   * Get the list of accessible Nunu tiers
   */
  const accessibleTiers = useMemo((): NunuTier[] => {
    return state.entitlement?.matchAccess ?? [];
  }, [state.entitlement]);

  /**
   * Get the current Duo variant
   */
  const currentVariant = useMemo((): DuoVariant | null => {
    return state.entitlement?.variant ?? null;
  }, [state.entitlement]);

  return {
    entitlement: state.entitlement,
    isLoading: state.isLoading,
    hasDuoTicket,
    currentVariant,
    accessibleTiers,
    canAccessTier,
    grantEntitlement,
    upgradeEntitlement,
    revokeEntitlement,
  };
}
