'use client';

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@/components/icons';
import { useEscapeKey } from '@/hooks';

/**
 * Dropdown Component
 *
 * Design System Standards:
 * - Border radius: rounded-lg (8px)
 * - Background: neutral-800
 * - Border: neutral-700
 * - Focus: ring-2 ring-primary-500
 *
 * Accessibility:
 * - Keyboard navigation: Arrow keys, Enter, Escape
 * - ARIA: role="listbox", aria-expanded, aria-activedescendant
 * - Focus management within dropdown
 */

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

interface DropdownProps {
  /** Label shown before the selected value */
  label?: string;
  /** Currently selected value */
  value: string;
  /** Available options */
  options: DropdownOption[];
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Min width for dropdown menu */
  menuMinWidth?: number;
}

export function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  size = 'md',
  disabled = false,
  className,
  menuMinWidth = 200,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Close on escape
  useEscapeKey(() => {
    if (isOpen) {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }, isOpen);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Reset highlighted index when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((o) => o.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, options, value]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isOpen, highlightedIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              onChange(option.value);
              setIsOpen(false);
              buttonRef.current?.focus();
            }
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) => {
              let next = prev + 1;
              while (next < options.length && options[next].disabled) {
                next++;
              }
              return next < options.length ? next : prev;
            });
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) => {
              let next = prev - 1;
              while (next >= 0 && options[next].disabled) {
                next--;
              }
              return next >= 0 ? next : prev;
            });
          }
          break;

        case 'Home':
          e.preventDefault();
          if (isOpen) {
            const firstEnabled = options.findIndex((o) => !o.disabled);
            if (firstEnabled >= 0) setHighlightedIndex(firstEnabled);
          }
          break;

        case 'End':
          e.preventDefault();
          if (isOpen) {
            for (let i = options.length - 1; i >= 0; i--) {
              if (!options[i].disabled) {
                setHighlightedIndex(i);
                break;
              }
            }
          }
          break;

        case 'Tab':
          if (isOpen) {
            setIsOpen(false);
          }
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, onChange]
  );

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption?.label ?? placeholder;

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3 py-2 text-sm gap-2',
  };

  const optionSizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `dropdown-label-${label}` : undefined}
        className={cn(
          'flex items-center rounded-lg',
          'bg-neutral-800 border border-neutral-700 text-neutral-200',
          'hover:bg-neutral-700 hover:border-neutral-600',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-950',
          'transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:border-neutral-700',
          sizeStyles[size]
        )}
      >
        {label && (
          <span id={`dropdown-label-${label}`} className="text-neutral-400 flex-shrink-0">
            {label}:
          </span>
        )}
        <span className="font-medium truncate">{displayText}</span>
        <ChevronDownIcon
          size="sm"
          className={cn(
            'text-neutral-400 transition-transform flex-shrink-0 ml-auto',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `option-${options[highlightedIndex].value}` : undefined
          }
          className={cn(
            'absolute top-full left-0 mt-1 max-h-[300px] overflow-y-auto',
            'py-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl shadow-black/30 z-50'
          )}
          style={{ minWidth: `${menuMinWidth}px` }}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(el) => { optionsRef.current[index] = el; }}
              id={`option-${option.value}`}
              role="option"
              type="button"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                  buttonRef.current?.focus();
                }
              }}
              onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
              className={cn(
                'w-full text-left transition-colors',
                optionSizeStyles[size],
                option.disabled && 'opacity-50 cursor-not-allowed',
                option.value === value && 'bg-primary-600/20 text-primary-400',
                option.value !== value && !option.disabled && 'text-neutral-300',
                index === highlightedIndex && !option.disabled && option.value !== value && 'bg-neutral-700'
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.sublabel && (
                  <span className="text-xs text-neutral-500">{option.sublabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
