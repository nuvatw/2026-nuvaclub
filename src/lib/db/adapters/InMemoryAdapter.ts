import type { StorageAdapter } from './StorageAdapter';

/**
 * In-memory adapter for testing and SSR
 * Data is not persisted - exists only in memory
 */
export class InMemoryAdapter implements StorageAdapter {
  private data: Record<string, unknown[]> = {};

  async initialize(): Promise<void> {
    // No initialization needed for in-memory storage
  }

  async hasData(): Promise<boolean> {
    return Object.keys(this.data).length > 0;
  }

  async load(): Promise<Record<string, unknown[]> | null> {
    return Object.keys(this.data).length > 0 ? this.data : null;
  }

  async persist(schema: Record<string, { toArray(): unknown[] }>): Promise<void> {
    for (const [key, collection] of Object.entries(schema)) {
      this.data[key] = collection.toArray();
    }
  }

  async clear(): Promise<void> {
    this.data = {};
  }

  async getCollection(name: string): Promise<unknown[] | null> {
    return this.data[name] || null;
  }

  async setCollection(name: string, data: unknown[]): Promise<void> {
    this.data[name] = data;
  }
}
