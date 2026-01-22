# nuvaClub Platform Documentation

Welcome to the nuvaClub platform documentation. nuvaClub is an AI education platform that helps learners master AI tools and concepts through structured courses, mentorship, and community engagement.

## Platform Overview

nuvaClub provides a comprehensive learning ecosystem with the following key features:

### Core Features

| Feature | Description | Entry Point |
|---------|-------------|-------------|
| **Learn** | Video courses and tutorials on AI tools | `/learn` |
| **Test** | 12-level assessment system | `/test` |
| **Space** | Mentorship matching (Nunu-Vava system) | `/space` |
| **Forum** | Community discussions and Q&A | `/forum` |
| **Shop** | Subscriptions, tickets, events, merch | `/shop` |
| **Sprint** | Seasonal projects and showcases | `/sprint` |

### User Identity Types

nuvaClub uses a tiered identity system based on subscription and ticket purchases:

- **Guest** - Unauthenticated visitors
- **Free** - Registered users without subscription
- **Explorer** - Basic monthly subscription
- **Traveler** - Premium yearly subscription
- **Duo Go** - Monthly companion ticket
- **Duo Run** - Seasonal companion ticket (certified mentors)
- **Duo Fly** - Seasonal companion ticket (1:1 with founder)

## Documentation Structure

```
docs/
├── README.md                 # This file
├── getting-started.md        # Quick start guide
├── architecture.md           # Technical architecture
│
├── learn/                    # Learn feature docs
│   ├── README.md
│   ├── courses.md
│   └── instructors.md
│
├── test/                     # Test feature docs
│   ├── README.md
│   ├── levels.md
│   └── scoring.md
│
├── space/                    # Space feature docs
│   ├── README.md
│   ├── nunu-system.md
│   ├── matching-board.md
│   └── access-control.md
│
├── forum/                    # Forum feature docs
│   ├── README.md
│   ├── posts.md
│   └── moderation.md
│
├── shop/                     # Shop feature docs
│   ├── README.md
│   ├── products.md
│   ├── subscriptions.md
│   └── checkout.md
│
├── sprint/                   # Sprint feature docs
│   ├── README.md
│   ├── seasons.md
│   └── projects.md
│
├── auth/                     # Authentication docs
│   ├── README.md
│   ├── identity-types.md
│   └── permissions.md
│
└── database/                 # Database docs
    ├── README.md
    ├── schema.md
    └── seeding.md
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Database**: MockDB (localStorage-based for demo)
- **State**: React Context + Custom Hooks

## Quick Links

- [Getting Started](./getting-started.md)
- [Architecture Overview](./architecture.md)
- [Authentication & Permissions](./auth/README.md)
- [Database Schema](./database/schema.md)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Test Accounts

For testing different user identities, use the Identity Switcher in the navigation bar. Available test identities:

| Identity | Features Access |
|----------|----------------|
| Guest | Public content only |
| Free | Basic course access |
| Explorer | Full course access |
| Traveler | All content + priority |
| Duo Go | Space access (Nunu matching) |
| Duo Run | Space + Certified Nunu |
| Duo Fly | Space + 1:1 with Shangzhe |
