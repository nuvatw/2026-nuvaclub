'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { MatchInvitation, InvitationStatus } from '../types';

const INVITATIONS_STORAGE_KEY = 'nuvaclub_match_invitations';

interface UseInvitationsReturn {
  invitations: MatchInvitation[];
  isHydrated: boolean;
  getInvitationsForUser: (userId: string) => MatchInvitation[];
  getInvitationsSentByUser: (userId: string) => MatchInvitation[];
  getPendingCount: (userId: string) => number;
  sendInvitation: (invitation: Omit<MatchInvitation, 'id' | 'status' | 'createdAt'>) => void;
  updateInvitationStatus: (invitationId: string, status: InvitationStatus) => void;
  getInvitationById: (id: string) => MatchInvitation | undefined;
}

export function useInvitations(): UseInvitationsReturn {
  const [invitations, setInvitations, isHydrated] = useLocalStorage<MatchInvitation[]>(
    INVITATIONS_STORAGE_KEY,
    []
  );

  const getInvitationsForUser = useCallback(
    (userId: string): MatchInvitation[] => {
      return invitations.filter((inv) => inv.toUserId === userId);
    },
    [invitations]
  );

  const getInvitationsSentByUser = useCallback(
    (userId: string): MatchInvitation[] => {
      return invitations.filter((inv) => inv.fromUserId === userId);
    },
    [invitations]
  );

  const getPendingCount = useCallback(
    (userId: string): number => {
      return invitations.filter(
        (inv) => inv.toUserId === userId && inv.status === 'pending'
      ).length;
    },
    [invitations]
  );

  const sendInvitation = useCallback(
    (invitation: Omit<MatchInvitation, 'id' | 'status' | 'createdAt'>) => {
      const newInvitation: MatchInvitation = {
        ...invitation,
        id: `invitation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date(),
      };

      setInvitations((prev) => [newInvitation, ...prev]);
    },
    [setInvitations]
  );

  const updateInvitationStatus = useCallback(
    (invitationId: string, status: InvitationStatus) => {
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId
            ? { ...inv, status, respondedAt: new Date() }
            : inv
        )
      );
    },
    [setInvitations]
  );

  const getInvitationById = useCallback(
    (id: string): MatchInvitation | undefined => {
      return invitations.find((inv) => inv.id === id);
    },
    [invitations]
  );

  return {
    invitations,
    isHydrated,
    getInvitationsForUser,
    getInvitationsSentByUser,
    getPendingCount,
    sendInvitation,
    updateInvitationStatus,
    getInvitationById,
  };
}
