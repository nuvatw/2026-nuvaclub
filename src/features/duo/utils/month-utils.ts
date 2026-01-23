// ============================================================================
// MONTH UTILITY FUNCTIONS
// For handling month-based operations in the Duo system
// ============================================================================

/**
 * Format a Date to YYYY-MM string
 */
export function dateToMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Parse YYYY-MM string to Date (first day of month)
 */
export function monthToDate(month: string): Date {
  const [year, monthNum] = month.split('-').map(Number);
  return new Date(year, monthNum - 1, 1);
}

/**
 * Get the current month as YYYY-MM string
 */
export function getCurrentMonth(): string {
  return dateToMonth(new Date());
}

/**
 * Get the next N months starting from current month
 * @param count Number of months to get (default 12)
 */
export function getNextMonths(count: number = 12): string[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(dateToMonth(date));
  }

  return months;
}

/**
 * Format month string for display
 * e.g., "2026-03" -> "March 2026"
 */
export function formatMonthLong(month: string): string {
  const date = monthToDate(month);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Format month string for short display
 * e.g., "2026-03" -> "Mar '26"
 */
export function formatMonthShort(month: string): string {
  const date = monthToDate(month);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${monthName} '${year}`;
}

/**
 * Format month string for compact display
 * e.g., "2026-03" -> "Mar"
 */
export function formatMonthCompact(month: string): string {
  const date = monthToDate(month);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

/**
 * Get the year from a month string
 */
export function getYearFromMonth(month: string): number {
  return parseInt(month.split('-')[0], 10);
}

/**
 * Get the month number from a month string (1-12)
 */
export function getMonthNumber(month: string): number {
  return parseInt(month.split('-')[1], 10);
}

/**
 * Check if a month is in the past
 */
export function isMonthPast(month: string): boolean {
  const current = getCurrentMonth();
  return month < current;
}

/**
 * Check if a month is current month
 */
export function isMonthCurrent(month: string): boolean {
  return month === getCurrentMonth();
}

/**
 * Check if a month is in the future
 */
export function isMonthFuture(month: string): boolean {
  const current = getCurrentMonth();
  return month > current;
}

/**
 * Group months by year
 * Returns { 2026: ["2026-01", "2026-02"], 2027: ["2027-01"] }
 */
export function groupMonthsByYear(
  months: string[]
): Record<number, string[]> {
  return months.reduce(
    (acc, month) => {
      const year = getYearFromMonth(month);
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(month);
      return acc;
    },
    {} as Record<number, string[]>
  );
}

/**
 * Sort months chronologically
 */
export function sortMonths(months: string[]): string[] {
  return [...months].sort((a, b) => a.localeCompare(b));
}

/**
 * Get months between two month strings (inclusive)
 */
export function getMonthsBetween(start: string, end: string): string[] {
  const months: string[] = [];
  const startDate = monthToDate(start);
  const endDate = monthToDate(end);

  const current = new Date(startDate);
  while (current <= endDate) {
    months.push(dateToMonth(current));
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

/**
 * Add months to a month string
 */
export function addMonths(month: string, count: number): string {
  const date = monthToDate(month);
  date.setMonth(date.getMonth() + count);
  return dateToMonth(date);
}

/**
 * Check if two month arrays have any overlap
 */
export function hasMonthOverlap(months1: string[], months2: string[]): boolean {
  const set1 = new Set(months1);
  return months2.some((m) => set1.has(m));
}

/**
 * Get overlapping months between two arrays
 */
export function getOverlappingMonths(
  months1: string[],
  months2: string[]
): string[] {
  const set1 = new Set(months1);
  return months2.filter((m) => set1.has(m));
}
