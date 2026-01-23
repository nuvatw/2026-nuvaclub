'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { getMembershipDisplay } from '@/features/auth/types';
import { UserIcon, BookOpenIcon, HeartIcon, UsersIcon, SettingsIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const SIDEBAR_ITEMS = [
  {
    label: 'Profile',
    href: '/member/profile',
    icon: <UserIcon size="md" />,
  },
  {
    label: 'My Courses',
    href: '/member/courses',
    icon: <BookOpenIcon size="md" />,
  },
  {
    label: 'Favorites',
    href: '/member/favorites',
    icon: <HeartIcon size="md" />,
  },
  {
    label: 'My Space',
    href: '/member/space',
    icon: <UsersIcon size="md" />,
  },
  {
    label: 'Settings',
    href: '/member/settings',
    icon: <SettingsIcon size="md" />,
  },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, identity } = useAuth();
  const membership = getMembershipDisplay(identity);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Please Login</h1>
            <p className="text-neutral-400">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden sticky top-24">
              {/* User Card */}
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-neutral-700">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium text-white mt-1', membership.color)}>
                      {membership.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                      )}
                    >
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
