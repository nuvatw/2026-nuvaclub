'use client';

import { useState, useEffect, useCallback } from 'react';
import { CAMPAIGN_CONFIG } from '@/content/home-content';

export function useCampaignState() {
  const [raisedAmount, setRaisedAmount] = useState<number>(CAMPAIGN_CONFIG.initialRaised);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CAMPAIGN_CONFIG.storageKey);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        setRaisedAmount(parsed);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CAMPAIGN_CONFIG.storageKey, String(raisedAmount));
    }
  }, [raisedAmount, isHydrated]);

  const addPledge = useCallback((amount: number) => {
    setRaisedAmount((prev) => prev + amount);
  }, []);

  const resetCampaign = useCallback(() => {
    setRaisedAmount(CAMPAIGN_CONFIG.initialRaised);
    localStorage.removeItem(CAMPAIGN_CONFIG.storageKey);
  }, []);

  return {
    raisedAmount,
    goalAmount: CAMPAIGN_CONFIG.goalAmount,
    currency: CAMPAIGN_CONFIG.currency,
    addPledge,
    resetCampaign,
    isHydrated,
  };
}
