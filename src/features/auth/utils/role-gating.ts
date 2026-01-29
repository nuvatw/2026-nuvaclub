/**
 * Role gating utilities for Learn page and other features
 * @deprecated Use `useDomainGate` hook for authoritative access checks.
 * These functions are retained for simple UI conditional rendering based on client-side identity,
 * but should not be used for critical access control.
 */

import type { IdentityType } from '@/features/auth/types';

/**
 * Identities that should see free content sections
 * Guest and Explorer users see free courses prominently
 */
export const FREE_TIER_IDENTITIES: IdentityType[] = ['guest', 'explorer'];

/**
 * Identities that represent paid/premium tiers
 * Traveler and above do NOT see the "Free Courses" section
 */
export const PAID_TIER_IDENTITIES: IdentityType[] = [
  'solo-traveler',
  'voyager',
  'duo-go',
  'duo-run',
  'duo-fly',
];

export function isGuestOrExplorer(identity: IdentityType): boolean {
  return FREE_TIER_IDENTITIES.includes(identity);
}

export function isTravelerOrAbove(identity: IdentityType): boolean {
  return PAID_TIER_IDENTITIES.includes(identity);
}

export function isLoggedIn(identity: IdentityType): boolean {
  return identity !== 'guest';
}
