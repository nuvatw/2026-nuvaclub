'use client';

import Image from 'next/image';
import { Badge } from '@/components/atoms';
import type { EventProduct } from '@/features/shop/types';
import { formatDateLong } from '@/lib/utils/date';

interface EventHeroProps {
  event: EventProduct;
}

export function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--shop-bg)] via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={event.eventType === 'online' ? 'primary' : 'default'}>
              {event.eventType === 'online' ? 'Online' : 'In-Person'}
            </Badge>
            {event.isLiveQA && (
              <Badge variant="warning">Live Q&A</Badge>
            )}
            {event.remainingSeats < 20 && (
              <Badge variant="error">
                Only {event.remainingSeats} seats left
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            {event.name}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateLong(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
