'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms';
import { useCart } from '@/features/shop/components/cart';
import type { EventProduct } from '@/features/shop/types';
import { formatDateShort, formatTime } from '@/lib/utils/date';

interface EventSidebarProps {
  event: EventProduct;
}

export function EventSidebar({ event }: EventSidebarProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(event.id);

  const handleAddToCart = () => {
    addToCart(event.id, 'event');
  };

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(event.id, 'event');
    }
    router.push('/checkout');
  };

  return (
    <div className="sticky top-24">
      <div className="bg-[var(--shop-card)] rounded-2xl border border-[var(--shop-border)] p-6">
        {/* Price */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-[var(--shop-text)]">
            {event.price === 0 ? 'Free' : `$${event.price.toLocaleString()}`}
          </span>
          <p className="text-sm text-[var(--shop-text-muted)] mt-1">
            per person
          </p>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          {/* Date */}
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[var(--shop-text-muted)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--shop-text)]">Date</p>
              <p className="text-sm text-[var(--shop-text-muted)]">
                {formatDateShort(event.date)}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[var(--shop-text-muted)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--shop-text)]">Time</p>
              <p className="text-sm text-[var(--shop-text-muted)]">
                {formatTime(event.date)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[var(--shop-text-muted)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--shop-text)]">Location</p>
              <p className="text-sm text-[var(--shop-text-muted)]">
                {event.location}
              </p>
            </div>
          </div>

          {/* Seats */}
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[var(--shop-text-muted)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--shop-text)]">Availability</p>
              <p className="text-sm text-[var(--shop-text-muted)]">
                {event.remainingSeats} of {event.capacity} seats remaining
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-[var(--shop-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{
                width: `${((event.capacity - event.remainingSeats) / event.capacity) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-[var(--shop-text-muted)] mt-1 text-center">
            {Math.round(((event.capacity - event.remainingSeats) / event.capacity) * 100)}% booked
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handleBuyNow}
            disabled={event.remainingSeats === 0}
          >
            {event.remainingSeats === 0 ? 'Sold Out' : 'Buy Ticket'}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleAddToCart}
            disabled={inCart || event.remainingSeats === 0}
          >
            {inCart ? 'Added to Cart' : 'Add to Cart'}
          </Button>
        </div>

        {/* Guarantee */}
        <p className="text-xs text-center text-[var(--shop-text-muted)] mt-4">
          30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
