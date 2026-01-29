'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MockDB } from '@/infra/mock/core/MockDB';
import type { DBEvent } from '@/infra/mock/core/types';

interface DBContextValue {
  db: MockDB;
  isReady: boolean;
  refresh: () => void;
}

const DBContext = createContext<DBContextValue | null>(null);

interface DBProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that initializes and provides access to the MockDB
 */
export function DBProvider({ children }: DBProviderProps) {
  const [db] = useState(() => MockDB.getInstance());
  const [isReady, setIsReady] = useState(false);
  const [, forceUpdate] = useState({});

  // Initialize database on mount
  useEffect(() => {
    let mounted = true;

    db.initialize().then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [db]);

  // Subscribe to database events for reactivity
  useEffect(() => {
    const unsubscribe = db.subscribe((event: DBEvent) => {
      // Trigger re-render on any database change
      forceUpdate({});
    });

    return unsubscribe;
  }, [db]);

  // Manual refresh function
  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  const value: DBContextValue = {
    db,
    isReady,
    refresh,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

/**
 * Hook to access the database context
 */
export function useDBContext(): DBContextValue {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDBContext must be used within a DBProvider');
  }
  return context;
}

/**
 * Hook to get the MockDB instance
 * Returns null if not ready
 */
export function useDB(): MockDB | null {
  const { db, isReady } = useDBContext();
  return isReady ? db : null;
}

/**
 * Hook to check if database is ready
 */
export function useDBReady(): boolean {
  const { isReady } = useDBContext();
  return isReady;
}
