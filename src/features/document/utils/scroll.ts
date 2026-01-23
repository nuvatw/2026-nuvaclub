/**
 * Scroll Navigation Utility
 *
 * Handles smooth scrolling with proper offset calculation
 * for fixed navbar and sticky elements.
 */

// Constants
const NAVBAR_HEIGHT = 64; // h-16 = 64px
const SCROLL_BUFFER = 24; // Extra breathing room
export const SCROLL_OFFSET = NAVBAR_HEIGHT + SCROLL_BUFFER; // 88px

/**
 * Scrolls to an element by ID with proper offset
 */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`[ScrollNav] Element with id "${id}" not found`);
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: 'smooth',
  });
}
