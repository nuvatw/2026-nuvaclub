import { redirect } from 'next/navigation';

/**
 * Shop base route - redirects to the default category (Plan)
 *
 * All shop categories are now at their own routes:
 * - /shop/plan - Subscription plans
 * - /shop/duo - Duo passes
 * - /shop/events - Event tickets
 * - /shop/merchandise - Merchandise
 */
export default function ShopPage() {
  redirect('/shop/plan');
}
