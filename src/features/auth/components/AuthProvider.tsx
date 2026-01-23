'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { IdentityType, User } from '@/features/auth/types';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  type Permission,
} from '@/features/auth/permissions';
import { useDBContext } from '@/lib/db';

/**
 * Test accounts available for selection
 * These map to the users seeded in the database
 *
 * Note: Duo identities have been removed in the marketplace model.
 * Space is now open to all logged-in users (Explorer+).
 */
export interface TestAccount {
  id: string;
  name: string;
  description: string;
  identity: IdentityType;
  isNunu?: boolean; // Whether this user is an approved Nunu
}

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    id: 'guest',
    name: 'Guest',
    description: 'Unauthenticated Guest',
    identity: 'guest',
  },
  {
    id: 'user-5',
    name: 'Kevin Lee',
    description: 'Explorer - New user, asking questions',
    identity: 'explorer',
  },
  {
    id: 'user-7',
    name: 'David Zhang',
    description: 'Explorer - Casual user',
    identity: 'explorer',
  },
  {
    id: 'user-6',
    name: 'Jessica Wu',
    description: 'Explorer - Engaged learner',
    identity: 'explorer',
  },
  {
    id: 'user-8',
    name: 'Lisa Chen',
    description: 'Explorer - Active participant',
    identity: 'explorer',
  },
  {
    id: 'user-1',
    name: 'Alex Chen',
    description: 'Solo Traveler - Active community member',
    identity: 'solo-traveler',
  },
  {
    id: 'user-3',
    name: 'Mike Wang',
    description: 'Solo Traveler - Experienced learner',
    identity: 'solo-traveler',
  },
  {
    id: 'user-2',
    name: 'Sarah Lin',
    description: 'Solo Traveler - Nunu Mentor (N4)',
    identity: 'solo-traveler',
    isNunu: true,
  },
  {
    id: 'user-4',
    name: 'Emily Huang',
    description: 'Solo Traveler - Nunu Mentor (N3)',
    identity: 'solo-traveler',
    isNunu: true,
  },
  {
    id: 'user-10',
    name: 'Amy Lin',
    description: 'Solo Traveler - Nunu Mentor (N2)',
    identity: 'solo-traveler',
    isNunu: true,
  },
];

interface AuthContextType {
  user: User | null;
  identity: IdentityType;
  isLoading: boolean;
  currentAccountId: string;
  testAccounts: TestAccount[];
  setIdentity: (identity: IdentityType) => void;
  switchAccount: (accountId: string) => void;
  login: (name?: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { db, isReady } = useDBContext();
  const [currentAccountId, setCurrentAccountId] = useState<string>('guest');
  const [user, setUser] = useState<User | null>(null);
  const [identity, setIdentityState] = useState<IdentityType>('guest');
  const [isLoading, setIsLoading] = useState(false);

  // Load user from database when account changes
  useEffect(() => {
    if (!isReady || !db) return;

    if (currentAccountId === 'guest') {
      setUser(null);
      setIdentityState('guest');
      return;
    }

    const userRecord = db.users.findById(currentAccountId);
    if (userRecord) {
      // Map the identity type, defaulting non-existent duo types to explorer
      let mappedIdentity = userRecord.identityType as IdentityType;
      if (!['guest', 'explorer', 'solo-traveler'].includes(mappedIdentity)) {
        // Legacy duo identities get mapped to solo-traveler
        mappedIdentity = 'solo-traveler';
      }

      const mappedUser: User = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        avatar: userRecord.avatar,
        identity: mappedIdentity,
        createdAt: userRecord.createdAt,
      };

      setUser(mappedUser);
      setIdentityState(mappedIdentity);
    }
  }, [currentAccountId, db, isReady]);

  const switchAccount = useCallback((accountId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentAccountId(accountId);
      setIsLoading(false);
    }, 300);
  }, []);

  const setIdentity = useCallback(
    (newIdentity: IdentityType) => {
      // Find the first account with this identity
      const account = TEST_ACCOUNTS.find((a) => a.identity === newIdentity);
      if (account) {
        switchAccount(account.id);
      }
    },
    [switchAccount]
  );

  const login = useCallback(
    (name?: string) => {
      // Default to first explorer account
      switchAccount('user-5');
    },
    [switchAccount]
  );

  const logout = useCallback(() => {
    switchAccount('guest');
  }, [switchAccount]);

  const checkPermission = useCallback(
    (permission: Permission) => hasPermission(identity, permission),
    [identity]
  );

  const checkAllPermissions = useCallback(
    (permissions: Permission[]) => hasAllPermissions(identity, permissions),
    [identity]
  );

  const checkAnyPermission = useCallback(
    (permissions: Permission[]) => hasAnyPermission(identity, permissions),
    [identity]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        identity,
        isLoading,
        currentAccountId,
        testAccounts: TEST_ACCOUNTS,
        setIdentity,
        switchAccount,
        login,
        logout,
        hasPermission: checkPermission,
        hasAllPermissions: checkAllPermissions,
        hasAnyPermission: checkAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
