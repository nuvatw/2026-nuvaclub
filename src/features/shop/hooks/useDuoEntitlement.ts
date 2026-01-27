'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DuoVariant, NunuTier } from '@/features/shop/types';
import { getMatchAccessForVariant } from '@/Database';

const DUO_ENTITLEMENT_KEY = 'nuvaclub_duo_entitlement';

export interface DuoEntitlement {
  variant: DuoVariant;
  purchasedAt: string; // ISO date string
  matchAccess: NunuTier[];
}

interface DuoEntitlementState {
  entitlement: DuoEntitlement | null;
  isLoading: boolean;
}

/**
 * Hook for managing Duo ticket entitlements
 * Stored in localStorage for persistence across sessions
 */
export function useDuoEntitlement() {
  const [state, setState] = useState<DuoEntitlementState>({
    entitlement: null,
    isLoading: true,
  });

  // Load entitlement from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DUO_ENTITLEMENT_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as DuoEntitlement;
          setState({ entitlement: parsed, isLoading: false });
        } catch {
          localStorage.removeItem(DUO_ENTITLEMENT_KEY);
          setState({ entitlement: null, isLoading: false });
        }
      } else {
        setState({ entitlement: null, isLoading: false });
      }
    }
  }, []);

  /**
   * Grant a Duo ticket entitlement (simulates purchase)
   */
  const grantEntitlement = useCallback((variant: DuoVariant) => {
    const matchAccess = getMatchAccessForVariant(variant);
    const entitlement: DuoEntitlement = {
      variant,
      purchasedAt: new Date().toISOString(),
      matchAccess,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(DUO_ENTITLEMENT_KEY, JSON.stringify(entitlement));
    }

    setState({ entitlement, isLoading: false });
  }, []);

  /**
   * Upgrade to a higher tier (keeps the better one)
   */
  const upgradeEntitlement = useCallback((newVariant: DuoVariant) => {
    const tierOrder: DuoVariant[] = ['go', 'run', 'fly'];
    const currentIndex = state.entitlement
      ? tierOrder.indexOf(state.entitlement.variant)
      : -1;
    const newIndex = tierOrder.indexOf(newVariant);

    // Only upgrade if new tier is higher
    if (newIndex > currentIndex) {
      grantEntitlement(newVariant);
    }
  }, [state.entitlement, grantEntitlement]);

  /**
   * Revoke the current entitlement
   */
  const revokeEntitlement = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DUO_ENTITLEMENT_KEY);
    }
    setState({ entitlement: null, isLoading: false });
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

/**
 * Helper to check entitlement without React hook (for server/non-component use)
 */
export function getDuoEntitlementFromStorage(): DuoEntitlement | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(DUO_ENTITLEMENT_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as DuoEntitlement;
  } catch {
    return null;
  }
}
