import type { Collection } from '../core/Collection';
import type { MockDB } from '../core/MockDB';
import type { BaseEntity, QueryOptions, PaginatedResult } from '../core/types';

/**
 * Base repository class providing common CRUD operations
 * Extend this class for specific entity repositories
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected collection: Collection<T>;
  protected db: MockDB;

  constructor(collection: Collection<T>, db: MockDB) {
    this.collection = collection;
    this.db = db;
  }

  /**
   * Find an entity by ID
   */
  findById(id: string): T | undefined {
    return this.collection.findById(id);
  }

  /**
   * Find all entities
   */
  findAll(): T[] {
    return this.collection.findAll();
  }

  /**
   * Find entities matching query options
   */
  findMany(options?: QueryOptions<T>): T[] {
    return this.collection.findMany(options);
  }

  /**
   * Find the first entity matching query options
   */
  findFirst(options?: QueryOptions<T>): T | undefined {
    return this.collection.findFirst(options);
  }

  /**
   * Get paginated results
   */
  findPaginated(
    page: number,
    pageSize: number,
    options?: Omit<QueryOptions<T>, 'limit' | 'offset'>
  ): PaginatedResult<T> {
    return this.collection.findPaginated(page, pageSize, options);
  }

  /**
   * Count entities matching optional where clause
   */
  count(where?: QueryOptions<T>['where']): number {
    return this.collection.count(where);
  }

  /**
   * Check if an entity exists
   */
  exists(id: string): boolean {
    return this.collection.exists(id);
  }

  /**
   * Create a new entity
   */
  create(data: Omit<T, 'id'> & { id?: string }): T {
    const entity = this.collection.create(data);
    this.persist();
    return entity;
  }

  /**
   * Create multiple entities
   */
  createMany(data: Array<Omit<T, 'id'> & { id?: string }>): T[] {
    const entities = this.collection.createMany(data);
    this.persist();
    return entities;
  }

  /**
   * Update an entity by ID
   */
  update(id: string, data: Partial<T>): T | undefined {
    const entity = this.collection.update(id, data);
    if (entity) {
      this.persist();
    }
    return entity;
  }

  /**
   * Update multiple entities matching where clause
   */
  updateMany(where: QueryOptions<T>['where'], data: Partial<T>): number {
    const count = this.collection.updateMany(where!, data);
    if (count > 0) {
      this.persist();
    }
    return count;
  }

  /**
   * Delete an entity by ID
   */
  delete(id: string): boolean {
    const deleted = this.collection.delete(id);
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  /**
   * Delete multiple entities matching where clause
   */
  deleteMany(where: QueryOptions<T>['where']): number {
    const count = this.collection.deleteMany(where!);
    if (count > 0) {
      this.persist();
    }
    return count;
  }

  /**
   * Upsert - create or update
   */
  upsert(id: string, data: Omit<T, 'id'>): T {
    const entity = this.collection.upsert(id, data);
    this.persist();
    return entity;
  }

  /**
   * Persist changes to storage
   */
  protected persist(): void {
    // Debounce persistence to avoid too many writes
    this.db.persist().catch((err) => {
      console.error('Failed to persist database:', err);
    });
  }
}
