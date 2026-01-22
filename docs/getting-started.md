# Getting Started

This guide will help you set up and run the nuvaClub platform locally.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nuvaclub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (main features)
│   └── layout.tsx         # Root layout
│
├── components/            # Shared UI components
│   └── atoms/             # Base UI elements (Button, Card, etc.)
│
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── learn/             # Courses and lessons
│   ├── test/              # Assessment system
│   ├── space/             # Mentorship matching
│   ├── forum/             # Community forum
│   ├── shop/              # E-commerce
│   └── sprint/            # Projects
│
└── lib/                   # Utilities and core
    ├── db/                # MockDB system
    │   ├── core/          # Database core
    │   ├── schema/        # Type definitions
    │   ├── seed/          # Seed data
    │   ├── hooks/         # React hooks
    │   └── repositories/  # Data access
    └── utils/             # Helper functions
```

## Testing Different User Identities

The platform includes an **Identity Switcher** in the navigation bar that allows you to test different user roles without actual authentication.

### Available Test Identities

1. **Guest** - No authentication
   - Can view public content
   - Cannot access restricted features

2. **Free** - Basic registered user
   - Can access basic courses
   - Limited feature access

3. **Explorer** - Monthly subscription
   - Full course access
   - Forum participation

4. **Traveler** - Yearly subscription
   - All Explorer features
   - Priority access

5. **Duo Go** - Monthly companion ticket
   - Access to Space
   - Match with Nunu mentors

6. **Duo Run** - Seasonal companion ticket
   - All Duo Go features
   - Match with Certified Nunu

7. **Duo Fly** - Premium seasonal ticket
   - All features
   - 1:1 with Shangzhe (founder)

## Resetting the Database

The MockDB uses localStorage for persistence. To reset:

1. **Via Browser Console**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Via Application**
   The database will automatically reseed on first load if no data exists.

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/learn` | Course catalog |
| `/learn/[courseId]` | Course detail |
| `/test` | Assessment levels |
| `/test/[levelId]` | Take a test |
| `/space` | Mentorship matching |
| `/forum` | Community discussions |
| `/shop` | Products and subscriptions |
| `/sprint` | Seasonal projects |

## Development Tips

### Component Patterns

- Use atomic design (atoms → components → features)
- All client components must have `'use client'` directive
- Use hooks from `@/lib/db/hooks` for data access

### Styling

- Use Tailwind CSS classes
- Dark theme by default (neutral-900 backgrounds)
- Use `cn()` utility for conditional classes

### State Management

- Authentication via `useAuth()` hook
- Database via `useDB()` and feature-specific hooks
- No external state management library needed

## Troubleshooting

### Common Issues

1. **Blank page on load**
   - Clear localStorage and refresh
   - Check browser console for errors

2. **Components not rendering**
   - Ensure `'use client'` directive is present
   - Check that hooks are used inside providers

3. **Data not persisting**
   - Verify localStorage is not blocked
   - Check that `db.persist()` is being called
