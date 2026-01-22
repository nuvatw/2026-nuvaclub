# Sprint Feature

Sprint is the seasonal project showcase system where members submit and vote on AI projects.

## Overview

Sprint provides:
- Seasonal project cycles
- Community voting
- Project showcases
- Awards and recognition

## Key Concepts

### Seasons

Quarterly project cycles:
- Q1: January - March
- Q2: April - June
- Q3: July - September
- Q4: October - December

### Sprints

Time-boxed periods within seasons for submissions.

### Projects

Member-submitted AI projects for community voting.

## Access Control

| Feature | Guest | Free | Explorer+ |
|---------|-------|------|-----------|
| View projects | ✓ | ✓ | ✓ |
| Submit project | ✗ | ✗ | ✓ |
| Vote | ✗ | ✗ | ✓ |

## Key Files

```
src/features/sprint/
├── components/
│   ├── SprintWorkCard.tsx
│   └── SprintFilters.tsx
└── types.ts

src/lib/db/hooks/
└── useSprints.ts

src/app/(public)/sprint/
├── page.tsx              # Sprint overview
└── [seasonId]/
    └── page.tsx          # Season detail
```

## Documentation

- [Seasons](./seasons.md) - Season and sprint cycles
- [Projects](./projects.md) - Project submission and voting
