'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/atoms';
import { useCart } from '@/features/shop/components/cart';
import { CheckoutProvider, useCheckout } from '@/features/checkout/context';
import { useDuoEntitlement } from '@/features/shop/hooks/useDuoEntitlement';
import { getDuoProductById } from '@/Database';
import type { CartItem } from '@/features/checkout/types';
import type { DuoVariant } from '@/features/shop/types';

// UI Components
import { Stepper } from '@/features/checkout/components/ui/Stepper';
import { OrderSummary } from '@/features/checkout/components/ui/OrderSummary';

// Step Components
import { ConfirmCartStep } from '@/features/checkout/components/steps/ConfirmCartStep';
import { PurchaserInfoStep } from '@/features/checkout/components/steps/PurchaserInfoStep';
import { PaymentInfoStep } from '@/features/checkout/components/steps/PaymentInfoStep';
import { PlanInfoStep } from '@/features/checkout/components/steps/PlanInfoStep';
import { CourseParticipantStep } from '@/features/checkout/components/steps/CourseParticipantStep';
import { DeliveryInfoStep } from '@/features/checkout/components/steps/DeliveryInfoStep';
import { ParticipantInfoStep } from '@/features/checkout/components/steps/ParticipantInfoStep';
import { ReviewStep } from '@/features/checkout/components/steps/ReviewStep';

// Convert cart items to checkout items
function convertCartToCheckoutItems(cartItems: Array<{
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedVariant?: string;
  selectedPeriod?: string;
}>): CartItem[] {
  return cartItems.map((item) => ({
    id: item.productId,
    name: item.name,
    description: item.selectedVariant || item.selectedPeriod || 'Standard item',
    price: item.price,
    quantity: item.quantity,
    type: 'digital_plan' as const, // Default type, could be enhanced based on product metadata
    image: item.imageUrl,
    monthlyAverage: item.price / 12,
  }));
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { grantEntitlement, upgradeEntitlement } = useDuoEntitlement();

  // Convert cart items
  const checkoutItems = convertCartToCheckoutItems(cart.items);

  const handlePlaceOrder = () => {
    // Check for Duo products and grant entitlements
    cart.items.forEach((item) => {
      // Check if this is a Duo product
      const duoProduct = getDuoProductById(item.productId);
      if (duoProduct) {
        // Grant or upgrade the Duo entitlement
        upgradeEntitlement(duoProduct.duoVariant as DuoVariant);
      }
    });

    setOrderNumber(Math.random().toString(36).substring(2, 10).toUpperCase());
    setIsComplete(true);
    clearCart();
  };

  // Show completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Order Number</p>
            <p className="text-xl font-mono font-bold text-gray-900">
              #{orderNumber}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push('/shop')}>
              Continue Shopping
            </Button>
            <Button variant="secondary" onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => router.push('/shop')}>
            Browse Shop
          </Button>
        </div>
      </div>
    );
  }

  // Show checkout flow
  return (
    <CheckoutProvider initialItems={checkoutItems}>
      <CheckoutContent onPlaceOrder={handlePlaceOrder} />
    </CheckoutProvider>
  );
}

function CheckoutContent({ onPlaceOrder }: { onPlaceOrder: () => void }) {
  const router = useRouter();
  const {
    state,
    goToNextStep,
    goToPreviousStep,
    isCurrentStepValid,
    isFirstStep,
    isLastStep,
    getCurrentStep,
  } = useCheckout();

  const currentStep = getCurrentStep();
  const isValid = isCurrentStepValid();

  const handleContinue = () => {
    if (isLastStep()) {
      onPlaceOrder();
    } else {
      goToNextStep();
    }
  };

  // Render the current step
  const renderStepContent = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => router.push('/shop')}
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            nuva
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>

          {/* Back to Shop */}
          <button
            onClick={() => router.push('/shop')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <Stepper
            steps={state.steps}
            currentStepIndex={state.currentStepIndex}
            completedSteps={state.completedSteps}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  {renderStepContent()}
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
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    isValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLastStep() ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
