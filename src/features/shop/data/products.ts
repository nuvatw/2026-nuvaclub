/**
 * @deprecated Import from '@/lib/legacy-db-shim' or '@/lib/types/legacy-shim/products' instead.
 *
 * This file is a compatibility re-export. All shop product data now lives in Database/tables/products.ts.
 *
 * Migration guide:
 *   // Old
 *   import { getAllShopProducts, EVENTS } from '@/features/shop/data/products';
 *
 *   // New
 *   import { getAllShopProducts, EVENTS } from '@/lib/legacy-db-shim';
 */

export * from '@/lib/types/legacy-shim/products';

// Legacy function name alias
export { getShopEventById as getEventById, getShopProductById as getProductById } from '@/lib/types/legacy-shim/products';
