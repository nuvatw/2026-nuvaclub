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
export function formatTimeAgo(date: Date, locale: SupportedLocale = 'en-US'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const labels = TIME_AGO_LABELS[locale];

  if (diffMins < 60) return `${diffMins} ${labels.minutes}`;
  if (diffHours < 24) return `${diffHours} ${labels.hours}`;
  if (diffDays < 7) return `${diffDays} ${labels.days}`;

  return date.toLocaleDateString(locale);
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
