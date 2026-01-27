'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, Modal } from '@/components/atoms';
import { useInvitations } from '../../hooks/useInvitations';
import { cn } from '@/lib/utils';
import type { MatchInvitation } from '../../types';

interface NotificationItemProps {
  invitation: MatchInvitation;
  onClose?: () => void;
}

export function NotificationItem({ invitation, onClose }: NotificationItemProps) {
  const { updateInvitationStatus } = useInvitations();
  const [showDetails, setShowDetails] = useState(false);

  const isPending = invitation.status === 'pending';
  const isAccepted = invitation.status === 'accepted';
  const isDeclined = invitation.status === 'declined';

  const handleAccept = () => {
    updateInvitationStatus(invitation.id, 'accepted');
  };

  const handleDecline = () => {
    updateInvitationStatus(invitation.id, 'declined');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const dateObj = new Date(date);
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return dateObj.toLocaleDateString();
  };

  return (
    <>
      <div
        className={cn(
          'px-4 py-3 transition-colors',
          isPending && 'bg-neutral-800/30',
          !isPending && 'opacity-75'
        )}
      >
        {/* Header Row */}
        <div className="flex items-start gap-3 mb-2">
          <Image
            src={invitation.fromUserAvatar || 'https://api.dicebear.com/9.x/avataaars/png?seed=default'}
            alt={invitation.fromUserName}
            width={36}
            height={36}
            className="rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">
              <span className="font-medium">{invitation.fromUserName}</span>
              <span className="text-neutral-400"> sent you a request</span>
            </p>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {invitation.listingTitle}
            </p>
          </div>
          <span className="text-xs text-neutral-500 flex-shrink-0">
            {formatTimeAgo(invitation.createdAt)}
          </span>
        </div>

        {/* Status Badge or Actions */}
        {!isPending ? (
          <div className="flex items-center gap-2 ml-11">
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                isAccepted && 'bg-green-600/20 text-green-400',
                isDeclined && 'bg-red-600/20 text-red-400'
              )}
            >
              {isAccepted ? 'Accepted' : 'Declined'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-11">
            <Button
              size="sm"
              variant="secondary"
              className="text-xs px-3 py-1"
              onClick={() => setShowDetails(true)}
            >
              More Info
            </Button>
            <Button
              size="sm"
              className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700"
              onClick={handleAccept}
            >
              Accept
            </Button>
          </div>
        )}
      </div>

      {/* More Info Modal */}
      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Request Details">
        <div className="space-y-4">
          {/* From */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50">
            <Image
              src={invitation.fromUserAvatar || 'https://api.dicebear.com/9.x/avataaars/png?seed=default'}
              alt={invitation.fromUserName}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-medium text-white">{invitation.fromUserName}</p>
              <p className="text-sm text-neutral-400">
                {invitation.listingType === 'nunu-looking-for-vava'
                  ? 'Wants to connect as Vava'
                  : 'Wants to connect as Nunu'}
              </p>
            </div>
          </div>

          {/* Listing */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Regarding Listing
            </h4>
            <p className="text-white font-medium">{invitation.listingTitle}</p>
          </div>

          {/* Message */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Message
            </h4>
            <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
              <p className="text-sm text-neutral-300 whitespace-pre-wrap">
                {invitation.message || 'No message provided.'}
              </p>
            </div>
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  handleDecline();
                  setShowDetails(false);
                }}
              >
                Decline
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleAccept();
                  setShowDetails(false);
                }}
              >
                Accept
              </Button>
            </div>
          )}

          {!isPending && (
            <div className="flex justify-center pt-2">
              <span
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium',
                  isAccepted && 'bg-green-600/20 text-green-400',
                  isDeclined && 'bg-red-600/20 text-red-400'
                )}
              >
                {isAccepted ? 'Request Accepted' : 'Request Declined'}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
