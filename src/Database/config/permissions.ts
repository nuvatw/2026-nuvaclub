/**
 * Permissions Configuration
 *
 * Defines permission matrix for identity types.
 * Migrated from features/auth/permissions.ts
 */

import type { IdentityType } from '@/features/auth/types';

export type Permission =
  // Learn
  | 'learn:view_first_chapter'
  | 'learn:view_free_courses'
  | 'learn:view_all_courses'
  | 'learn:certificates'
  // Forum
  | 'forum:read'
  | 'forum:like_comment'
  | 'forum:post'
  // Space (Marketplace)
  | 'space:enter'
  | 'space:match'
  | 'space:create_post'
  | 'space:view_nunu'
  | 'space:view_certified_nunu'
  | 'space:view_shangzhe'
  | 'space:priority_matching'
  // Sprint
  | 'sprint:view_projects'
  | 'sprint:submit_project'
  | 'sprint:vote'
  | 'sprint:featured_slot'
  | 'sprint:early_access'
  // Test
  | 'test:basic_levels'
  | 'test:intermediate_levels'
  | 'test:advanced_levels'
  | 'test:skill_badges'
  // Shop
  | 'shop:browse'
  | 'shop:purchase';

// Base permissions for logged-in users
const EXPLORER_PERMISSIONS: Permission[] = [
  'learn:view_first_chapter',
  'learn:view_free_courses',
  'forum:read',
  'forum:like_comment',
  'sprint:view_projects',
  'shop:browse',
  'shop:purchase',
  // Space marketplace is now open to all logged-in users
  'space:enter',
  'space:match',
  'space:create_post',
  'space:view_nunu',
  // Basic test levels for all logged-in users
  'test:basic_levels',
];

// Premium permissions for solo travelers
const SOLO_TRAVELER_PERMISSIONS: Permission[] = [
  ...EXPLORER_PERMISSIONS,
  'learn:view_all_courses',
  'forum:post',
  'sprint:submit_project',
  'sprint:vote',
  // Premium users can also view certified Nunus
  'space:view_certified_nunu',
];

// Voyager: Full platform access
const VOYAGER_PERMISSIONS: Permission[] = [
  ...SOLO_TRAVELER_PERMISSIONS,
  // Full Test access
  'test:intermediate_levels',
  'test:advanced_levels',
  'test:skill_badges',
  // Full Space access
  'space:view_shangzhe',
  'space:priority_matching',
  // Enhanced Sprint
  'sprint:featured_slot',
  'sprint:early_access',
  // Certificates
  'learn:certificates',
];

// Duo Go: Entry tier with basic Nunu access
const DUO_GO_PERMISSIONS: Permission[] = [
  ...EXPLORER_PERMISSIONS,
  'space:view_certified_nunu',
];

// Duo Run: Intermediate tier with expanded access
const DUO_RUN_PERMISSIONS: Permission[] = [
  ...DUO_GO_PERMISSIONS,
  'learn:view_all_courses',
  'forum:post',
  'sprint:submit_project',
  'sprint:vote',
];

// Duo Fly: Premium tier with full access
const DUO_FLY_PERMISSIONS: Permission[] = [
  ...DUO_RUN_PERMISSIONS,
  'space:view_shangzhe',
  'space:priority_matching',
  'test:intermediate_levels',
  'test:skill_badges',
];

export const PERMISSION_MATRIX: Record<IdentityType, Permission[]> = {
  guest: [
    'learn:view_first_chapter',
    'forum:read',
    'sprint:view_projects',
    'shop:browse',
  ],
  explorer: EXPLORER_PERMISSIONS,
  'solo-traveler': SOLO_TRAVELER_PERMISSIONS,
  voyager: VOYAGER_PERMISSIONS,
  'duo-go': DUO_GO_PERMISSIONS,
  'duo-run': DUO_RUN_PERMISSIONS,
  'duo-fly': DUO_FLY_PERMISSIONS,
};

export function hasPermission(
  identity: IdentityType,
  permission: Permission
): boolean {
  return PERMISSION_MATRIX[identity]?.includes(permission) ?? false;
}

export function hasAllPermissions(
  identity: IdentityType,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(identity, p));
}

export function hasAnyPermission(
  identity: IdentityType,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(identity, p));
}
