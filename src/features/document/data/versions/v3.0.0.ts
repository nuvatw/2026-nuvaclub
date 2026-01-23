/**
 * Playbook Version 3.0.0 - User-Friendly Redesign
 * Release Date: 2026-01-23
 *
 * Complete rewrite focused on:
 * - Easy to read (clear, simple language)
 * - Fun to read (friendly tone, visuals)
 * - Fast to understand (scannable, concise)
 */

import type { PlaybookVersion } from '../../types';

export const PLAYBOOK_V3_0_0: PlaybookVersion = {
  info: {
    version: '3.0.0',
    releaseDate: '2026-01-23',
    title: 'User-Friendly Playbook',
    description: 'Complete playbook redesign with clearer language, friendlier tone, and faster navigation.',
  },

  changelog: {
    version: '3.0.0',
    releaseDate: '2026-01-23',
    summary: 'We completely rewrote the playbook to make it easier to read, more fun, and faster to understand. No more walls of text!',
    updates: [
      {
        category: 'feature',
        title: 'TL;DR Sections',
        description: 'Every section now starts with a quick summary. Get the gist in 10 seconds.',
      },
      {
        category: 'feature',
        title: 'Visual Roadmaps',
        description: 'See your progression path at a glance with clear visual guides.',
      },
      {
        category: 'improvement',
        title: 'Friendlier Tone',
        description: 'Less corporate speak, more human conversation. We sound like friends now.',
      },
      {
        category: 'improvement',
        title: 'Scannable Format',
        description: 'Bold headers, bullet points, and clear sections. Find what you need fast.',
      },
      {
        category: 'feature',
        title: 'Quick Action Cards',
        description: 'Each section tells you exactly what to do next. No more guessing.',
      },
    ],
  },

  quickStartItems: [
    {
      id: 'learn',
      title: 'Learn',
      description: 'Watch courses, level up your AI skills',
      icon: '📚',
      href: '#learn',
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      id: 'test',
      title: 'Test',
      description: 'Prove what you know, earn badges',
      icon: '📝',
      href: '#test',
      color: 'from-green-500/20 to-green-600/10',
    },
    {
      id: 'forum',
      title: 'Forum',
      description: 'Ask questions, share wins',
      icon: '💬',
      href: '#forum',
      color: 'from-purple-500/20 to-purple-600/10',
    },
    {
      id: 'space',
      title: 'Space',
      description: 'Find a mentor or become one',
      icon: '🤝',
      href: '#space',
      color: 'from-pink-500/20 to-pink-600/10',
    },
    {
      id: 'sprint',
      title: 'Sprint',
      description: 'Build projects, win prizes',
      icon: '🚀',
      href: '#sprint',
      color: 'from-orange-500/20 to-orange-600/10',
    },
    {
      id: 'shop',
      title: 'Shop',
      description: 'Unlock more features',
      icon: '🛒',
      href: '#shop',
      color: 'from-amber-500/20 to-amber-600/10',
    },
  ],

  identityInfo: [
    {
      id: 'guest',
      name: 'Guest',
      description: "You're just browsing. No account yet.",
      color: 'neutral',
      capabilities: [
        'Preview Lv.1 courses (like trailers)',
        'Read forum posts',
        'Check out the shop',
        'Browse Sprint projects',
      ],
      limitations: [
        'No full course access',
        'No posting or commenting',
        'No project uploads',
        'No mentor matching',
      ],
      upgradePath: 'Sign up free to become an Explorer',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: "You're in! Free account, basic access.",
      color: 'primary',
      capabilities: [
        'All Lv.1 courses (free!)',
        'Vote and comment in forum',
        'Your own dashboard',
        'Save favorites',
      ],
      limitations: [
        'Lv.2-10 courses locked',
        'No creating forum posts',
        'No Sprint uploads',
        'No Space access',
      ],
      upgradePath: 'Go Solo Traveler for full access',
    },
    {
      id: 'solo-traveler',
      name: 'Solo Traveler',
      description: 'Full platform access. All courses unlocked.',
      color: 'blue',
      capabilities: [
        'Every single course (Lv.1-10)',
        'Post in forum',
        'Upload Sprint projects',
        'Vote on projects',
        'Priority support',
      ],
      limitations: [
        'No mentor matching (need Duo Ticket)',
      ],
      upgradePath: 'Add a Duo Ticket for Space access',
    },
    {
      id: 'duo-go',
      name: 'Duo Go',
      description: 'Your first step into mentorship.',
      color: 'green',
      capabilities: [
        'Everything Solo Traveler has',
        'Match with Nunu mentors',
        'Discord community access',
        'My Space dashboard',
      ],
      limitations: [
        'No Certified Nunu access',
        'No Founder access',
      ],
      upgradePath: 'Upgrade to Run for Certified Nunus',
    },
    {
      id: 'duo-run',
      name: 'Duo Run',
      description: 'Premium mentorship with the pros.',
      color: 'purple',
      capabilities: [
        'Everything Duo Go has',
        'Certified Nunu mentors',
        'Skip the matching queue',
        'Pro-level guidance',
      ],
      limitations: [
        'No Founder access',
      ],
      upgradePath: 'Upgrade to Fly for Founder access',
    },
    {
      id: 'duo-fly',
      name: 'Duo Fly',
      description: 'VIP. Work directly with the founder.',
      color: 'amber',
      capabilities: [
        'Everything Duo Run has',
        '1:1 with Founder (Shang-Zhe)',
        'AI strategy consulting',
        'Career guidance',
        'Exclusive community',
      ],
      limitations: [],
    },
  ],

  identityCapabilities: [
    {
      feature: 'Preview Lv.1 Courses',
      guest: true,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Full Lv.1 (Free) Courses',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'All Courses (Lv.1-10)',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Personal Dashboard',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Read Forum',
      guest: true,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Vote & Comment',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Create Posts',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Browse Sprint',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Upload Projects',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Vote on Projects',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Space Matching',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Match with Nunu',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Certified Nunu',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: false,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Founder Access',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: false,
      duoRun: false,
      duoFly: true,
    },
    {
      feature: 'Priority Support',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
  ],

  tableOfContents: [
    {
      id: 'quick-start',
      title: 'Quick Start',
      level: 1,
    },
    {
      id: 'version-updates',
      title: "What's New",
      level: 1,
    },
    {
      id: 'identity',
      title: 'Your Level',
      level: 1,
      children: [
        { id: 'identity-guest', title: 'Guest', level: 2 },
        { id: 'identity-explorer', title: 'Explorer', level: 2 },
        { id: 'identity-solo', title: 'Solo Traveler', level: 2 },
        { id: 'identity-duo', title: 'Duo Tickets', level: 2 },
        { id: 'identity-comparison', title: 'Quick Compare', level: 2 },
      ],
    },
    {
      id: 'member-dashboard',
      title: 'Your Dashboard',
      level: 1,
      children: [
        { id: 'dashboard-overview', title: 'Overview', level: 2 },
        { id: 'dashboard-profile', title: 'Profile', level: 2 },
        { id: 'dashboard-courses', title: 'My Courses', level: 2 },
        { id: 'dashboard-favorites', title: 'Favorites', level: 2 },
        { id: 'dashboard-settings', title: 'Settings', level: 2 },
        { id: 'dashboard-space', title: 'My Space', level: 2 },
      ],
    },
    {
      id: 'learn',
      title: 'Learn',
      level: 1,
      children: [
        { id: 'learn-overview', title: 'How It Works', level: 2 },
        { id: 'learn-levels', title: 'The 10 Levels', level: 2 },
        { id: 'learn-access', title: 'Who Gets What', level: 2 },
        { id: 'learn-progress', title: 'Track Progress', level: 2 },
      ],
    },
    {
      id: 'test',
      title: 'Test',
      level: 1,
      children: [
        { id: 'test-overview', title: 'How It Works', level: 2 },
        { id: 'test-levels', title: 'Level by Level', level: 2 },
        { id: 'test-types', title: 'Question Types', level: 2 },
        { id: 'test-scoring', title: 'Pass or Retry', level: 2 },
      ],
    },
    {
      id: 'forum',
      title: 'Forum',
      level: 1,
      children: [
        { id: 'forum-overview', title: 'How It Works', level: 2 },
        { id: 'forum-categories', title: 'Post Types', level: 2 },
        { id: 'forum-guidelines', title: 'House Rules', level: 2 },
        { id: 'forum-markdown', title: 'Formatting Tips', level: 2 },
      ],
    },
    {
      id: 'space',
      title: 'Space',
      level: 1,
      children: [
        { id: 'space-overview', title: 'What Is It?', level: 2 },
        { id: 'space-roles', title: 'Nunu vs Vava', level: 2 },
        { id: 'space-matching', title: 'Get Matched', level: 2 },
        { id: 'space-tickets', title: 'Which Ticket?', level: 2 },
      ],
    },
    {
      id: 'sprint',
      title: 'Sprint',
      level: 1,
      children: [
        { id: 'sprint-overview', title: 'What Is It?', level: 2 },
        { id: 'sprint-seasons', title: 'How It Runs', level: 2 },
        { id: 'sprint-submit', title: 'Submit a Project', level: 2 },
        { id: 'sprint-voting', title: 'Vote & Win', level: 2 },
      ],
    },
    {
      id: 'shop',
      title: 'Shop',
      level: 1,
      children: [
        { id: 'shop-plans', title: 'Plans', level: 2 },
        { id: 'shop-duo', title: 'Duo Tickets', level: 2 },
        { id: 'shop-events', title: 'Events', level: 2 },
        { id: 'shop-merch', title: 'Merch', level: 2 },
      ],
    },
    {
      id: 'faq',
      title: 'FAQ',
      level: 1,
    },
  ],

  content: {
    hero: {
      title: 'The nuvaClub Playbook',
      subtitle: 'Everything you need to know, nothing you don\'t',
      description:
        'Skip the confusion. This guide gets you up and running fast. Learn AI, prove your skills, build projects, find mentors.',
    },

    quickStart: {
      title: 'Quick Start',
      content: `
## TL;DR

**Sign up free** → **Watch courses** → **Level up** → **Join the community**

That's it. You're ready. But if you want the full picture, keep reading.

---

## Your First 5 Minutes

### 1. Create a Free Account
Click "Sign Up" and become an **Explorer**. It's free, no credit card needed.

### 2. Check Your Dashboard
Click your avatar (top right). This is your home base.

### 3. Watch a Course
Head to **Learn** → pick any Lv.1 course → start watching. Progress saves automatically.

### 4. Say Hi
Found something cool? Share it in the **Forum**. Ask a question. Someone will help.

---

## The 6 Pillars

| Pillar | What You Do | Why It Matters |
|--------|-------------|----------------|
| **Learn** | Watch courses | Gain skills |
| **Test** | Take quizzes | Prove it |
| **Forum** | Ask & share | Get help |
| **Space** | Find mentors | Level up faster |
| **Sprint** | Build projects | Show off |
| **Shop** | Upgrade | Unlock more |

---

## Ready for More?

Scroll down or tap any section in the sidebar. Each section has a TL;DR at the top if you're in a hurry.
      `,
    },

    versionUpdates: {
      title: "What's New",
      content: `
## TL;DR

This playbook got a **complete makeover**. Easier to read, faster to scan, actually helpful.

---

## New in v3.0.0

### Every Section Has a TL;DR
No time? No problem. The summary at the top of each section gives you the gist in seconds.

### Less Jargon, More Clarity
We rewrote everything in plain English. If your grandma can't understand it, we rewrote it again.

### Scannable Everything
Bold headers. Bullet points. Tables. Find what you need without reading a novel.

### Clear Next Steps
Every section tells you exactly what to do. No more "now what?"

---

## Previous Updates (v2.0.0)

- Member Dashboard (Profile, My Courses, Favorites)
- 10-Level Course System
- Hero Carousel on Learn page
- Navigation redesign
- Better course cards
      `,
    },

    learn: {
      overview: `
## TL;DR

**Watch video courses** → **Learn AI skills** → **Track your progress**

All courses are organized by difficulty (Lv.1-10). Start at Lv.1, work your way up.

---

## How Learning Works

1. **Browse** - Find a course in the library
2. **Watch** - Stream lessons anytime, anywhere
3. **Progress** - Your spot is saved automatically
4. **Complete** - Finish all lessons to complete the course

### Course Structure

\`\`\`
Course
 └── Chapter 1
      ├── Lesson 1 (video)
      ├── Lesson 2 (video)
      └── Lesson 3 (video)
 └── Chapter 2
      └── ...
\`\`\`

### Finding Courses

- **Hero Carousel** - Featured courses at the top
- **Categories** - Browse by topic (AI Fundamentals, Automation, etc.)
- **Level Filter** - Show only your difficulty level
- **Search** - Find exactly what you need
      `,
      access: `
## Who Gets What

| Your Level | Access |
|------------|--------|
| **Guest** | Preview only (like movie trailers) |
| **Explorer** | All Lv.1 courses (free!) |
| **Solo Traveler+** | Every course, every level |

### The Simple Version

- **Free account?** You get all Lv.1 (beginner) courses. That's a lot!
- **Want more?** Subscribe to Solo Traveler for Lv.2-10
      `,
      progress: `
## Tracking Your Progress

Your dashboard shows everything:

- **Progress Bar** - How much of each course you've completed
- **Resume** - One-click to continue where you left off
- **Time Spent** - Total learning hours
- **Favorites** - Courses you've saved for later
- **Completed** - Your finished courses (congrats!)

### Pro Tips

1. **Star courses** you want to watch later
2. **Check "My Courses"** in your dashboard daily
3. **Complete one course** before starting another
      `,
    },

    test: {
      overview: `
## TL;DR

**Take quizzes** → **Pass with 60%+** → **Earn badges** → **Unlock levels**

Tests match the course levels. Finish a Lv.3 course? Take the Lv.3 test.

---

## Why Test?

- **Validate** - Prove you actually learned something
- **Badges** - Show off your level
- **Unlock** - Higher levels unlock more content recommendations
- **Track** - See your growth over time
      `,
      levels: `
## The Level System

Tests match course difficulty. Here's the breakdown:

| Level | Questions | Time | Pass Score |
|-------|-----------|------|------------|
| Lv.1-2 | 10 | 10 min | 60% |
| Lv.3-4 | 12 | 12 min | 65% |
| Lv.5-6 | 15 | 15 min | 70% |
| Lv.7-8 | 18 | 20 min | 75% |
| Lv.9-10 | 20 | 25 min | 80% |

### How to Progress

1. Complete a course at level X
2. Take the level X test
3. Score above passing threshold
4. Get your badge!
5. Move to level X+1
      `,
      types: `
## Question Types

### True/False
> Is ChatGPT a large language model? **True / False**

Simple yes or no. Good warm-up.

### Multiple Choice
> Which is NOT a type of machine learning?
> A) Supervised B) Unsupervised C) Reinforced D) Caffeinated

Pick one correct answer.

### Multiple Select
> Which ARE valid AI applications? (Select all)

Pick ALL correct answers. Trickier.

### Short Answer
> What does GPT stand for?

Type your answer. AI checks if you're close enough.

### Practical (Lv.7+)
> Build a simple chatbot prompt...

Hands-on tasks. Show, don't tell.
      `,
      scoring: `
## Pass or Retry

### Passing
- Each level has a passing score (60%-80%)
- Get above it = you pass
- Get below = try again

### Retakes
- **Unlimited attempts** - Keep trying until you nail it
- **Best score saved** - We only record your highest
- **No penalty** - Failed attempts don't hurt you

### What You Earn
- **Level Badge** - Displayed on your profile
- **Leaderboard spot** - Compare with others
- **Bragging rights** - You earned it
      `,
    },

    forum: {
      overview: `
## TL;DR

**Read posts** → **Vote on good stuff** → **Comment** → **Create your own**

The forum is where the community hangs out. Ask questions, share wins, help others.

---

## What You Can Do

| Action | Guest | Explorer | Solo+ |
|--------|-------|----------|-------|
| Read | Yes | Yes | Yes |
| Vote | No | Yes | Yes |
| Comment | No | Yes | Yes |
| Post | No | No | Yes |
      `,
      categories: `
## Post Types

Choose the right category when posting:

| Type | When to Use | Example |
|------|-------------|---------|
| **Discussion** | General chat | "What AI tools do you use daily?" |
| **Question** | Need help | "How do I connect GPT to Zapier?" |
| **Share** | Show something cool | "I automated my entire workflow!" |
| **Resource** | Helpful links | "Best free AI courses list" |
| **Announcement** | Official news | (Admin only) |

### Quick Guide
- Stuck? → **Question**
- Found something cool? → **Share**
- Want to chat? → **Discussion**
- Have a useful link? → **Resource**
      `,
      guidelines: `
## House Rules

### Do This
- Be nice (seriously, just be nice)
- Write clear titles
- Search before asking (avoid duplicates)
- Tag your posts properly
- Credit others' work

### Don't Do This
- Spam or excessive self-promotion
- Be rude or offensive
- Share private info
- Create duplicate posts
- Use clickbait titles

### The Golden Rule
**Would you want to receive this post?** If yes, send it. If no, revise it.
      `,
      markdown: `
## Formatting Tips

Make your posts look good:

### Bold & Italic
- \`**bold**\` → **bold**
- \`*italic*\` → *italic*

### Lists
\`\`\`
- Item one
- Item two
- Item three
\`\`\`

### Code
Use backticks for \`inline code\`

Use triple backticks for code blocks:
\`\`\`
const ai = "awesome";
\`\`\`

### Links
\`[text](url)\` → [clickable link](url)

### Quotes
\`> quoted text\` →
> quoted text
      `,
    },

    space: {
      overview: `
## TL;DR

**Space = mentorship matching.** Find someone to learn from (Nunu) or teach (Vava).

Think of it like a study buddy system, but way better.

---

## Why Space Exists

Learning alone is hard. Space connects you with:

- **Nunus** (mentors) - People ahead of you who can guide you
- **Vavas** (mentees) - People behind you who you can help

### The Benefits
- Personalized guidance
- Accountability partner
- Faster growth
- Real connections

### How to Access
You need a **Duo Ticket** (Go, Run, or Fly). Get one from the Shop.
      `,
      roles: `
## The Two Roles

### Nunu (Mentor)

The guide. The helper. The one with experience.

**Nunu Levels:**
- Beginner → Intermediate → Senior → Expert → Master

**Certified Nunu:**
Extra verified. Professional credentials. Premium mentors.

### Vava (Mentee)

The learner. The one seeking guidance.

**What You Get:**
- 1:1 support
- Regular check-ins
- Personalized advice
- Someone who gets it

### Can I Be Both?
Not at the same time. But you can switch roles later.
      `,
      matching: `
## Getting Matched

### Step by Step

1. **Get a Duo Ticket** → Shop → Buy Go/Run/Fly
2. **Go to Space** → Click "Space" in nav
3. **Create a Post** → Say what you're looking for
4. **Browse Profiles** → Check out available Nunus/Vavas
5. **Send Request** → Found a match? Request them
6. **Start Learning** → Begin your mentorship

### Match Types by Ticket

| Ticket | Can Match With |
|--------|----------------|
| **Go** | Regular Nunus |
| **Run** | Regular + Certified Nunus |
| **Fly** | Everyone + Founder |
      `,
      tickets: `
## Picking Your Ticket

### Duo Go
- **Best for:** First-time mentorship seekers
- **You get:** Regular Nunu matching, Discord access
- **Price:** Most affordable

### Duo Run
- **Best for:** Serious learners wanting pro guidance
- **You get:** Certified Nunus, priority queue
- **Price:** Mid-tier

### Duo Fly
- **Best for:** VIPs who want the best
- **You get:** Founder access, career guidance, everything
- **Price:** Premium

### Which Should You Pick?

- "I just want to try it" → **Go**
- "I want quality mentorship" → **Run**
- "I want the absolute best" → **Fly**
      `,
    },

    sprint: {
      overview: `
## TL;DR

**Build a project** → **Submit it** → **Get votes** → **Win prizes**

Sprint is our project competition. Turn your skills into real things.

---

## The Concept

Every month, there's a Sprint with a theme (like "AI Automation Tools").

1. Build something matching the theme
2. Submit your project
3. Community votes on projects
4. Top projects win recognition

### Why Participate?
- Practice real skills
- Get feedback from peers
- Build your portfolio
- Win prizes and recognition
      `,
      seasons: `
## How It's Organized

### Seasons
A season = one quarter (3 months)

- **Q1** (Jan-Mar) = Season 1
- **Q2** (Apr-Jun) = Season 2
- **Q3** (Jul-Sep) = Season 3
- **Q4** (Oct-Dec) = Season 4

### Sprints
Each season has 3 Sprints (roughly one per month)

| Season | Sprints | Timeline |
|--------|---------|----------|
| Q1 | Sprint 1, 2, 3 | Jan → Mar |
| Q2 | Sprint 4, 5, 6 | Apr → Jun |
| Q3 | Sprint 7, 8, 9 | Jul → Sep |
| Q4 | Sprint 10, 11, 12 | Oct → Dec |
      `,
      submit: `
## Submitting Your Project

### What You Need

| Required | Optional |
|----------|----------|
| Title | GitHub link |
| Description | Live demo URL |
| Thumbnail image | |
| Tech stack | |

### Tips for a Great Submission

1. **Clear title** - What does it do?
2. **Compelling description** - Why should people care?
3. **Good screenshot** - Show, don't tell
4. **Tech stack** - What tools did you use?
5. **Demo link** - Let people try it

### Deadline
Check the Sprint page for submission deadlines. Late = disqualified.
      `,
      voting: `
## Voting & Winning

### Who Can Vote
- Solo Traveler and above
- One vote per project

### Voting Period
Usually the last 1-2 weeks of each Sprint

### How Winners Are Chosen
- Most votes = highest rank
- Top 3 get special recognition
- Everyone who submits gets visibility

### What Winners Get
- Featured spot on homepage
- Community recognition
- Potential prizes (varies by Sprint)
- Portfolio gold
      `,
    },

    shop: {
      plans: `
## Subscription Plans

### Explorer (Free)
- All Lv.1 courses
- Forum voting & commenting
- Sprint browsing
- Basic dashboard

**Cost:** $0

### Solo Traveler
- ALL courses (Lv.1-10)
- Full forum access
- Sprint participation
- Full dashboard
- Priority support

**Cost:** $990/month

### The Simple Decision
- Just exploring? Stay **Explorer**
- Serious about learning? Go **Solo Traveler**
      `,
      duo: `
## Duo Tickets

*Requires Solo Traveler subscription*

### Quick Comparison

| Ticket | Monthly | What You Get |
|--------|---------|--------------|
| **Go** | $ | Basic mentorship |
| **Run** | $$ | Certified mentors |
| **Fly** | $$$ | Founder + everything |

### Go
Entry level. Match with regular Nunus. Discord access.

### Run
Premium. Certified Nunus. Priority matching. Pro guidance.

### Fly
VIP. Founder access. Career guidance. The works.
      `,
      events: `
## Events

nuvaClub hosts live events:

### Types
- **Workshops** - Hands-on learning
- **Meetups** - Community hangouts
- **Webinars** - Expert talks
- **AMAs** - Ask founders anything

### How to Join
1. Go to Shop → Events
2. Find an event
3. Register (some free, some paid)
4. Show up!

### Pro Tip
Events fill up fast. Register early.
      `,
      merch: `
## Merchandise

Rep the community:

- **T-shirts** - Multiple designs
- **Hoodies** - Stay warm, stay cool
- **Stickers** - Laptop decor
- **Accessories** - Mugs, caps, etc.

### Shipping
Worldwide shipping available.

### Quality
Premium materials. We wear this stuff too.
      `,
    },

    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'How do I get to my dashboard?',
          answer: 'Click your avatar in the top-right corner. That\'s it!',
        },
        {
          question: 'What courses can I access for free?',
          answer: 'All Lv.1 (Beginner) courses are free with an Explorer account.',
        },
        {
          question: 'I forgot my password. Help!',
          answer: 'Click "Forgot Password" on the login page. Check your email for reset instructions.',
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, anytime. Your access continues until the billing period ends.',
        },
        {
          question: 'How do I become a Nunu (mentor)?',
          answer: 'Apply in the Space section. You\'ll need to demonstrate expertise and complete verification.',
        },
        {
          question: 'What if I fail a test?',
          answer: 'Take it again! Unlimited retries. We only save your best score.',
        },
        {
          question: 'How do I report someone being rude?',
          answer: 'Click the report button on any post or comment. Our team reviews all reports.',
        },
        {
          question: 'Can I upgrade my Duo Ticket?',
          answer: 'Yes! Upgrade anytime. You\'ll be charged the difference.',
        },
        {
          question: 'Do courses expire?',
          answer: 'Nope. Once you have access, learn at your own pace forever.',
        },
        {
          question: 'How are Sprint winners picked?',
          answer: 'Community votes. Most votes = winner.',
        },
        {
          question: 'Where do I see old Playbook versions?',
          answer: 'Use the version dropdown at the top of this page.',
        },
        {
          question: 'I have a question not listed here.',
          answer: 'Post it in the Forum with the "Question" tag. Someone will help!',
        },
      ],
    },
  },
};
