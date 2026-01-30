/**
 * Shared date formatting utilities
 */

export type SupportedLocale = 'en-US' | 'zh-TW';

const TIME_AGO_LABELS = {
  'en-US': { minutes: 'minutes ago', hours: 'hours ago', days: 'days ago' },
  'zh-TW': { minutes: 'minutes ago', hours: 'hours ago', days: 'days ago' },
} as const;

/**
 * Format a date as a relative time string (e.g., "5 minutes ago")
 */
export function formatTimeAgo(date: Date | string, locale: SupportedLocale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const labels = TIME_AGO_LABELS[locale];

  if (diffMins < 60) return `${diffMins} ${labels.minutes}`;
  if (diffHours < 24) return `${diffHours} ${labels.hours}`;
  if (diffDays < 7) return `${diffDays} ${labels.days}`;

  return d.toLocaleDateString(locale);
}

/**
 * Format a date with full weekday, month, day, and year
 */
export function formatDateLong(date: Date, locale: SupportedLocale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with short weekday, month, day, and year
 */
export function formatDateShort(date: Date, locale: SupportedLocale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time as HH:MM AM/PM
 */
export function formatTime(date: Date, locale: SupportedLocale = 'en-US'): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date with custom options
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: SupportedLocale = 'en-US'
): string {
  return date.toLocaleDateString(locale, options);
}

/**
 * Format a date as "MMM d, yyyy" (e.g., "Jan 15, 2024")
 * Returns 'N/A' for undefined dates
 */
export function formatDateCompact(date: Date | undefined, locale: SupportedLocale = 'en-US'): string {
  if (!date) return 'N/A';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date as "Month d, yyyy" (e.g., "January 15, 2024")
 * Returns 'N/A' for undefined dates
 */
export function formatDateMedium(date: Date | undefined, locale: SupportedLocale = 'en-US'): string {
  if (!date) return 'N/A';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date with time as "Month d, yyyy at HH:MM AM/PM"
 */
export function formatDateWithTime(date: Date | string, locale: SupportedLocale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date range as "MMM d, yyyy - MMM d, yyyy"
 */
export function formatDateRange(start: Date | string, end: Date | string, locale: SupportedLocale = 'en-US'): string {
  return `${formatDateCompact(start as any, locale)} - ${formatDateCompact(end as any, locale)}`;
}

/**
 * Format a date as "YYYY MonthName" (e.g., "2026 October")
 * Used for month grouping headers in event listings
 */
export function formatMonthYear(date: Date, locale: SupportedLocale = 'en-US'): string {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = d.toLocaleDateString(locale, { month: 'long' });
  return `${year} ${month}`;
}

/**
 * Get the short weekday name (e.g., "Tue", "Wed")
 */
export function formatDayOfWeek(date: Date, locale: SupportedLocale = 'en-US'): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, { weekday: 'short' });
}

/**
 * Get the day of month as a number (e.g., 1, 15, 31)
 */
export function formatDayNumber(date: Date): number {
  const d = date instanceof Date ? date : new Date(date);
  return d.getDate();
}

/**
 * Get year-month key for grouping (e.g., "2026-10")
 */
export function getMonthKey(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
