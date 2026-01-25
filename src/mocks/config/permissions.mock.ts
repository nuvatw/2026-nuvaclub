/**
 * Permissions Configuration
 *
 * Re-exports from the canonical source for backward compatibility.
 * All permission logic is now defined in @/features/auth/permissions.
 */

export {
  PERMISSION_MATRIX,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from '@/features/auth/permissions';

export type { Permission } from '@/features/auth/permissions';
