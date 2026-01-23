'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Card, CardContent } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { MyNunuSection, MyVavaSection } from '@/features/space/components/MySpaceSection';
import { MatchingBoardSection } from '@/features/space/components/MatchingBoard';
import { PageTransition } from '@/components/molecules/PageTransition';
import { SpacePageSkeleton, SpaceLockedSkeleton } from '@/components/skeletons';

export default function SpacePage() {
  const { identity, user } = useAuth();

  // Space is now open to all logged-in users (Explorer+)
  const isLoggedIn = identity !== 'guest';

  // Guest users see login prompt
  if (!isLoggedIn) {
    return (
      <PageTransition skeleton={<SpaceLockedSkeleton />} minLoadTime={100}>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              {/* Marketplace Hero */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Space Marketplace</h1>
              <p className="text-neutral-400 max-w-md mx-auto mb-8">
                Connect with learning companions. Find a Nunu mentor to guide your journey,
                or offer your expertise as a mentor to help others grow.
              </p>

              <Card className="max-w-lg mx-auto">
                <CardContent>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    How It Works
                  </h2>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">Browse the Marketplace</div>
                        <div className="text-sm text-neutral-400">Find Nunu mentors or Vava learners looking to connect</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/50">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">Set Your Own Price</div>
                        <div className="text-sm text-neutral-400">Nunus set monthly rates, Vavas set their budget</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/50">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">Purchase & Connect</div>
                        <div className="text-sm text-neutral-400">Buy mentorship directly from Nunu posts</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-800">
                    <p className="text-sm text-neutral-500 mb-4 text-center">
                      Sign in to access the marketplace
                    </p>
                    <Button className="w-full">Sign In to Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition skeleton={<SpacePageSkeleton />} minLoadTime={150}>
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Space Marketplace</h1>
                <p className="text-neutral-400">
                  Find mentors, connect with learners, grow together
                </p>
              </div>
              <Link href="/member/space">
                <Button variant="secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Space
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20 p-4">
              <div className="text-2xl font-bold text-amber-400 mb-1">Find Nunu</div>
              <p className="text-sm text-neutral-400">Browse mentor posts</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20 p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">Find Vava</div>
              <p className="text-sm text-neutral-400">Find learners to guide</p>
            </div>
            <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-xl border border-primary-500/20 p-4">
              <div className="text-2xl font-bold text-primary-400 mb-1">Direct Pay</div>
              <p className="text-sm text-neutral-400">Instant transactions</p>
            </div>
          </motion.div>

          {/* Section 1: My Nunu (only if user has one) */}
          <MyNunuSection onNavigateToMatchingBoard={() => {}} />

          {/* Section 2: My Vava (only if user is a Nunu) */}
          <MyVavaSection onNavigateToMatchingBoard={() => {}} />

          {/* Section 3: Matching Board (Main Marketplace) */}
          <MatchingBoardSection />
        </div>
      </div>
    </PageTransition>
  );
}
