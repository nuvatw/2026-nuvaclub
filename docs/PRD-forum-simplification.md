# PRD: Forum Section Simplification

## Overview

Simplify the Forum section UI by removing unnecessary elements and streamlining the filtering experience to reduce visual clutter and improve usability.

## Current State

### File Location
- `/src/app/(public)/forum/page.tsx`

### Current Components

| Component | Location | Description |
|-----------|----------|-------------|
| TrendingCard | Left sidebar | Shows top 3 trending posts with scores and comment counts |
| ContributorsCard | Left sidebar | Shows top 5 contributors with avatars and points |
| Community Forum card | Right sidebar | Welcome message + Create Post button |
| Community Rules card | Right sidebar | 4 rules displayed in a bordered card |
| FeedToolbar | Main feed | Category pills, sort options (Hot/New/Top), time filter |
| Global Search | Page header | Left-aligned search input (max-w-xl) |
| Tags | Post cards | Displayed as pills showing first 3 tags + "+X more" |

### Current Sort Options (line 97-101)
```typescript
const SORT_OPTIONS = [
  { value: 'hot', label: 'Hot', icon: 'fire' },
  { value: 'recent', label: 'New', icon: 'clock' },
  { value: 'popular', label: 'Top', icon: 'trending-up' },
];
```

### Current Time Filters (line 90-95)
```typescript
const TIME_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'Past Month' },
  { value: 'week', label: 'Past Week' },
  { value: 'day', label: '24 Hours' },
];
```

---

## Proposed Changes

### 1. Remove Community Rules Card

**What:** Delete the "Community Rules" card from the right sidebar.

**Location:** `RightSidebar` component (lines 590-608)

**Code to remove:**
```tsx
{/* Community Rules */}
<div className="bg-[#1a1a1b] border border-[#343536] rounded-[4px] overflow-hidden">
  <div className="px-3 py-2.5 border-b border-[#343536]">
    <span className="text-xs font-bold text-[#d7dadc]">Community Rules</span>
  </div>
  <div className="p-3 space-y-2">
    {[
      'Be respectful and constructive',
      'No spam or self-promotion',
      'Stay on topic',
      'Use appropriate tags',
    ].map((rule, i) => (
      <div key={i} className="flex items-start gap-2 text-xs text-[#818384]">
        <span className="text-[#6b6c6d] font-medium">{i + 1}.</span>
        <span>{rule}</span>
      </div>
    ))}
  </div>
</div>
```

---

### 2. Remove Trending Content (TrendingCard)

**What:** Remove the "Trending Now" card from the left sidebar.

**Location:**
- `TrendingCard` component definition (lines 107-169)
- Left sidebar usage (line 678)
- Mobile sidebar usage (line 696)

**Components to remove:**
1. The entire `TrendingCard` function component
2. Usage in left sidebar: `<TrendingCard />`
3. Usage in mobile sidebar grid: `<TrendingCard />`

**Note:** The `ContributorsCard` remains in the left sidebar.

---

### 3. Simplify Sort Options to Popular and Latest

**What:** Reduce sort options from 3 (Hot, New, Top) to 2 (Popular, Latest).

**Location:** `SORT_OPTIONS` constant (lines 97-101)

**Before:**
```typescript
const SORT_OPTIONS = [
  { value: 'hot', label: 'Hot', icon: 'fire' },
  { value: 'recent', label: 'New', icon: 'clock' },
  { value: 'popular', label: 'Top', icon: 'trending-up' },
];
```

**After:**
```typescript
const SORT_OPTIONS: { value: SortOption; label: string; icon: 'clock' | 'trending-up' }[] = [
  { value: 'popular', label: 'Popular', icon: 'trending-up' },
  { value: 'recent', label: 'Latest', icon: 'clock' },
];
```

**Additional change:** Update default sort from `'hot'` to `'popular'` (line 620):
```typescript
const [sortBy, setSortBy] = useState<SortOption>('popular');
```

---

### 4. Reduce Time Filter Options

**What:** Reduce time filters from 4 to 3 options (remove "Past Month").

**Location:** `TIME_FILTERS` constant (lines 90-95)

**Before:**
```typescript
const TIME_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'Past Month' },
  { value: 'week', label: 'Past Week' },
  { value: 'day', label: '24 Hours' },
];
```

**After:**
```typescript
const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'week', label: 'Past week' },
  { value: 'day', label: 'Past 24 hours' },
];
```

**Note:** Lowercase "time", "week", "hours" for consistency with request.

---

### 5. Convert Tags to Collapsible Filter

**What:** Transform tags from display-only pills on post cards to a collapsible filter dropdown in the toolbar. Remove "tag" label/text.

**Location:**
- `FeedToolbar` component (add new tag filter)
- `RedditPostCard` component (lines 477-492 - remove tags display)

**Implementation:**

#### 5.1 Add Tag Filter State (in `ForumPage`)
```typescript
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
```

#### 5.2 Extract Unique Tags from Posts
```typescript
const allTags = useMemo(() => {
  const tagSet = new Set<string>();
  posts.forEach(post => post.tags?.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}, [posts]);
```

#### 5.3 Add Collapsed Tag Filter to FeedToolbar
Add a new collapsible dropdown after the time filter:

```tsx
{/* Tag Filter - Collapsed */}
<div className="relative">
  <button
    onClick={() => setIsTagFilterOpen(!isTagFilterOpen)}
    className={cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all border',
      selectedTags.length > 0
        ? 'bg-primary-600/20 text-primary-400 border-primary-600'
        : 'bg-[#272729] text-[#818384] border-[#343536] hover:text-[#d7dadc]'
    )}
  >
    <Icon name="tag" size="sm" />
    {selectedTags.length > 0 ? `${selectedTags.length} selected` : 'Tags'}
    <Icon name="chevron-down" size="sm" className={cn(isTagFilterOpen && 'rotate-180')} />
  </button>

  {isTagFilterOpen && (
    <div className="absolute top-full mt-1 left-0 z-10 bg-[#1a1a1b] border border-[#343536] rounded-[4px] p-2 min-w-[200px] max-h-[300px] overflow-y-auto">
      {allTags.map(tag => (
        <label key={tag} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#272729] rounded cursor-pointer">
          <input
            type="checkbox"
            checked={selectedTags.includes(tag)}
            onChange={() => toggleTag(tag)}
            className="accent-primary-500"
          />
          <span className="text-xs text-[#d7dadc]">{tag}</span>
        </label>
      ))}
      {allTags.length === 0 && (
        <p className="text-xs text-[#818384] px-2 py-1">No tags available</p>
      )}
    </div>
  )}
</div>
```

#### 5.4 Remove Tags from Post Cards
Delete the tags display section from `RedditPostCard` (lines 477-492):
```tsx
{/* Remove this entire block */}
{post.tags && post.tags.length > 0 && (
  <div className="flex flex-wrap gap-1.5 mb-2.5">
    {post.tags.slice(0, 3).map((tag) => (
      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-[#272729] text-[#818384] border border-[#343536]">
        {tag}
      </span>
    ))}
    {post.tags.length > 3 && (
      <span className="text-[10px] text-[#6b6c6d]">+{post.tags.length - 3} more</span>
    )}
  </div>
)}
```

#### 5.5 Update Filtering Logic
Pass `selectedTags` to `usePostsFiltered` hook and filter posts by tags.

---

### 6. Center-Align Search Field

**What:** Move the "Search discussions" input to center alignment.

**Location:** Global Search section (lines 650-671)

**Before:**
```tsx
<div className="relative max-w-xl">
```

**After:**
```tsx
<div className="relative max-w-xl mx-auto">
```

---

## Summary of Changes

| # | Change | Action | Files Affected |
|---|--------|--------|----------------|
| 1 | Remove Community Rules | Delete component | `page.tsx` |
| 2 | Remove Trending content | Delete TrendingCard component and usages | `page.tsx` |
| 3 | Simplify sort options | Reduce to Popular + Latest only | `page.tsx` |
| 4 | Reduce time filters | Remove "Past Month" option | `page.tsx` |
| 5 | Tags as collapsed filter | Add dropdown filter, remove from cards | `page.tsx`, potentially `usePostsFiltered.ts` |
| 6 | Center search field | Add `mx-auto` class | `page.tsx` |

---

## Visual Comparison

### Before
```
┌─────────────────────────────────────────────────────────────┐
│  [Search discussions...                    ]                │
├─────────────┬──────────────────────────────┬───────────────┤
│ Trending    │ [Hot] [New] [Top]            │ Community     │
│ Now         │ Time: [All Time ▼]           │ Forum         │
│ 1. Post     │                              │ [Create Post] │
│ 2. Post     ├──────────────────────────────┤               │
│ 3. Post     │ Post Card                    │ Community     │
│             │   tags: [AI] [Tips] +2 more  │ Rules         │
│ Top         │                              │ 1. Be nice    │
│ Contributors├──────────────────────────────┤ 2. No spam    │
│             │ Post Card                    │ 3. On topic   │
│             │   tags: [Dev] [Help]         │ 4. Use tags   │
└─────────────┴──────────────────────────────┴───────────────┘
```

### After
```
┌─────────────────────────────────────────────────────────────┐
│              [Search discussions...        ]                │
├─────────────┬──────────────────────────────┬───────────────┤
│ Top         │ [Popular] [Latest]           │ Community     │
│ Contributors│ Time: [All time ▼]           │ Forum         │
│             │ Tags: [▼ Tags]               │ [Create Post] │
│             ├──────────────────────────────┤               │
│             │ Post Card                    │               │
│             │   (no inline tags)           │               │
│             ├──────────────────────────────┤               │
│             │ Post Card                    │               │
│             │   (no inline tags)           │               │
└─────────────┴──────────────────────────────┴───────────────┘
```

---

## Dependencies

- No new packages required
- Hooks that may need updates:
  - `usePostsFiltered` - add tag filtering support if not already present

## Acceptance Criteria

- [ ] Community Rules card is removed from right sidebar
- [ ] TrendingCard is removed from left sidebar (desktop and mobile)
- [ ] Sort options show only "Popular" and "Latest"
- [ ] Time filter shows only "All time", "Past week", "Past 24 hours"
- [ ] Tags appear as a collapsible filter dropdown (no "tag" label visible)
- [ ] Search field is center-aligned
- [ ] Existing functionality (search, filtering, sorting) continues to work
- [ ] Mobile responsiveness is maintained
