'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import { CompanionRepository, type CompanionWithRelations } from '@/infra/mock/repositories';
import type { CompanionType } from '@/infra/mock/schema';

/**
 * Hook to access companion data from the database
 */
export function useCompanions() {
  const db = useDB();

  const repo = useMemo(() => {
    if (!db) return null;
    return new CompanionRepository(db);
  }, [db]);

  const companions = useMemo(() => {
    if (!repo) return [];
    return repo.findAllWithRelations();
  }, [repo]);

  const availableCompanions = useMemo(() => {
    if (!repo) return [];
    return repo.findAvailable();
  }, [repo]);

  return {
    companions,
    availableCompanions,
    isReady: !!db,
    getCompanionById: (id: string) => repo?.findByIdWithRelations(id),
    getCompanionsByType: (type: CompanionType) => repo?.findByType(type) ?? [],
    getAvailableByType: (type: CompanionType) => repo?.findAvailableByType(type) ?? [],
    getVisibleToUser: (ticketType: 'go' | 'run' | 'fly' | null) =>
      repo?.findVisibleToUser(ticketType) ?? [],
  };
}

/**
 * Hook to get a single companion by ID
 */
export function useCompanion(companionId: string): CompanionWithRelations | null {
  const db = useDB();

  return useMemo(() => {
    if (!db) return null;
    const repo = new CompanionRepository(db);
    return repo.findByIdWithRelations(companionId) ?? null;
  }, [db, companionId]);
}
