# Identity Types

nuvaClub uses a tiered identity system to manage user access levels.

## Identity Hierarchy

```
┌─────────────────────────────────────────────┐
│                  Duo Fly                    │ (Premium)
├─────────────────────────────────────────────┤
│                  Duo Run                    │
├─────────────────────────────────────────────┤
│                  Duo Go                     │
├─────────────────────────────────────────────┤
│                 Traveler                    │
├─────────────────────────────────────────────┤
│                 Explorer                    │
├─────────────────────────────────────────────┤
│                   Free                      │
├─────────────────────────────────────────────┤
│                  Guest                      │ (Base)
└─────────────────────────────────────────────┘
```

## Identity Details

### Guest

- **Description**: Unauthenticated visitors
- **Access**: Public content only
- **Limitations**: Cannot interact, post, or purchase

### Free

- **Description**: Registered users without subscription
- **Access**: Basic course previews, forum reading
- **Limitations**: No full course access, limited features

### Explorer

- **Description**: Monthly subscription holders
- **Price**: $9.99/month
- **Access**:
  - Full course access
  - Forum participation
  - Basic test levels

### Traveler

- **Description**: Yearly subscription holders
- **Price**: $99/year
- **Access**:
  - All Explorer features
  - Priority support
  - Early access to new content

### Duo Go

- **Description**: Monthly companion ticket holders
- **Price**: $29/month
- **Access**:
  - All Traveler features
  - Space access
  - Nunu mentor matching
  - Monthly time selection

### Duo Run

- **Description**: Seasonal companion ticket holders
- **Price**: $79/season (3 months)
- **Access**:
  - All Duo Go features
  - Certified Nunu matching
  - Verified Nunu content access
  - Seasonal time selection

### Duo Fly

- **Description**: Premium seasonal ticket holders
- **Price**: $299/season
- **Access**:
  - All Duo Run features
  - 1:1 sessions with Shangzhe (founder)
  - Exclusive content and events
  - Priority matching

## Test Users

For development and testing, the following user IDs are available:

| User ID | Identity | Description |
|---------|----------|-------------|
| `user-guest` | Guest | No authentication |
| `user-free` | Free | Basic account |
| `user-explorer` | Explorer | Monthly subscriber |
| `user-traveler` | Traveler | Yearly subscriber |
| `user-duo-go` | Duo Go | Go ticket holder |
| `user-duo-run` | Duo Run | Run ticket holder |
| `user-duo-fly` | Duo Fly | Fly ticket holder |

## TypeScript Type

```typescript
type IdentityType =
  | 'guest'
  | 'free'
  | 'explorer'
  | 'traveler'
  | 'duo-go'
  | 'duo-run'
  | 'duo-fly';
```

## Upgrading Identities

Users can upgrade their identity by:

1. **Subscription**: Free → Explorer → Traveler
2. **Duo Tickets**: Any subscription + ticket purchase → Duo tier
3. **Ticket Upgrades**: Go → Run → Fly

Note: Duo tickets require an active subscription (Explorer or Traveler).
