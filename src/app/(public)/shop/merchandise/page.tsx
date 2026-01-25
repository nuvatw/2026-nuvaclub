'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Button, Card, CardContent } from '@/components/atoms';
import { Gate } from '@/features/auth/components/Gate';
import { MERCHANDISE } from '@/mocks';
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@/components/icons';

// Category info for Merchandise
const MERCHANDISE_INFO = {
  introduction: {
    title: 'About Official Merchandise',
    description: 'Show your Nuva pride with our exclusive gear. All items are made with high-quality materials and feature unique designs only available to our community. Convenient 7-ELEVEN pickup available across Taiwan.',
  },
  faq: [
    { question: 'What are the shipping options?', answer: 'We offer 7-ELEVEN store pickup across Taiwan. Select your preferred store at checkout.' },
    { question: 'Can I return items?', answer: 'Unworn items can be returned within 14 days. Please keep the original packaging.' },
    { question: 'Are sizes accurate?', answer: 'We provide detailed size charts on each product page. When in doubt, size up.' },
  ],
};

export default function MerchandisePage() {
  return (
    <div className="rounded-2xl p-6 md:p-8 border border-neutral-700 bg-neutral-800/30">
      {/* Merchandise Grid Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Merchandise</h2>
          <p className="text-neutral-400 text-sm">
            Exclusive nuvaClub merchandise, show your community identity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MERCHANDISE.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="h-full overflow-hidden flex flex-col">
                <div className="relative aspect-square">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex flex-col flex-grow">
                  <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-neutral-400 mb-3 flex-grow">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-white">
                      NT${item.price.toLocaleString()}
                    </span>
                    <Gate
                      permission="shop:purchase"
                      fallback={
                        <Button size="sm" variant="secondary" disabled>
                          Log in
                        </Button>
                      }
                    >
                      <Button size="sm" variant="secondary">
                        Add to Cart
                      </Button>
                    </Gate>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Introduction Section */}
      <div className="mb-8 bg-neutral-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <InformationCircleIcon size="md" className="text-neutral-400" />
          {MERCHANDISE_INFO.introduction.title}
        </h3>
        <p className="text-neutral-400 leading-relaxed">
          {MERCHANDISE_INFO.introduction.description}
        </p>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <QuestionMarkCircleIcon size="md" className="text-neutral-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {MERCHANDISE_INFO.faq.map((item, index) => (
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
