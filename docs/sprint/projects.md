# Projects

Submitting and voting on AI projects in Sprint.

## Project Structure

```typescript
interface ProjectRecord {
  id: string;
  sprintId: string;
  authorId: string;
  title: string;
  description: string;
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  voteCount: number;
  viewCount: number;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Submission Requirements

### Required Fields

- Title (10-100 characters)
- Description (100-2000 characters)
- Thumbnail image
- Tech stack tags

### Optional Fields

- Demo URL (live project)
- Repository URL
- Video walkthrough

## Tech Stack Tags

```typescript
interface ProjectTechStackRecord {
  id: string;
  projectId: string;
  technology: string;
}
```

Common tags:
- ChatGPT
- Claude
- Make.com
- Zapier
- Python
- JavaScript
- API Integration

## Submission Flow

```
1. Create Draft
   ↓
2. Add Details
   ↓
3. Upload Media
   ↓
4. Submit
   ↓
5. Review (if needed)
   ↓
6. Published
```

## Voting System

### Vote Schema

```typescript
interface ProjectVoteRecord {
  id: string;
  projectId: string;
  voterId: string;
  createdAt: Date;
}
```

### Voting Rules

- One vote per user per project
- Can change vote during voting phase
- Cannot vote for own project
- Explorer+ subscription required

## Project Display

```typescript
<SprintWorkCard
  project={project}
  showVoting={isVotingPhase}
  onVote={handleVote}
  isVoted={userVoted}
/>
```

## Ranking

Projects ranked by:
1. Vote count (primary)
2. View count (tiebreaker)
3. Submission time (tiebreaker)

## Awards

### Sprint Awards

- **Winner** - Most votes
- **Runner-up** - Second place
- **Community Pick** - Editor's choice

### Season Awards

- **Season Champion** - Best overall
- **Rising Star** - Best newcomer
- **Innovation Award** - Most creative

## Moderation

Projects may be:
- **Approved** - Meets guidelines
- **Rejected** - Violates rules
- **Featured** - Staff pick

Rejection reasons:
- Incomplete submission
- Inappropriate content
- Copyright issues
- Quality concerns
