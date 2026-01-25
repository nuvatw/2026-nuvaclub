'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';

/**
 * AdminThemeProvider - Applies light mode theme when admin is logged in.
 * This helps distinguish between:
 * - Player mode (Nunu/Vava) - dark theme
 * - Guardian mode (Admin) - light theme
 */
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();

  // Apply/remove admin theme class on body
  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.add('admin-theme');
      document.body.classList.add('admin-theme');
    } else {
      document.documentElement.classList.remove('admin-theme');
      document.body.classList.remove('admin-theme');
    }

    return () => {
      document.documentElement.classList.remove('admin-theme');
      document.body.classList.remove('admin-theme');
    };
  }, [isAdmin]);

  return <>{children}</>;
}
