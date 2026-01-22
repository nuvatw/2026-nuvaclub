# Database Seeding

This guide explains how seed data is created and managed.

## Seeding Process

When the database initializes:

1. Check if data exists in localStorage
2. If no data, run `seedAll()` function
3. Seed modules in dependency order
4. Persist to localStorage

## Seed Order

```typescript
// src/lib/db/seed/index.ts
export async function seedAll(db: MockDB): Promise<void> {
  // 1. Users first (no dependencies)
  await seedUsers(db);

  // 2. Learn module (depends on users)
  await seedLearn(db);

  // 3. Forum module (depends on users)
  await seedForum(db);

  // 4. Space module (depends on users, duo tickets)
  await seedSpace(db);

  // 5. Sprint module (depends on users)
  await seedSprint(db);

  // 6. Shop module (depends on users)
  await seedShop(db);

  // 7. Test module (depends on users)
  await seedTest(db);
}
```

## Test Users

### Standard Users

```typescript
// User IDs for testing
const TEST_USERS = {
  guest: 'user-guest',
  free: 'user-free',
  explorer: 'user-explorer',
  traveler: 'user-traveler',
  duoGo: 'user-duo-go',
  duoRun: 'user-duo-run',
  duoFly: 'user-duo-fly',
};
```

### Special Users

```typescript
const SPECIAL_USERS = {
  nunuMentor: 'user-nunu-mentor',  // Dedicated mentor
  vavaAlice: 'user-vava-alice',    // Learner
  vavaBob: 'user-vava-bob',        // Learner
  // ... more vavas
};
```

## Space Seed Data

### Companions

6 official companions:
- 3 Nunu (Go tier)
- 2 Certified Nunu (Run tier)
- 1 Shangzhe (Fly tier)

### Mentorships

Pre-seeded relationships:
- Nunu Mentor → Duo Go, Run, Fly users
- Duo Go → 1 Vava
- Duo Run → 5 Vavas
- Duo Fly → 2 Vavas

### Nunu Applications

4 sample applications:
- 2 Approved (Duo Run, Duo Fly users)
- 1 Pending
- 1 Rejected

### Nunu Profiles

3 active Nunu profiles:
- N4 Regular (Duo Run)
- N2 Verified (Duo Fly)
- N1 Verified (Mentor)

### Matching Posts

6 sample posts:
- 2 Offering Nunu (1 regular, 1 verified)
- 2 Looking for Nunu (1 regular, 1 verified)
- 1 Looking for Vava (verified)
- 1 Inactive (closed)

### Matching Comments

12+ comments across posts with:
- Public discussions
- Private messages
- Nested replies

## Adding Seed Data

### New Collection

1. Create schema in `schema/*.schema.ts`
2. Add collection to `MockDB.ts`
3. Create seed function in `seed/*.seed.ts`
4. Add to `seedAll()` in correct order

### Example

```typescript
// In seed/myfeature.seed.ts
export async function seedMyFeature(db: MockDB): Promise<void> {
  db.myCollection.createMany([
    {
      id: 'item-1',
      name: 'First Item',
      createdAt: new Date(),
    },
    // ... more items
  ]);
}
```

## Resetting Data

### Full Reset

```typescript
await db.reset(); // Clears and reseeds
```

### Partial Reset

```typescript
// Clear specific collection
db.matchingPosts.deleteMany({});
db.matchingComments.deleteMany({});

// Reseed specific module
await seedSpace(db);
await db.persist();
```

### Via Console

```javascript
localStorage.removeItem('nuvaclub_db');
location.reload();
```

## Data Relationships

### Foreign Keys (Manual)

MockDB doesn't enforce foreign keys. Use consistent IDs:

```typescript
// User
db.users.create({ id: 'user-1', name: 'John' });

// Related subscription
db.userSubscriptions.create({
  id: 'sub-1',
  userId: 'user-1',  // Must match user ID
  // ...
});
```

### Junction Tables

For many-to-many relationships:

```typescript
// Course tags
db.courseTags.createMany([
  { id: 'ct-1', courseId: 'course-1', tag: 'AI' },
  { id: 'ct-2', courseId: 'course-1', tag: 'ChatGPT' },
]);
```
