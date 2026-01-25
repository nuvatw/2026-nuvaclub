# Database - Mock Data Layer

This folder is the **single source of truth** for all mock data in the NuvaClub application.

## Structure

```
Database/
├── tables/           # One file per entity type (like DB tables)
│   ├── users.ts      # User accounts
│   ├── courses.ts    # Learning courses
│   ├── forumPosts.ts # Forum posts
│   ├── comments.ts   # Comments on posts
│   ├── events.ts     # Shop events
│   ├── products.ts   # Shop merchandise
│   ├── plans.ts      # Subscription plans
│   ├── companions.ts # Nunu companions
│   ├── seasons.ts    # Sprint seasons
│   ├── sprints.ts    # Individual sprints
│   └── ...
├── utils/            # Helper functions
│   └── index.ts      # Common utilities
├── schema.ts         # Re-exports all types
├── index.ts          # Main entry point
└── README.md         # This file
```

## Usage

### Importing Data

```typescript
// Import specific table
import { UsersTable, getUserById } from '@/Database/tables/users';

// Import from main entry
import { UsersTable, CoursesTable } from '@/Database';

// Import types
import type { User, Course } from '@/Database/schema';
```

### Table Structure

Each table file exports:

1. **Type definition** - TypeScript interface for the entity
2. **Data array** - The actual mock data (e.g., `UsersTable`)
3. **Helper functions** - Common queries (e.g., `getUserById`, `getUsersByIds`)

Example:

```typescript
// tables/users.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  identity?: UserIdentity;
}

export const UsersTable: User[] = [
  { id: 'user-1', name: 'Alex Chen', ... },
  { id: 'user-2', name: 'Sarah Lin', ... },
];

export const getUserById = (id: string): User | undefined =>
  UsersTable.find(u => u.id === id);

export const getUsersByIds = (ids: string[]): User[] =>
  UsersTable.filter(u => ids.includes(u.id));
```

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Table constant | PascalCase + `Table` | `UsersTable` |
| Type | PascalCase | `User` |
| Helper function | camelCase verb | `getUserById` |
| File name | camelCase | `users.ts` |

## Adding New Tables

1. Create `tables/newEntity.ts`
2. Define the type interface
3. Create the data array as `NewEntityTable`
4. Add helper functions
5. Re-export from `index.ts`

## Relationship to lib/db

The `lib/db/` folder contains the **runtime database** (MockDB) that:
- Loads data from these tables on initialization
- Provides CRUD operations
- Persists changes to localStorage
- Offers React hooks for data access

This `Database/` folder is the **source data** that seeds the runtime DB.

## Migration from Old Paths

The following paths are deprecated and redirect here:

- `@/mocks/*` → `@/Database`
- `@/data/*` → `@/Database`
- `@/features/*/data/*` → `@/Database/tables/*`

Do not add new code to the old paths.
