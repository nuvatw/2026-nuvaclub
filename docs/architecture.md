# Technical Architecture

This document describes the technical architecture of the nuvaClub platform.

## Overview

nuvaClub is built with Next.js 15 using the App Router pattern. It uses a client-side MockDB for data persistence, making it suitable for demonstrations and prototyping without requiring a backend server.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Pages (App Router)                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Learn  │ │  Test   │ │  Space  │ │  Shop   │ ...      │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │
│       │           │           │           │                 │
├───────┴───────────┴───────────┴───────────┴─────────────────┤
│  Feature Modules                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Components  │  Types  │  Data  │  Hooks            │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Shared Layer                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Atoms     │ │    Utils    │ │   Providers  │          │
│  │  (UI Base)  │ │  (Helpers)  │ │  (Auth, DB)  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (MockDB)                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Schema  │  Repositories  │  Hooks  │  Seed Data   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                    ┌───────┴───────┐                       │
│                    │  localStorage │                       │
│                    └───────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### `/src/app` - Next.js Pages

Uses the App Router convention:
- `(public)/` - Route group for public pages
- `layout.tsx` - Root layout with providers
- `page.tsx` - Homepage

### `/src/components` - Shared Components

Atomic design pattern:
- `atoms/` - Base UI elements (Button, Card, Badge, Modal)

### `/src/features` - Feature Modules

Each feature is self-contained:
```
feature/
├── components/     # Feature-specific components
├── types.ts        # TypeScript types
├── data/           # Static data files
└── hooks/          # Feature-specific hooks (if any)
```

### `/src/lib` - Core Libraries

#### `/src/lib/db` - MockDB System

```
db/
├── core/
│   ├── MockDB.ts       # Singleton database class
│   ├── Collection.ts   # Generic collection with CRUD
│   └── types.ts        # Core types
├── schema/
│   ├── index.ts        # Schema exports
│   └── *.schema.ts     # Table definitions
├── seed/
│   ├── index.ts        # Seed orchestrator
│   └── *.seed.ts       # Seed data per module
├── hooks/
│   └── use*.ts         # React hooks for data access
├── repositories/
│   └── *Repository.ts  # Data access patterns
├── adapters/
│   └── *Adapter.ts     # Storage adapters
└── provider/
    └── DBProvider.tsx  # React context provider
```

## Key Patterns

### 1. Authentication Flow

```typescript
// AuthProvider wraps the app
<AuthProvider>
  <App />
</AuthProvider>

// Components use the hook
const { identity, hasPermission, user } = useAuth();

// Permission checks
if (hasPermission('space:enter')) {
  // Show space content
}
```

### 2. Database Access

```typescript
// Via hooks (recommended)
const { courses, isReady } = useCourses();

// Via repository (for complex queries)
const repo = new CourseRepository(db);
const courses = repo.findAllWithRelations();
```

### 3. Component Pattern

```typescript
'use client';

import { motion } from 'motion/react';
import { Button, Card } from '@/components/atoms';

interface MyComponentProps {
  data: MyData;
  onAction?: () => void;
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card>
        {/* Content */}
      </Card>
    </motion.div>
  );
}
```

## State Management

### Global State

- **Authentication**: `AuthProvider` + `useAuth()`
- **Database**: `DBProvider` + `useDB()`
- **Cart**: `CartProvider` + `useCart()`

### Local State

- React's `useState` and `useReducer`
- Form state managed locally

### No External State Library

The application uses React's built-in state management capabilities. For complex state:
- Use context providers
- Use custom hooks for encapsulation
- Use `useMemo` for derived state

## MockDB System

### Collection API

```typescript
// Create
collection.create(item);
collection.createMany(items);

// Read
collection.findAll();
collection.findById(id);
collection.findMany(filter);
collection.findFirst(filter);

// Update
collection.update(id, updates);
collection.upsert(item);

// Delete
collection.delete(id);
collection.deleteMany(filter);
```

### Event System

```typescript
// Subscribe to changes
const unsubscribe = db.subscribe((event) => {
  if (event.collection === 'courses') {
    // Refresh data
  }
});
```

### Persistence

Data is automatically persisted to localStorage via the `LocalStorageAdapter`.

## Performance Considerations

### Code Splitting

- Features are lazy-loaded via dynamic imports
- Large components use `dynamic()` from Next.js

### Memoization

- `useMemo` for expensive computations
- `useCallback` for event handlers passed to children

### Animation

- Framer Motion with reduced motion support
- Stagger animations for lists
- Hardware-accelerated transforms

## Security Notes

This is a demonstration platform with mock authentication:

- No real user credentials
- No server-side validation
- localStorage is not secure storage

For production:
- Implement proper authentication (NextAuth, Clerk, etc.)
- Use a real database (PostgreSQL, MongoDB, etc.)
- Add server-side validation
- Implement proper authorization
