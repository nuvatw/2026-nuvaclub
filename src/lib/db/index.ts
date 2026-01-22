// Main entry point for the mock database

// Core
export { MockDB } from './core/MockDB';
export { Collection } from './core/Collection';
export type { BaseEntity, Timestamps, WhereClause, QueryOptions, PaginatedResult, DBEvent, DBEventType, DBEventListener } from './core/types';

// Adapters
export type { StorageAdapter } from './adapters/StorageAdapter';
export { LocalStorageAdapter } from './adapters/LocalStorageAdapter';
export { InMemoryAdapter } from './adapters/InMemoryAdapter';

// Schemas - re-export all schema types
export * from './schema';

// Repositories
export * from './repositories';

// Provider
export { DBProvider, useDBContext, useDB, useDBReady } from './provider/DBProvider';

// Hooks
export * from './hooks';

// Seed functions
export { seedAll } from './seed';

import { MockDB as MockDBClass } from './core/MockDB';

/**
 * Get the MockDB singleton instance
 * This is the main way to access the database
 */
export function getDB(): MockDBClass {
  return MockDBClass.getInstance();
}

/**
 * Initialize the database
 * Call this once at app startup
 */
export async function initializeDB(): Promise<MockDBClass> {
  const db = getDB();
  await db.initialize();
  return db;
}
