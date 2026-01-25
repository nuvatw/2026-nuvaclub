'use client';

import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@/components/icons';
import {
  PlanComparisonSection,
} from '@/features/shop/components';

// Category info for Plan
const PLAN_INFO = {
  introduction: {
    title: 'About Subscription Plans',
    description: 'Choose the plan that fits your learning journey. Explorer is free with basic access. Traveler (NT$790/mo) unlocks full courses and progress tracking. Voyager (NT$990/mo) adds mentor support, certificates, and priority features. Enterprise (NT$8,500/mo) is for teams with custom onboarding. Upgrade anytime without losing your progress.',
  },
  faq: [
    { question: 'What\'s the difference between Traveler and Voyager?', answer: 'Traveler (NT$790/mo) gives you full access to all premium courses, expanded practice sets, and progress tracking. Voyager (NT$990/mo) includes everything in Traveler plus mentor support & guidance, priority feedback, advanced projects, certificates, and priority support.' },
    { question: 'What\'s the yearly 10+2 offer?', answer: 'When you choose yearly billing, you pay for 10 months and get 2 months free - that\'s a 17% discount! For Traveler, that\'s NT$7,900/year instead of NT$9,480. For Voyager, it\'s NT$9,900/year instead of NT$11,880.' },
    { question: 'What about Enterprise?', answer: 'Enterprise (NT$8,500/mo) is designed for teams and organizations that need custom onboarding, admin controls, dedicated support, and SLA guarantees. Contact us on LINE for custom pricing and team setup.' },
    { question: 'Can I switch plans?', answer: 'Yes! You can upgrade from Explorer to Traveler, Voyager, or Enterprise at any time. Your learning progress will be preserved, and you\'ll receive prorated credit for any remaining time on your current plan.' },
  ],
};

export default function PlanPage() {
  return (
    <div className="rounded-2xl p-6 md:p-8 border border-neutral-700 bg-neutral-800/30">
      {/* Plan Comparison Table */}
      <div className="mb-8">
        <PlanComparisonSection />
      </div>

      {/* Introduction Section */}
      <div className="mb-8 bg-neutral-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <InformationCircleIcon size="md" className="text-neutral-400" />
          {PLAN_INFO.introduction.title}
        </h3>
        <p className="text-neutral-400 leading-relaxed">
          {PLAN_INFO.introduction.description}
        </p>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <QuestionMarkCircleIcon size="md" className="text-neutral-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {PLAN_INFO.faq.map((item, index) => (
            <div key={index} className="bg-neutral-800/50 rounded-xl p-4">
              <h4 className="font-medium text-white mb-1">{item.question}</h4>
              <p className="text-sm text-neutral-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
