// Storage adapter interface for pluggable persistence

export interface StorageAdapter {
  /**
   * Initialize the storage adapter
   */
  initialize(): Promise<void>;

  /**
   * Check if storage has any data
   */
  hasData(): Promise<boolean>;

  /**
   * Load all data from storage
   */
  load(): Promise<Record<string, unknown[]> | null>;

  /**
   * Persist all collections to storage
   */
  persist(schema: Record<string, { toArray(): unknown[] }>): Promise<void>;

  /**
   * Clear all stored data
   */
  clear(): Promise<void>;

  /**
   * Get a specific collection's data
   */
  getCollection(name: string): Promise<unknown[] | null>;

  /**
   * Set a specific collection's data
   */
  setCollection(name: string, data: unknown[]): Promise<void>;
}
