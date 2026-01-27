'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { getMembershipDisplay } from '@/features/auth/types';
import { LoginModal } from '@/features/auth/components/LoginModal';
import { Button } from '@/components/atoms';
import { CartIcon, CartDrawer } from '@/features/shop/components/cart';
import {
  MenuIcon,
  XIcon,
  ChevronRightIcon,
  BookOpenIcon,
  HeartIcon,
  LogoutIcon,
  FireIcon,
  SearchIcon,
  ShieldIcon,
} from '@/components/icons';
import { MissionPanel } from '@/features/mission';
import { UserAvatarDropdown } from '@/components/organisms/UserAvatarDropdown';
import { NotificationBell } from '@/features/space/components/Notifications';
import { HeaderSearch } from '@/components/organisms/HeaderSearch';
import { AdminMenu } from '@/features/admin/components/AdminMenu';
import { cn } from '@/lib/utils';
import { useKeyboardShortcuts } from '@/features/keyboard-shortcuts';

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
  const { isSearchOpen, openSearch, closeSearch } = useKeyboardShortcuts();

  const membership = getMembershipDisplay(identity);

  // Refs for calculating underline position relative to container (scroll-independent)
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number } | null>(null);

  // Calculate underline position relative to nav container (not viewport)
  const updateUnderlinePosition = useCallback(() => {
    const activeItem = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
    if (!activeItem || !navContainerRef.current) {
      setUnderlineStyle(null);
      return;
    }

    const navItemEl = navItemRefs.current.get(activeItem.href);
    if (!navItemEl) {
      setUnderlineStyle(null);
      return;
    }

    // Use offsetLeft/offsetWidth which are relative to offsetParent, not viewport
    // This makes the position independent of scroll state
    setUnderlineStyle({
      left: navItemEl.offsetLeft,
      width: navItemEl.offsetWidth,
    });
  }, [pathname]);

  // Update underline on pathname change and mount
  useEffect(() => {
    updateUnderlinePosition();
  }, [updateUnderlinePosition]);

  // Update on window resize
  useEffect(() => {
    window.addEventListener('resize', updateUnderlinePosition);
    return () => window.removeEventListener('resize', updateUnderlinePosition);
  }, [updateUnderlinePosition]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/50">
        {/* Full-width container with app gutter for consistent alignment with Learn page */}
        <div className="w-full" style={{ paddingLeft: 'var(--app-gutter)', paddingRight: 'var(--app-gutter)' }}>
          <div className="flex items-center justify-between h-18">
            {/* Left: Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/white nuva logo.png"
                  alt="nuva"
                  width={80}
                  height={32}
                  className="h-7 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div ref={navContainerRef} className="hidden md:flex items-center gap-8 relative">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={(el) => {
                      if (el) {
                        navItemRefs.current.set(item.href, el);
                      } else {
                        navItemRefs.current.delete(item.href);
                      }
                    }}
                    className="relative py-6 group"
                  >
                    <span
                      className={cn(
                        'text-base font-medium transition-all duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-neutral-500 group-hover:text-white'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              {/* Active underline indicator - positioned relative to container, not viewport */}
              {underlineStyle && (
                <motion.div
                  className="absolute bottom-0 h-0.5 bg-white"
                  initial={false}
                  animate={{
                    left: underlineStyle.left,
                    width: underlineStyle.width,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </div>

            {/* Right: User Area - Icon order: Search, Mission, Notification, Cart, Avatar/Login */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={openSearch}
                className="p-2 text-neutral-500 hover:text-white transition-colors"
                title="Search (⌘K)"
                aria-label="Open search (⌘K)"
              >
                <SearchIcon size="lg" />
              </button>
              <MissionPanel />
              <NotificationBell />
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
              className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <XIcon size="lg" />
              ) : (
                <MenuIcon size="lg" />
              )}
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
              <div className="px-4 py-4 space-y-2 bg-neutral-900">
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
                {/* Mission Link */}
                <Link
                  href="/mission"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                    pathname === '/mission'
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-white'
                  )}
                >
                  {pathname === '/mission' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                  )}
                  <FireIcon className="w-4 h-4" />
                  Missions
                </Link>
                <div className="pt-4 border-t border-neutral-800">
                  {user ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <Link
                        href="/member/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neutral-700">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-semibold">
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
                        <ChevronRightIcon size="md" className="text-neutral-500" />
                      </Link>

                      {/* Quick Links */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/member/courses"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm text-neutral-300"
                        >
                          <BookOpenIcon size="sm" />
                          My Courses
                        </Link>
                        <Link
                          href="/member/favorites"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm text-neutral-300"
                        >
                          <HeartIcon size="sm" />
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
                        <LogoutIcon size="sm" className="mr-2" />
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

      {/* Header Search Modal */}
      <HeaderSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </>
  );
}
