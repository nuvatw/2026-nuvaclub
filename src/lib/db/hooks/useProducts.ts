'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import { ProductRepository, type ProductWithDetails } from '../repositories';
import type { ProductType } from '../schema';

/**
 * Hook to access product data from the database
 */
export function useProducts() {
  const db = useDB();

  const repo = useMemo(() => {
    if (!db) return null;
    return new ProductRepository(db);
  }, [db]);

  const products = useMemo(() => {
    if (!repo) return [];
    return repo.findAllWithDetails();
  }, [repo]);

  const plans = useMemo(() => {
    if (!repo) return [];
    return repo.findPlans();
  }, [repo]);

  const duoTickets = useMemo(() => {
    if (!repo) return [];
    return repo.findDuoTickets();
  }, [repo]);

  const events = useMemo(() => {
    if (!repo) return [];
    return repo.findEvents();
  }, [repo]);

  const upcomingEvents = useMemo(() => {
    if (!repo) return [];
    return repo.findUpcomingEvents();
  }, [repo]);

  const merchandise = useMemo(() => {
    if (!repo) return [];
    return repo.findMerchandise();
  }, [repo]);

  return {
    products,
    plans,
    duoTickets,
    events,
    upcomingEvents,
    merchandise,
    isReady: !!db,
    getProductById: (id: string) => repo?.findByIdWithDetails(id),
    getProductsByType: (type: ProductType) => repo?.findByType(type) ?? [],
    searchProducts: (query: string) => repo?.search(query) ?? [],
    getPlanByType: (planType: 'explorer' | 'traveler') => repo?.findPlanByType(planType),
    getDuoTicketByType: (ticketType: 'go' | 'run' | 'fly') =>
      repo?.findDuoTicketByType(ticketType),
  };
}

/**
 * Hook to get a single product by ID
 */
export function useProduct(productId: string): ProductWithDetails | null {
  const db = useDB();

  return useMemo(() => {
    if (!db) return null;
    const repo = new ProductRepository(db);
    return repo.findByIdWithDetails(productId) ?? null;
  }, [db, productId]);
}
