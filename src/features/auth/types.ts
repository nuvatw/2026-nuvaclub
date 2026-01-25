export type IdentityType =
  | 'guest'
  | 'explorer'
  | 'solo-traveler'
  | 'voyager'
  | 'duo-go'
  | 'duo-run'
  | 'duo-fly';

// Voyager is the premium tier with full access to Test, Space, and Sprint systems.
// Duo tiers (go/run/fly) represent different Duo membership levels with Nunu mentorship.

// Role determines admin vs regular user privileges
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  discordId?: string;
  githubUsername?: string;
  identity: IdentityType;
  role: UserRole;
  createdAt: Date;
}

export const IDENTITY_LABELS: Record<IdentityType, string> = {
  guest: 'Guest',
  explorer: 'Explorer',
  'solo-traveler': 'Solo Traveler',
  voyager: 'Voyager',
  'duo-go': 'Duo Go',
  'duo-run': 'Duo Run',
  'duo-fly': 'Duo Fly',
};

export const IDENTITY_COLORS: Record<IdentityType, string> = {
  guest: 'bg-neutral-600',
  explorer: 'bg-primary-600',
  'solo-traveler': 'bg-accent-500',
  voyager: 'bg-purple-600',
  'duo-go': 'bg-green-500',
  'duo-run': 'bg-purple-500',
  'duo-fly': 'bg-amber-500',
};

export interface MembershipDisplay {
  label: string;
  color: string;
  description: string;
}

const MEMBERSHIP_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Not logged in',
  explorer: 'Free membership',
  'solo-traveler': 'Premium membership',
  voyager: 'Full platform access',
  'duo-go': 'Duo entry tier',
  'duo-run': 'Duo intermediate tier',
  'duo-fly': 'Duo premium tier',
};

export function getMembershipDisplay(identity: IdentityType): MembershipDisplay {
  return {
    label: IDENTITY_LABELS[identity],
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
  voyager: 'text-purple-400',
  'duo-go': 'text-green-400',
  'duo-run': 'text-purple-400',
  'duo-fly': 'text-amber-400',
};

const MEMBERSHIP_BORDER_COLORS: Record<IdentityType, string> = {
  guest: 'border-neutral-500/30',
  explorer: 'border-primary-500/30',
  'solo-traveler': 'border-accent-500/30',
  voyager: 'border-purple-500/30',
  'duo-go': 'border-green-500/30',
  'duo-run': 'border-purple-500/30',
  'duo-fly': 'border-amber-500/30',
};

const MEMBERSHIP_FULL_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Create an account to access all features.',
  explorer: 'Free membership with access to Space marketplace, free courses, and community features.',
  'solo-traveler': 'Premium membership with full access to all learning content and priority features.',
  voyager: 'Complete platform access with Test system, Shangzhe mentors, and exclusive Sprint features.',
  'duo-go': 'Duo entry tier with 1 Nunu match per month.',
  'duo-run': 'Duo intermediate tier with 5 Nunu matches per month.',
  'duo-fly': 'Duo premium tier with unlimited Nunu matches.',
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
  voyager: [
    'Everything in Traveler',
    'Full Test system access (all 12 levels)',
    'Earn skill badges & certificates',
    'Access Shangzhe (founder mentors)',
    'Priority matching in Space',
    'Featured Sprint submission slot',
    'Early access to Sprint themes',
    'Voyager badge on profile',
    'Priority support',
  ],
  'duo-go': [
    'Everything in Explorer',
    '1 Nunu match per month',
    '1-on-1 mentorship sessions',
    'Basic progress tracking',
  ],
  'duo-run': [
    'Everything in Duo Go',
    '5 Nunu matches per month',
    'Priority matching queue',
    'Extended session duration',
    'Progress reports',
  ],
  'duo-fly': [
    'Everything in Duo Run',
    'Unlimited Nunu matches',
    'Access to verified Nunus',
    'Premium progress analytics',
    'Priority support',
  ],
};

export function getMembershipDetails(identity: IdentityType): MembershipDetails {
  return {
    label: IDENTITY_LABELS[identity],
    color: IDENTITY_COLORS[identity],
    description: MEMBERSHIP_FULL_DESCRIPTIONS[identity],
    textColor: MEMBERSHIP_TEXT_COLORS[identity],
    borderColor: MEMBERSHIP_BORDER_COLORS[identity],
    features: MEMBERSHIP_FEATURES[identity],
  };
}
