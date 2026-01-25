/**
 * Identity Configuration
 *
 * Re-exports from the canonical source for backward compatibility.
 * All identity configuration is now defined in @/features/auth/types.
 */

export {
  IDENTITY_LABELS,
  IDENTITY_COLORS,
  getMembershipDisplay,
  getMembershipDetails,
} from '@/features/auth/types';

export type { IdentityType, MembershipDisplay, MembershipDetails } from '@/features/auth/types';

// Additional helper exports for convenience
import type { IdentityType } from '@/features/auth/types';

// All identity types in order
export const IDENTITY_TYPES: IdentityType[] = [
  'guest',
  'explorer',
  'solo-traveler',
  'voyager',
  'duo-go',
  'duo-run',
  'duo-fly',
];

// Check if identity is a paid tier
export function isPaidIdentity(identity: IdentityType): boolean {
  const freeIdentities = ['guest', 'explorer'];
  return !freeIdentities.includes(identity);
}
