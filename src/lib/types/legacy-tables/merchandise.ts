/**
 * Merchandise Table
 *
 * Contains physical merchandise products for the shop.
 */

export interface MerchandiseVariant {
  name: string;
  stock: number;
}

export interface MerchandiseProduct {
  id: string;
  type: 'merchandise';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  variants?: MerchandiseVariant[];
}

export const MerchandiseTable: MerchandiseProduct[] = [
  {
    id: 'merch-1',
    type: 'merchandise',
    name: 'nuvaClub T-Shirt',
    description:
      'Premium cotton t-shirt with nuvaClub logo. Comfortable and stylish.',
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
    description:
      'Ceramic mug, 350ml capacity. Perfect for your morning coffee.',
    price: 390,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'merch-3',
    type: 'merchandise',
    name: 'Sticker Pack',
    description:
      'Set of 6 vinyl stickers. Great for laptops, water bottles, and more.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: 'merch-4',
    type: 'merchandise',
    name: 'nuvaClub Cap',
    description:
      'Classic baseball cap with embroidered logo. Adjustable strap.',
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
    description:
      'Eco-friendly canvas tote. Spacious and durable for everyday use.',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: 'merch-6',
    type: 'merchandise',
    name: 'Metal Keychain',
    description:
      'Premium metal keychain with nuvaClub emblem. Sleek and durable.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800',
    rating: 4.5,
    reviewCount: 145,
  },
  {
    id: 'merch-7',
    type: 'merchandise',
    name: 'Dot Grid Notebook',
    description:
      'A5 dot grid notebook, 192 pages. Perfect for notes and sketches.',
    price: 290,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800',
    rating: 4.9,
    reviewCount: 112,
  },
];

// ============================================================
// Helper Functions
// ============================================================

export const getMerchandiseById = (id: string): MerchandiseProduct | undefined =>
  MerchandiseTable.find((m) => m.id === id);

export const getAllMerchandise = (): MerchandiseProduct[] => MerchandiseTable;

export const getMerchandiseInStock = (): MerchandiseProduct[] =>
  MerchandiseTable.filter((m) => {
    if (!m.variants) return true;
    return m.variants.some((v) => v.stock > 0);
  });

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use MerchandiseTable instead */
export const MOCK_MERCHANDISE = MerchandiseTable;

/** @deprecated Use MerchandiseTable instead */
export const MERCHANDISE = MerchandiseTable;
