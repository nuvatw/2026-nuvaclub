'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { getMembershipDisplay } from '@/features/auth/types';
import { LoginModal } from '@/features/auth/components/LoginModal';
import { Button } from '@/components/atoms';
import { CartIcon, CartDrawer } from '@/features/shop/components/cart';
import { BookIcon } from '@/components/icons';
import { UserAvatarDropdown } from '@/components/organisms/UserAvatarDropdown';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/learn', label: 'Learn' },
  { href: '/test', label: 'Test' },
  { href: '/forum', label: 'Forum' },
  { href: '/space', label: 'Space' },
  { href: '/sprint', label: 'Sprint' },
  { href: '/shop', label: 'Shop' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, identity, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const membership = getMembershipDisplay(identity);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">nuva</span>
              <span className="text-xl font-bold text-primary-500">Club</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative py-5 group"
                  >
                    <span
                      className={cn(
                        'text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-neutral-500 group-hover:text-white'
                      )}
                    >
                      {item.label}
                    </span>
                    {/* Active underline indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Area */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/document"
                className="p-2 text-neutral-500 hover:text-white transition-colors"
                title="Playbook"
              >
                <BookIcon className="w-5 h-5" />
              </Link>
              <CartIcon />
              {user ? (
                <UserAvatarDropdown />
              ) : (
                <Button size="sm" onClick={() => setLoginModalOpen(true)}>
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-800"
            >
              <div className="px-4 py-4 space-y-1 bg-neutral-900">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'relative block px-4 py-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'text-white'
                          : 'text-neutral-500 hover:text-white'
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
                {/* Playbook Link */}
                <Link
                  href="/document"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                    pathname === '/document'
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-white'
                  )}
                >
                  {pathname === '/document' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                  )}
                  <BookIcon className="w-4 h-4" />
                  Playbook
                </Link>
                <div className="pt-4 border-t border-neutral-800">
                  {user ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <Link
                        href="/member/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neutral-700">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{user.name}</p>
                          <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium text-white mt-0.5', membership.color)}>
                            {membership.label}
                          </span>
                        </div>
                        <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>

                      {/* Quick Links */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/member/courses"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm text-neutral-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          My Courses
                        </Link>
                        <Link
                          href="/member/favorites"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm text-neutral-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Favorites
                        </Link>
                      </div>

                      {/* Logout */}
                      <Button
                        variant="ghost"
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        setLoginModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <CartDrawer />
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
