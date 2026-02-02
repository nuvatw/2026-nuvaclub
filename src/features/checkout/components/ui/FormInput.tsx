'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircleIcon } from '@/components/icons';

/**
 * FormInput Component
 *
 * Design System Standards:
 * - Supports both light and dark themes via variant prop
 * - Default to light theme for checkout flows
 * - Includes success state for validated fields
 */

type FormVariant = 'light' | 'dark';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  /** Theme variant - defaults to dark */
  variant?: FormVariant;
  /** Show success state (green check) */
  success?: boolean;
}

const VARIANT_STYLES: Record<FormVariant, {
  label: string;
  input: string;
  inputError: string;
  inputSuccess: string;
  helper: string;
  error: string;
}> = {
  light: {
    label: 'text-gray-900',
    input: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 hover:border-gray-400',
    inputError: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    inputSuccess: 'border-green-500 focus:ring-green-500 focus:border-green-500',
    helper: 'text-gray-500',
    error: 'text-red-600',
  },
  dark: {
    label: 'text-neutral-200',
    input: 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 hover:border-neutral-600',
    inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    inputSuccess: 'border-green-500 focus:ring-green-500 focus:border-green-500',
    helper: 'text-neutral-400',
    error: 'text-red-400',
  },
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required, error, helperText, variant = 'light', success, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const styles = VARIANT_STYLES[variant];

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={cn('text-sm font-medium', styles.label)}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 px-3 rounded-lg border',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              styles.input,
              error && styles.inputError,
              success && !error && styles.inputSuccess,
              success && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {success && !error && (
            <CheckCircleIcon
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={cn('text-sm', styles.error)}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className={cn('text-sm', styles.helper)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// Radio Card Component
interface RadioCardOption {
  value: string;
  title: string;
  subtitle?: string;
}

interface RadioCardGroupProps {
  name: string;
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: FormVariant;
}

export function RadioCardGroup({
  name,
  options,
  value,
  onChange,
  className,
  variant = 'light',
}: RadioCardGroupProps) {
  const isDark = variant === 'dark';

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all',
            value === option.value
              ? 'border-blue-600 bg-blue-50'
              : isDark
                ? 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0',
              value === option.value
                ? 'border-blue-600'
                : isDark ? 'border-neutral-600' : 'border-gray-300'
            )}
          >
            {value === option.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <span className={cn('block font-medium', isDark ? 'text-white' : 'text-gray-900')}>
              {option.title}
            </span>
            {option.subtitle && (
              <span className={cn('block text-sm mt-0.5', isDark ? 'text-neutral-400' : 'text-gray-500')}>
                {option.subtitle}
              </span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

// Checkbox Component
interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  className?: string;
  variant?: FormVariant;
}

export function Checkbox({ id, checked, onChange, label, className, variant = 'light' }: CheckboxProps) {
  const isDark = variant === 'dark';

  return (
    <label
      htmlFor={id}
      className={cn('flex items-start gap-3 cursor-pointer', className)}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
            checked
              ? 'bg-blue-600 border-blue-600'
              : isDark
                ? 'bg-neutral-800 border-neutral-600 hover:border-neutral-500'
                : 'bg-white border-gray-300 hover:border-gray-400'
          )}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className={cn('text-sm', isDark ? 'text-neutral-300' : 'text-gray-700')}>{label}</span>
    </label>
  );
}

// Quantity Selector Component
interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  helperText?: string;
  variant?: FormVariant;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  helperText,
  variant = 'light',
}: QuantitySelectorProps) {
  const isDark = variant === 'dark';

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={cn('text-sm font-medium', isDark ? 'text-neutral-200' : 'text-gray-700')}>
          {label}
        </label>
      )}
      {helperText && (
        <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-gray-500')}>{helperText}</p>
      )}
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={cn(
            'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
            value <= min
              ? isDark
                ? 'bg-neutral-900 border-neutral-700 text-neutral-600 cursor-not-allowed'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          )}
          aria-label="Decrease quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className={cn('w-12 text-center text-lg font-medium', isDark ? 'text-white' : 'text-gray-900')}>
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={cn(
            'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
            value >= max
              ? isDark
                ? 'bg-neutral-900 border-neutral-700 text-neutral-600 cursor-not-allowed'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          )}
          aria-label="Increase quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
