# Space Feature

Space is the mentorship matching system in nuvaClub. It connects learners (Vavas) with mentors (Nunus) for personalized guidance.

## Overview

Space provides:
- **My Space** - View your current Nunu/Vava relationships
- **Matching Board** - Find Nunus or recruit Vavas
- **Official Companions** - Match with platform-verified mentors

## Key Concepts

### Nunu (Mentor)

A Nunu is a mentor who helps learners (Vavas) on their AI learning journey.

Types:
- **Regular Nunu** - Community mentors, monthly matching
- **Verified Nunu** - Certified by platform, seasonal matching

Levels: N5 (beginner) → N1 (master)

### Vava (Learner)

A Vava is a learner being mentored by a Nunu.

### Official Companions

Platform-verified mentors:
- **Nunu** - Basic companions (Go ticket)
- **Certified Nunu** - Advanced companions (Run ticket)
- **Shangzhe** - Founder 1:1 (Fly ticket)

## Access Control

| Feature | Duo Go | Duo Run | Duo Fly |
|---------|--------|---------|---------|
| Enter Space | ✓ | ✓ | ✓ |
| View Nunu posts | ✓ | ✓ | ✓ |
| View Verified Nunu posts | ✗ | ✓ | ✓ |
| Match with Nunu | ✓ | ✓ | ✓ |
| Match with Certified Nunu | ✗ | ✓ | ✓ |
| Match with Shangzhe | ✗ | ✗ | ✓ |
| Apply to become Nunu | ✓ | ✓ | ✓ |

## Documentation

- [Nunu System](./nunu-system.md) - Becoming and managing Nunu status
- [Matching Board](./matching-board.md) - Using the matching board
- [Access Control](./access-control.md) - Detailed permissions

## Key Files

```
src/features/space/
├── components/
│   ├── MySpaceSection/
│   │   ├── MySpaceSection.tsx
│   │   ├── PairingCard.tsx
│   │   ├── NunuDashboard.tsx
│   │   ├── NunuApplicationCard.tsx
│   │   └── EmptyPairingState.tsx
│   └── MatchingBoard/
│       ├── MatchingBoardSection.tsx
│       ├── MatchingPostCard.tsx
│       ├── MatchingFilters.tsx
│       ├── MatchingPostDetail.tsx
│       ├── MatchingCommentList.tsx
│       ├── MatchingCommentForm.tsx
│       └── LockedPostCard.tsx
├── types.ts
└── data/
    ├── companions.ts
    └── nunu-levels.ts
```

## Database Tables

- `companions` - Official companion profiles
- `companionExpertise` - Companion skills (junction)
- `matches` - User-companion matches
- `matchRatings` - Match feedback
- `userMentorships` - Nunu-Vava relationships
- `nunuApplications` - Nunu applications
- `nunuProfiles` - Approved Nunu profiles
- `matchingPosts` - Matching board posts
- `matchingPostTags` - Post tags (junction)
- `matchingComments` - Post comments
