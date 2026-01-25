/**
 * Auth feature exports
 */

// Types
export * from './types';

// Permissions
export { hasPermission, hasAllPermissions, hasAnyPermission, PERMISSION_MATRIX } from './permissions';
export type { Permission } from './permissions';

// Components
export { AuthProvider, useAuth } from './components/AuthProvider';
export { Gate } from './components/Gate';
export { IdentitySwitcher } from './components/IdentitySwitcher';
export { LoginModal } from './components/LoginModal';

// Utilities
export * from './utils';
