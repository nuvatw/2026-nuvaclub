'use client';

import { useState } from 'react';
import { CheckoutModal, type CartItem } from '@/features/checkout';

// Sample cart items for different scenarios
const SAMPLE_ITEMS: Record<string, CartItem[]> = {
  digital_plan: [
    {
      id: 'plan-001',
      name: 'Traveler Annual Plan',
      description: '12-month full access membership',
      price: 9600,
      quantity: 1,
      type: 'digital_plan',
      monthlyAverage: 800,
    },
  ],
  duo_go: [
    {
      id: 'duo-go-001',
      name: 'Duo Go',
      description: 'Monthly duo membership - share with a partner',
      price: 1200,
      quantity: 2,
      type: 'duo_go',
      duoPeriodType: 'month',
      selectedPeriods: [
        { id: '2026-01', label: 'January 2026', year: 2026, month: 1 },
        { id: '2026-02', label: 'February 2026', year: 2026, month: 2 },
        { id: '2026-03', label: 'March 2026', year: 2026, month: 3 },
      ],
    },
  ],
  duo_run: [
    {
      id: 'duo-run-001',
      name: 'Duo Run',
      description: 'Quarterly duo membership - enhanced features',
      price: 3200,
      quantity: 2,
      type: 'duo_run',
      duoPeriodType: 'quarter',
      selectedPeriods: [
        { id: '2026-q1', label: '2026 Q1', year: 2026, quarter: 1 },
        { id: '2026-q2', label: '2026 Q2', year: 2026, quarter: 2 },
      ],
    },
  ],
  duo_fly: [
    {
      id: 'duo-fly-001',
      name: 'Duo Fly',
      description: 'Quarterly premium duo membership - all features unlocked',
      price: 4800,
      quantity: 2,
      type: 'duo_fly',
      duoPeriodType: 'quarter',
      selectedPeriods: [
        { id: '2026-q1', label: '2026 Q1', year: 2026, quarter: 1 },
      ],
    },
  ],
  explorer_upgrade: [
    {
      id: 'upgrade-001',
      name: 'Explorer to Traveler Upgrade',
      description: 'Upgrade your Explorer account to Traveler',
      price: 7200,
      quantity: 1,
      type: 'explorer_upgrade',
      isExplorerUpgrade: true,
    },
  ],
  physical_course: [
    {
      id: 'course-001',
      name: 'Weekend Workshop: Advanced Photography',
      description: '2-day intensive course in Taipei',
      price: 12000,
      quantity: 1,
      type: 'physical_course',
      requiresCourseDetails: true,
    },
  ],
  merchandise: [
    {
      id: 'merch-001',
      name: 'Nuva Limited Edition Hoodie',
      description: 'Premium cotton hoodie with embroidered logo',
      price: 1800,
      quantity: 1,
      type: 'merchandise',
      requiresShipping: true,
    },
  ],
  combined: [
    {
      id: 'plan-001',
      name: 'Traveler Annual Plan',
      description: '12-month full access membership',
      price: 9600,
      quantity: 2,
      type: 'digital_plan',
      monthlyAverage: 800,
    },
  ],
  first_time_3d: [
    {
      id: 'plan-first-001',
      name: 'Explorer Monthly Plan',
      description: 'First-time purchase - will trigger 3D verification (SMS)',
      price: 299,
      quantity: 1,
      type: 'digital_plan',
      monthlyAverage: 299,
    },
  ],
  returning_customer: [
    {
      id: 'plan-return-001',
      name: 'Explorer Monthly Plan',
      description: 'Returning customer - may skip 3D verification',
      price: 299,
      quantity: 1,
      type: 'digital_plan',
      monthlyAverage: 299,
    },
  ],
  high_value_installment: [
    {
      id: 'course-premium-001',
      name: 'Premium Workshop Package',
      description: 'High-value course - eligible for installment (≥ NT$10,000)',
      price: 15000,
      quantity: 1,
      type: 'physical_course',
      requiresCourseDetails: true,
    },
  ],
  subscription_monthly: [
    {
      id: 'sub-monthly-001',
      name: 'Monthly Subscription Plan',
      description: 'Auto-renewing monthly subscription',
      price: 599,
      quantity: 1,
      type: 'subscription',
      subscriptionType: 'monthly',
    },
  ],
};

export default function CheckoutDemoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof SAMPLE_ITEMS>('digital_plan');

  const handlePlaceOrder = () => {
    alert('Payment successful and order placed! (BFF call completed)');
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout Modal Demo</h1>
        <p className="text-gray-600 mb-8">
          Select a scenario and click &quot;Open Checkout&quot; to test the checkout flow.
        </p>

        {/* Scenario Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Select a Scenario</h2>
          <div className="space-y-3">
            <ScenarioButton
              isActive={selectedScenario === 'digital_plan'}
              onClick={() => setSelectedScenario('digital_plan')}
              title="Digital Plan"
              description="Standard flow: Cart → Purchaser → Payment → Participant → Review"
            />
            <ScenarioButton
              isActive={selectedScenario === 'duo_go'}
              onClick={() => setSelectedScenario('duo_go')}
              title="Duo Go (Monthly)"
              description="Select by month - 3 months selected example"
            />
            <ScenarioButton
              isActive={selectedScenario === 'duo_run'}
              onClick={() => setSelectedScenario('duo_run')}
              title="Duo Run (Quarterly)"
              description="Select by quarter - 2 quarters selected example"
            />
            <ScenarioButton
              isActive={selectedScenario === 'duo_fly'}
              onClick={() => setSelectedScenario('duo_fly')}
              title="Duo Fly (Quarterly)"
              description="Premium quarterly - 1 quarter selected example"
            />
            <ScenarioButton
              isActive={selectedScenario === 'explorer_upgrade'}
              onClick={() => setSelectedScenario('explorer_upgrade')}
              title="Explorer → Traveler Upgrade"
              description="Includes Plan Info step with DOB requirement"
            />
            <ScenarioButton
              isActive={selectedScenario === 'physical_course'}
              onClick={() => setSelectedScenario('physical_course')}
              title="Physical Course"
              description="Includes Course Participant Details with DOB + Dietary"
            />
            <ScenarioButton
              isActive={selectedScenario === 'merchandise'}
              onClick={() => setSelectedScenario('merchandise')}
              title="Merchandise"
              description="Includes Delivery Info with 7-ELEVEN store selector"
            />
            <ScenarioButton
              isActive={selectedScenario === 'combined'}
              onClick={() => setSelectedScenario('combined')}
              title="Combined (2 participants)"
              description="Digital plan with quantity 2, shows multiple participant forms"
            />
            <ScenarioButton
              isActive={selectedScenario === 'first_time_3d'}
              onClick={() => setSelectedScenario('first_time_3d')}
              title="🔐 First-Time Purchase (3D)"
              description="Test 3D verification flow - will require SMS authentication"
            />
            <ScenarioButton
              isActive={selectedScenario === 'returning_customer'}
              onClick={() => setSelectedScenario('returning_customer')}
              title="✅ Returning Customer"
              description="Test returning customer - may skip 3D verification"
            />
            <ScenarioButton
              isActive={selectedScenario === 'high_value_installment'}
              onClick={() => setSelectedScenario('high_value_installment')}
              title="💰 High-Value Installment"
              description="NT$15,000 - Shows installment options (CTBC/E.SUN 3/6 periods)"
            />
            <ScenarioButton
              isActive={selectedScenario === 'subscription_monthly'}
              onClick={() => setSelectedScenario('subscription_monthly')}
              title="🔄 Monthly Subscription"
              description="Auto-renewing subscription - uses general merchant ID"
            />
          </div>
        </div>

        {/* Selected Item Preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cart Preview</h2>
          {SAMPLE_ITEMS[selectedScenario].map((item) => {
            const isDuo = item.type === 'duo_go' || item.type === 'duo_run' || item.type === 'duo_fly';
            const periodCount = item.selectedPeriods?.length || 1;
            const totalPrice = isDuo ? item.price * periodCount * item.quantity : item.price * item.quantity;

            return (
              <div key={item.id}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDuo ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    <svg className={`w-6 h-6 ${isDuo ? 'text-purple-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isDuo ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">NT${totalPrice.toLocaleString()}</p>
                    {isDuo ? (
                      <p className="text-sm text-gray-500">
                        {periodCount} {item.duoPeriodType}{periodCount > 1 ? 's' : ''} × {item.quantity}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">× {item.quantity}</p>
                    )}
                  </div>
                </div>
                {/* Show selected periods for Duo */}
                {isDuo && item.selectedPeriods && item.selectedPeriods.length > 0 && (
                  <div className="mt-3 ml-16">
                    <p className="text-xs text-gray-500 mb-1.5">Selected {item.duoPeriodType === 'month' ? 'months' : 'quarters'}:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.selectedPeriods.map((period) => (
                        <span
                          key={period.id}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium"
                        >
                          {period.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Open Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Open Checkout
        </button>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={SAMPLE_ITEMS[selectedScenario]}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

interface ScenarioButtonProps {
  isActive: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

function ScenarioButton({ isActive, onClick, title, description }: ScenarioButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isActive
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300'
        }`}
    >
      <p className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
        {title}
      </p>
      <p className="text-sm text-gray-500 mt-0.5">{description}</p>
    </button>
  );
}
