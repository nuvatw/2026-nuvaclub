/**
 * Users Table
 *
 * Contains all user entities used across the application.
 * Users 1-10 are canonical community users (used in forum, progress, favorites)
 * Users 11-30 are extended users (used in sprint projects)
 */

export type UserIdentity =
  | 'guest'
  | 'explorer'
  | 'solo-traveler'
  | 'voyager'
  | 'duo-go'
  | 'duo-run'
  | 'duo-fly';

export interface User {
  id: string;
  name: string;
  avatar: string;
  identity?: UserIdentity;
}

export const UsersTable: User[] = [
  // Canonical users (1-10) - used across forum, progress, favorites
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
    identity: 'solo-traveler',
  },
  {
    id: 'user-2',
    name: 'Sarah Lin',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairBigHair',
    identity: 'duo-run',
  },
  {
    id: 'user-3',
    name: 'Mike Wang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairSides',
    identity: 'solo-traveler',
  },
  {
    id: 'user-4',
    name: 'Emily Huang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairMiaWallace',
    identity: 'duo-fly',
  },
  {
    id: 'user-5',
    name: 'Kevin Lee',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=kevin&top=shortHairShortCurly',
    identity: 'explorer',
  },
  {
    id: 'user-6',
    name: 'Jessica Wu',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    identity: 'duo-go',
  },
  {
    id: 'user-7',
    name: 'David Zhang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=david&top=shortHairShortWaved',
    identity: 'explorer',
  },
  {
    id: 'user-8',
    name: 'Lisa Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=lisa&top=longHairBob',
    identity: 'duo-go',
  },
  {
    id: 'user-9',
    name: 'Tom Huang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tom&top=shortHairFrizzle',
    identity: 'solo-traveler',
  },
  {
    id: 'user-10',
    name: 'Amy Lin',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy&top=longHairStraightStrand',
    identity: 'duo-fly',
  },
  // Extended users (11-30) - used in sprint projects
  {
    id: 'user-11',
    name: 'Ryan Xu',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=ryanxu&top=shortHairTheCaesar',
  },
  {
    id: 'user-12',
    name: 'Nicole Tan',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=nicole&top=longHairCurly',
  },
  {
    id: 'user-13',
    name: 'Jason Ma',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jason&top=shortHairShortRound',
  },
  {
    id: 'user-14',
    name: 'Cathy Luo',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=cathy&top=longHairNotTooLong',
  },
  {
    id: 'user-15',
    name: 'Steve Zhou',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=steve&top=shortHairDreads01',
  },
  {
    id: 'user-16',
    name: 'Mia He',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=miahe&top=longHairFrida',
  },
  {
    id: 'user-17',
    name: 'Eric Sun',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=ericsun&top=shortHairTheCaesarSidePart',
  },
  {
    id: 'user-18',
    name: 'Olivia Feng',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=oliviafeng&top=longHairCurvy',
  },
  {
    id: 'user-19',
    name: 'Chris Gao',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=chris&top=shortHairShortFlat',
  },
  {
    id: 'user-20',
    name: 'Tina Ye',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tina&top=longHairStraight2',
  },
  {
    id: 'user-21',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=marcus&top=shortHairSides',
  },
  {
    id: 'user-22',
    name: 'Sophia Kim',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sophiakim&top=longHairBigHair',
  },
  {
    id: 'user-23',
    name: 'Daniel Park',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=daniel&top=shortHairShortWaved',
  },
  {
    id: 'user-24',
    name: 'Rachel Green',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=rachel&top=longHairBob',
  },
  {
    id: 'user-25',
    name: 'Andrew Scott',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=andrew&top=shortHairShortCurly',
  },
  {
    id: 'user-26',
    name: 'Michelle Torres',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=michelle&top=longHairMiaWallace',
  },
  {
    id: 'user-27',
    name: 'Brandon Lee',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=brandon&top=shortHairFrizzle',
  },
  {
    id: 'user-28',
    name: 'Jessica Wang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessicawang&top=longHairStraightStrand',
  },
  {
    id: 'user-29',
    name: 'Tyler Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tyler&top=shortHairTheCaesar',
  },
  {
    id: 'user-30',
    name: 'Amanda Liu',
    avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amanda&top=longHairCurly',
  },
];

// ============================================================
// Helper Functions
// ============================================================

export const getUserById = (id: string): User | undefined =>
  UsersTable.find((u) => u.id === id);

export const getUsersByIds = (ids: string[]): User[] =>
  UsersTable.filter((u) => ids.includes(u.id));

export const getCanonicalUsers = (): User[] => UsersTable.slice(0, 10);

export const getExtendedUsers = (): User[] => UsersTable.slice(10);

export const getAllUsers = (): User[] => UsersTable;

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use UsersTable instead */
export const MOCK_USERS = UsersTable;

/** @deprecated Use getAllUsers instead */
export const getSprintAuthors = (): User[] => UsersTable;

// Re-export type for convenience
export type { User as MockUser };
