import type { Companion } from '@/features/space/types';

export const MOCK_COMPANIONS: Companion[] = [
  // Nunu (Go ticket)
  {
    id: 'companion-1',
    name: 'Amy',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy-nunu&top=longHairStraight',
    type: 'nunu',
    bio: 'Loves helping beginners get started with AI tools, skilled at explaining complex concepts in simple ways.',
    expertise: ['ChatGPT', 'Beginner Tutorial', 'Copywriting'],
    discordId: 'amy#1234',
    isAvailable: true,
    matchCount: 28,
    rating: 4.8,
  },
  {
    id: 'companion-2',
    name: 'Ben',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=ben-nunu&top=shortHairShortFlat',
    type: 'nunu',
    bio: 'Focused on AI automation, can help you build workflows.',
    expertise: ['Make.com', 'Zapier', 'Automation'],
    discordId: 'ben#5678',
    isAvailable: true,
    matchCount: 15,
    rating: 4.6,
  },
  {
    id: 'companion-3',
    name: 'Carol',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=carol-nunu&top=longHairBob',
    type: 'nunu',
    bio: 'Content creator, skilled at using AI to boost creative efficiency.',
    expertise: ['Content Creation', 'SEO', 'Social Media Management'],
    discordId: 'carol#9012',
    isAvailable: false,
    matchCount: 22,
    rating: 4.7,
  },
  // Certified Nunu (Run ticket)
  {
    id: 'companion-4',
    name: 'David',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=david-certified&top=shortHairShortWaved',
    type: 'certified-nunu',
    bio: 'Senior AI engineer, specializing in Prompt Engineering and AI application development.',
    expertise: ['Prompt Engineering', 'API Integration', 'Python'],
    discordId: 'david#3456',
    isAvailable: true,
    matchCount: 45,
    rating: 4.9,
  },
  {
    id: 'companion-5',
    name: 'Eva',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=eva-certified&top=longHairMiaWallace',
    type: 'certified-nunu',
    bio: 'AI Product Manager, helping you go from idea to execution.',
    expertise: ['Product Planning', 'Project Management', 'AI Strategy'],
    discordId: 'eva#7890',
    isAvailable: true,
    matchCount: 38,
    rating: 4.8,
  },
  // Shangzhe (Fly ticket)
  {
    id: 'companion-6',
    name: 'Shangzhe',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=shangzhe&top=shortHairShortCurly',
    type: 'shangzhe',
    bio: 'nuvaClub founder, AI education expert, providing one-on-one in-depth consultation.',
    expertise: ['AI Strategy', 'Business Application', 'Career Development'],
    discordId: 'shangzhe#0001',
    isAvailable: true,
    matchCount: 120,
    rating: 5.0,
  },
];

export function getCompanionsByType(type: string): Companion[] {
  return MOCK_COMPANIONS.filter((c) => c.type === type);
}

export function getAvailableCompanions(): Companion[] {
  return MOCK_COMPANIONS.filter((c) => c.isAvailable);
}

export function getCompanionById(id: string): Companion | undefined {
  return MOCK_COMPANIONS.find((c) => c.id === id);
}
