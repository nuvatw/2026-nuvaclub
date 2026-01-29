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
    invitations: [], // TODO: Need GET endpoint for list
    isHydrated: true,
    getInvitationsForUser: () => [],
    getInvitationsSentByUser: () => [],
    getPendingCount: () => 0,
    sendInvitation,
    updateInvitationStatus,
    getInvitationById: () => undefined,
    loading
  };
}
