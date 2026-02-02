'use client';

import { useState, useEffect, useCallback } from 'react';
import { CAMPAIGN_CONFIG } from '@/content/home-content';

export function useCampaignState() {
  const [raisedAmount, setRaisedAmount] = useState<number>(CAMPAIGN_CONFIG.initialRaised);
  const [backerCount, setBackerCount] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/bff/campaign/stats');
      const data = await response.json();
      if (data.ok) {
        setRaisedAmount(data.totalRaised);
        setBackerCount(data.backerCount);
      }
    } catch (error) {
      console.error('Failed to fetch campaign stats:', error);
    }
  }, []);

  // Poll for stats every 30 seconds to keep it fresh
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Handle local state hydration (still good for immediate feedback)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const addPledge = useCallback((amount: number) => {
    // Optimistic update
    setRaisedAmount((prev) => prev + amount);
    setBackerCount((prev) => prev + 1);
    // Refresh from server after a short delay to get definitive numbers
    setTimeout(fetchStats, 1000);
  }, [fetchStats]);

  const resetCampaign = useCallback(async () => {
    try {
      await fetch('/api/bff/campaign/reset', { method: 'POST' });
      fetchStats();
    } catch (error) {
      console.error('Failed to reset campaign:', error);
    }
  }, [fetchStats]);

  return {
    raisedAmount,
    backerCount,
    goalAmount: CAMPAIGN_CONFIG.goalAmount,
    currency: CAMPAIGN_CONFIG.currency,
    addPledge,
    resetCampaign,
    isHydrated,
  };
}
