'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VideoHero } from '@/features/shop/components';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/molecules/PageTransition';
import { ShopPageSkeleton } from '@/components/skeletons';
import { getAllShopProducts } from '@/features/shop/data/products';
import type { ShopProduct, ProductCategory } from '@/features/shop/types';

// Category types
type CategoryId = 'plan' | 'duo' | 'event' | 'merchandise';

interface CategoryConfig {
  id: CategoryId;
  productCategory: ProductCategory;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

// Category button configurations
const CATEGORIES: CategoryConfig[] = [
  {
    id: 'plan',
    productCategory: 'plan',
    title: 'Plan',
    subtitle: 'Subscriptions',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'duo',
    productCategory: 'duo',
    title: 'Duo',
    subtitle: 'Partner Access',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'event',
    productCategory: 'event',
    title: 'Event',
    subtitle: 'Workshops',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'merchandise',
    productCategory: 'merchant',
    title: 'Merchandise',
    subtitle: 'Official Gear',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      description: 'Share your learning journey with a Nunu mentor. Duo Go offers monthly flexibility with community mentors. Duo Run provides quarterly access to certified Nunus. Duo Fly is our premium tier with exclusive founder sessions.',
    },
    faq: [
      { question: 'What is a Nunu?', answer: 'A Nunu is a learning companion/mentor in our community. They guide you through your learning journey.' },
      { question: 'Can I select multiple periods?', answer: 'Yes! You can select multiple months (Go) or quarters (Run/Fly) during checkout.' },
      { question: 'Can I upgrade my Duo tier?', answer: 'Yes, you can upgrade your tier at any time for upcoming periods.' },
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

function CategoryButton({
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
        'flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-2 transition-all duration-200',
        'hover:scale-105 hover:shadow-lg',
        isSelected
          ? `${config.bgColor} ${config.borderColor} shadow-lg`
          : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
      )}
    >
      <div className={cn(
        'w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-2 md:mb-3',
        isSelected ? config.bgColor : 'bg-neutral-700/50',
        config.color
      )}>
        {config.icon}
      </div>
      <span className={cn(
        'font-bold text-base md:text-lg',
        isSelected ? config.color : 'text-white'
      )}>
        {config.title}
      </span>
      <span className="text-xs text-neutral-500 mt-0.5">{config.subtitle}</span>
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

function CategoryDetails({
  categoryId,
  products,
  config,
}: {
  categoryId: CategoryId;
  products: ShopProduct[];
  config: CategoryConfig;
}) {
  const router = useRouter();
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

  return (
    <div className={cn('rounded-2xl p-6 md:p-8 border', config.bgColor, config.borderColor)}>
      {/* Products Section */}
      <div className="mb-8">
        <h2 className={cn('text-2xl font-bold mb-6', config.color)}>
          {config.title} ({products.length})
        </h2>

        {products.length > 0 ? (
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

  const selectedConfig = CATEGORIES.find(c => c.id === selectedCategory)!;

  return (
    <PageTransition skeleton={<ShopPageSkeleton />}>
      <div className="shop-page min-h-screen bg-[var(--shop-bg)]">
        {/* Section 1: Hero Video */}
        <VideoHero videoId="dLRdaUda8Ho" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Shop</h1>
            <p className="text-neutral-400">
              Choose a category to explore our offerings
            </p>
          </div>

          {/* Section 2: Category Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                config={category}
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>

          {/* Section 3: Category Details (Products + Introduction + FAQ) */}
          <CategoryDetails
            categoryId={selectedCategory}
            products={filteredProducts}
            config={selectedConfig}
          />
        </div>
      </div>
    </PageTransition>
  );
}
