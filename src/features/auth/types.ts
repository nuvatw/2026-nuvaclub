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
}

export function getMembershipDisplay(identity: IdentityType): MembershipDisplay {
  const labels: Record<IdentityType, string> = {
    guest: 'Guest',
    explorer: 'Explorer',
    'solo-traveler': 'Solo Traveler',
    'duo-go': 'Duo Go',
    'duo-run': 'Duo Run',
    'duo-fly': 'Duo Fly',
  };

  return {
    label: labels[identity],
    color: IDENTITY_COLORS[identity],
  };
}
