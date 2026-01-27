/**
 * @deprecated Import from '@/Database' or '@/Database/tables/products' instead.
 *
 * This file is a compatibility re-export. All shop product data now lives in Database/tables/products.ts.
 *
 * Migration guide:
 *   // Old
 *   import { getAllShopProducts, EVENTS } from '@/features/shop/data/products';
 *
 *   // New
 *   import { getAllShopProducts, EVENTS } from '@/Database';
 */

export * from '@/Database/tables/products';

// Legacy function name alias
export { getShopEventById as getEventById, getShopProductById as getProductById } from '@/Database/tables/products';
