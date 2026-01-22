'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface LockedPostCardProps {
  postType: 'verified-nunu';
}

export function LockedPostCard({ postType }: LockedPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative p-4 rounded-xl overflow-hidden',
        'bg-neutral-900 border border-neutral-800'
      )}
    >
      {/* Blurred Content Preview */}
      <div className="blur-sm pointer-events-none">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-600/20 text-purple-400">
              Verified Nunu
            </span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Exclusive content from verified mentors...
        </h3>
        <p className="text-sm text-neutral-400 mb-3">
          This content is only available for Duo Run or Duo Fly subscribers...
        </p>
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-400">
            AI Strategy
          </span>
          <span className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-400">
            Business
          </span>
        </div>
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400"
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

          <h4 className="text-lg font-semibold text-white mb-2">Verified Nunu Content</h4>
          <p className="text-sm text-neutral-400 mb-4 max-w-xs">
            Upgrade to Duo Run or Duo Fly to access verified Nunu posts and exclusive matching opportunities
          </p>

          <div className="flex flex-col gap-2">
            <Link href="/shop?category=duo">
              <Button className="w-full">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                Upgrade Now
              </Button>
            </Link>
            <div className="flex justify-center gap-2 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Badge variant="default" size="sm" className="bg-purple-600/20 text-purple-400">
                  Run
                </Badge>
                Certified Nunu
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="default" size="sm" className="bg-amber-600/20 text-amber-400">
                  Fly
                </Badge>
                1:1 with Shangzhe
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
