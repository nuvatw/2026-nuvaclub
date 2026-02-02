import type { User } from '@/features/auth/types';

/**
 * UserSessionDTO represents the precomputed session data for the UI.
 * It includes authorization decisions (permission flags) to prevent the UI
 * from having to compute them based on raw roles.
 */
export interface UserSessionDTO extends User {
    canAccessAdminPanel: boolean;
    canManageUsers?: boolean;
}
