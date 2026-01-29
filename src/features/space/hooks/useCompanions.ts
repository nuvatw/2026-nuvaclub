'use client';

import { useState, useEffect } from 'react';

// Local types
export interface Companion {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
}

/**
 * Hook to access companion data via BFF
 */
export function useCompanions() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch('/api/bff/space/companions')
      .then(res => res.json())
      .then(data => {
        setCompanions(data);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch companions:', err);
        setIsReady(true);
      });
  }, []);

  const availableCompanions = companions.filter(c => c.isAvailable);

  return {
    companions,
    availableCompanions,
    isReady,
    getCompanionById: (id: string) => companions.find(c => c.id === id) || null,
    getCompanionsByType: (type: string) => companions.filter(c => c.type === type),
    getAvailableByType: (type: string) => availableCompanions.filter(c => c.type === type),
    getVisibleToUser: () => companions, // Simplified - no ticket filtering
  };
}

/**
 * Hook to get a single companion by ID
 */
export function useCompanion(companionId: string): Companion | null {
  const { companions, isReady } = useCompanions();

  if (!isReady) return null;
  return companions.find(c => c.id === companionId) || null;
}
