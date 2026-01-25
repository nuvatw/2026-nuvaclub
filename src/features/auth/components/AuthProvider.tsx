'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { IdentityType, User, UserRole } from '@/features/auth/types';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  type Permission,
} from '@/features/auth/permissions';
import { useDBContext } from '@/lib/db';
import {
  TEST_ACCOUNTS,
  type TestAccount,
} from '@/features/auth/data/test-accounts';

// Re-export for backwards compatibility
export { TEST_ACCOUNTS, TEST_ACCOUNT_TO_USER_ID, getEffectiveUserId } from '@/features/auth/data/test-accounts';
export type { TestAccount } from '@/features/auth/data/test-accounts';

interface AuthContextType {
  user: User | null;
  identity: IdentityType;
  isAdmin: boolean;
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

  // Compute isAdmin from user role
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Load user from test account or database when account changes
  useEffect(() => {
    if (currentAccountId === 'test-guest') {
      setUser(null);
      setIdentityState('guest');
      return;
    }

    // For test accounts (IDs starting with 'test-'), use TestAccount data directly
    const testAccount = TEST_ACCOUNTS.find((a) => a.id === currentAccountId);
    if (testAccount && testAccount.id.startsWith('test-')) {
      if (testAccount.identity === 'guest') {
        setUser(null);
        setIdentityState('guest');
      } else {
        const testUser: User = {
          id: testAccount.id,
          name: testAccount.name,
          email: `${testAccount.id}@nuvaclub.test`,
          identity: testAccount.identity,
          role: 'user', // Test accounts are regular users by default
          createdAt: new Date(),
        };
        setUser(testUser);
        setIdentityState(testAccount.identity);
      }
      return;
    }

    // For database-backed users, load from DB
    if (!isReady || !db) return;

    if (currentAccountId === 'guest') {
      setUser(null);
      setIdentityState('guest');
      return;
    }

    const userRecord = db.users.findById(currentAccountId);
    if (userRecord) {
      const mappedIdentity = userRecord.identityType as IdentityType;

      const mappedUser: User = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        avatar: userRecord.avatar,
        identity: mappedIdentity,
        role: 'user',
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
      switchAccount('test-explorer-solo-1');
    },
    [switchAccount]
  );

  const logout = useCallback(() => {
    switchAccount('test-guest');
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
        isAdmin,
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
