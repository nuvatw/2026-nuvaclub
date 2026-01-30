'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { Course } from '@/features/learn/types';

export interface LearnSection {
  id: string;
  title: string;
  courses: Course[];
  href?: string;
  order: number;
}

/**
 * Hook for building Learn page sections.
 * 
 * This is now a "thin" hook that fetches data from the BFF,
 * removing business logic from the UI layer.
 */
export function useLearnSections() {
  const { currentAccountId } = useAuth();
  const userId = currentAccountId !== 'guest' ? currentAccountId : 'user-1';

  const [data, setData] = useState<{ heroCourse?: Course; sections: LearnSection[] }>({ sections: [] });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/bff/learn/sections?userId=${userId}`)
      .then(res => res.json())
      .then(result => {
        if (mounted) {
          setData(result);
          setIsReady(true);
        }
      })
      .catch(err => {
        console.error('Failed to fetch learn sections', err);
        if (mounted) setIsReady(true);
      });
    return () => { mounted = false; };
  }, [userId]);

  return {
    sections: data.sections,
    heroCourse: data.heroCourse,
    isHydrated: isReady,
  };
}
