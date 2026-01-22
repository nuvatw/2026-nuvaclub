# nuvaClub Playbook/Document Page - Product Requirements Document

## Executive Summary

Transform the existing `/document` page into a comprehensive, interactive playbook that serves as the definitive guide for new and existing users to understand and navigate the nuvaClub platform. The design will be inspired by the game-rule reference project while adapting to nuvaClub's existing design system.

---

## 1. Problem Statement

### Current State
- The `/document` page only contains a Markdown syntax guide
- No document icon in the header for easy access
- New users lack a central place to understand the platform
- No quick navigation to different feature areas
- Missing comprehensive rules, guidelines, and workflows

### Desired State
- Document icon prominently placed in the header (top right)
- Full playbook covering all platform features and rules
- Quick start section with feature-specific navigation
- Hierarchical table of contents for easy navigation
- Professional, engaging design consistent with nuvaClub

---

## 2. Goals & Success Metrics

### Primary Goals
1. Provide a single source of truth for all platform rules and guidelines
2. Enable quick onboarding for new users
3. Reduce support questions through self-service documentation
4. Maintain consistency with nuvaClub's design language

### Success Metrics
- Users can find relevant documentation within 3 clicks
- All major features documented with examples
- Mobile-responsive design with optimal readability

---

## 3. User Personas

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| **New User (Guest)** | First-time visitor exploring the platform | Quick overview, getting started guide |
| **Explorer** | Registered free user | Understanding upgrade benefits, feature access |
| **Solo Traveler** | Paid subscriber | Advanced features, Sprint/Forum rules |
| **Duo Traveler** | Companion plan holder | Space matching, Nunu guidelines |
| **Nunu (Mentor)** | Community mentor | Mentoring guidelines, level progression |

---

## 4. Feature Specifications

### 4.1 Header Document Icon

**Location**: Navbar right side, between main navigation and user area

**Design Specifications**:
- Icon: Book/document icon (consistent with nuvaClub style)
- Size: 36x36px clickable area
- Hover state: Background highlight (neutral-800)
- Tooltip: "Playbook" on hover
- Link: Navigate to `/document`
- Mobile: Include in mobile menu

**Implementation**:
```typescript
// Add to Navbar.tsx
<Link href="/document" className="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
  <BookIcon className="w-5 h-5 text-neutral-400 hover:text-white" />
</Link>
```

### 4.2 Document Page Layout

**Page Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ Header (sticky)                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Back to Home  |  nuvaClub Playbook  |  Search (future)  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   HERO SECTION                        │   │
│  │  "Your Complete Guide to nuvaClub"                    │   │
│  │  Quick navigation cards for each feature              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────┬────────────────────────────────────────┐   │
│  │ Table of    │                                        │   │
│  │ Contents    │       MAIN CONTENT AREA                │   │
│  │ (Sidebar)   │                                        │   │
│  │             │  - Identity System                     │   │
│  │ - Quick     │  - Learn Module                        │   │
│  │   Start     │  - Test Module                         │   │
│  │ - Identity  │  - Forum Guidelines                    │   │
│  │ - Learn     │  - Space & Matching                    │   │
│  │ - Test      │  - Sprint Challenges                   │   │
│  │ - Forum     │  - Shop & Subscriptions                │   │
│  │ - Space     │  - FAQ                                 │   │
│  │ - Sprint    │                                        │   │
│  │ - Shop      │                                        │   │
│  │ - FAQ       │                                        │   │
│  └─────────────┴────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Quick Start Section

**Design**: Grid of feature cards (6 cards, 3x2 on desktop, 2x3 on tablet, 1x6 on mobile)

**Cards**:
| Feature | Icon | Description | Link |
|---------|------|-------------|------|
| Learn | 📚 | Master AI skills with courses | #learn |
| Test | 📝 | Prove your knowledge | #test |
| Forum | 💬 | Connect with community | #forum |
| Space | 🤝 | Find your companion | #space |
| Sprint | 🚀 | Build and showcase projects | #sprint |
| Shop | 🛒 | Upgrade your experience | #shop |

**Card Styling**:
- Background: neutral-900/800 with hover effect
- Border: neutral-800 with primary-500 on hover
- Icon size: 32px
- Click action: Smooth scroll to section

### 4.4 Table of Contents (Sidebar)

**Desktop Behavior**:
- Fixed position on left side
- Width: 256px
- Collapsible with toggle button
- Active section highlighting
- Smooth scroll on click

**Mobile Behavior**:
- Hidden by default
- Accessible via hamburger menu
- Full-screen overlay
- Touch-friendly tap targets (44px min)

**TOC Items**:
```
1. Quick Start
2. Your Identity
   2.1 Guest
   2.2 Explorer
   2.3 Solo Traveler
   2.4 Duo Traveler
   2.5 Identity Comparison
3. Learn
   3.1 Course Access Levels
   3.2 How to Learn
   3.3 Progress Tracking
4. Test
   4.1 Level System
   4.2 Question Types
   4.3 Scoring & Passing
5. Forum
   5.1 Posting Guidelines
   5.2 Categories
   5.3 Voting System
   5.4 Markdown Guide
6. Space
   6.1 What is Space?
   6.2 Nunu & Vava
   6.3 Matching Process
   6.4 Duo Tickets
7. Sprint
   7.1 What is Sprint?
   7.2 Seasons & Sprints
   7.3 Submitting Projects
   7.4 Voting
8. Shop
   8.1 Plans
   8.2 Duo Tickets
   8.3 Events
   8.4 Merchandise
9. FAQ
```

### 4.5 Content Sections

Each section follows a consistent structure:

**Section Template**:
```
## [Section Title]

### Overview
Brief introduction to the feature (2-3 sentences)

### Key Concepts
- Concept 1: Description
- Concept 2: Description
- Concept 3: Description

### Rules & Guidelines
1. Rule one
2. Rule two
3. Rule three

### Access by Identity
| Feature | Guest | Explorer | Solo | Duo |
|---------|-------|----------|------|-----|
| ...     | ...   | ...      | ...  | ... |

### Tips & Best Practices
> Pro tip: [Helpful advice]

### Related Links
- [Link to feature page]
- [Link to related documentation]
```

---

## 5. Content Outline

### 5.1 Quick Start
- Welcome message
- Platform overview (5 pillars: Learn, Test, Forum, Space, Sprint + Shop)
- Getting started in 3 steps
- Link to identity explanation

### 5.2 Identity System

**Guest**:
- Who: Unregistered visitors
- Can: View first chapter, browse forum, view shop
- Cannot: Post, comment, access full courses
- Upgrade path: Register to become Explorer

**Explorer**:
- Who: Registered free users
- Can: Access free courses, interact in forum, browse Sprint
- Cannot: Access paid courses, upload Sprint projects
- Upgrade path: Subscribe to become Solo Traveler

**Solo Traveler**:
- Who: Paid subscribers
- Can: All courses, forum posting, Sprint uploads
- Cannot: Space matching (no Duo Ticket)
- Upgrade path: Purchase Duo Ticket

**Duo Traveler**:
- Who: Solo Traveler with active Duo Ticket
- Can: Everything + Space matching
- Levels: Go, Run, Fly (increasing benefits)

**Comparison Table**:
| Capability | Guest | Explorer | Solo | Duo Go | Duo Run | Duo Fly |
|------------|-------|----------|------|--------|---------|---------|
| View First Chapter | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Free Courses | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All Courses | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Forum Read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forum Post | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Sprint Browse | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sprint Upload | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Sprint Vote | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Space Access | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Match Nunu | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Match Certified | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| Match Founder | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### 5.3 Learn Module

- What it is: Structured courses on AI tools and skills
- Course access levels: First-chapter, Free, Paid
- How to start a course
- Progress tracking
- Completion certificates (if applicable)

### 5.4 Test Module

- Purpose: Validate your AI knowledge
- Level system: Beginner → Intermediate → Advanced → Expert
- Question types: True/False, Multiple Choice, Short Answer, Essay
- Scoring: Passing threshold, time limits
- Unlocking levels
- Retaking tests

### 5.5 Forum Guidelines

- Purpose: Community discussion and knowledge sharing
- Categories: Discussion, Question, Share, Resource, Announcement
- Posting guidelines:
  - Be respectful
  - Use clear titles
  - Proper categorization
  - No spam or self-promotion
- Voting system: Upvote/downvote mechanics
- Markdown formatting guide (link to full guide)

### 5.6 Space & Matching

- What is Space: Companion matching platform
- Roles:
  - **Nunu (Mentor)**: Experienced guides who help Vavas
  - **Vava (Mentee)**: Learners seeking guidance
- Duo Tickets explained:
  - Go: Match with regular Nunu
  - Run: Match with Certified Nunu
  - Fly: Match with founder
- Matching process:
  1. Purchase Duo Ticket
  2. Enter Space
  3. Browse available Nunus or wait for match
  4. Start mentorship

### 5.7 Sprint Challenges

- What is Sprint: Project-based challenges
- Seasons and Sprints:
  - Season = Quarter (Q1, Q2, Q3, Q4)
  - Sprint = Monthly theme within a season
- Participation:
  - Browse projects (Explorer+)
  - Upload projects (Solo Traveler+)
  - Vote on projects (Solo Traveler+)
- Project requirements:
  - Title and description
  - Thumbnail image
  - Tech stack
  - Optional: GitHub, live demo

### 5.8 Shop & Subscriptions

- Plans:
  - Explorer (free)
  - Solo Traveler ($990/month)
- Duo Tickets:
  - Go: Monthly/Quarterly
  - Run: Monthly/Quarterly
  - Fly: Monthly/Quarterly
- Events: Workshops, meetups
- Merchandise: nuvaClub branded items

### 5.9 FAQ

Common questions organized by category:
- Account & Registration
- Billing & Subscriptions
- Courses & Learning
- Forum & Community
- Space & Matching
- Sprint & Projects
- Technical Issues

---

## 6. Technical Implementation

### 6.1 File Structure

```
src/
├── app/(public)/document/
│   └── page.tsx              # Main playbook page
├── features/document/
│   ├── components/
│   │   ├── PlaybookHero.tsx         # Hero section with quick nav
│   │   ├── PlaybookSidebar.tsx      # Table of contents sidebar
│   │   ├── PlaybookSection.tsx      # Reusable section component
│   │   ├── QuickStartCard.tsx       # Feature quick nav card
│   │   ├── IdentityTable.tsx        # Identity comparison table
│   │   └── index.ts
│   ├── data/
│   │   └── playbook-content.ts      # All content data
│   └── types.ts
├── components/
│   ├── icons/
│   │   └── BookIcon.tsx             # Document icon for navbar
│   └── organisms/
│       └── Navbar.tsx               # Updated with document icon
```

### 6.2 Component Hierarchy

```
DocumentPage
├── PlaybookHero
│   ├── Title & Subtitle
│   └── QuickStartGrid
│       └── QuickStartCard (x6)
├── PlaybookLayout
│   ├── PlaybookSidebar
│   │   ├── MobileToggle
│   │   └── TOCItems (recursive)
│   └── PlaybookContent
│       └── PlaybookSection (multiple)
│           ├── SectionHeader
│           ├── SectionContent (Markdown)
│           └── SectionFooter (related links)
```

### 6.3 State Management

- **Active Section**: Track via Intersection Observer
- **Sidebar Open**: useState for mobile toggle
- **Scroll Position**: Track for TOC highlighting

### 6.4 Styling Approach

Use nuvaClub's existing design system:
- Colors: neutral-950/900/800/400, primary-500/400, accent colors
- Typography: Existing font stack
- Spacing: Tailwind scale (consistent with rest of app)
- Components: Reuse Card, Badge, Button atoms

### 6.5 Accessibility

- Semantic HTML (article, section, nav, aside)
- ARIA labels on interactive elements
- Focus visible states
- Keyboard navigation
- Skip to content link
- Proper heading hierarchy

### 6.6 Performance

- Static content (can be server-rendered)
- Lazy loading for images if any
- Minimal JavaScript (mostly CSS for interactions)
- Smooth scroll with CSS scroll-behavior

---

## 7. Design Specifications

### 7.1 Color Palette (Using nuvaClub System)

| Element | Light/Dark Value |
|---------|------------------|
| Page Background | neutral-950 |
| Card Background | neutral-900 |
| Card Border | neutral-800 |
| Primary Text | white |
| Secondary Text | neutral-400 |
| Accent | primary-500 |
| Active Section | primary-500/20 |
| Hover State | neutral-800 |

### 7.2 Typography

| Element | Style |
|---------|-------|
| Page Title | text-4xl font-bold |
| Section Title | text-2xl font-semibold |
| Subsection | text-xl font-medium |
| Body Text | text-base leading-relaxed |
| Caption | text-sm text-neutral-400 |
| Code | font-mono text-sm |

### 7.3 Spacing

| Element | Value |
|---------|-------|
| Page Padding | px-4 sm:px-6 lg:px-8 |
| Section Gap | py-16 |
| Card Padding | p-6 |
| Content Max Width | max-w-4xl |
| Sidebar Width | w-64 |

### 7.4 Responsive Breakpoints

| Breakpoint | Layout Change |
|------------|---------------|
| < 768px (mobile) | Single column, sidebar hidden |
| 768-1024px (tablet) | Single column, sidebar toggle |
| > 1024px (desktop) | Two column with fixed sidebar |

---

## 8. Implementation Phases

### Phase 1: Header Icon & Basic Structure
1. Create BookIcon component
2. Add icon to Navbar (desktop & mobile)
3. Set up page layout skeleton
4. Create basic components structure

### Phase 2: Hero & Quick Start
1. Design and implement PlaybookHero
2. Create QuickStartCard component
3. Implement 6-card grid layout
4. Add smooth scroll navigation

### Phase 3: Sidebar & TOC
1. Create PlaybookSidebar component
2. Implement TOC with nested structure
3. Add Intersection Observer for active tracking
4. Mobile drawer implementation

### Phase 4: Content Sections
1. Create PlaybookSection component
2. Write all content sections
3. Implement identity comparison table
4. Style content with prose typography

### Phase 5: Polish & Accessibility
1. Add all ARIA labels
2. Keyboard navigation testing
3. Mobile responsiveness testing
4. Performance optimization

---

## 9. Content Writing Guidelines

### Tone & Voice
- Friendly and welcoming
- Clear and concise
- Action-oriented
- Consistent terminology

### Formatting Rules
- Use second person ("you")
- Short paragraphs (3-4 sentences max)
- Bullet points for lists
- Tables for comparisons
- Code blocks for technical terms

### Terminology Consistency
| Term | Usage |
|------|-------|
| nuvaClub | Always capitalize both letters |
| Nunu | Mentor role in Space |
| Vava | Mentee role in Space |
| Sprint | Project challenge (capitalize) |
| Space | Matching feature (capitalize) |

---

## 10. Future Enhancements

### Phase 2 (Future)
- Search functionality (like game-rule)
- AI chat assistant (like game-rule)
- Version control for rulebook
- Multi-language support
- Print-friendly version
- Video tutorials embedded
- Interactive examples

---

## 11. Appendix

### A. Reference: game-rule Design System

The game-rule project provides these patterns to adapt:
- TableOfContents component structure
- MarkdownRenderer styling
- SearchDialog pattern
- Responsive sidebar behavior
- Active section highlighting

### B. Existing nuvaClub Components to Reuse

- Card, CardContent, CardHeader
- Badge
- Button
- Motion animations
- cn() utility

### C. External Dependencies

No new dependencies required. All functionality achievable with:
- React 19
- Next.js 15
- Tailwind CSS 4
- Framer Motion (already installed)

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Author: Claude Code*
