/**
 * Events Table
 *
 * Contains all event products (workshops, meetups, webinars, AMA sessions).
 *
 * NOTE: This file re-exports from the existing mocks location during migration.
 * The data will be moved here in a future phase.
 */

export type EventType = 'online' | 'in-person';

export interface EventAgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface EventFAQItem {
  question: string;
  answer: string;
}

export interface EventProduct {
  id: string;
  type: 'event';
  eventType: EventType;
  isLiveQA?: boolean;
  name: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  price: number;
  capacity: number;
  remainingSeats: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  hotScore?: number;
  overview?: string;
  whatYouWillLearn?: string[];
  whoIsItFor?: string[];
  agenda?: EventAgendaItem[];
  faqs?: EventFAQItem[];
}

// Re-export from the existing mocks location
// This maintains backward compatibility during migration
export {
  MOCK_EVENTS,
  MOCK_EVENTS as EventsTable,
  EVENTS,
  getEventById,
  getUpcomingEvents,
  getEventsByType,
  getFreeEvents,
  getAvailableEvents,
  getPastEvents,
  getInPersonEvents,
  getOnlineEvents,
  getEventsSorted,
  searchAndFilterEvents,
} from '@/mocks/entities/events.mock';

export type { EventSortBy } from '@/mocks/entities/events.mock';

// Additional helpers
import { MOCK_EVENTS } from '@/mocks/entities/events.mock';

export const getAllEvents = (): EventProduct[] => MOCK_EVENTS;
