'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalHotkeys, type HotkeyConfig } from '@/hooks/useGlobalHotkeys';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

// Main navigation sections in order
const NAV_SECTIONS = [
  { href: '/learn', label: 'Learn' },
  { href: '/test', label: 'Test' },
  { href: '/forum', label: 'Forum' },
  { href: '/space', label: 'Space' },
  { href: '/sprint', label: 'Sprint' },
  { href: '/shop', label: 'Shop' },
] as const;

interface KeyboardShortcutsContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  navigatePrevSection: () => void;
  navigateNextSection: () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcuts(): KeyboardShortcutsContextType {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Search modal controls
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), []);

  // Help modal controls
  const openHelp = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);
  const toggleHelp = useCallback(() => setIsHelpOpen((prev) => !prev), []);

  // Get current section index
  const getCurrentSectionIndex = useCallback((): number => {
    for (let i = 0; i < NAV_SECTIONS.length; i++) {
      if (pathname.startsWith(NAV_SECTIONS[i].href)) {
        return i;
      }
    }
    return -1; // Not on a main section (e.g., home page)
  }, [pathname]);

  // Navigate to previous section
  const navigatePrevSection = useCallback(() => {
    const currentIndex = getCurrentSectionIndex();
    let newIndex: number;

    if (currentIndex <= 0) {
      // Wrap to last section
      newIndex = NAV_SECTIONS.length - 1;
    } else {
      newIndex = currentIndex - 1;
    }

    const targetSection = NAV_SECTIONS[newIndex];
    router.push(targetSection.href);
  }, [getCurrentSectionIndex, router]);

  // Navigate to next section
  const navigateNextSection = useCallback(() => {
    const currentIndex = getCurrentSectionIndex();
    let newIndex: number;

    if (currentIndex < 0 || currentIndex >= NAV_SECTIONS.length - 1) {
      // Wrap to first section
      newIndex = 0;
    } else {
      newIndex = currentIndex + 1;
    }

    const targetSection = NAV_SECTIONS[newIndex];
    router.push(targetSection.href);
  }, [getCurrentSectionIndex, router]);

  // Define all hotkeys
  const hotkeys = useMemo<HotkeyConfig[]>(
    () => [
      // ⌘K / Ctrl+K - Open search
      {
        key: 'k',
        mod: true,
        handler: () => {
          if (isSearchOpen) {
            closeSearch();
          } else {
            openSearch();
          }
        },
        allowInModal: true, // Allow toggling search even if help modal is open
      },
      // ⌘⌥← / Ctrl+Alt+← - Previous section
      {
        key: 'ArrowLeft',
        mod: true,
        alt: true,
        handler: navigatePrevSection,
      },
      // ⌘⌥→ / Ctrl+Alt+→ - Next section
      {
        key: 'ArrowRight',
        mod: true,
        alt: true,
        handler: navigateNextSection,
      },
      // ⌘/ / Ctrl+/ - Open keyboard shortcuts help
      {
        key: '/',
        mod: true,
        handler: () => {
          if (isHelpOpen) {
            closeHelp();
          } else {
            openHelp();
          }
        },
        allowInModal: true,
      },
    ],
    [
      isSearchOpen,
      openSearch,
      closeSearch,
      isHelpOpen,
      openHelp,
      closeHelp,
      navigatePrevSection,
      navigateNextSection,
    ]
  );

  // Register global hotkeys
  useGlobalHotkeys(hotkeys);

  const value = useMemo<KeyboardShortcutsContextType>(
    () => ({
      isSearchOpen,
      openSearch,
      closeSearch,
      toggleSearch,
      isHelpOpen,
      openHelp,
      closeHelp,
      toggleHelp,
      navigatePrevSection,
      navigateNextSection,
    }),
    [
      isSearchOpen,
      openSearch,
      closeSearch,
      toggleSearch,
      isHelpOpen,
      openHelp,
      closeHelp,
      toggleHelp,
      navigatePrevSection,
      navigateNextSection,
    ]
  );

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <KeyboardShortcutsModal isOpen={isHelpOpen} onClose={closeHelp} />
    </KeyboardShortcutsContext.Provider>
  );
}
