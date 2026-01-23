/**
 * Timing constants for animations, delays, and timeouts
 */
export const TIMING = {
  /** Auth loading delay in ms */
  AUTH_LOADING_DELAY: 300,
  /** Hover to expand delay for course cards in ms */
  HOVER_EXPAND_DELAY: 500,
  /** Carousel autoplay interval in ms */
  CAROUSEL_AUTOPLAY: 6000,
  /** Simulated checkout processing delay in ms */
  CHECKOUT_SIMULATION: 2000,
} as const;

/**
 * Time duration constants in milliseconds
 */
export const MS_PER = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;
