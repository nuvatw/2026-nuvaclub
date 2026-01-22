# Permissions

This document describes the permission system used in nuvaClub.

## Permission Format

Permissions follow the format: `feature:action`

Examples:
- `learn:view_all` - View all courses
- `space:enter` - Enter the Space feature
- `forum:post` - Create forum posts

## Permission Matrix

### Learn Permissions

| Permission | Guest | Free | Explorer | Traveler | Duo Go | Duo Run | Duo Fly |
|------------|-------|------|----------|----------|--------|---------|---------|
| `learn:view_preview` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `learn:view_all` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `learn:download` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |

### Test Permissions

| Permission | Guest | Free | Explorer | Traveler | Duo Go | Duo Run | Duo Fly |
|------------|-------|------|----------|----------|--------|---------|---------|
| `test:take_basic` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `test:take_all` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `test:view_analytics` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |

### Space Permissions

| Permission | Guest | Free | Explorer | Traveler | Duo Go | Duo Run | Duo Fly |
|------------|-------|------|----------|----------|--------|---------|---------|
| `space:enter` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| `space:view_nunu` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| `space:view_certified_nunu` | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `space:view_shangzhe` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| `space:post_matching` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| `space:apply_nunu` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |

### Forum Permissions

| Permission | Guest | Free | Explorer | Traveler | Duo Go | Duo Run | Duo Fly |
|------------|-------|------|----------|----------|--------|---------|---------|
| `forum:read` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `forum:post` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `forum:comment` | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `forum:vote` | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Shop Permissions

| Permission | Guest | Free | Explorer | Traveler | Duo Go | Duo Run | Duo Fly |
|------------|-------|------|----------|----------|--------|---------|---------|
| `shop:browse` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `shop:purchase` | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `shop:member_discount` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Sprint Permissions

| Permission | Guest | Free | Explorer | Traveler | Duo Go | Duo Run | Duo Fly |
|------------|-------|------|----------|----------|--------|---------|---------|
| `sprint:view` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `sprint:submit` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `sprint:vote` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Checking Permissions

```typescript
import { useAuth } from '@/features/auth/components/AuthProvider';

function MyComponent() {
  const { hasPermission } = useAuth();

  // Single check
  if (hasPermission('space:enter')) {
    // Render space content
  }

  // Multiple checks
  const canPostAndComment =
    hasPermission('forum:post') &&
    hasPermission('forum:comment');
}
```

## Permission Guards

For route-level protection, use the `Gate` component:

```typescript
import { Gate } from '@/features/auth/components/Gate';

function ProtectedPage() {
  return (
    <Gate permission="space:enter" fallback={<UpgradePrompt />}>
      <SpaceContent />
    </Gate>
  );
}
```

## Adding New Permissions

1. Define the permission in `src/features/auth/types.ts`
2. Add mappings in `src/features/auth/permissions.ts`
3. Update this documentation
