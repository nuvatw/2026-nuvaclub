# Space Access Control

Detailed access control rules for the Space feature.

## Entry Requirements

To enter Space, users must have a Duo Ticket:
- Duo Go (monthly)
- Duo Run (seasonal)
- Duo Fly (seasonal)

## Companion Visibility

### Duo Go Users

Can see:
- Regular Nunu companions
- Non-verified matching posts

Cannot see:
- Certified Nunu companions
- Shangzhe
- Verified Nunu matching posts

### Duo Run Users

Can see:
- Regular Nunu companions
- Certified Nunu companions
- All matching posts (including Verified)

Cannot see:
- Shangzhe

### Duo Fly Users

Can see:
- All companions including Shangzhe
- All matching posts

## Matching Board Visibility

### Post Visibility Matrix

| Post Setting | Duo Go | Duo Run | Duo Fly |
|--------------|--------|---------|---------|
| `isVerifiedNunuOnly: false` | ✓ View | ✓ View | ✓ View |
| `isVerifiedNunuOnly: true` | Locked | ✓ View | ✓ View |

### Locked Post Experience

For Duo Go users viewing verified-only content:
- Post card shows blurred preview
- Lock icon displayed
- "Upgrade to Duo Run" CTA
- Cannot view details or comments
- Cannot request match

## Action Permissions

### All Duo Users (Go, Run, Fly)

- Enter Space
- View My Space section
- View Nunu Dashboard (if Nunu)
- Create matching posts
- Comment on visible posts
- Request matches on visible posts
- Apply to become Nunu

### Duo Run and Fly Only

- View Verified Nunu posts
- Comment on Verified Nunu posts
- Request match with Certified Nunu

### Duo Fly Only

- Match with Shangzhe
- Access exclusive Fly-only content (future)

## Nunu Application

All Duo users can apply to become Nunu.

Upon approval:
- Duo Go users become Regular Nunu
- Duo Run/Fly users can become Verified Nunu

## Implementation

```typescript
// Check access
const canViewVerified = hasPermission('space:view_certified_nunu');

// Filter posts
const visiblePosts = posts.filter(post => {
  if (post.isVerifiedNunuOnly && !canViewVerified) {
    return false; // Hide or show as locked
  }
  return true;
});

// Get visible companions
const companions = getVisibleToUser(ticketType);
```

## Upgrade Prompts

When users encounter locked content:

```
┌────────────────────────────────────────┐
│        🔒 Verified Nunu Content        │
│                                        │
│  Upgrade to Duo Run or Duo Fly to     │
│  access verified Nunu posts and       │
│  exclusive matching opportunities     │
│                                        │
│         [Upgrade Now]                  │
└────────────────────────────────────────┘
```

Clicking "Upgrade Now" navigates to `/shop?category=duo`.
