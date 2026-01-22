# Authentication System

The nuvaClub authentication system manages user identity and permissions across the platform.

## Overview

Authentication in nuvaClub is handled through a context-based system that provides:
- User identity management
- Permission checking
- Test account switching (for demos)

## Key Files

- `src/features/auth/components/AuthProvider.tsx` - Main auth context
- `src/features/auth/components/IdentitySwitcher.tsx` - Demo identity switcher
- `src/features/auth/types.ts` - Type definitions
- `src/features/auth/permissions.ts` - Permission mappings

## Usage

### Accessing Auth State

```typescript
import { useAuth } from '@/features/auth/components/AuthProvider';

function MyComponent() {
  const {
    identity,      // Current identity type
    user,          // User object
    hasPermission, // Permission checker
    setIdentity    // Identity setter (demo only)
  } = useAuth();

  // Check permissions
  if (hasPermission('space:enter')) {
    // User can access Space
  }
}
```

### Permission Checking

```typescript
// Single permission
const canView = hasPermission('learn:view_all');

// Multiple permissions (any)
const canAccess = ['space:enter', 'forum:post'].some(hasPermission);
```

## Identity Types

See [Identity Types](./identity-types.md) for detailed information.

## Permissions

See [Permissions](./permissions.md) for the complete permission matrix.

## Demo Mode

The platform includes a demo mode where users can switch between identity types to test different permission levels. This is controlled by the Identity Switcher in the navigation bar.

In production, this would be replaced with actual authentication:
- OAuth providers (Google, GitHub)
- Email/password authentication
- Session management
