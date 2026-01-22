'use client';

import { cn } from '@/lib/utils';
import type { CheckoutStep, CheckoutStepId } from '../../types';

interface StepperProps {
  steps: CheckoutStep[];
  currentStepIndex: number;
  completedSteps: Set<CheckoutStepId>;
}

export function Stepper({ steps, currentStepIndex, completedSteps }: StepperProps) {
  return (
    <div className="w-full py-4 px-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isActive = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex && !isCompleted;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    isCompleted && 'bg-blue-600 text-white',
                    isActive && !isCompleted && 'bg-blue-600 text-white',
                    isUpcoming && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium whitespace-nowrap max-w-[80px] text-center leading-tight',
                    isCompleted && 'text-blue-600',
                    isActive && !isCompleted && 'text-blue-600',
                    isUpcoming && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 h-0.5 mx-2 mt-[-20px]',
                    index < currentStepIndex || completedSteps.has(step.id)
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
