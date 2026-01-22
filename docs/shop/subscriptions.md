# Subscriptions

Subscription plans and billing in nuvaClub.

## Plan Comparison

| Feature | Free | Explorer | Traveler |
|---------|------|----------|----------|
| Course previews | ✓ | ✓ | ✓ |
| Full course access | ✗ | ✓ | ✓ |
| Forum posting | ✗ | ✓ | ✓ |
| Sprint participation | ✗ | ✓ | ✓ |
| Priority support | ✗ | ✗ | ✓ |
| Early access | ✗ | ✗ | ✓ |
| Downloads | ✗ | ✗ | ✓ |

## Pricing

### Explorer

- Monthly: $9.99/month
- Yearly: $89.99/year (25% off)

### Traveler

- Monthly: Not available
- Yearly: $99/year

## Subscription Lifecycle

```
Free → Purchase → Active → Renewal/Cancel → Expired
```

### Status Types

- **Active** - Currently subscribed
- **Cancelled** - Won't renew, access until period end
- **Expired** - Period ended, no access
- **Paused** - Temporarily suspended

## Subscription Record

```typescript
interface UserSubscriptionRecord {
  id: string;
  userId: string;
  planType: 'explorer' | 'traveler';
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  createdAt: Date;
}
```

## Upgrading

| From | To | Action |
|------|-----|--------|
| Free | Explorer | Purchase |
| Free | Traveler | Purchase |
| Explorer | Traveler | Upgrade (prorated) |

## Downgrading

| From | To | Action |
|------|-----|--------|
| Traveler | Explorer | At renewal |
| Explorer | Free | Cancel |
| Traveler | Free | Cancel |

## With Duo Tickets

Duo tickets require an active subscription:
- Explorer OR Traveler required
- Ticket benefits stack with subscription
- If subscription expires, Duo ticket pauses
