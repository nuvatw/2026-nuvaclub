'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border bg-white',
            'text-gray-900 placeholder:text-gray-400',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
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
}

export function RadioCardGroup({
  name,
  options,
  value,
  onChange,
  className,
}: RadioCardGroupProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all',
            value === option.value
              ? 'border-blue-500 bg-blue-50'
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
                ? 'border-blue-500'
                : 'border-gray-300'
            )}
          >
            {value === option.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <span className="block font-medium text-gray-900">
              {option.title}
            </span>
            {option.subtitle && (
              <span className="block text-sm text-gray-500 mt-0.5">
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
}

export function Checkbox({ id, checked, onChange, label, className }: CheckboxProps) {
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
              ? 'bg-blue-500 border-blue-500'
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
      <span className="text-sm text-gray-700">{label}</span>
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
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  helperText,
}: QuantitySelectorProps) {
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
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={cn(
            'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
            value <= min
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          )}
          aria-label="Decrease quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-12 text-center text-lg font-medium text-gray-900">
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={cn(
            'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
            value >= max
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
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
