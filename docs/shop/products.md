# Products

Different product types in the nuvaClub shop.

## Product Types

### Plans (Subscriptions)

Recurring subscriptions for content access.

| Plan | Price | Billing | Features |
|------|-------|---------|----------|
| Explorer | $9.99/mo | Monthly | Full course access |
| Traveler | $99/yr | Yearly | All content + priority |

### Duo Tickets

Companion matching access.

| Ticket | Price | Duration | Access |
|--------|-------|----------|--------|
| Go | $29/mo | Monthly | Nunu matching |
| Run | $79/season | 3 months | + Certified Nunu |
| Fly | $299/season | 3 months | + Shangzhe 1:1 |

### Events

One-time event tickets.

- Workshops
- Meetups
- Conferences
- Special sessions

### Merchandise

Physical products.

- T-shirts
- Stickers
- Accessories
- Limited editions

## Product Schema

```typescript
interface ProductRecord {
  id: string;
  type: 'plan' | 'duo-ticket' | 'event' | 'merchandise';
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Extended Product Types

### Plan Products

```typescript
interface PlanProductRecord {
  id: string;
  productId: string;
  planType: 'explorer' | 'traveler';
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}
```

### Event Products

```typescript
interface EventProductRecord {
  id: string;
  productId: string;
  eventDate: Date;
  location: string;
  capacity: number;
  currentAttendees: number;
  isVirtual: boolean;
}
```

### Merchandise Products

```typescript
interface MerchandiseProductRecord {
  id: string;
  productId: string;
  category: 'apparel' | 'accessories' | 'collectibles';
  hasVariants: boolean;
}

interface MerchandiseVariantRecord {
  id: string;
  merchandiseId: string;
  name: string; // "Medium", "Large", etc.
  sku: string;
  stock: number;
  priceModifier: number;
}
```

## Product Display

```typescript
<ShopProductCard
  product={product}
  variant="grid" // or "featured"
  onAddToCart={handleAdd}
/>
```
