'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import type {
  MentorshipAgreementRecord,
  MentorshipAgreementStatus,
  PaymentStatus,
} from '@/infra/mock/schema';

export interface MentorshipAgreementWithRelations extends MentorshipAgreementRecord {
  post?: {
    id: string;
    title: string;
    type: string;
  };
  nunu?: {
    id: string;
    name: string;
    avatar?: string;
  };
  vava?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface AgreementFilters {
  nunuId?: string;
  vavaId?: string;
  status?: MentorshipAgreementStatus;
  paymentStatus?: PaymentStatus;
}

/**
 * Hook to access mentorship agreements with relations
 */
export function useMentorshipAgreements(filters?: AgreementFilters) {
  const db = useDB();

  // Get all agreements with relations
  const agreements = useMemo((): MentorshipAgreementWithRelations[] => {
    if (!db) return [];

    let records = db.mentorshipAgreements.findAll();

    // Apply filters
    if (filters?.nunuId) {
      records = records.filter((a) => a.nunuId === filters.nunuId);
    }
    if (filters?.vavaId) {
      records = records.filter((a) => a.vavaId === filters.vavaId);
    }
    if (filters?.status) {
      records = records.filter((a) => a.status === filters.status);
    }
    if (filters?.paymentStatus) {
      records = records.filter((a) => a.paymentStatus === filters.paymentStatus);
    }

    // Collect unique IDs for batch lookup
    const nunuIds = new Set(records.map((a) => a.nunuId));
    const vavaIds = new Set(records.map((a) => a.vavaId));
    const postIds = new Set(records.map((a) => a.postId));

    // Pre-fetch users
    const usersMap = new Map<string, { id: string; name: string; avatar?: string }>();
    for (const id of [...nunuIds, ...vavaIds]) {
      const user = db.users.findById(id);
      if (user) {
        usersMap.set(id, { id: user.id, name: user.name, avatar: user.avatar });
      }
    }

    // Pre-fetch posts
    const postsMap = new Map<string, { id: string; title: string; type: string }>();
    for (const id of postIds) {
      const post = db.matchingPosts.findById(id);
      if (post) {
        postsMap.set(id, { id: post.id, title: post.title, type: post.type });
      }
    }

    // Build agreements with relations
    return records.map((agreement) => ({
      ...agreement,
      post: postsMap.get(agreement.postId),
      nunu: usersMap.get(agreement.nunuId),
      vava: usersMap.get(agreement.vavaId),
    }));
  }, [db, filters?.nunuId, filters?.vavaId, filters?.status, filters?.paymentStatus]);

  // Calculate totals
  const totals = useMemo(() => {
    const paid = agreements.filter((a) => a.paymentStatus === 'paid');
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
    isReady: !!db,
    getAgreementById: (id: string) => agreements.find((a) => a.id === id) ?? null,
  };
}

/**
 * Hook to get user's earnings (as Nunu)
 */
export function useNunuEarnings(userId?: string) {
  const db = useDB();

  return useMemo(() => {
    if (!db || !userId) {
      return {
        totalEarnings: 0,
        totalMonths: 0,
        activeAgreements: 0,
        completedAgreements: 0,
        pendingPayments: 0,
      };
    }

    const agreements = db.mentorshipAgreements.findMany({ where: { nunuId: userId } });

    const paidAgreements = agreements.filter((a) => a.paymentStatus === 'paid');
    const totalEarnings = paidAgreements.reduce((sum, a) => sum + a.totalAmount, 0);
    const totalMonths = paidAgreements.reduce((sum, a) => sum + a.agreedMonths.length, 0);
    const activeAgreements = agreements.filter((a) => a.status === 'active' || a.status === 'accepted').length;
    const completedAgreements = agreements.filter((a) => a.status === 'completed').length;
    const pendingPayments = agreements
      .filter((a) => a.paymentStatus === 'unpaid')
      .reduce((sum, a) => sum + a.totalAmount, 0);

    return {
      totalEarnings,
      totalMonths,
      activeAgreements,
      completedAgreements,
      pendingPayments,
    };
  }, [db, userId]);
}

/**
 * Hook to get user's spending (as Vava)
 */
export function useVavaSpending(userId?: string) {
  const db = useDB();

  return useMemo(() => {
    if (!db || !userId) {
      return {
        totalSpent: 0,
        totalMonths: 0,
        activeAgreements: 0,
        completedAgreements: 0,
      };
    }

    const agreements = db.mentorshipAgreements.findMany({ where: { vavaId: userId } });

    const paidAgreements = agreements.filter((a) => a.paymentStatus === 'paid');
    const totalSpent = paidAgreements.reduce((sum, a) => sum + a.totalAmount, 0);
    const totalMonths = paidAgreements.reduce((sum, a) => sum + a.agreedMonths.length, 0);
    const activeAgreements = agreements.filter((a) => a.status === 'active' || a.status === 'accepted').length;
    const completedAgreements = agreements.filter((a) => a.status === 'completed').length;

    return {
      totalSpent,
      totalMonths,
      activeAgreements,
      completedAgreements,
    };
  }, [db, userId]);
}
