/**
 * Database Utilities
 *
 * Common helper functions for working with mock data tables.
 */

/**
 * Find an item by ID in any table
 */
export function findById<T extends { id: string }>(
  table: T[],
  id: string
): T | undefined {
  return table.find((item) => item.id === id);
}

/**
 * Find items by IDs in any table
 */
export function findByIds<T extends { id: string }>(
  table: T[],
  ids: string[]
): T[] {
  return table.filter((item) => ids.includes(item.id));
}

/**
 * Filter items by a predicate
 */
export function filterBy<T>(
  table: T[],
  predicate: (item: T) => boolean
): T[] {
  return table.filter(predicate);
}

/**
 * Sort items by a key
 */
export function sortBy<T>(
  table: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...table].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Paginate a table
 */
export function paginate<T>(
  table: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number; totalPages: number } {
  const total = table.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = table.slice(start, start + pageSize);
  return { data, total, totalPages };
}

/**
 * Group items by a key
 */
export function groupBy<T, K extends string | number>(
  table: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return table.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}
