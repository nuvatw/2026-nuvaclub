/**
 * Shop-related constants for category display
 */

export type ProductCategory = 'plan' | 'duo' | 'event' | 'merchandise';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  plan: 'Plan',
  duo: 'Duo Ticket',
  event: 'Event',
  merchandise: 'Merchandise',
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  plan: 'bg-primary-500/20 text-primary-400',
  duo: 'bg-purple-500/20 text-purple-400',
  event: 'bg-amber-500/20 text-amber-400',
  merchandise: 'bg-emerald-500/20 text-emerald-400',
};
