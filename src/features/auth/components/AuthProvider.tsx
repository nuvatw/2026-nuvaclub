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
 */
export interface TestAccount {
  id: string;
  name: string;
  description: string;
  identity: IdentityType;
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
    id: 'user-6',
    name: 'Jessica Wu',
    description: 'Duo Go - Engaged learner',
    identity: 'duo-go',
  },
  {
    id: 'user-8',
    name: 'Lisa Chen',
    description: 'Duo Go - Active participant',
    identity: 'duo-go',
  },
  {
    id: 'user-2',
    name: 'Sarah Lin',
    description: 'Duo Run - Power user, mentor',
    identity: 'duo-run',
  },
  {
    id: 'user-4',
    name: 'Emily Huang',
    description: 'Duo Fly - Premium user, content creator',
    identity: 'duo-fly',
  },
  {
    id: 'user-10',
    name: 'Amy Lin',
    description: 'Duo Fly - Expert mentor',
    identity: 'duo-fly',
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
      // Get duo ticket if exists
      const ticketRecord = db.duoTickets.findFirst({
        where: { userId: currentAccountId, status: 'active' },
      });

      const mappedUser: User = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        avatar: userRecord.avatar,
        identity: userRecord.identityType as IdentityType,
        duoTicket: ticketRecord
          ? {
              type: ticketRecord.ticketType as 'go' | 'run' | 'fly',
              validFrom: ticketRecord.validFrom,
              validUntil: ticketRecord.validUntil,
              isActive: ticketRecord.status === 'active',
            }
          : undefined,
        createdAt: userRecord.createdAt,
      };

      setUser(mappedUser);
      setIdentityState(userRecord.identityType as IdentityType);
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
