/**
 * Platform detection utilities for keyboard shortcuts
 */

/**
 * Detects if the current platform is macOS
 * Safe for SSR (returns false on server)
 */
export function isMacOS(): boolean {
  if (typeof window === 'undefined') return false;
  return navigator.platform?.toLowerCase().includes('mac') ?? false;
}

/**
 * Returns the modifier key for the current platform
 * Mac: metaKey (⌘), Windows/Linux: ctrlKey
 */
export function getModifierKey(): 'meta' | 'ctrl' {
  return isMacOS() ? 'meta' : 'ctrl';
}

/**
 * Formats a keyboard shortcut for display
 * Uses Mac symbols (⌘, ⌥) on Mac, text (Ctrl, Alt) on Windows/Linux
 */
export function formatShortcut(
  keys: {
    mod?: boolean;
    alt?: boolean;
    shift?: boolean;
    key: string;
  },
  platform?: 'mac' | 'windows'
): string {
  const isMac = platform ? platform === 'mac' : isMacOS();
  const parts: string[] = [];

  if (keys.mod) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (keys.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (keys.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }

  // Format special keys
  let keyDisplay = keys.key;
  if (keys.key === 'ArrowLeft') keyDisplay = '←';
  else if (keys.key === 'ArrowRight') keyDisplay = '→';
  else if (keys.key === 'ArrowUp') keyDisplay = '↑';
  else if (keys.key === 'ArrowDown') keyDisplay = '↓';
  else if (keys.key === 'Escape') keyDisplay = 'Esc';
  else if (keys.key === 'Enter') keyDisplay = '↵';
  else keyDisplay = keys.key.toUpperCase();

  parts.push(keyDisplay);

  return isMac ? parts.join('') : parts.join('+');
}

/**
 * Checks if the active element is an input field where we should skip shortcuts
 */
export function isInputFocused(): boolean {
  if (typeof document === 'undefined') return false;

  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();

  // Check for input, textarea, select
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return true;
  }

  // Check for contenteditable
  if (activeElement.getAttribute('contenteditable') === 'true') {
    return true;
  }

  // Check for elements with role="textbox"
  if (activeElement.getAttribute('role') === 'textbox') {
    return true;
  }

  return false;
}

/**
 * Checks if a modal or dialog is currently open
 * Looks for elements with role="dialog" or aria-modal="true"
 */
export function isModalOpen(): boolean {
  if (typeof document === 'undefined') return false;

  const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
  return modal !== null;
}
