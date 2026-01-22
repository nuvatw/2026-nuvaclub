'use client';

import Link from 'next/link';
import { PlanComparisonSection } from '@/features/shop/components';
import { PageTransition } from '@/components/molecules/PageTransition';

export default function PlanPage() {
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
              <span className="text-[var(--shop-text)]">Plan</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-900/20 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Subscription Plans
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Choose the plan that fits your learning journey. Start free with Explorer or unlock everything with Traveler.
            </p>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PlanComparisonSection />
        </div>

        {/* FAQ Section */}
        <div className="border-t border-[var(--shop-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">What&apos;s included in the Explorer plan?</h3>
                <p className="text-neutral-400 text-sm">
                  Explorer is our free tier that gives you access to basic learning materials, community forums, and limited course content. Perfect for getting started on your journey.
                </p>
              </div>
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">Can I upgrade from Explorer to Traveler anytime?</h3>
                <p className="text-neutral-400 text-sm">
                  Yes! You can upgrade to Traveler at any time. Your learning progress will be preserved, and you&apos;ll instantly gain access to all premium features.
                </p>
              </div>
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">Is there a refund policy?</h3>
                <p className="text-neutral-400 text-sm">
                  We offer a 14-day money-back guarantee for Traveler subscriptions. If you&apos;re not satisfied, contact our support team for a full refund.
                </p>
              </div>
              <div className="bg-[var(--shop-card)] rounded-xl border border-[var(--shop-border)] p-6">
                <h3 className="font-semibold text-white mb-2">What payment methods are accepted?</h3>
                <p className="text-neutral-400 text-sm">
                  We accept credit/debit cards (Visa, Mastercard, JCB) and ATM bank transfer. All prices are in NT$ (New Taiwan Dollar).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
