import type { IdentityType } from '@/features/auth/types';

export type Permission =
  // Learn
  | 'learn:view_first_chapter'
  | 'learn:view_free_courses'
  | 'learn:view_all_courses'
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
  // Sprint
  | 'sprint:view_projects'
  | 'sprint:submit_project'
  | 'sprint:vote'
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

export const PERMISSION_MATRIX: Record<IdentityType, Permission[]> = {
  guest: [
    'learn:view_first_chapter',
    'forum:read',
    'sprint:view_projects',
    'shop:browse',
  ],
  explorer: EXPLORER_PERMISSIONS,
  'solo-traveler': SOLO_TRAVELER_PERMISSIONS,
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
