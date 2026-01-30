'use client';

import { useDomainSpace } from '@/lib/hooks/domain/useDomainSpace';
import { MatchInvitation } from '../types'; // Keeping types for compatibility

/**
 * @deprecated useInvitations was based on LocalStorage. Use useDomainSpace for API interactions.
 * This file is kept as a wrapper/shim during migration but implementation is stubbed or redirected.
 */
export function useInvitations() {
  const { requestRelationship, acceptRelationship, loading } = useDomainSpace();

  // Mapping old API to new Domain API where possible
  const sendInvitation = async (invitation: any) => {
    await requestRelationship({
      targetUserId: invitation.toUserId,
      type: invitation.type,
      message: invitation.message
    });
  };

  const updateInvitationStatus = async (id: string, status: string) => {
    if (status === 'accepted') {
      await acceptRelationship(id);
    }
  };

  return {
    invitations: [] as MatchInvitation[],
    isHydrated: true,
    getInvitationsForUser: (): MatchInvitation[] => [],
    getInvitationsSentByUser: (): MatchInvitation[] => [],
    getPendingCount: (): number => 0,
    sendInvitation,
    updateInvitationStatus,
    getInvitationById: (id: string): MatchInvitation | undefined => undefined,
    loading
  };
}
