'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { ShieldIcon, SpinnerIcon } from '@/components/icons';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be ready
    if (isLoading) return;

    // Redirect non-admins to home
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <SpinnerIcon size="lg" className="text-amber-400" />
      </div>
    );
  }

  // Don't render content for non-admins
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <ShieldIcon size="lg" className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Access Denied</h1>
          <p className="text-neutral-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      {/* Admin header bar */}
      <div className="border-b border-amber-600/30 bg-amber-600/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 text-amber-400">
            <ShieldIcon size="sm" />
            <span className="text-sm font-medium">Admin Panel</span>
            <span className="text-amber-400/60 text-sm">|</span>
            <span className="text-sm text-amber-400/80">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Admin content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
