# NuvaClub Architecture

## Overview

NuvaClub is a Next.js 15 (App Router) frontend application for an AI learning platform. This document describes the architecture after the restructuring effort to centralize mock data into the `Database` folder.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public-facing routes with Navbar/Footer
│   │   ├── checkout/
│   │   ├── document/
│   │   ├── forum/
│   │   ├── learn/
│   │   ├── member/
│   │   ├── shop/
│   │   ├── space/
│   │   ├── sprint/
│   │   └── test/
│   ├── admin/             # Admin dashboard (separate layout)
│   └── api/               # API routes
│
├── components/            # Shared UI components (atomic design)
│   ├── atoms/            # Basic building blocks (Button, Card, Badge, Modal, Skeleton)
│   ├── molecules/        # Compositions (Dropdown, Pagination, SearchBar, RatingStars)
│   ├── organisms/        # Complex components (Navbar, Footer, HeroCarousel)
│   ├── icons/            # Icon components
│   ├── skeletons/        # Loading skeleton components
│   └── templates/        # Page templates (currently empty)
│
├── Database/              # ** SINGLE SOURCE OF TRUTH FOR MOCK DATA **
│   ├── tables/           # Table-like modules for each entity type
│   │   ├── users.ts
│   │   ├── courses.ts
│   │   ├── forumPosts.ts
│   │   ├── comments.ts
│   │   ├── events.ts
│   │   ├── products.ts
│   │   ├── plans.ts
│   │   ├── seasons.ts
│   │   ├── sprints.ts
│   │   ├── companions.ts
│   │   └── ...
│   ├── schema.ts         # TypeScript types for all tables
│   ├── utils/            # Helper functions (getById, list, find, etc.)
│   ├── seed/             # Seed data generators (optional)
│   ├── index.ts          # Main entry - re-exports all tables
│   └── README.md         # Documentation for Database usage
│
├── features/              # Feature-based modules
│   ├── auth/             # Authentication (mock login, permissions)
│   ├── checkout/         # Checkout flow
│   ├── document/         # Document viewer
│   ├── duo/              # Duo pass system
│   ├── forum/            # Forum discussions
│   ├── home/             # Homepage content
│   ├── keyboard-shortcuts/
│   ├── learn/            # Courses and lessons
│   ├── mission/          # Missions/challenges
│   ├── shared/           # Shared feature utilities
│   ├── shop/             # E-commerce (products, events, plans)
│   ├── space/            # Community space
│   ├── sprint/           # Sprint challenges
│   └── test/             # AI skill tests
│
├── hooks/                 # Shared React hooks
│
├── lib/                   # Core utilities
│   ├── constants/        # Application constants
│   ├── db/               # MockDB runtime (collections, persistence)
│   └── utils/            # Utility functions
│
├── mocks/                 # ** DEPRECATED - Use Database instead **
│   └── index.ts          # Re-exports from Database for compatibility
│
└── data/                  # ** DEPRECATED - Use Database instead **
    └── index.ts          # Re-exports from Database for compatibility
```

## Key Concepts

### Database (Mock Data Layer)

All mock data lives in `src/Database/`. Each entity type is a "table":

```typescript
// src/Database/tables/users.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  identity?: UserIdentity;
}

export const UsersTable: User[] = [...];

export const getUserById = (id: string) => UsersTable.find(u => u.id === id);
export const getUsers = () => UsersTable;
```

Import from Database:
```typescript
import { UsersTable, getUserById } from '@/Database/tables/users';
// or
import { UsersTable } from '@/Database';
```

### MockDB (Runtime Layer)

`src/lib/db/` provides a runtime database abstraction with:
- Collections with CRUD operations
- LocalStorage persistence
- Event system for reactivity
- Repository pattern for business logic
- React hooks for data access

The MockDB seeds its data from `Database/tables/` on initialization.

### Features

Each feature module contains:
- `components/` - Feature-specific React components
- `hooks/` - Feature-specific hooks
- `types.ts` - TypeScript interfaces
- `index.ts` - Public exports

Features do NOT contain data files - all data comes from `Database/`.

### Components (Atomic Design)

- **Atoms**: Basic UI elements (Button, Card, Badge, Modal, Skeleton)
- **Molecules**: Combinations of atoms (Dropdown, Pagination, SearchBar)
- **Organisms**: Complex UI sections (Navbar, Footer, HeroCarousel)
- **Icons**: SVG icon components
- **Skeletons**: Loading state components

## Naming Conventions

- **Files**: kebab-case for utilities, PascalCase for components
- **Tables**: PascalCase with `Table` suffix (e.g., `UsersTable`, `CoursesTable`)
- **Types**: PascalCase (e.g., `User`, `Course`, `ForumPost`)
- **Helpers**: camelCase verbs (e.g., `getUserById`, `getCoursesbyCategory`)

## Import Aliases

```json
{
  "@/*": ["./src/*"]
}
```

Examples:
```typescript
import { Button } from '@/components/atoms';
import { UsersTable } from '@/Database';
import { useAuth } from '@/features/auth';
```

## Data Flow

1. **Static Mock Data**: Defined in `Database/tables/*.ts`
2. **Runtime Persistence**: MockDB loads data, persists to localStorage
3. **React Access**: Use hooks from `@/lib/db/hooks` or feature hooks
4. **UI Rendering**: Components consume data via hooks

## Migration Notes

### Deprecated Paths (Do Not Use)

- `@/mocks/*` - Redirects to `@/Database`
- `@/data/*` - Redirects to `@/Database`
- `@/features/*/data/*` - Moved to `@/Database/tables`

These paths have compatibility re-exports but should not be used in new code.

### Updating Old Imports

```typescript
// OLD (deprecated)
import { MOCK_USERS } from '@/mocks/entities/users.mock';
import { MOCK_COURSES } from '@/features/learn/data/courses';

// NEW (recommended)
import { UsersTable } from '@/Database/tables/users';
import { CoursesTable } from '@/Database/tables/courses';
// or
import { UsersTable, CoursesTable } from '@/Database';
```
