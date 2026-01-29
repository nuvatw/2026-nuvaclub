/**
 * Users Table
 *
 * Contains all user entities used across the application.
 * Users 1-10 are canonical community users (used in forum, progress, favorites)
 * Users 11-30 are extended users (used in sprint projects)
 */

export type UserIdentity =
  | 'guest'
  | 'explorer'
  | 'solo-traveler'
  | 'voyager'
  | 'duo-go'
  | 'duo-run'
  | 'duo-fly';

export interface User {
  id: string;
  name: string;
  avatar: string;
  identity?: UserIdentity;
}

import { MOCK_USERS as DEMO_USERS } from '@/demo/users';

export const UsersTable: User[] = DEMO_USERS;

// ============================================================
// Helper Functions
// ============================================================

export const getUserById = (id: string): User | undefined =>
  UsersTable.find((u) => u.id === id);

export const getUsersByIds = (ids: string[]): User[] =>
  UsersTable.filter((u) => ids.includes(u.id));

export const getCanonicalUsers = (): User[] => UsersTable.slice(0, 10);

export const getExtendedUsers = (): User[] => UsersTable.slice(10);

export const getAllUsers = (): User[] => UsersTable;

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use UsersTable instead */
export const MOCK_USERS = UsersTable;

/** @deprecated Use getAllUsers instead */
export const getSprintAuthors = (): User[] => UsersTable;

// Re-export type for convenience
export type { User as MockUser };
