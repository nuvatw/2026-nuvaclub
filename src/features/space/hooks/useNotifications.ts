'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const NOTIFICATIONS_STORAGE_KEY = 'nuvaclub_notifications';

// ==================== TYPES ====================

export type NotificationType = 'invitation' | 'report' | 'system';

export interface BaseNotification {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ReportNotification extends BaseNotification {
  type: 'report';
  reportMonth: string; // YYYY-MM format
}

export interface SystemNotification extends BaseNotification {
  type: 'system';
}

export type Notification = BaseNotification | ReportNotification | SystemNotification;

// ==================== MOCK DATA ====================

function getMockReportNotification(userId: string): ReportNotification | null {
  // Generate a report notification for the last completed month
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  const monthStr = `${year}-${month.toString().padStart(2, '0')}`;

  // Simulate that the report was generated on the last day of the previous month
  const lastDayOfMonth = new Date(year, month, 0, 12, 0, 0);

  // Only show if we're within the first week of a new month (mock behavior)
  const dayOfMonth = now.getDate();
  if (dayOfMonth > 7) {
    return null;
  }

  return {
    id: `report-notification-${monthStr}`,
    type: 'report',
    userId,
    title: 'Your Monthly AI Report is Ready!',
    message: `Your ${getMonthName(month)} ${year} report is now available. See your growth highlights, metrics, and personalized recommendations.`,
    isRead: false,
    createdAt: lastDayOfMonth,
    actionUrl: '/test?tab=report',
    reportMonth: monthStr,
  };
}

function getMonthName(month: number): string {
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
}

// ==================== HOOK ====================

interface UseNotificationsReturn {
  notifications: Notification[];
  isHydrated: boolean;
  getNotificationsForUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  dismissNotification: (notificationId: string) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications, isHydrated] = useLocalStorage<Notification[]>(
    NOTIFICATIONS_STORAGE_KEY,
    []
  );

  const getNotificationsForUser = useCallback(
    (userId: string): Notification[] => {
      const userNotifications = notifications.filter((n) => n.userId === userId);

      // Check if we need to add a mock report notification
      const hasReportNotification = userNotifications.some(
        (n) => n.type === 'report'
      );

      if (!hasReportNotification) {
        const mockReport = getMockReportNotification(userId);
        if (mockReport) {
          // Add the mock notification to storage
          setNotifications((prev) => [mockReport, ...prev]);
          return [mockReport, ...userNotifications];
        }
      }

      // Sort by date, newest first
      return userNotifications.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    [notifications, setNotifications]
  );

  const getUnreadCount = useCallback(
    (userId: string): number => {
      return notifications.filter(
        (n) => n.userId === userId && !n.isRead
      ).length;
    },
    [notifications]
  );

  const markAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    },
    [setNotifications]
  );

  const markAllAsRead = useCallback(
    (userId: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.userId === userId ? { ...n, isRead: true } : n
        )
      );
    },
    [setNotifications]
  );

  const dismissNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    },
    [setNotifications]
  );

  return {
    notifications,
    isHydrated,
    getNotificationsForUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  };
}
