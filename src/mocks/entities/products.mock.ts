import type {
  MerchandiseProduct,
  Product,
  ShopProduct,
  ProductCategory,
} from '@/features/shop/types';
import { MOCK_PLANS } from './plans.mock';
import { MOCK_EVENTS } from './events.mock';
import { DUO_PRODUCTS } from '@/features/shop/data/duo';

/**
 * Products Mock Data
 *
 * Contains merchandise products.
 */

export const MOCK_MERCHANDISE: MerchandiseProduct[] = [
  {
    id: 'merch-1',
    type: 'merchandise',
    name: 'nuvaClub T-Shirt',
    description: 'Premium cotton t-shirt with nuvaClub logo. Comfortable and stylish.',
    price: 590,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    rating: 4.8,
    reviewCount: 156,
    variants: [
      { name: 'S', stock: 10 },
      { name: 'M', stock: 15 },
      { name: 'L', stock: 12 },
      { name: 'XL', stock: 8 },
    ],
  },
  {
    id: 'merch-2',
    type: 'merchandise',
    name: 'nuvaClub Mug',
    description: 'Ceramic mug, 350ml capacity. Perfect for your morning coffee.',
    price: 390,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'merch-3',
    type: 'merchandise',
    name: 'Sticker Pack',
    description: 'Set of 6 vinyl stickers. Great for laptops, water bottles, and more.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: 'merch-4',
    type: 'merchandise',
    name: 'nuvaClub Cap',
    description: 'Classic baseball cap with embroidered logo. Adjustable strap.',
    price: 490,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    rating: 4.7,
    reviewCount: 67,
    variants: [{ name: 'One Size', stock: 20 }],
  },
  {
    id: 'merch-5',
    type: 'merchandise',
    name: 'Canvas Tote Bag',
    description: 'Eco-friendly canvas tote. Spacious and durable for everyday use.',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: 'merch-6',
    type: 'merchandise',
    name: 'Metal Keychain',
    description: 'Premium metal keychain with nuvaClub emblem. Sleek and durable.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800',
    rating: 4.5,
    reviewCount: 145,
  },
  {
    id: 'merch-7',
    type: 'merchandise',
    name: 'Dot Grid Notebook',
    description: 'A5 dot grid notebook, 192 pages. Perfect for notes and sketches.',
    price: 290,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800',
    rating: 4.9,
    reviewCount: 112,
  },
];

// Legacy exports for backward compatibility
export const MERCHANDISE = MOCK_MERCHANDISE;

// IDs for products with special filter flags
const NEW_ARRIVAL_IDS = ['event-1', 'event-4', 'merch-7'];
const DISCOUNT_IDS = ['event-6'];

// Re-export Duo products for convenience
export { DUO_PRODUCTS } from '@/features/shop/data/duo';

// Helper functions
export const getAllProducts = (): Product[] =>
  [...MOCK_PLANS, ...MOCK_EVENTS, ...MOCK_MERCHANDISE, ...DUO_PRODUCTS];

export const toShopProduct = (product: Product): ShopProduct => {
  const categoryMap: Record<string, ProductCategory> = {
    plan: 'plan',
    event: 'event',
    merchandise: 'merchant',
    duo: 'duo',
  };

  const rating = 'rating' in product ? product.rating : 0;

  const shopProduct: ShopProduct = {
    id: product.id,
    type: product.type,
    category: categoryMap[product.type],
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: 'imageUrl' in product ? product.imageUrl : '',
    rating,
    reviewCount: 'reviewCount' in product ? product.reviewCount : 0,
    isNew: NEW_ARRIVAL_IDS.includes(product.id),
    isBestSeller: rating >= 4.8,
    isOnDiscount: DISCOUNT_IDS.includes(product.id) || product.price === 0,
  };

  // Add event-specific fields for filtering/sorting
  if (product.type === 'event') {
    shopProduct.eventType = product.eventType;
    shopProduct.date = product.date;
    shopProduct.hotScore = product.hotScore;
  }

  return shopProduct;
};

export const getAllShopProducts = (): ShopProduct[] =>
  getAllProducts().map(toShopProduct);

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  const all = getAllProducts();
  const categoryMap: Record<ProductCategory, string> = {
    plan: 'plan',
    event: 'event',
    merchant: 'merchandise',
    duo: 'duo',
  };
  return all.filter((p) => p.type === categoryMap[category]);
};

export const getProductById = (id: string): Product | undefined =>
  getAllProducts().find((p) => p.id === id);

export const getMerchandiseById = (id: string): MerchandiseProduct | undefined =>
  MOCK_MERCHANDISE.find((m) => m.id === id);
