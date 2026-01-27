'use client';

import { useEffect, useCallback } from 'react';
import { isMacOS, isInputFocused } from '@/lib/utils/platform';

export interface HotkeyConfig {
  key: string;
  mod?: boolean; // ⌘ on Mac, Ctrl on Windows
  alt?: boolean;
  shift?: boolean;
  /**
   * If true, the hotkey will fire even when focus is in an input field
   * Default: false
   */
  allowInInput?: boolean;
  /**
   * If true, the hotkey will fire even when a modal is open
   * Default: false
   */
  allowInModal?: boolean;
  /**
   * Callback to execute when the hotkey is triggered
   */
  handler: () => void;
}

/**
 * Hook to register global keyboard shortcuts
 *
 * Features:
 * - Cross-platform support (⌘ on Mac, Ctrl on Windows/Linux)
 * - Automatically skips when focus is in input fields (unless allowInInput)
 * - Prevents default browser behavior when shortcut is handled
 * - Cleans up listeners on unmount
 *
 * @param hotkeys - Array of hotkey configurations
 * @param enabled - Whether the hotkeys are active (default: true)
 */
export function useGlobalHotkeys(
  hotkeys: HotkeyConfig[],
  enabled = true
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if disabled
      if (!enabled) return;

      const isMac = isMacOS();

      for (const hotkey of hotkeys) {
        // Check modifier keys
        const modPressed = hotkey.mod
          ? isMac
            ? event.metaKey
            : event.ctrlKey
          : true;
        const altPressed = hotkey.alt ? event.altKey : !event.altKey || hotkey.mod;
        const shiftPressed = hotkey.shift ? event.shiftKey : !event.shiftKey;

        // More precise alt check - if alt is required, it must be pressed; if not required, ignore alt state
        const altMatch = hotkey.alt ? event.altKey : true;
        // But if alt is NOT required, we should reject if alt IS pressed (to avoid conflicts)
        const altExact = hotkey.alt === event.altKey;

        // Check if the key matches (guard against undefined event.key)
        if (!event.key) continue;
        const keyMatch = event.key.toLowerCase() === hotkey.key.toLowerCase();

        if (!keyMatch) continue;
        if (!modPressed) continue;
        if (hotkey.alt !== undefined && !altExact) continue;
        if (hotkey.shift !== undefined && hotkey.shift !== event.shiftKey) continue;

        // Check if we should skip due to input focus
        if (!hotkey.allowInInput && isInputFocused()) {
          continue;
        }

        // Check if we should skip due to modal being open
        // Note: We check for modals using data attribute instead of aria to avoid false positives
        if (!hotkey.allowInModal) {
          const hasOpenModal = document.querySelector('[data-keyboard-shortcut-modal="true"]');
          if (hasOpenModal) continue;
        }

        // Found a matching hotkey - execute it
        event.preventDefault();
        event.stopPropagation();
        hotkey.handler();
        return;
      }
    },
    [hotkeys, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [handleKeyDown, enabled]);
}
