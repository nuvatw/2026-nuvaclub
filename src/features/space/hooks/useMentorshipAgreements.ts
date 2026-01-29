'use client';

import { useState, useEffect, useMemo } from 'react';

// Local types
export interface MentorshipAgreement {
  id: string;
  mentorshipId: string;
  nunuId: string;
  vavaId: string;
  postId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  agreedMonths: string[];
  agreedPrice?: number; // Price per month
}

export interface MentorshipAgreementWithRelations extends MentorshipAgreement {
  post?: { id: string; title: string; type: string };
  nunu?: { id: string; name: string; avatar?: string };
  vava?: { id: string; name: string; avatar?: string };
}

export interface AgreementFilters {
  nunuId?: string;
  vavaId?: string;
  status?: string;
  paymentStatus?: string;
}

/**
 * Hook to access mentorship agreements via BFF
 */
export function useMentorshipAgreements(filters?: AgreementFilters) {
  const [agreements, setAgreements] = useState<MentorshipAgreementWithRelations[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Build query params
    const params = new URLSearchParams();
    if (filters?.nunuId) params.append('nunuId', filters.nunuId);
    if (filters?.vavaId) params.append('vavaId', filters.vavaId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

    fetch(`/api/bff/space/agreements?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setAgreements(Array.isArray(data) ? data : []);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch agreements:', err);
        setIsReady(true);
      });
  }, [filters?.nunuId, filters?.vavaId, filters?.status, filters?.paymentStatus]);

  const totals = useMemo(() => {
    const paid = agreements.filter(a => a.paymentStatus === 'paid');
    const totalAmount = paid.reduce((sum, a) => sum + a.totalAmount, 0);
    const totalMonths = paid.reduce((sum, a) => sum + a.agreedMonths.length, 0);

    return {
      totalAmount,
      totalMonths,
      agreementCount: agreements.length,
      paidCount: paid.length,
    };
  }, [agreements]);

  return {
    agreements,
    totals,
    isReady,
    getAgreementById: (id: string) => agreements.find(a => a.id === id) ?? null,
  };
}

/**
 * Hook to get user's earnings (as Nunu)
 */
export function useNunuEarnings(userId?: string) {
  const { agreements, isReady } = useMentorshipAgreements({ nunuId: userId });

  return useMemo(() => {
    if (!isReady) {
      return {
        totalEarnings: 0,
        totalMonths: 0,
        activeAgreements: 0,
        completedAgreements: 0,
        pendingPayments: 0,
      };
    }

    const paidAgreements = agreements.filter(a => a.paymentStatus === 'paid');
    const totalEarnings = paidAgreements.reduce((sum, a) => sum + a.totalAmount, 0);
    const totalMonths = paidAgreements.reduce((sum, a) => sum + a.agreedMonths.length, 0);
    const activeAgreements = agreements.filter(a => a.status === 'active' || a.status === 'accepted').length;
    const completedAgreements = agreements.filter(a => a.status === 'completed').length;
    const pendingPayments = agreements
      .filter(a => a.paymentStatus === 'unpaid')
      .reduce((sum, a) => sum + a.totalAmount, 0);

    return {
      totalEarnings,
      totalMonths,
      activeAgreements,
      completedAgreements,
      pendingPayments,
    };
  }, [agreements, isReady]);
}

/**
 * Hook to get user's spending (as Vava)
 */
export function useVavaSpending(userId?: string) {
  const { agreements, isReady } = useMentorshipAgreements({ vavaId: userId });

  return useMemo(() => {
    if (!isReady) {
      return {
        totalSpent: 0,
        totalMonths: 0,
        activeAgreements: 0,
        completedAgreements: 0,
      };
    }

    const paidAgreements = agreements.filter(a => a.paymentStatus === 'paid');
    const totalSpent = paidAgreements.reduce((sum, a) => sum + a.totalAmount, 0);
    const totalMonths = paidAgreements.reduce((sum, a) => sum + a.agreedMonths.length, 0);
    const activeAgreements = agreements.filter(a => a.status === 'active' || a.status === 'accepted').length;
    const completedAgreements = agreements.filter(a => a.status === 'completed').length;

    return {
      totalSpent,
      totalMonths,
      activeAgreements,
      completedAgreements,
    };
  }, [agreements, isReady]);
}
