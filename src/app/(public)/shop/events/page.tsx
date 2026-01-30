'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Button, Badge } from '@/components/atoms';
import { Gate } from '@/features/auth/components/Gate';
import { useEvents } from '@/features/shop/hooks/useShopData';
import {
  formatMonthYear,
  formatDayOfWeek,
  formatDayNumber,
  formatTime,
  getMonthKey,
} from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LocationIcon,
  ClockIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@/components/icons';
import type { EventProduct } from '@/features/shop/types';

// Constants
const PAGE_SIZE = 10;

// Filter options
const EVENT_TYPE_OPTIONS: { value: 'all' | 'in-person' | 'online'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-person', label: 'Offline' },
  { value: 'online', label: 'Online' },
];

// Category info for Events
const EVENT_INFO = {
  introduction: {
    title: 'About Events & Workshops',
    description: 'Join our community gatherings, hands-on workshops, and exclusive courses led by industry experts. In-person events offer intensive learning in Taipei, while online webinars let you join from anywhere with replays available.',
  },
  faq: [
    { question: 'Are events recorded?', answer: 'Online events are recorded and available for replay. In-person workshops are not recorded.' },
    { question: 'Can I get a refund if I can\'t attend?', answer: 'Refunds are available up to 7 days before the event. After that, you can transfer your ticket.' },
    { question: 'Do I need any prerequisites?', answer: 'Each event has its own requirements listed on the event page. Most are beginner-friendly.' },
  ],
};

// Month Header Component
function MonthHeader({ monthKey }: { monthKey: string }) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  const formatted = formatMonthYear(date);

  return (
    <div className="py-4 border-b border-neutral-800">
      <h2 className="text-lg font-semibold text-white">{formatted}</h2>
    </div>
  );
}

// Event List Row Component
function EventListRow({ event, index }: { event: EventProduct; index: number }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop/events/${event.id}`);
  };

  // Format price display
  const priceDisplay = useMemo(() => {
    if (event.price === 0) return 'Free';
    if (event.remainingSeats === 0) return 'Sold out';
    return `NT$${event.price.toLocaleString()}`;
  }, [event.price, event.remainingSeats]);

  const isSoldOut = event.remainingSeats === 0;
  const isFree = event.price === 0;

  // Format time range
  const timeDisplay = useMemo(() => {
    const start = formatTime(event.date);
    if (event.endDate) {
      const end = formatTime(event.endDate);
      return `${start} - ${end}`;
    }
    return start;
  }, [event.date, event.endDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={handleClick}
      className={cn(
        'group cursor-pointer py-4 border-b border-neutral-800/50',
        'hover:bg-neutral-800/30 transition-colors -mx-4 px-4'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View details for ${event.name}`}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Image on top for mobile */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-neutral-700">
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge variant={event.eventType === 'online' ? 'info' : 'default'} className="text-xs">
              {event.eventType === 'online' ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>

        {/* Date and content */}
        <div className="flex gap-3">
          {/* Date marker */}
          <div className="flex-shrink-0 w-12 text-center">
            <div className="text-xs text-neutral-500 uppercase">
              {formatDayOfWeek(event.date)}
            </div>
            <div className="text-2xl font-bold text-white">
              {formatDayNumber(event.date)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-primary-400 transition-colors">
              {event.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-400 mb-2">
              <span className="flex items-center gap-1">
                <ClockIcon size="sm" className="w-3.5 h-3.5" />
                {timeDisplay}
              </span>
              <span className="flex items-center gap-1">
                <LocationIcon size="sm" className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{event.location}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'text-lg font-bold',
                  isSoldOut ? 'text-neutral-500' : isFree ? 'text-green-400' : 'text-white'
                )}
              >
                {priceDisplay}
              </span>
              <Gate
                permission="shop:purchase"
                fallback={
                  <Button size="sm" variant="secondary" disabled>
                    Log in
                  </Button>
                }
              >
                <Button size="sm" disabled={isSoldOut}>
                  {isSoldOut ? 'Sold out' : 'Buy Ticket'}
                </Button>
              </Gate>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - 3 columns: Date | Content | Image */}
      <div className="hidden md:grid md:grid-cols-[80px_1fr_180px] gap-4 items-center">
        {/* Date Column */}
        <div className="text-center">
          <div className="text-xs text-neutral-500 uppercase tracking-wide">
            {formatDayOfWeek(event.date)}
          </div>
          <div className="text-3xl font-bold text-white">
            {formatDayNumber(event.date)}
          </div>
        </div>

        {/* Content Column */}
        <div className="min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="font-semibold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
              {event.name}
            </h3>
            <Badge
              variant={event.eventType === 'online' ? 'info' : 'default'}
              className="flex-shrink-0 text-xs"
            >
              {event.eventType === 'online' ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <p className="text-sm text-neutral-400 line-clamp-1 mb-2">
            {event.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ClockIcon size="sm" className="w-4 h-4" />
              {timeDisplay}
            </span>
            <span className="flex items-center gap-1.5">
              <LocationIcon size="sm" className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{event.location}</span>
            </span>
            <span
              className={cn(
                'font-semibold',
                isSoldOut ? 'text-neutral-500' : isFree ? 'text-green-400' : 'text-white'
              )}
            >
              {priceDisplay}
            </span>
          </div>
        </div>

        {/* Image Column */}
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {event.remainingSeats <= 10 && event.remainingSeats > 0 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="error" className="text-xs">
                {event.remainingSeats} left
              </Badge>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showAround = 1; // Show 1 page before and after current

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    // Add pages around current
    for (
      let i = Math.max(2, currentPage - showAround);
      i <= Math.min(totalPages - 1, currentPage + showAround);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8"
      aria-label="Event list pagination"
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="px-2"
      >
        <ChevronLeftIcon size="sm" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-neutral-500"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              )}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="px-2"
      >
        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
        <ChevronRightIcon size="sm" />
      </Button>
    </nav>
  );
}

export default function EventsPage() {
  const { items: MOCK_EVENTS, loading } = useEvents();
  const [eventType, setEventType] = useState<'all' | 'in-person' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort events (always sorted by date ascending - chronological)
  const filteredEvents = useMemo(() => {
    let events = [...MOCK_EVENTS];

    // Filter by event type
    if (eventType !== 'all') {
      events = events.filter((e) => e.eventType === eventType);
    }

    // Search by query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.name.toLowerCase().includes(lowerQuery) ||
          e.description.toLowerCase().includes(lowerQuery) ||
          e.location.toLowerCase().includes(lowerQuery)
      );
    }

    // Always sort by date ascending (earliest first - chronological order)
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [eventType, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);

  // Get current page events
  const currentPageEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  // Handle filter change - reset to page 1
  const handleFilterChange = (type: 'all' | 'in-person' | 'online') => {
    setEventType(type);
    setCurrentPage(1);
  };

  // Handle search change - reset to page 1
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Group events by month for rendering with headers
  const eventsWithMonthHeaders = useMemo(() => {
    const result: { type: 'header' | 'event'; data: string | EventProduct }[] = [];
    let lastMonthKey = '';

    currentPageEvents.forEach((event) => {
      const monthKey = getMonthKey(event.date);
      if (monthKey !== lastMonthKey) {
        result.push({ type: 'header', data: monthKey });
        lastMonthKey = monthKey;
      }
      result.push({ type: 'event', data: event });
    });

    return result;
  }, [currentPageEvents]);

  if (loading) return <div className="p-8 text-center text-neutral-500">Loading events...</div>;

  return (
    <div className="rounded-2xl p-6 md:p-8 border border-neutral-700 bg-neutral-800/30">
      {/* Event List Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Event Tickets</h2>
          <p className="text-neutral-400 text-sm mb-4">
            Join nuvaClub in-person and online events, connect with community members
          </p>

          {/* Search and Filters */}
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                aria-label="Search events"
              />
            </div>

            {/* Filter Controls - Only All / Offline / Online */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Type:</span>
              <div
                className="flex gap-1 bg-neutral-800/50 rounded-full p-0.5"
                role="radiogroup"
                aria-label="Filter by event type"
              >
                {EVENT_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      eventType === option.value
                        ? 'bg-neutral-700 text-white'
                        : 'text-neutral-400 hover:text-white'
                    )}
                    role="radio"
                    aria-checked={eventType === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-4 text-sm text-neutral-500">
          {filteredEvents.length === 0 ? (
            'No events found'
          ) : (
            <>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filteredEvents.length)} of{' '}
              {filteredEvents.length} events
            </>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-neutral-400 text-lg">No events found</p>
            <p className="text-neutral-500 text-sm mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <>
            {/* Event List with Month Headers */}
            <div className="divide-y divide-neutral-800/50">
              {eventsWithMonthHeaders.map((item, index) =>
                item.type === 'header' ? (
                  <MonthHeader key={`header-${item.data}`} monthKey={item.data as string} />
                ) : (
                  <EventListRow
                    key={(item.data as EventProduct).id}
                    event={item.data as EventProduct}
                    index={index}
                  />
                )
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Introduction Section */}
      <div className="mb-8 bg-neutral-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <InformationCircleIcon size="md" className="text-neutral-400" />
          {EVENT_INFO.introduction.title}
        </h3>
        <p className="text-neutral-400 leading-relaxed">
          {EVENT_INFO.introduction.description}
        </p>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <QuestionMarkCircleIcon size="md" className="text-neutral-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {EVENT_INFO.faq.map((item, index) => (
            <div key={index} className="bg-neutral-800/50 rounded-xl p-4">
              <h4 className="font-medium text-white mb-1">{item.question}</h4>
              <p className="text-sm text-neutral-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
