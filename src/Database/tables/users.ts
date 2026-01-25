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
    avatar: 'https://avatar.iran.liara.run/public/boy?username=alex',
    identity: 'solo-traveler',
  },
  {
    id: 'user-2',
    name: 'Sarah Lin',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=sarah',
    identity: 'duo-run',
  },
  {
    id: 'user-3',
    name: 'Mike Wang',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=mike',
    identity: 'solo-traveler',
  },
  {
    id: 'user-4',
    name: 'Emily Huang',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=emily',
    identity: 'duo-fly',
  },
  {
    id: 'user-5',
    name: 'Kevin Lee',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=kevin',
    identity: 'explorer',
  },
  {
    id: 'user-6',
    name: 'Jessica Wu',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=jessica',
    identity: 'duo-go',
  },
  {
    id: 'user-7',
    name: 'David Zhang',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=david',
    identity: 'explorer',
  },
  {
    id: 'user-8',
    name: 'Lisa Chen',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=lisa',
    identity: 'duo-go',
  },
  {
    id: 'user-9',
    name: 'Tom Huang',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=tom',
    identity: 'solo-traveler',
  },
  {
    id: 'user-10',
    name: 'Amy Lin',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=amy',
    identity: 'duo-fly',
  },
  // Extended users (11-30) - used in sprint projects
  {
    id: 'user-11',
    name: 'Ryan Xu',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=ryanxu',
  },
  {
    id: 'user-12',
    name: 'Nicole Tan',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=nicole',
  },
  {
    id: 'user-13',
    name: 'Jason Ma',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=jason',
  },
  {
    id: 'user-14',
    name: 'Cathy Luo',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=cathy',
  },
  {
    id: 'user-15',
    name: 'Steve Zhou',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=steve',
  },
  {
    id: 'user-16',
    name: 'Mia He',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=miahe',
  },
  {
    id: 'user-17',
    name: 'Eric Sun',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=ericsun',
  },
  {
    id: 'user-18',
    name: 'Olivia Feng',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=oliviafeng',
  },
  {
    id: 'user-19',
    name: 'Chris Gao',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=chris',
  },
  {
    id: 'user-20',
    name: 'Tina Ye',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=tina',
  },
  {
    id: 'user-21',
    name: 'Marcus Johnson',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=marcus',
  },
  {
    id: 'user-22',
    name: 'Sophia Kim',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=sophiakim',
  },
  {
    id: 'user-23',
    name: 'Daniel Park',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=daniel',
  },
  {
    id: 'user-24',
    name: 'Rachel Green',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=rachel',
  },
  {
    id: 'user-25',
    name: 'Andrew Scott',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=andrew',
  },
  {
    id: 'user-26',
    name: 'Michelle Torres',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=michelle',
  },
  {
    id: 'user-27',
    name: 'Brandon Lee',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=brandon',
  },
  {
    id: 'user-28',
    name: 'Jessica Wang',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=jessicawang',
  },
  {
    id: 'user-29',
    name: 'Tyler Chen',
    avatar: 'https://avatar.iran.liara.run/public/boy?username=tyler',
  },
  {
    id: 'user-30',
    name: 'Amanda Liu',
    avatar: 'https://avatar.iran.liara.run/public/girl?username=amanda',
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
