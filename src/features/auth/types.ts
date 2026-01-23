export type IdentityType =
  | 'guest'
  | 'explorer'
  | 'solo-traveler'
  | 'duo-go'
  | 'duo-run'
  | 'duo-fly';

export interface DuoTicket {
  type: 'go' | 'run' | 'fly';
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  discordId?: string;
  githubUsername?: string;
  identity: IdentityType;
  duoTicket?: DuoTicket;
  createdAt: Date;
}

export const IDENTITY_LABELS: Record<IdentityType, string> = {
  guest: 'Guest',
  explorer: 'Explorer',
  'solo-traveler': 'Solo Traveler',
  'duo-go': 'Duo Traveler (Go)',
  'duo-run': 'Duo Traveler (Run)',
  'duo-fly': 'Duo Traveler (Fly)',
};

export const IDENTITY_COLORS: Record<IdentityType, string> = {
  guest: 'bg-neutral-600',
  explorer: 'bg-primary-600',
  'solo-traveler': 'bg-accent-500',
  'duo-go': 'bg-green-500',
  'duo-run': 'bg-purple-500',
  'duo-fly': 'bg-amber-500',
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
  'duo-go': 'Duo Go',
  'duo-run': 'Duo Run',
  'duo-fly': 'Duo Fly',
};

const MEMBERSHIP_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Not logged in',
  explorer: 'Free membership',
  'solo-traveler': 'Premium membership',
  'duo-go': '1 Companion slot',
  'duo-run': '5 Companion slots',
  'duo-fly': 'Unlimited companions',
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
  'duo-go': 'text-green-400',
  'duo-run': 'text-purple-400',
  'duo-fly': 'text-amber-400',
};

const MEMBERSHIP_BORDER_COLORS: Record<IdentityType, string> = {
  guest: 'border-neutral-500/30',
  explorer: 'border-primary-500/30',
  'solo-traveler': 'border-accent-500/30',
  'duo-go': 'border-green-500/30',
  'duo-run': 'border-purple-500/30',
  'duo-fly': 'border-amber-500/30',
};

const MEMBERSHIP_FULL_DESCRIPTIONS: Record<IdentityType, string> = {
  guest: 'Create an account to access all features.',
  explorer: 'Free membership with access to free courses and community features.',
  'solo-traveler': 'Premium membership with full access to all learning content.',
  'duo-go': 'Connect with 1 learning companion for collaborative growth.',
  'duo-run': 'Build your learning team with up to 5 companions.',
  'duo-fly': 'Unlimited companions for maximum collaborative learning.',
};

const MEMBERSHIP_FEATURES: Record<IdentityType, string[]> = {
  guest: ['Browse public content', 'View course previews'],
  explorer: [
    'Access to free courses',
    'First chapter of paid courses',
    'Forum participation',
    'Browse projects in Sprint',
  ],
  'solo-traveler': [
    'All courses unlocked',
    'Priority forum support',
    'Upload projects to Sprint',
    'Download course materials',
  ],
  'duo-go': [
    'All Traveler benefits',
    '1 Nunu mentor',
    '1 Vava companion',
    'Space matching access',
  ],
  'duo-run': [
    'All Traveler benefits',
    '1 Nunu mentor',
    'Up to 5 Vava companions',
    'Priority matching',
  ],
  'duo-fly': [
    'All Traveler benefits',
    '1 Nunu mentor',
    'Unlimited Vava companions',
    'VIP matching priority',
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
