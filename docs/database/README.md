# Database System

nuvaClub uses a custom MockDB system for client-side data persistence.

## Overview

MockDB is a localStorage-based database designed for:
- Demonstration and prototyping
- Client-side data persistence
- No backend server required
- Easy data reset and reseeding

## Key Files

```
src/lib/db/
├── core/
│   ├── MockDB.ts          # Main database class
│   ├── Collection.ts      # Generic collection with CRUD
│   └── types.ts           # Core types
├── schema/
│   ├── index.ts           # Schema exports
│   ├── user.schema.ts     # User-related tables
│   ├── learn.schema.ts    # Learn module tables
│   ├── test.schema.ts     # Test module tables
│   ├── space.schema.ts    # Space module tables
│   ├── forum.schema.ts    # Forum module tables
│   ├── shop.schema.ts     # Shop module tables
│   └── sprint.schema.ts   # Sprint module tables
├── seed/
│   ├── index.ts           # Seed orchestrator
│   └── *.seed.ts          # Module seed data
├── hooks/
│   └── use*.ts            # React hooks
├── repositories/
│   └── *Repository.ts     # Data access patterns
├── adapters/
│   └── LocalStorageAdapter.ts
└── provider/
    └── DBProvider.tsx     # React context
```

## Documentation

- [Schema Reference](./schema.md) - All table definitions
- [Seeding Guide](./seeding.md) - Data seeding

## Quick Start

### Accessing the Database

```typescript
import { useDB } from '@/lib/db/provider/DBProvider';

function MyComponent() {
  const db = useDB();

  if (!db) return <Loading />;

  const users = db.users.findAll();
}
```

### Using Hooks (Recommended)

```typescript
import { useCourses, useCompanions } from '@/lib/db/hooks';

function MyComponent() {
  const { courses, isReady } = useCourses();
  const { companions } = useCompanions();
}
```

### Collection Operations

```typescript
// Create
db.users.create({ id: 'u1', name: 'John', ... });

// Read
const user = db.users.findById('u1');
const activeUsers = db.users.findMany({ isActive: true });

// Update
db.users.update('u1', { name: 'Jane' });

// Delete
db.users.delete('u1');
```

## Persistence

Data is automatically saved to localStorage under the key `nuvaclub_db`.

### Reset Database

```javascript
// Browser console
localStorage.clear();
location.reload();
```

Or programmatically:

```typescript
await db.reset(); // Clear and reseed
await db.clear(); // Clear only
```
