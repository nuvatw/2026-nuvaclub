'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { MySpaceSection } from '@/features/space/components/MySpaceSection';
import { MatchingBoardSection } from '@/features/space/components/MatchingBoard';
import { PageTransition } from '@/components/molecules/PageTransition';
import { SpacePageSkeleton, SpaceLockedSkeleton } from '@/components/skeletons';

export default function SpacePage() {
  const { identity, hasPermission } = useAuth();

  const canEnterSpace = hasPermission('space:enter');

  // Locked screen for non-Duo users
  if (!canEnterSpace) {
    return (
      <PageTransition skeleton={<SpaceLockedSkeleton />} minLoadTime={100}>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-800 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Space</h1>
            <p className="text-neutral-400 max-w-md mx-auto mb-8">
              Space is a place for matching and companionship. Purchase a Duo Ticket to enter Space and find your partner.
            </p>

            <Card className="max-w-lg mx-auto">
              <CardContent>
                <h2 className="text-lg font-semibold text-white mb-4">
                  Duo Ticket Plans
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                        <span className="text-green-400 font-medium">Go</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">Monthly Pass</div>
                        <div className="text-sm text-neutral-400">Match with Nunu</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                        <span className="text-purple-400 font-medium">Run</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">Seasonal Pass</div>
                        <div className="text-sm text-neutral-400">Match with Certified Nunu</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                        <span className="text-amber-400 font-medium">Fly</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">Seasonal Pass</div>
                        <div className="text-sm text-neutral-400">Match with Shangzhe</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/shop?category=duo" className="block mt-6">
                  <Button className="w-full">Go to Purchase Duo Ticket</Button>
                </Link>
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
          <h1 className="text-3xl font-bold text-white mb-2">Space</h1>
          <p className="text-neutral-400">
            Find your partner and grow together
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800">
            <span className="text-sm text-neutral-400">Current status:</span>
            <Badge variant="primary">
              {identity === 'duo-go' && 'Go Monthly Pass'}
              {identity === 'duo-run' && 'Run Seasonal Pass'}
              {identity === 'duo-fly' && 'Fly Seasonal Pass'}
            </Badge>
          </div>
        </motion.div>

        {/* Section 1: My Space / Pairing Info */}
        <MySpaceSection />

        {/* Section 2: Matching Board */}
        <MatchingBoardSection />
      </div>
    </div>
    </PageTransition>
  );
}
