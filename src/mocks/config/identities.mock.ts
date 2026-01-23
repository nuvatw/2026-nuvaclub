import type { IdentityType } from '@/features/auth/types';

/**
 * Identity Configuration
 *
 * Labels, colors, and display properties for user identity types.
 * Note: Duo identities have been removed in the marketplace model.
 */

export const IDENTITY_LABELS: Record<IdentityType, string> = {
  guest: 'Guest',
  explorer: 'Explorer',
  'solo-traveler': 'Solo Traveler',
};

export const IDENTITY_COLORS: Record<IdentityType, string> = {
  guest: 'bg-neutral-600',
  explorer: 'bg-primary-600',
  'solo-traveler': 'bg-accent-500',
};

export const IDENTITY_TEXT_COLORS: Record<IdentityType, string> = {
  guest: 'text-neutral-400',
  explorer: 'text-primary-400',
  'solo-traveler': 'text-accent-400',
};

export const IDENTITY_BORDER_COLORS: Record<IdentityType, string> = {
  guest: 'border-neutral-500/30',
  explorer: 'border-primary-500/30',
  'solo-traveler': 'border-accent-500/30',
};

export const MEMBERSHIP_LABELS: Record<IdentityType, string> = {
  guest: 'Guest',
  explorer: 'Explorer',
  'solo-traveler': 'Solo Traveler',
};

export const MEMBERSHIP_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Not logged in',
  explorer: 'Free membership',
  'solo-traveler': 'Premium membership',
};

export const MEMBERSHIP_FULL_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Create an account to access all features.',
  explorer: 'Free membership with access to Space marketplace, free courses, and community features.',
  'solo-traveler': 'Premium membership with full access to all learning content and priority features.',
};

export const MEMBERSHIP_FEATURES: Record<IdentityType, string[]> = {
  guest: ['Browse public content', 'View course previews'],
  explorer: [
    'Access to free courses',
    'First chapter of paid courses',
    'Forum participation',
    'Browse projects in Sprint',
    'Space marketplace access',
  ],
  'solo-traveler': [
    'All courses unlocked',
    'Priority forum support',
    'Upload projects to Sprint',
    'Download course materials',
    'Space marketplace access',
  ],
};

// All identity types in order
export const IDENTITY_TYPES: IdentityType[] = ['guest', 'explorer', 'solo-traveler'];

// Helper functions
export const getIdentityLabel = (identity: IdentityType): string => IDENTITY_LABELS[identity];

export const getIdentityColor = (identity: IdentityType): string => IDENTITY_COLORS[identity];

export const getMembershipLabel = (identity: IdentityType): string => MEMBERSHIP_LABELS[identity];

export const getMembershipDescription = (identity: IdentityType): string => MEMBERSHIP_DESCRIPTIONS[identity];

export const getMembershipFeatures = (identity: IdentityType): string[] => MEMBERSHIP_FEATURES[identity];

export const isPaidIdentity = (identity: IdentityType): boolean =>
  identity !== 'guest' && identity !== 'explorer';
