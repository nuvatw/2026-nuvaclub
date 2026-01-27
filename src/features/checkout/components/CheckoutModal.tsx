'use client';

import { useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckoutProvider, useCheckout } from '../context/CheckoutContext';
import type { CartItem } from '../types';

// UI Components
import { Stepper } from './ui/Stepper';
import { OrderSummary } from './ui/OrderSummary';

// Step Components
import { ConfirmCartStep } from './steps/ConfirmCartStep';
import { PurchaserInfoStep } from './steps/PurchaserInfoStep';
import { PaymentInfoStep } from './steps/PaymentInfoStep';
import { PlanInfoStep } from './steps/PlanInfoStep';
import { CourseParticipantStep } from './steps/CourseParticipantStep';
import { DeliveryInfoStep } from './steps/DeliveryInfoStep';
import { ParticipantInfoStep } from './steps/ParticipantInfoStep';
import { ReviewStep } from './steps/ReviewStep';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onPlaceOrder?: () => void;
}

export function CheckoutModal({ isOpen, onClose, items, onPlaceOrder }: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <CheckoutProvider initialItems={items}>
          <CheckoutModalContent onClose={onClose} onPlaceOrder={onPlaceOrder} />
        </CheckoutProvider>
      )}
    </AnimatePresence>
  );
}

interface CheckoutModalContentProps {
  onClose: () => void;
  onPlaceOrder?: () => void;
}

function CheckoutModalContent({ onClose, onPlaceOrder }: CheckoutModalContentProps) {
  const {
    state,
    goToNextStep,
    goToPreviousStep,
    isCurrentStepValid,
    isFirstStep,
    isLastStep,
    getCurrentStep,
  } = useCheckout();

  const contentRef = useRef<HTMLDivElement>(null);
  const currentStep = getCurrentStep();
  const isValid = isCurrentStepValid();

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.currentStepIndex]);

  const handleContinue = () => {
    if (isLastStep()) {
      onPlaceOrder?.();
    } else {
      goToNextStep();
    }
  };

  // Render the current step
  const StepContent = useMemo(() => {
    switch (currentStep?.id) {
      case 'confirm_cart':
        return <ConfirmCartStep />;
      case 'purchaser_info':
        return <PurchaserInfoStep />;
      case 'payment_info':
        return <PaymentInfoStep />;
      case 'plan_info':
        return <PlanInfoStep />;
      case 'course_participant_details':
        return <CourseParticipantStep />;
      case 'delivery_info':
        return <DeliveryInfoStep />;
      case 'participant_info':
        return <ParticipantInfoStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return null;
    }
  }, [currentStep?.id]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div
          className={cn(
            'w-full max-w-5xl bg-gray-100 rounded-2xl shadow-2xl overflow-hidden',
            'flex flex-col max-h-[90vh]'
          )}
        >
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            {/* Logo */}
            <span className="text-xl font-bold text-blue-600">nuva</span>

            {/* Title */}
            <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close checkout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stepper */}
          <div className="bg-white border-b border-gray-200 flex-shrink-0">
            <Stepper
              steps={state.steps}
              currentStepIndex={state.currentStepIndex}
              completedSteps={state.completedSteps}
            />
          </div>

          {/* Main Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  {/* Step Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep?.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {StepContent}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    {/* Back Button */}
                    {!isFirstStep() ? (
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {/* Continue / Place Order Button */}
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!isValid}
                      className={cn(
                        'px-6 py-2.5 rounded-lg font-medium transition-colors',
                        isValid
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      {isLastStep() ? 'Place Order' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary (hidden on mobile) */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-0">
                  <OrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
