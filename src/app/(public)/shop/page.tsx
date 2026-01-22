'use client';

import { Suspense, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  VideoHero,
  ShopHeader,
  RecommendationsCarousel,
} from '@/features/shop/components';
import { getAllShopProducts } from '@/features/shop/data/products';
import type { ShopProduct } from '@/features/shop/types';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ShopPageSkeleton } from '@/components/skeletons';

// Category card data
const CATEGORIES = [
  {
    id: 'plan',
    title: 'Plan',
    description: 'Subscription plans for your journey - Explorer & Traveler',
    href: '/shop/plan',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'duo',
    title: 'Duo',
    description: 'Share your journey with a partner - Go, Run & Fly',
    href: '/shop/duo',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'event',
    title: 'Event',
    description: 'Workshops, courses & community gatherings',
    href: '/shop/events',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'merchandise',
    title: 'Merchandise',
    description: 'Official Nuva gear & exclusive items',
    href: '/shop/merchandise',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-600',
  },
];

function CategoryCard({
  title,
  description,
  href,
  icon,
  gradient,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-[var(--shop-card)] border border-[var(--shop-border)] p-6 transition-all duration-300 hover:border-transparent hover:shadow-xl hover:-translate-y-1"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-[var(--shop-text)] mb-2 group-hover:text-primary-500 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[var(--shop-text-muted)] leading-relaxed">
        {description}
      </p>

      {/* Arrow */}
      <div className="mt-4 flex items-center text-primary-500 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Explore</span>
        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function ShopContent() {
  const router = useRouter();

  // Get all products
  const allProducts = useMemo(() => getAllShopProducts(), []);

  // Get recommendations (random selection from different categories)
  const recommendations = useMemo(() => {
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, [allProducts]);

  // Handle buy now
  const handleBuyNow = useCallback(
    (product: ShopProduct) => {
      router.push('/checkout');
    },
    [router]
  );

  return (
    <>
      {/* Header */}
      <ShopHeader tagline="Give All You Need" />

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              href={category.href}
              icon={category.icon}
              gradient={category.gradient}
            />
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="border-t border-[var(--shop-border)] bg-[var(--shop-bg)]">
        <div className="max-w-7xl mx-auto">
          <RecommendationsCarousel
            title="Recommend for you"
            products={recommendations}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>
    </>
  );
}

function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[var(--shop-card)] rounded-2xl border border-[var(--shop-border)] p-6 animate-pulse"
          >
            <div className="w-14 h-14 bg-[var(--shop-border)] rounded-xl mb-4" />
            <div className="h-6 bg-[var(--shop-border)] rounded w-24 mb-2" />
            <div className="h-4 bg-[var(--shop-border)] rounded w-full" />
            <div className="h-4 bg-[var(--shop-border)] rounded w-3/4 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <PageTransition skeleton={<ShopPageSkeleton />}>
      <div className="shop-page min-h-screen bg-[var(--shop-bg)]">
        {/* Hero Video Section */}
        <VideoHero videoId="dLRdaUda8Ho" />

        {/* Shop Content with Suspense */}
        <Suspense fallback={<ShopLoading />}>
          <ShopContent />
        </Suspense>
      </div>
    </PageTransition>
  );
}
