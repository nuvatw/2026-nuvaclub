# Nunu System

The Nunu system allows community members to become mentors and guide other learners.

## Nunu Levels

| Level | Name | Max Vavas | Description |
|-------|------|-----------|-------------|
| N5 | Beginner Nunu | 3 | Entry level mentor |
| N4 | Intermediate Nunu | 5 | Mid-level mentor |
| N3 | Senior Nunu | 10 | Advanced mentor |
| N2 | Expert Nunu | 30 | Expert-level mentor |
| N1 | Master Nunu | 50 | Highest level mentor |

## Nunu Types

### Regular Nunu

- Monthly time selection
- Standard matching
- Open to all Duo ticket holders

### Verified Nunu

- Seasonal time selection
- Certified by platform
- Visible only to Duo Run and Duo Fly users
- Higher credibility and reach

## Becoming a Nunu

### Application Process

1. **Eligibility**: Must have a Duo ticket (Go, Run, or Fly)
2. **Apply**: Submit application with:
   - Why you want to become a Nunu
   - Your expertise areas
   - Discord ID for contact
3. **Review**: Platform reviews application
4. **Approval**: If approved, you become an N5 Nunu

### Application Status

- **Pending**: Under review
- **Approved**: You're now a Nunu
- **Rejected**: With feedback for reapplication

## Managing Vavas

As a Nunu, you can:

### Dashboard Features

- View your current level and max Vava capacity
- See list of current Vavas with session counts
- Track your rating and total mentorships
- Toggle availability status

### Vava Management

- Accept new Vavas (up to your level limit)
- Track session progress
- Leave notes for each Vava
- Complete or pause mentorships

## Level Progression

Factors affecting level:
- Number of completed mentorships
- Average rating from Vavas
- Session consistency
- Time as Nunu

## Code Example

```typescript
// Check if user is a Nunu
const { isNunu, profile, canAcceptMoreVavas } = useNunuProfile(userId);

// Get user's mentorships
const { myVavas, activeVavaCount } = useMentorships(userId);

// Apply to become Nunu
const handleApply = async (applicationData) => {
  await db.nunuApplications.create({
    userId,
    status: 'pending',
    ...applicationData
  });
};
```

## Database Schema

```typescript
interface NunuProfileRecord {
  id: string;
  userId: string;
  applicationId: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  type: 'regular' | 'verified';
  bio: string;
  expertise: string[];
  discordId: string;
  currentVavaCount: number;
  totalMentorships: number;
  avgRating: number;
  totalRatings: number;
  isAvailable: boolean;
}
```
