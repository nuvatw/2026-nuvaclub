'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useInvitations } from '../../hooks/useInvitations';
import { useNotifications, type Notification } from '../../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { ChartBarIcon, CheckIcon } from '@/components/icons';

export function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const { getInvitationsForUser, getPendingCount, isHydrated: invitationsHydrated } = useInvitations();
  const { getNotificationsForUser, getUnreadCount, markAsRead, isHydrated: notificationsHydrated } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHydrated = invitationsHydrated && notificationsHydrated;

  const invitations = user ? getInvitationsForUser() : [];
  const pendingInvitationCount = user ? getPendingCount() : 0;

  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadNotificationCount = user ? getUnreadCount(user.id) : 0;

  // Total badge count (pending invitations + unread notifications)
  const totalUnreadCount = pendingInvitationCount + unreadNotificationCount;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  if (!user || !isHydrated) {
    return null;
  }

  const hasAnyItems = invitations.length > 0 || notifications.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg transition-colors',
          'text-neutral-500 hover:text-white hover:bg-neutral-800',
          isOpen && 'text-white bg-neutral-800'
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'w-80 max-h-96 overflow-hidden',
              'bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl'
            )}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-800">
              <h3 className="font-semibold text-white">Notifications</h3>
              {totalUnreadCount > 0 && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  {totalUnreadCount} unread notification{totalUnreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-72">
              {!hasAnyItems ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-sm text-neutral-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {/* Report Notifications */}
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors hover:bg-neutral-800/50',
                        !notification.isRead && 'bg-green-500/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                          notification.type === 'report' ? 'bg-green-500/10' : 'bg-neutral-700'
                        )}>
                          {notification.type === 'report' ? (
                            <ChartBarIcon size="sm" className="text-green-400" />
                          ) : (
                            <span className="text-sm">📢</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              'text-sm font-medium truncate',
                              notification.isRead ? 'text-neutral-300' : 'text-white'
                            )}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Invitation Notifications */}
                  {invitations.map((invitation) => (
                    <NotificationItem
                      key={invitation.id}
                      invitation={invitation}
                      onClose={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
