'use client';

import Link from 'next/link';
import { DuoComparisonSection } from '@/features/shop/components';
import { PageTransition } from '@/components/molecules/PageTransition';

export default function DuoPage() {
  return (
    <PageTransition skeleton={<div className="min-h-screen bg-neutral-900 animate-pulse" />}>
      <div className="min-h-screen bg-[var(--shop-bg)]">
        {/* Breadcrumb */}
        <div className="bg-[var(--shop-card)] border-b border-[var(--shop-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/shop" className="text-[var(--shop-text-muted)] hover:text-primary-500 transition-colors">
                Shop
              </Link>
              <span className="text-[var(--shop-text-muted)]">/</span>
              <span className="text-[var(--shop-text)]">Duo</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-purple-900/20 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Duo Membership
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Share your learning journey with a partner. Choose from Go, Run, or Fly to match with different companion types.
            </p>
          </div>
        </div>

        {/* Duo Comparison */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DuoComparisonSection />
        </div>

        {/* How It Works Section */}
        <div className="border-t border-[var(--shop-border)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">How Duo Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-600/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-400">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Choose Your Tier</h3>
                <p className="text-sm text-neutral-400">
                  Select Go, Run, or Fly based on your learning goals and budget.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-400">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Select Your Period</h3>
                <p className="text-sm text-neutral-400">
                  Pick specific months (Go) or quarters (Run/Fly) for your membership.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-600/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-amber-400">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Find Your Match</h3>
                <p className="text-sm text-neutral-400">
                  Enter Space to match with a Nunu companion for your journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-[var(--shop-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">What&apos;s the difference between Go, Run, and Fly?</h3>
                <p className="text-neutral-400 text-sm">
                  <strong className="text-green-400">Go</strong> is our monthly option for flexibility. <strong className="text-purple-400">Run</strong> is quarterly with enhanced features. <strong className="text-amber-400">Fly</strong> is our premium quarterly tier with exclusive access to founder sessions and certified Nunu matching.
                </p>
              </div>
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">Can I choose multiple periods at once?</h3>
                <p className="text-neutral-400 text-sm">
                  Yes! You can select multiple months (for Go) or quarters (for Run/Fly) during checkout. This gives you continuous access without needing to renew.
                </p>
              </div>
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">What is a Nunu?</h3>
                <p className="text-neutral-400 text-sm">
                  A Nunu is a learning companion/mentor in our community. Certified Nunus have completed additional training, and some tiers include access to sessions with our founder.
                </p>
              </div>
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">Can I upgrade my Duo tier?</h3>
                <p className="text-neutral-400 text-sm">
                  Yes, you can upgrade your tier at any time. Contact our support team or purchase a higher tier for upcoming periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
