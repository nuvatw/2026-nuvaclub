# Matching Board

The Matching Board is where users find Nunus or recruit Vavas.

## Post Types

### 1. Nunu Looking for Vava (`offering-nunu`)

Posted by Nunus who want to find learners to mentor.

- Describes teaching style
- Lists expertise areas
- Specifies time commitment

### 2. Looking for Nunu (`looking-for-nunu`)

Posted by learners seeking a mentor.

- Describes learning goals
- Lists areas of interest
- Specifies availability

### 3. Nunu Recruiting Vava (`looking-for-vava`)

Posted by Nunus actively recruiting with specific openings.

- Announces available slots
- Describes ideal Vava profile
- May have specific requirements

## Time Selection

### Monthly

- Available for Regular Nunus
- Format: `2026-01`, `2026-02`, etc.
- One month commitment

### Seasonal

- Available for Verified Nunus
- Format: `2026-Q1`, `2026-Q2`, etc.
- Three month commitment

## Posting Limits

Each user can have:
- Max 1 active `offering-nunu` post
- Max 1 active `looking-for-nunu` post
- Max 1 active `looking-for-vava` post
- Total: 3 active posts maximum

## Filters

### By Type
- All types
- Nunu Looking for Vava
- Looking for Nunu
- Nunu Recruiting Vava

### By Time Selection
- All periods
- Monthly Matching
- Seasonal Matching

### By Verification
- Toggle: Verified Nunu Only

### Sort By
- Most Recent
- Oldest
- Most Views
- Most Comments

## Access Control

### Duo Go Users
- Can see regular Nunu posts
- Cannot see Verified Nunu posts (locked)
- Prompted to upgrade for full access

### Duo Run / Fly Users
- Can see all posts
- Can interact with Verified Nunu posts

## Comments

### Public Comments
- Visible to all post viewers
- Used for general questions

### Private Comments
- Visible only to:
  - Post author
  - Comment author
- Used for personal contact info

## Using the Board

### Creating a Post

1. Click "Create Post" button
2. Select post type
3. Write title and content
4. Add relevant tags
5. Select time period
6. Choose visibility (Verified only or all)
7. Submit

### Requesting a Match

1. Browse posts or search by tags
2. View post details
3. Read comments and author profile
4. Click "Request Match"
5. Wait for response

## Code Example

```typescript
// Fetch posts with filters
const { posts, isReady } = useMatchingPosts({
  type: 'offering-nunu',
  isVerifiedNunuOnly: false,
  isActive: true
}, 'newest');

// Check posting limits
const { canPostOfferingNunu, canPost } = useMatchingPostLimits(userId);

// Get visible posts based on user tier
const visiblePosts = getVisiblePosts(ticketType);
```
