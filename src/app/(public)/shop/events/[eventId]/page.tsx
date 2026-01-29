'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  EventHero,
  EventOverview,
  EventAgenda,
  EventSidebar,
  EventFAQ,
} from '@/features/shop/components/events';
import { getEventById } from '@/lib/legacy-db-shim';
import { PageTransition } from '@/components/molecules/PageTransition';
import { EventDetailSkeleton } from '@/components/skeletons';

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = use(params);
  const event = getEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <PageTransition skeleton={<EventDetailSkeleton />}>
    <div className="shop-page min-h-screen bg-[var(--shop-bg)]">
      {/* Hero */}
      <EventHero event={event} />

      {/* Breadcrumb */}
      <div className="bg-[var(--shop-card)] border-b border-[var(--shop-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/shop"
              className="text-[var(--shop-text-muted)] hover:text-[var(--shop-text)] transition-colors"
            >
              Shop
            </Link>
            <span className="text-[var(--shop-text-muted)]">/</span>
            <Link
              href="/shop?category=event"
              className="text-[var(--shop-text-muted)] hover:text-[var(--shop-text)] transition-colors"
            >
              Events
            </Link>
            <span className="text-[var(--shop-text-muted)]">/</span>
            <span className="text-[var(--shop-text)]">{event.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview, What You'll Learn, Who It's For */}
            <EventOverview
              overview={event.overview}
              whatYouWillLearn={event.whatYouWillLearn}
              whoIsItFor={event.whoIsItFor}
            />

            {/* Agenda */}
            <EventAgenda agenda={event.agenda} />

            {/* FAQ */}
            {event.faqs && <EventFAQ faqs={event.faqs} />}
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="lg:col-span-1">
            <EventSidebar event={event} />
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
