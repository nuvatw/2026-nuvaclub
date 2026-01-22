# Shop Feature

The Shop is the e-commerce system for subscriptions, Duo memberships, events, and merchandise.

## Overview

Shop offers:
- Subscription plans (Explorer, Traveler)
- Duo memberships (Go, Run, Fly)
- Event tickets (workshops, courses)
- Merchandise (physical goods)

## Product Types

| Type | Description | Period Selection | Recurring |
|------|-------------|------------------|-----------|
| `digital_plan` | Subscription (Explorer/Traveler) | None | Yes |
| `duo_go` | Duo Go membership | Monthly | Yes |
| `duo_run` | Duo Run membership | Quarterly | Yes |
| `duo_fly` | Duo Fly premium membership | Quarterly | Yes |
| `explorer_upgrade` | Explorer → Traveler upgrade | None | No |
| `physical_course` | In-person workshop/course | None | No |
| `merchandise` | Physical goods | None | No |

## Key Files

```
src/features/shop/
├── components/
│   ├── ShopHeader.tsx
│   ├── ShopProductCard.tsx
│   ├── VideoHero.tsx
│   ├── PlanComparisonSection.tsx
│   ├── DuoComparisonSection.tsx
│   ├── RecommendationsCarousel.tsx
│   ├── cart/
│   │   ├── CartProvider.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartIcon.tsx
│   │   └── CartItem.tsx
│   └── events/
│       ├── EventHero.tsx
│       ├── EventOverview.tsx
│       ├── EventAgenda.tsx
│       ├── EventFAQ.tsx
│       └── EventSidebar.tsx
└── types.ts

src/features/checkout/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces & validation
├── context/
│   └── CheckoutContext.tsx     # State management (useReducer)
└── components/
    ├── CheckoutModal.tsx       # Main modal container
    ├── ui/
    │   ├── FormInput.tsx       # Form components
    │   ├── Stepper.tsx         # Progress indicator
    │   └── OrderSummary.tsx    # Right column summary
    └── steps/
        ├── ConfirmCartStep.tsx
        ├── PurchaserInfoStep.tsx
        ├── PaymentInfoStep.tsx
        ├── PlanInfoStep.tsx
        ├── CourseParticipantStep.tsx
        ├── DeliveryInfoStep.tsx
        ├── ParticipantInfoStep.tsx
        └── ReviewStep.tsx

src/app/(public)/
├── shop/
│   ├── page.tsx              # Product catalog
│   ├── cart/
│   │   └── page.tsx          # Cart page
│   └── [productId]/
│       └── page.tsx          # Product detail
└── checkout/
    └── page.tsx              # Multi-step checkout page

src/app/checkout-demo/
└── page.tsx                  # Demo page for testing scenarios
```

## Documentation

- [Products](./products.md) - Product types
- [Subscriptions](./subscriptions.md) - Plan details
- [Checkout](./checkout.md) - Multi-step checkout system
