# Forum Posts

Creating and managing forum posts.

## Post Structure

```typescript
interface PostRecord {
  id: string;
  authorId: string;
  category: 'question' | 'discussion' | 'showcase' | 'announcement';
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  score: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Creating Posts

### Requirements

- Explorer+ subscription
- Title (10-200 characters)
- Content (minimum 20 characters)
- Category selection
- Tags (1-5 tags)

### Post Form

```typescript
<PostForm
  onSubmit={handleCreate}
  categories={['question', 'discussion', 'showcase']}
  maxTags={5}
/>
```

## Post Categories

### Question ❓

- Ask for help or clarification
- Can be marked as "answered"
- Best answer highlighted

### Discussion 💬

- General conversations
- Opinion sharing
- Community topics

### Showcase 🎨

- Share projects
- Demo AI creations
- Portfolio pieces

### Announcement 📢

- Admin/moderator only
- Platform updates
- Important notices

## Tags

- User-defined tags
- Searchable
- Used for filtering

```typescript
interface PostTagRecord {
  id: string;
  postId: string;
  tag: string;
}
```

## Post Actions

| Action | Who Can |
|--------|---------|
| Edit | Author |
| Delete | Author, Moderator |
| Pin | Moderator |
| Lock | Moderator |
| Report | Any user |

## Using Posts

```typescript
// Get all posts
const { posts, isReady } = usePosts();

// Get single post
const post = usePost(postId);

// Filter by category
const questions = posts.filter(p => p.category === 'question');
```
