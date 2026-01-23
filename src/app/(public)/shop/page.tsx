'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ShopPageSkeleton } from '@/components/skeletons';
import { getAllShopProducts, DUO_TICKETS } from '@/features/shop/data/products';
import type { ShopProduct, ProductCategory, DuoTicketProduct } from '@/features/shop/types';
import { DuoProductCard } from '@/features/duo/components/DuoProductCard';
import { PLANS } from '@/features/shop/data/plans';
import { usePlanStatus } from '@/features/shop/hooks/usePlanStatus';

// Category types
type CategoryId = 'plan' | 'duo' | 'event' | 'merchandise';

interface CategoryConfig {
  id: CategoryId;
  productCategory: ProductCategory;
  title: string;
  icon: React.ReactNode;
}

// Category button configurations
const CATEGORIES: CategoryConfig[] = [
  {
    id: 'plan',
    productCategory: 'plan',
    title: 'Plan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'duo',
    productCategory: 'duo',
    title: 'Duo',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'event',
    productCategory: 'event',
    title: 'Event',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'merchandise',
    productCategory: 'merchant',
    title: 'Merchandise',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];

// Category introduction and FAQ data
const CATEGORY_INFO: Record<CategoryId, {
  introduction: { title: string; description: string };
  faq: { question: string; answer: string }[];
}> = {
  plan: {
    introduction: {
      title: 'About Subscription Plans',
      description: 'Choose the plan that fits your learning journey. Explorer is free and gives you basic access. Traveler unlocks everything including premium courses, exclusive events, and priority support. Upgrade anytime without losing your progress.',
    },
    faq: [
      { question: 'Can I switch plans?', answer: 'Yes! You can upgrade from Explorer to Traveler at any time. Your learning progress will be preserved.' },
      { question: 'Is there a refund policy?', answer: 'We offer a 14-day money-back guarantee for Traveler subscriptions.' },
      { question: 'What payment methods are accepted?', answer: 'We accept credit/debit cards and ATM bank transfer. All prices are in NT$.' },
    ],
  },
  duo: {
    introduction: {
      title: 'About Duo Membership',
      description: 'Share your learning journey with a Nunu mentor. Each Duo pass is purchased for specific months, giving you flexibility to plan your mentorship journey. Duo Go connects you with regular Nunus, Duo Run gives access to Certified Nunus, and Duo Fly offers exclusive sessions with Founders.',
    },
    faq: [
      { question: 'What is a Nunu?', answer: 'A Nunu is a learning companion/mentor in our community. They guide you through your learning journey.' },
      { question: 'How does monthly purchasing work?', answer: 'Select specific months you want access to when adding to cart. Each month is purchased separately, so you only pay for what you need.' },
      { question: 'Can I upgrade my Duo tier?', answer: 'Yes! If you already have a lower tier for a month, you can upgrade by paying the difference.' },
      { question: 'What if I already own a month?', answer: 'The system will recognize owned months and either prevent duplicate purchases or offer upgrade options if applicable.' },
    ],
  },
  event: {
    introduction: {
      title: 'About Events & Workshops',
      description: 'Join our community gatherings, hands-on workshops, and exclusive courses led by industry experts. In-person events offer intensive learning in Taipei, while online webinars let you join from anywhere with replays available.',
    },
    faq: [
      { question: 'Are events recorded?', answer: 'Online events are recorded and available for replay. In-person workshops are not recorded.' },
      { question: 'Can I get a refund if I can\'t attend?', answer: 'Refunds are available up to 7 days before the event. After that, you can transfer your ticket.' },
      { question: 'Do I need any prerequisites?', answer: 'Each event has its own requirements listed on the event page. Most are beginner-friendly.' },
    ],
  },
  merchandise: {
    introduction: {
      title: 'About Official Merchandise',
      description: 'Show your Nuva pride with our exclusive gear. All items are made with high-quality materials and feature unique designs only available to our community. Convenient 7-ELEVEN pickup available across Taiwan.',
    },
    faq: [
      { question: 'What are the shipping options?', answer: 'We offer 7-ELEVEN store pickup across Taiwan. Select your preferred store at checkout.' },
      { question: 'Can I return items?', answer: 'Unworn items can be returned within 14 days. Please keep the original packaging.' },
      { question: 'Are sizes accurate?', answer: 'We provide detailed size charts on each product page. When in doubt, size up.' },
    ],
  },
};

function CategoryPill({
  config,
  isSelected,
  onClick,
}: {
  config: CategoryConfig;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200',
        isSelected
          ? 'bg-white text-neutral-900 border-white'
          : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
      )}
    >
      <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">
        {config.icon}
      </span>
      <span className="font-medium text-sm">
        {config.title}
      </span>
    </button>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onMoreInfo,
}: {
  product: ShopProduct;
  onAddToCart: () => void;
  onMoreInfo: () => void;
}) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `NT$${price.toLocaleString()}`;
  };

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden hover:border-neutral-600 transition-colors">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-700">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
              Popular
            </span>
          )}
          {product.isOnDiscount && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
              Sale
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-neutral-300">{product.rating}</span>
            <span className="text-xs text-neutral-500">({product.reviewCount})</span>
          </div>
        )}

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onMoreInfo}>
              More Info
            </Button>
            <Button variant="primary" size="sm" onClick={onAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  currentPlan,
  isGuest,
}: {
  plan: typeof PLANS[0];
  currentPlan: 'explorer' | 'traveler' | null;
  isGuest: boolean;
}) {
  const isCurrentPlan = currentPlan === plan.planType;
  const isUpgrade = currentPlan === 'explorer' && plan.planType === 'traveler';
  const isDowngrade = currentPlan === 'traveler' && plan.planType === 'explorer';

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `NT$${price.toLocaleString()}/mo`;
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 border-2 transition-all',
        isCurrentPlan
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
      )}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
            Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-neutral-400 text-sm mb-4">{plan.description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-neutral-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action button */}
      {isCurrentPlan ? (
        <Button variant="secondary" size="lg" className="w-full" disabled>
          Current Plan
        </Button>
      ) : isGuest ? (
        <Button variant="primary" size="lg" className="w-full">
          Sign Up
        </Button>
      ) : isUpgrade ? (
        <Button variant="primary" size="lg" className="w-full">
          Upgrade
        </Button>
      ) : isDowngrade ? (
        <Button variant="ghost" size="lg" className="w-full border border-neutral-600">
          Downgrade
        </Button>
      ) : (
        <Button variant="primary" size="lg" className="w-full">
          Get Started
        </Button>
      )}
    </div>
  );
}

function CategoryDetails({
  categoryId,
  products,
}: {
  categoryId: CategoryId;
  products: ShopProduct[];
}) {
  const router = useRouter();
  const { currentPlan, isGuest } = usePlanStatus();
  const info = CATEGORY_INFO[categoryId];

  const handleAddToCart = (product: ShopProduct) => {
    // TODO: Add to cart functionality
    console.log('Add to cart:', product);
  };

  const handleMoreInfo = (product: ShopProduct) => {
    if (product.category === 'event') {
      router.push(`/shop/events/${product.id}`);
    } else if (categoryId === 'plan') {
      router.push('/shop/plan');
    } else if (categoryId === 'duo') {
      router.push('/shop/duo');
    } else {
      router.push(`/shop/${categoryId}`);
    }
  };

  // For duo category, use DuoProductCard with full product data
  const duoProducts = categoryId === 'duo' ? DUO_TICKETS : [];

  return (
    <div className="rounded-2xl p-6 md:p-8 border border-neutral-700 bg-neutral-800/30">
      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {categoryId === 'plan' ? 'Choose Your Plan' : `${CATEGORIES.find(c => c.id === categoryId)?.title} (${categoryId === 'duo' ? duoProducts.length : products.length})`}
        </h2>

        {/* Plan selection UI */}
        {categoryId === 'plan' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlan={currentPlan}
                isGuest={isGuest}
              />
            ))}
          </div>
        ) : categoryId === 'duo' ? (
          duoProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {duoProducts.map((product) => (
                <DuoProductCard
                  key={product.id}
                  product={product}
                  onBuyNow={() => router.push('/checkout')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              No Duo products available.
            </div>
          )
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onMoreInfo={() => handleMoreInfo(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-400">
            No products available in this category.
          </div>
        )}
      </div>

      {/* Introduction Section */}
      <div className="mb-8 bg-neutral-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {info.introduction.title}
        </h3>
        <p className="text-neutral-400 leading-relaxed">
          {info.introduction.description}
        </p>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {info.faq.map((item, index) => (
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

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('plan');

  // Get all products
  const allProducts = useMemo(() => getAllShopProducts(), []);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    const config = CATEGORIES.find(c => c.id === selectedCategory);
    if (!config) return [];
    return allProducts.filter(p => p.category === config.productCategory);
  }, [allProducts, selectedCategory]);

  return (
    <PageTransition skeleton={<ShopPageSkeleton />}>
      <div className="shop-page min-h-screen bg-[var(--shop-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="mb-6">
            <p className="text-neutral-400 text-center mb-4">
              Choose a category to explore our offerings
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {CATEGORIES.map((category) => (
                <CategoryPill
                  key={category.id}
                  config={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Category Details (Products + Introduction + FAQ) */}
          <CategoryDetails
            categoryId={selectedCategory}
            products={filteredProducts}
          />
        </div>
      </div>
    </PageTransition>
  );
}
