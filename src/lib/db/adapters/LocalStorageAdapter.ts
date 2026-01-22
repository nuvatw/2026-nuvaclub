import type { StorageAdapter } from './StorageAdapter';

const STORAGE_VERSION = 2;

interface StorageWrapper {
  version: number;
  data: Record<string, unknown[]>;
  lastUpdated: string;
}

/**
 * LocalStorage adapter for browser-based persistence
 * Handles Date serialization/deserialization automatically
 */
export class LocalStorageAdapter implements StorageAdapter {
  private storageKey: string;
  private cache: Record<string, unknown[]> | null = null;

  constructor(storageKey: string = 'nuvaclub_db') {
    this.storageKey = storageKey;
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const wrapper: StorageWrapper = JSON.parse(stored, this.dateReviver);
        // Handle version migrations if needed
        if (wrapper.version === STORAGE_VERSION) {
          this.cache = wrapper.data;
        } else {
          // Version mismatch - clear and reseed
          console.warn('Database version mismatch, clearing data');
          this.cache = null;
        }
      } catch (e) {
        console.error('Failed to parse stored data:', e);
        this.cache = null;
      }
    }
  }

  async hasData(): Promise<boolean> {
    return this.cache !== null && Object.keys(this.cache).length > 0;
  }

  async load(): Promise<Record<string, unknown[]> | null> {
    return this.cache;
  }

  async persist(schema: Record<string, { toArray(): unknown[] }>): Promise<void> {
    if (typeof window === 'undefined') return;

    const data: Record<string, unknown[]> = {};
    for (const [key, collection] of Object.entries(schema)) {
      data[key] = collection.toArray();
    }

    this.cache = data;

    const wrapper: StorageWrapper = {
      version: STORAGE_VERSION,
      data,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(wrapper));
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
    this.cache = null;
  }

  async getCollection(name: string): Promise<unknown[] | null> {
    if (!this.cache) return null;
    return this.cache[name] || null;
  }

  async setCollection(name: string, data: unknown[]): Promise<void> {
    if (!this.cache) {
      this.cache = {};
    }
    this.cache[name] = data;
    // Persist immediately for single collection updates
    if (typeof window !== 'undefined') {
      const wrapper: StorageWrapper = {
        version: STORAGE_VERSION,
        data: this.cache,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(wrapper));
    }
  }

  /**
   * JSON reviver function to automatically convert ISO date strings back to Date objects
   */
  private dateReviver(_key: string, value: unknown): unknown {
    if (typeof value === 'string') {
      // ISO 8601 date format regex
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      if (dateRegex.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }
}
