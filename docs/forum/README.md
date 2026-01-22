# Forum Feature

The Forum is a community space for discussions, questions, and knowledge sharing.

## Overview

Forum provides:
- Category-based discussions
- Voting system
- Nested comments
- Pin/lock functionality

## Categories

| Category | Purpose | Icon |
|----------|---------|------|
| Question | Ask for help | ❓ |
| Discussion | General topics | 💬 |
| Showcase | Share projects | 🎨 |
| Announcement | Official updates | 📢 |

## Access Control

| Feature | Guest | Free | Explorer+ |
|---------|-------|------|-----------|
| Read posts | ✓ | ✓ | ✓ |
| Create posts | ✗ | ✗ | ✓ |
| Comment | ✗ | ✓ | ✓ |
| Vote | ✗ | ✓ | ✓ |

## Key Files

```
src/features/forum/
├── components/
│   ├── PostCard.tsx
│   └── PostForm.tsx
└── types.ts

src/lib/db/hooks/
└── usePosts.ts

src/app/(public)/forum/
├── page.tsx           # Post list
└── [postId]/
    └── page.tsx       # Post detail
```

## Documentation

- [Posts](./posts.md) - Creating and managing posts
- [Moderation](./moderation.md) - Voting and moderation
