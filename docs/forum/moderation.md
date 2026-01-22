# Moderation

Voting and moderation system for the forum.

## Voting System

### Upvotes / Downvotes

- All registered users can vote
- One vote per user per item
- Can change vote
- Affects score and visibility

### Score Calculation

```
Score = Upvotes - Downvotes
```

### Vote Storage

```typescript
interface VoteRecord {
  id: string;
  userId: string;
  targetType: 'post' | 'comment';
  targetId: string;
  value: 1 | -1;
  createdAt: Date;
}
```

## Comment System

### Nested Comments

- Parent/child relationships
- Max depth: 3 levels
- Collapsible threads

### Comment Structure

```typescript
interface CommentRecord {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Moderation Actions

### Pin Post

- Stays at top of list
- Moderator only
- Used for important threads

### Lock Post

- No new comments
- Voting disabled
- Used to close discussions

### Delete Post/Comment

- Soft delete (hidden)
- Moderator or author
- Can be appealed

### Report

- Flag inappropriate content
- Reviewed by moderators
- Anonymous reporting

## Moderator Roles

| Role | Permissions |
|------|-------------|
| User | Vote, Comment, Report |
| Author | Edit own, Delete own |
| Moderator | Pin, Lock, Delete any |
| Admin | All + manage moderators |

## Best Practices

1. **Constructive feedback** - Focus on helping
2. **Be respectful** - No personal attacks
3. **Stay on topic** - Use appropriate categories
4. **Search first** - Check existing posts
5. **Provide context** - Detail in questions
