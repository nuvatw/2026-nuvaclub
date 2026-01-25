'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { MyNunuSection, MyVavaSection, LockedMyNunuSection, LockedMyVavaSection } from '@/features/space/components/MySpaceSection';
import { MatchingBoardSection } from '@/features/space/components/MatchingBoard';
import { PageTransition } from '@/components/molecules/PageTransition';
import { SpacePageSkeleton } from '@/components/skeletons';

export default function SpacePage() {
  const { identity } = useAuth();

  // Space is now open to all users including guests
  const isLoggedIn = identity !== 'guest';

  return (
    <PageTransition skeleton={<SpacePageSkeleton />} minLoadTime={150}>
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section 1: My Nunu - locked for guests */}
          {isLoggedIn ? (
            <MyNunuSection onNavigateToMatchingBoard={() => {}} />
          ) : (
            <LockedMyNunuSection />
          )}

          {/* Section 2: My Vava - locked for guests */}
          {isLoggedIn ? (
            <MyVavaSection onNavigateToMatchingBoard={() => {}} />
          ) : (
            <LockedMyVavaSection />
          )}

          {/* Section 3: Matching Board (Main Marketplace) - always visible */}
          <MatchingBoardSection />
        </div>
      </div>
    </PageTransition>
  );
}
