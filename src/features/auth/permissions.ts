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
  // Space
  | 'space:enter'
  | 'space:match'
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

const SOLO_TRAVELER_PERMISSIONS: Permission[] = [
  'learn:view_first_chapter',
  'learn:view_free_courses',
  'learn:view_all_courses',
  'forum:read',
  'forum:like_comment',
  'forum:post',
  'sprint:view_projects',
  'sprint:submit_project',
  'sprint:vote',
  'shop:browse',
  'shop:purchase',
];

export const PERMISSION_MATRIX: Record<IdentityType, Permission[]> = {
  guest: [
    'learn:view_first_chapter',
    'forum:read',
    'sprint:view_projects',
    'shop:browse',
  ],
  explorer: [
    'learn:view_first_chapter',
    'learn:view_free_courses',
    'forum:read',
    'forum:like_comment',
    'sprint:view_projects',
    'shop:browse',
    'shop:purchase',
  ],
  'solo-traveler': SOLO_TRAVELER_PERMISSIONS,
  'duo-go': [
    ...SOLO_TRAVELER_PERMISSIONS,
    'space:enter',
    'space:match',
    'space:view_nunu',
  ],
  'duo-run': [
    ...SOLO_TRAVELER_PERMISSIONS,
    'space:enter',
    'space:match',
    'space:view_certified_nunu',
  ],
  'duo-fly': [
    ...SOLO_TRAVELER_PERMISSIONS,
    'space:enter',
    'space:match',
    'space:view_shangzhe',
  ],
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
