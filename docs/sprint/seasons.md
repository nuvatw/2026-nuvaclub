# Seasons

Seasonal cycles for project submissions and showcases.

## Season Structure

```
Season (Quarter)
├── Sprint 1 (Month 1)
│   ├── Submission Phase
│   ├── Voting Phase
│   └── Results
├── Sprint 2 (Month 2)
│   └── ...
├── Sprint 3 (Month 3)
│   └── ...
└── Season Finale
```

## Season Schema

```typescript
interface SeasonRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  theme?: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

## Sprint Schema

```typescript
interface SprintRecord {
  id: string;
  seasonId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  votingStart: Date;
  votingEnd: Date;
  status: 'upcoming' | 'submission' | 'voting' | 'completed';
  createdAt: Date;
}
```

## Sprint Phases

### Submission Phase

- Members submit projects
- Can edit until deadline
- No voting yet

### Voting Phase

- Submissions closed
- Community voting open
- Projects displayed randomly

### Results Phase

- Voting closed
- Winners announced
- Showcased on platform

## Season Themes

Optional themes for seasons:
- "AI for Productivity"
- "Creative AI"
- "Automation Challenge"
- "Business Solutions"

## Timeline Example

**Season: 2026 Q1**

| Sprint | Dates | Theme |
|--------|-------|-------|
| Sprint 1 | Jan 1-31 | Open |
| Sprint 2 | Feb 1-28 | Automation |
| Sprint 3 | Mar 1-31 | Business |
| Finale | Apr 1-7 | Awards |

## Using Seasons

```typescript
// Get current season
const { currentSeason, activeSprint } = useSeason();

// Get all seasons
const { seasons } = useSprints();

// Get season by ID
const season = useSeason(seasonId);
```
