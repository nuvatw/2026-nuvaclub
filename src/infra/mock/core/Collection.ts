import type { BaseEntity, WhereClause, QueryOptions, PaginatedResult } from './types';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generic Collection class providing CRUD operations
 * Designed to mimic a database table with query capabilities
 */
export class Collection<T extends BaseEntity> {
  private items: Map<string, T> = new Map();
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  // ==========================================
  // CREATE Operations
  // ==========================================

  /**
   * Create a new item in the collection
   */
  create(data: Omit<T, 'id'> & { id?: string }): T {
    const id = data.id ?? generateId();
    const item = { ...data, id } as T;
    this.items.set(id, item);
    return item;
  }

  /**
   * Create multiple items at once
   */
  createMany(data: Array<Omit<T, 'id'> & { id?: string }>): T[] {
    return data.map((item) => this.create(item));
  }

  // ==========================================
  // READ Operations
  // ==========================================

  /**
   * Find an item by ID
   */
  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  /**
   * Find the first item matching the query
   */
  findFirst(options?: QueryOptions<T>): T | undefined {
    const results = this.findMany({ ...options, limit: 1 });
    return results[0];
  }

  /**
   * Find all items matching the query
   */
  findMany(options?: QueryOptions<T>): T[] {
    let results = Array.from(this.items.values());

    // Apply where clause
    if (options?.where) {
      results = this.applyWhere(results, options.where);
    }

    // Apply ordering
    if (options?.orderBy) {
      results = this.applyOrderBy(results, options.orderBy);
    }

    // Apply pagination
    if (options?.offset !== undefined) {
      results = results.slice(options.offset);
    }
    if (options?.limit !== undefined) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Find all items (alias for findMany with no options)
   */
  findAll(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Get paginated results
   */
  findPaginated(page: number, pageSize: number, options?: Omit<QueryOptions<T>, 'limit' | 'offset'>): PaginatedResult<T> {
    let results = Array.from(this.items.values());

    // Apply where clause
    if (options?.where) {
      results = this.applyWhere(results, options.where);
    }

    // Apply ordering
    if (options?.orderBy) {
      results = this.applyOrderBy(results, options.orderBy);
    }

    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const items = results.slice(offset, offset + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Count items matching the query
   */
  count(where?: WhereClause<T>): number {
    if (!where) return this.items.size;
    const results = this.findMany({ where });
    return results.length;
  }

  /**
   * Check if an item exists
   */
  exists(id: string): boolean {
    return this.items.has(id);
  }

  // ==========================================
  // UPDATE Operations
  // ==========================================

  /**
   * Update an item by ID
   */
  update(id: string, data: Partial<T>): T | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data, id } as T;
    this.items.set(id, updated);
    return updated;
  }

  /**
   * Update multiple items matching the where clause
   */
  updateMany(where: WhereClause<T>, data: Partial<T>): number {
    const toUpdate = this.findMany({ where });
    for (const item of toUpdate) {
      this.update(item.id, data);
    }
    return toUpdate.length;
  }

  /**
   * Upsert - create or update
   */
  upsert(id: string, data: Omit<T, 'id'>): T {
    const existing = this.items.get(id);
    if (existing) {
      return this.update(id, data as Partial<T>) as T;
    }
    return this.create({ ...data, id } as Omit<T, 'id'> & { id: string });
  }

  // ==========================================
  // DELETE Operations
  // ==========================================

  /**
   * Delete an item by ID
   */
  delete(id: string): boolean {
    return this.items.delete(id);
  }

  /**
   * Delete multiple items matching the where clause
   */
  deleteMany(where: WhereClause<T>): number {
    const toDelete = this.findMany({ where });
    for (const item of toDelete) {
      this.items.delete(item.id);
    }
    return toDelete.length;
  }

  /**
   * Clear all items from the collection
   */
  clear(): void {
    this.items.clear();
  }

  // ==========================================
  // Hydration & Serialization
  // ==========================================

  /**
   * Load items from an array (for persistence)
   */
  hydrate(items: T[]): void {
    this.items.clear();
    for (const item of items) {
      this.items.set(item.id, item);
    }
  }

  /**
   * Convert collection to array (for persistence)
   */
  toArray(): T[] {
    return Array.from(this.items.values());
  }

  // ==========================================
  // Private Helpers
  // ==========================================

  private applyWhere(items: T[], where: WhereClause<T>): T[] {
    if (typeof where === 'function') {
      return items.filter(where);
    }

    return items.filter((item) =>
      Object.entries(where as Partial<T>).every(([key, value]) => {
        const itemValue = item[key as keyof T];
        // Handle array comparison
        if (Array.isArray(value)) {
          return Array.isArray(itemValue) &&
            value.length === itemValue.length &&
            value.every((v, i) => v === itemValue[i]);
        }
        return itemValue === value;
      })
    );
  }

  private applyOrderBy(
    items: T[],
    orderBy: keyof T | { field: keyof T; direction: 'asc' | 'desc' }
  ): T[] {
    let field: keyof T;
    let direction: 'asc' | 'desc';

    if (typeof orderBy === 'object' && orderBy !== null && 'field' in orderBy) {
      field = orderBy.field;
      direction = orderBy.direction;
    } else {
      field = orderBy as keyof T;
      direction = 'asc';
    }

    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === 'asc' ? -1 : 1;
      if (bVal == null) return direction === 'asc' ? 1 : -1;

      // Handle dates
      if (aVal instanceof Date && bVal instanceof Date) {
        const comparison = aVal.getTime() - bVal.getTime();
        return direction === 'desc' ? -comparison : comparison;
      }

      // Handle strings and numbers
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === 'desc' ? -comparison : comparison;
    });
  }
}
