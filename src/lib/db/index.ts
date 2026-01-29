// Main entry point for the mock database
// SHIM: Redirecting to src/infra/mock

// Core
export { MockDB } from '@/infra/mock/core/MockDB';
export { Collection } from '@/infra/mock/core/Collection';
export type { BaseEntity, Timestamps, WhereClause, QueryOptions, PaginatedResult, DBEvent, DBEventType, DBEventListener } from '@/infra/mock/core/types';

// Adapters
export type { StorageAdapter } from '@/infra/mock/adapters/StorageAdapter';
export { LocalStorageAdapter } from '@/infra/mock/adapters/LocalStorageAdapter';
export { InMemoryAdapter } from '@/infra/mock/adapters/InMemoryAdapter';

// Schemas - re-export all schema types
export * from '@/infra/mock/schema';

// Repositories
export * from '@/infra/mock/repositories';

// Provider
export { DBProvider, useDBContext, useDB, useDBReady } from './provider/DBProvider';

// Hooks
export * from './hooks';

// Seed functions
export { seedAll } from '@/infra/mock/seed';

import { MockDB as MockDBClass } from '@/infra/mock/core/MockDB';

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
