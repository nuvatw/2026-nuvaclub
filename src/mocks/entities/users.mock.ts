/**
 * Unified Users Mock Data
 *
 * Contains all user entities used across the application.
 * Users 1-10 are canonical community users (used in forum, progress, favorites)
 * Users 11-30 are extended users (used in sprint projects)
 */

export interface MockUser {
  id: string;
  name: string;
  avatar: string;
  identity?: 'explorer' | 'solo-traveler' | 'duo-go' | 'duo-run' | 'duo-fly';
}

export const MOCK_USERS: MockUser[] = [
  // Canonical users (1-10) - used across forum, progress, favorites
  { id: 'user-1', name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alex', identity: 'solo-traveler' },
  { id: 'user-2', name: 'Sarah Lin', avatar: 'https://i.pravatar.cc/150?u=sarah', identity: 'duo-run' },
  { id: 'user-3', name: 'Mike Wang', avatar: 'https://i.pravatar.cc/150?u=mike', identity: 'solo-traveler' },
  { id: 'user-4', name: 'Emily Huang', avatar: 'https://i.pravatar.cc/150?u=emily', identity: 'duo-fly' },
  { id: 'user-5', name: 'Kevin Lee', avatar: 'https://i.pravatar.cc/150?u=kevin', identity: 'explorer' },
  { id: 'user-6', name: 'Jessica Wu', avatar: 'https://i.pravatar.cc/150?u=jessica', identity: 'duo-go' },
  { id: 'user-7', name: 'David Zhang', avatar: 'https://i.pravatar.cc/150?u=david', identity: 'explorer' },
  { id: 'user-8', name: 'Lisa Chen', avatar: 'https://i.pravatar.cc/150?u=lisa', identity: 'duo-go' },
  { id: 'user-9', name: 'Tom Huang', avatar: 'https://i.pravatar.cc/150?u=tom', identity: 'solo-traveler' },
  { id: 'user-10', name: 'Amy Lin', avatar: 'https://i.pravatar.cc/150?u=amy', identity: 'duo-fly' },
  // Extended users (11-30) - used in sprint projects
  { id: 'user-11', name: 'Ryan Xu', avatar: 'https://i.pravatar.cc/150?u=ryan' },
  { id: 'user-12', name: 'Nicole Tan', avatar: 'https://i.pravatar.cc/150?u=nicole' },
  { id: 'user-13', name: 'Jason Ma', avatar: 'https://i.pravatar.cc/150?u=jason' },
  { id: 'user-14', name: 'Cathy Luo', avatar: 'https://i.pravatar.cc/150?u=cathy' },
  { id: 'user-15', name: 'Steve Zhou', avatar: 'https://i.pravatar.cc/150?u=steve' },
  { id: 'user-16', name: 'Mia He', avatar: 'https://i.pravatar.cc/150?u=mia' },
  { id: 'user-17', name: 'Eric Sun', avatar: 'https://i.pravatar.cc/150?u=eric' },
  { id: 'user-18', name: 'Olivia Feng', avatar: 'https://i.pravatar.cc/150?u=olivia' },
  { id: 'user-19', name: 'Chris Gao', avatar: 'https://i.pravatar.cc/150?u=chris' },
  { id: 'user-20', name: 'Tina Ye', avatar: 'https://i.pravatar.cc/150?u=tina' },
  { id: 'user-21', name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 'user-22', name: 'Sophia Kim', avatar: 'https://i.pravatar.cc/150?u=sophia' },
  { id: 'user-23', name: 'Daniel Park', avatar: 'https://i.pravatar.cc/150?u=daniel' },
  { id: 'user-24', name: 'Rachel Green', avatar: 'https://i.pravatar.cc/150?u=rachel' },
  { id: 'user-25', name: 'Andrew Scott', avatar: 'https://i.pravatar.cc/150?u=andrew' },
  { id: 'user-26', name: 'Michelle Torres', avatar: 'https://i.pravatar.cc/150?u=michelle' },
  { id: 'user-27', name: 'Brandon Lee', avatar: 'https://i.pravatar.cc/150?u=brandon' },
  { id: 'user-28', name: 'Jessica Wang', avatar: 'https://i.pravatar.cc/150?u=jessica2' },
  { id: 'user-29', name: 'Tyler Chen', avatar: 'https://i.pravatar.cc/150?u=tyler' },
  { id: 'user-30', name: 'Amanda Liu', avatar: 'https://i.pravatar.cc/150?u=amanda' },
];

// Helper functions
export const getCanonicalUsers = (): MockUser[] => MOCK_USERS.slice(0, 10);

export const getSprintAuthors = (): MockUser[] => MOCK_USERS;

export const getUserById = (id: string): MockUser | undefined =>
  MOCK_USERS.find((u) => u.id === id);

export const getUsersByIds = (ids: string[]): MockUser[] =>
  MOCK_USERS.filter((u) => ids.includes(u.id));
