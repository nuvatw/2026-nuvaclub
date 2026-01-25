/**
 * Role gating utilities for Learn page and other features
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

/**
 * Check if the identity is Guest or Explorer (free tier)
 * Used for showing the Free Courses row on Learn page
 */
export function isGuestOrExplorer(identity: IdentityType): boolean {
  return FREE_TIER_IDENTITIES.includes(identity);
}

/**
 * Check if the identity is Traveler or above (paid tier)
 * These users do NOT see the Free Courses row
 */
export function isTravelerOrAbove(identity: IdentityType): boolean {
  return PAID_TIER_IDENTITIES.includes(identity);
}

/**
 * Check if identity is a logged-in user (not guest)
 */
export function isLoggedIn(identity: IdentityType): boolean {
  return identity !== 'guest';
}
