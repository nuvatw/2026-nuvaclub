export type IdentityType =
  | 'guest'
  | 'explorer'
  | 'solo-traveler';

// Note: Duo identities (duo-go, duo-run, duo-fly) have been removed.
// The marketplace model now allows all logged-in users (Explorer+) to access Space
// and negotiate directly with Nunus/Vavas for mentorship.

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  discordId?: string;
  githubUsername?: string;
  identity: IdentityType;
  createdAt: Date;
}

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

export interface MembershipDisplay {
  label: string;
  color: string;
  description: string;
}

const MEMBERSHIP_LABELS: Record<IdentityType, string> = {
  guest: 'Guest',
  explorer: 'Explorer',
  'solo-traveler': 'Solo Traveler',
};

const MEMBERSHIP_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Not logged in',
  explorer: 'Free membership',
  'solo-traveler': 'Premium membership',
};

export function getMembershipDisplay(identity: IdentityType): MembershipDisplay {
  return {
    label: MEMBERSHIP_LABELS[identity],
    color: IDENTITY_COLORS[identity],
    description: MEMBERSHIP_DESCRIPTIONS[identity],
  };
}

// Extended membership details for profile page
export interface MembershipDetails extends MembershipDisplay {
  textColor: string;
  borderColor: string;
  features: string[];
}

const MEMBERSHIP_TEXT_COLORS: Record<IdentityType, string> = {
  guest: 'text-neutral-400',
  explorer: 'text-primary-400',
  'solo-traveler': 'text-accent-400',
};

const MEMBERSHIP_BORDER_COLORS: Record<IdentityType, string> = {
  guest: 'border-neutral-500/30',
  explorer: 'border-primary-500/30',
  'solo-traveler': 'border-accent-500/30',
};

const MEMBERSHIP_FULL_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Create an account to access all features.',
  explorer: 'Free membership with access to Space marketplace, free courses, and community features.',
  'solo-traveler': 'Premium membership with full access to all learning content and priority features.',
};

const MEMBERSHIP_FEATURES: Record<IdentityType, string[]> = {
  guest: ['Browse public content', 'View course previews'],
  explorer: [
    'Access to free courses',
    'First chapter of paid courses',
    'Forum participation',
    'Browse projects in Sprint',
    'Space marketplace access',
    'Find and purchase Nunu mentorship',
  ],
  'solo-traveler': [
    'All courses unlocked',
    'Priority forum support',
    'Upload projects to Sprint',
    'Download course materials',
    'Space marketplace access',
    'Find and purchase Nunu mentorship',
  ],
};

export function getMembershipDetails(identity: IdentityType): MembershipDetails {
  return {
    label: MEMBERSHIP_LABELS[identity],
    color: IDENTITY_COLORS[identity],
    description: MEMBERSHIP_FULL_DESCRIPTIONS[identity],
    textColor: MEMBERSHIP_TEXT_COLORS[identity],
    borderColor: MEMBERSHIP_BORDER_COLORS[identity],
    features: MEMBERSHIP_FEATURES[identity],
  };
}
