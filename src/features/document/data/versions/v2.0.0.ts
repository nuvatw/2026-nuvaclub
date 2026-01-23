/**
 * Playbook Version 2.0.0 - Major Update
 * Release Date: 2026-01-22
 *
 * This version includes comprehensive updates to reflect the new features
 * and improvements made to the nuvaClub platform.
 */

import type { PlaybookVersion } from '../../types';

export const PLAYBOOK_V2_0_0: PlaybookVersion = {
  info: {
    version: '2.0.0',
    releaseDate: '2026-01-22',
    title: 'Major Platform Update',
    description: 'Comprehensive updates including new member dashboard, 10-level course system, redesigned navigation, and conversion-focused landing page.',
  },

  changelog: {
    version: '2.0.0',
    releaseDate: '2026-01-22',
    summary: 'This major update introduces a new member dashboard, 10-level course progression system, redesigned navigation, and a conversion-optimized landing page.',
    updates: [
      {
        category: 'feature',
        title: 'Member Dashboard',
        description: 'New personalized member area with Profile, My Courses, Favorites, Settings, and My Space sections.',
      },
      {
        category: 'feature',
        title: '10-Level Course System',
        description: 'Courses now use a 10-level progression system from Lv.1 Beginner to Lv.10 Grandmaster, replacing the simple free/paid model.',
      },
      {
        category: 'improvement',
        title: 'Navigation Redesign',
        description: 'Cleaner navigation with animated underline indicator for active sections and improved visual hierarchy.',
      },
      {
        category: 'feature',
        title: 'Landing Page',
        description: 'New conversion-focused landing page with hero video, problem/solution sections, testimonials, pricing tiers, and urgency-driven CTAs.',
      },
      {
        category: 'improvement',
        title: 'Course Cards',
        description: 'Updated course cards now display level badges with color-coded difficulty indicators.',
      },
      {
        category: 'feature',
        title: 'Hero Carousel',
        description: 'Featured courses now appear in an auto-playing hero carousel on the Learn page.',
      },
      {
        category: 'improvement',
        title: 'Identity System Documentation',
        description: 'Enhanced documentation clarifying the six identity types and their progression paths.',
      },
      {
        category: 'fix',
        title: 'Test Level Alignment',
        description: 'Test levels now properly align with the 10-level course system.',
      },
    ],
  },

  quickStartItems: [
    {
      id: 'learn',
      title: 'Learn',
      description: 'Master AI skills with 10-level courses',
      icon: '📚',
      href: '#learn',
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      id: 'test',
      title: 'Test',
      description: 'Prove your knowledge with level assessments',
      icon: '📝',
      href: '#test',
      color: 'from-green-500/20 to-green-600/10',
    },
    {
      id: 'forum',
      title: 'Forum',
      description: 'Connect and share with the community',
      icon: '💬',
      href: '#forum',
      color: 'from-purple-500/20 to-purple-600/10',
    },
    {
      id: 'space',
      title: 'Space',
      description: 'Find your learning companion',
      icon: '🤝',
      href: '#space',
      color: 'from-pink-500/20 to-pink-600/10',
    },
    {
      id: 'sprint',
      title: 'Sprint',
      description: 'Build projects and showcase skills',
      icon: '🚀',
      href: '#sprint',
      color: 'from-orange-500/20 to-orange-600/10',
    },
    {
      id: 'shop',
      title: 'Shop',
      description: 'Upgrade your experience',
      icon: '🛒',
      href: '#shop',
      color: 'from-amber-500/20 to-amber-600/10',
    },
  ],

  identityInfo: [
    {
      id: 'guest',
      name: 'Guest',
      description: 'Unregistered visitors exploring the platform',
      color: 'neutral',
      capabilities: [
        'View Lv.1 (Beginner) course previews',
        'Browse forum posts (read-only)',
        'View shop products and pricing',
        'Explore Sprint project showcases',
        'Access landing page and platform overview',
      ],
      limitations: [
        'Cannot access full courses',
        'Cannot post or comment in forum',
        'Cannot upload Sprint projects',
        'Cannot access Space matching',
        'Cannot access member dashboard',
      ],
      upgradePath: 'Register for free to become an Explorer',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Registered free members with basic access',
      color: 'primary',
      capabilities: [
        'Access all Lv.1 (Free) courses',
        'View preview of higher-level courses',
        'Interact in forum (vote, comment)',
        'Browse Sprint projects',
        'Access member dashboard (Profile, Settings)',
        'Track course progress and favorites',
      ],
      limitations: [
        'Cannot access Lv.2-10 paid courses',
        'Cannot create forum posts',
        'Cannot upload Sprint projects',
        'Cannot access Space matching',
      ],
      upgradePath: 'Subscribe to Solo Traveler plan for full access',
    },
    {
      id: 'solo-traveler',
      name: 'Solo Traveler',
      description: 'Paid subscribers with full platform access',
      color: 'blue',
      capabilities: [
        'Access all courses (Lv.1-10)',
        'Full forum access (post, vote, comment)',
        'Upload projects to Sprint',
        'Vote on Sprint projects',
        'Full member dashboard access',
        'Priority customer support',
      ],
      limitations: [
        'Cannot access Space matching (requires Duo Ticket)',
      ],
      upgradePath: 'Purchase a Duo Ticket to access Space',
    },
    {
      id: 'duo-go',
      name: 'Duo Go',
      description: 'Duo Ticket holder with basic matching',
      color: 'green',
      capabilities: [
        'All Solo Traveler benefits',
        'Access Space matching',
        'Match with regular Nunu mentors',
        'Join Discord community group',
        'My Space section in dashboard',
      ],
      limitations: [
        'Cannot match with Certified Nunu',
        'Cannot match with Founder',
      ],
      upgradePath: 'Upgrade to Duo Run for Certified Nunu access',
    },
    {
      id: 'duo-run',
      name: 'Duo Run',
      description: 'Premium matching with certified mentors',
      color: 'purple',
      capabilities: [
        'All Duo Go benefits',
        'Match with Certified Nunu mentors',
        'Priority matching queue',
        'Professional guidance sessions',
      ],
      limitations: [
        'Cannot match with Founder',
      ],
      upgradePath: 'Upgrade to Duo Fly for Founder access',
    },
    {
      id: 'duo-fly',
      name: 'Duo Fly',
      description: 'Ultimate access with founder mentorship',
      color: 'amber',
      capabilities: [
        'All Duo Run benefits',
        'Match with Founder (Shang-Zhe)',
        'AI strategy consulting',
        'Career guidance',
        'Exclusive community access',
      ],
      limitations: [],
    },
  ],

  identityCapabilities: [
    {
      feature: 'View Lv.1 Course Preview',
      guest: true,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Access Lv.1 (Free) Courses',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Access All Courses (Lv.1-10)',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Member Dashboard',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Forum: Read Posts',
      guest: true,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Forum: Vote & Comment',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Forum: Create Posts',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Sprint: Browse Projects',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Sprint: Upload Projects',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Sprint: Vote on Projects',
      guest: false,
      explorer: false,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Space: Access Matching',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Space: Match with Nunu',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Space: Match with Certified Nunu',
      guest: false,
      explorer: false,
      soloTraveler: false,
      duoGo: false,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Space: Match with Founder',
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
      title: 'Version Updates',
      level: 1,
    },
    {
      id: 'identity',
      title: 'Your Identity',
      level: 1,
      children: [
        { id: 'identity-guest', title: 'Guest', level: 2 },
        { id: 'identity-explorer', title: 'Explorer', level: 2 },
        { id: 'identity-solo', title: 'Solo Traveler', level: 2 },
        { id: 'identity-duo', title: 'Duo Traveler', level: 2 },
        { id: 'identity-comparison', title: 'Comparison Table', level: 2 },
      ],
    },
    {
      id: 'member-dashboard',
      title: 'Member Dashboard',
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
        { id: 'learn-overview', title: 'Overview', level: 2 },
        { id: 'learn-levels', title: 'Course Levels (1-10)', level: 2 },
        { id: 'learn-access', title: 'Access by Identity', level: 2 },
        { id: 'learn-progress', title: 'Progress Tracking', level: 2 },
      ],
    },
    {
      id: 'test',
      title: 'Test',
      level: 1,
      children: [
        { id: 'test-overview', title: 'Overview', level: 2 },
        { id: 'test-levels', title: 'Level System (1-10)', level: 2 },
        { id: 'test-types', title: 'Question Types', level: 2 },
        { id: 'test-scoring', title: 'Scoring & Passing', level: 2 },
      ],
    },
    {
      id: 'forum',
      title: 'Forum',
      level: 1,
      children: [
        { id: 'forum-overview', title: 'Overview', level: 2 },
        { id: 'forum-categories', title: 'Categories', level: 2 },
        { id: 'forum-guidelines', title: 'Posting Guidelines', level: 2 },
        { id: 'forum-markdown', title: 'Markdown Guide', level: 2 },
      ],
    },
    {
      id: 'space',
      title: 'Space',
      level: 1,
      children: [
        { id: 'space-overview', title: 'What is Space?', level: 2 },
        { id: 'space-roles', title: 'Nunu & Vava', level: 2 },
        { id: 'space-matching', title: 'Matching Process', level: 2 },
        { id: 'space-tickets', title: 'Duo Tickets', level: 2 },
      ],
    },
    {
      id: 'sprint',
      title: 'Sprint',
      level: 1,
      children: [
        { id: 'sprint-overview', title: 'What is Sprint?', level: 2 },
        { id: 'sprint-seasons', title: 'Seasons & Sprints', level: 2 },
        { id: 'sprint-submit', title: 'Submitting Projects', level: 2 },
        { id: 'sprint-voting', title: 'Voting', level: 2 },
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
        { id: 'shop-merch', title: 'Merchandise', level: 2 },
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
      title: 'nuvaClub Playbook',
      subtitle: 'Your complete guide to mastering the platform',
      description:
        'Everything you need to know about nuvaClub - from getting started to becoming a power user. Explore our five pillars: Learn, Test, Forum, Space, and Sprint.',
    },

    quickStart: {
      title: 'Quick Start',
      content: `
Welcome to nuvaClub! Here's how to get started in 4 simple steps:

**Step 1: Create Your Account**
Register for free to become an Explorer. You'll get access to Lv.1 (Free) courses and can interact with the community.

**Step 2: Explore the Dashboard**
Once logged in, access your personalized member dashboard. View your profile, track course progress, manage favorites, and customize settings.

**Step 3: Start Learning**
Browse our course catalog organized by difficulty levels (Lv.1-10). Start with free courses and work your way up through the levels.

**Step 4: Level Up**
As you grow, consider upgrading to Solo Traveler for full course access (Lv.1-10), or get a Duo Ticket to find a learning companion in Space.

> **Tip:** Check the Version Updates section below to see what's new in this version of the Playbook!
      `,
    },

    versionUpdates: {
      title: 'Version Updates',
      content: `
### What's New in v2.0.0

This major update brings significant improvements to the nuvaClub platform:

#### New Features

**Member Dashboard**
Your personalized control center is here! Access:
- **Profile**: View and edit your information, see your identity level
- **My Courses**: Track all courses you're enrolled in with progress indicators
- **Favorites**: Quick access to courses and content you've saved
- **Settings**: Customize your experience, notifications, and preferences
- **My Space**: Manage your Nunu/Vava connections (Duo Ticket holders)

**10-Level Course System**
Courses are now organized by difficulty:
| Level | Name | Description |
|-------|------|-------------|
| Lv.1 | Beginner | Introduction to AI concepts (Free) |
| Lv.2 | Basic | Foundational skills |
| Lv.3 | Elementary | Building understanding |
| Lv.4 | Intermediate | Applied knowledge |
| Lv.5 | Upper-Int | Advanced applications |
| Lv.6 | Advanced | Complex implementations |
| Lv.7 | Proficient | Expert techniques |
| Lv.8 | Expert | Specialized skills |
| Lv.9 | Master | Industry-level mastery |
| Lv.10 | Grandmaster | Elite expertise |

**Hero Carousel**
Featured courses now appear in a beautiful auto-playing carousel on the Learn page.

#### Improvements

**Navigation Redesign**
- Cleaner, more focused navigation bar
- Animated underline indicator shows current section
- Improved visual hierarchy with subtle opacity changes

**Course Cards**
- Color-coded level badges for instant difficulty recognition
- Improved layout and information display

**Landing Page**
- New conversion-focused design
- Clear value proposition and transformation messaging
- Problem/solution sections
- Social proof with testimonials
- Transparent pricing tiers
      `,
    },

    learn: {
      overview: `
**Learn** is your gateway to mastering AI tools and skills. Our structured courses cover everything from ChatGPT basics to advanced automation workflows.

### Course Structure
Each course contains multiple lessons organized into chapters. You can track your progress and pick up where you left off anytime.

### Finding Courses
- Browse by **category** (AI Fundamentals, Advanced Applications, etc.)
- Filter by **level** (Lv.1-10)
- Use the **search** to find specific topics
- Check the **hero carousel** for featured courses
      `,
      access: `
### Course Access by Identity

| Identity | Course Access |
|----------|---------------|
| Guest | Preview of Lv.1 courses only |
| Explorer | Full access to Lv.1 (Free) courses |
| Solo Traveler+ | Full access to all courses (Lv.1-10) |

### Unlocking Higher Levels
- **Register** to access all Lv.1 (Free) courses
- **Subscribe to Solo Traveler** to unlock Lv.2-10 courses
      `,
      progress: `
### Tracking Your Learning

Your progress is automatically saved as you watch lessons. Access your learning stats in the **My Courses** section of your dashboard:

- **Progress Bar**: Visual completion percentage for each course
- **Resume Button**: Jump back to where you left off
- **Time Tracking**: See total learning time invested
- **History**: View your complete learning timeline
- **Favorites**: Star courses to save them for later
      `,
    },

    test: {
      overview: `
**Test** your AI knowledge and earn recognition for your skills. Our assessment system aligns with the 10-level course system.

### Purpose
- Validate your understanding of course material
- Unlock higher difficulty levels
- Earn badges and recognition
- Track your growth over time
      `,
      levels: `
### Level System (1-10)

Tests align with the course difficulty levels:

| Level | Difficulty | Questions | Time Limit | Pass Rate |
|-------|------------|-----------|------------|-----------|
| Lv.1-2 | Beginner | 10 | 10 min | 60% |
| Lv.3-4 | Elementary | 12 | 12 min | 65% |
| Lv.5-6 | Intermediate | 15 | 15 min | 70% |
| Lv.7-8 | Advanced | 18 | 20 min | 75% |
| Lv.9-10 | Master | 20 | 25 min | 80% |

### Progression
- Complete a course to unlock its corresponding test
- Pass the test to earn a level badge
- Higher levels unlock advanced content recommendations
      `,
      types: `
### Question Types

**True/False**
Simple yes/no questions to test basic understanding.

**Multiple Choice**
Select the correct answer from 4 options.

**Multiple Select**
Choose all correct answers from multiple options.

**Short Answer**
Type a brief response (auto-graded with AI matching).

**Practical Exercise** (Lv.7+)
Hands-on tasks demonstrating real skills.
      `,
      scoring: `
### Scoring & Passing

- **Passing Score**: Varies by level (60%-80%)
- **Retakes**: Unlimited attempts allowed
- **Best Score**: Your highest score is recorded
- **Badges**: Earn level badges for passing tests
- **Leaderboard**: Compare with other learners
      `,
    },

    forum: {
      overview: `
**Forum** is your space to connect with the nuvaClub community. Share knowledge, ask questions, and learn from others.

### What You Can Do
- Read discussions and resources
- Vote on helpful content
- Comment on posts
- Create your own posts (Solo Traveler+)
      `,
      categories: `
### Post Categories

| Category | Purpose | Example |
|----------|---------|---------|
| Discussion | General conversations | "What's your AI workflow?" |
| Question | Seeking help or answers | "How do I use ChatGPT for coding?" |
| Share | Sharing experiences | "My AI automation success story" |
| Resource | Helpful links/tools | "Curated list of AI tools" |
| Announcement | Official updates | "New course release!" |
      `,
      guidelines: `
### Community Guidelines

**Do:**
- Be respectful and constructive
- Use clear, descriptive titles
- Tag posts with relevant categories
- Search before asking (avoid duplicates)
- Give credit when sharing others' work

**Don't:**
- Spam or self-promote excessively
- Post offensive or inappropriate content
- Share confidential information
- Create duplicate posts
- Use misleading titles
      `,
      markdown: `
### Markdown Formatting

The forum supports Markdown for rich text formatting:

**Basic Formatting**
- \`**bold**\` for **bold text**
- \`*italic*\` for *italic text*
- \`\`\`code\`\`\` for \`inline code\`

**Structure**
- Use \`#\`, \`##\`, \`###\` for headings
- Use \`-\` or \`*\` for bullet lists
- Use \`1.\`, \`2.\`, \`3.\` for numbered lists

**Advanced**
- \`> text\` for blockquotes
- \`[text](url)\` for links
- \`![alt](url)\` for images
- Triple backticks for code blocks
      `,
    },

    space: {
      overview: `
**Space** is nuvaClub's unique companion matching system. Find a mentor (Nunu) or mentee (Vava) to accelerate your learning journey together.

### Why Space?
- Learning is better with a partner
- Get personalized guidance from experienced members
- Build meaningful connections
- Accelerate your growth with accountability

### Accessing Space
Space matching requires a Duo Ticket (Go, Run, or Fly). Once you have a ticket, you can access Space through the main navigation or your **My Space** dashboard section.
      `,
      roles: `
### Nunu (Mentor)
Experienced community members who guide and support Vavas.

**Nunu Levels:**
- Beginner Nunu: New mentors
- Intermediate Nunu: Some mentoring experience
- Senior Nunu: Proven track record
- Expert Nunu: Top-tier mentors
- Master Nunu: Elite mentors

**Certified Nunu:**
Specially verified mentors with professional credentials. Only available to Duo Run and Duo Fly ticket holders.

### Vava (Mentee)
Members seeking guidance and support from a Nunu.

**What Vavas Get:**
- Personalized learning guidance
- Regular check-ins
- Skill development support
- Community connections
      `,
      matching: `
### How Matching Works

1. **Get a Duo Ticket** - Purchase from Shop
2. **Enter Space** - Via navigation or My Space dashboard
3. **Create Matching Post** - Describe what you're looking for
4. **Browse Profiles** - View available Nunus/Vavas
5. **Request Match** - Send a matching request
6. **Start Journey** - Begin your mentorship

### Match Types by Ticket

| Ticket | Can Match With |
|--------|----------------|
| Duo Go | Regular Nunu |
| Duo Run | Regular + Certified Nunu |
| Duo Fly | All Nunus + Founder |
      `,
      tickets: `
### Duo Tickets Explained

**Duo Go** - Entry Level
- Match with regular Nunu mentors
- Join Discord community
- Monthly or quarterly options

**Duo Run** - Premium
- Everything in Duo Go
- Match with Certified Nunus
- Priority matching queue
- Professional guidance

**Duo Fly** - Ultimate
- Everything in Duo Run
- Match with Founder (Shang-Zhe)
- AI strategy consulting
- Career guidance
      `,
    },

    sprint: {
      overview: `
**Sprint** is nuvaClub's project-based challenge system. Turn your learning into real projects and showcase your skills to the community.

### The Concept
- Each Sprint has a theme (e.g., "AI Automation Tools")
- Build a project matching the theme
- Submit for community review
- Vote on other projects
- Win recognition and prizes
      `,
      seasons: `
### Seasons & Sprints

**Seasons**
A season spans one quarter (3 months). Example: "2026 Q1"

**Sprints**
Each season contains multiple Sprints, typically one per month.

| Season | Duration | Sprints |
|--------|----------|---------|
| Q1 | Jan-Mar | 3 Sprints |
| Q2 | Apr-Jun | 3 Sprints |
| Q3 | Jul-Sep | 3 Sprints |
| Q4 | Oct-Dec | 3 Sprints |
      `,
      submit: `
### Submitting Projects

**Requirements:**
- Title and description
- Thumbnail image
- Tech stack used
- Optional: GitHub link
- Optional: Live demo URL

**Best Practices:**
- Write a clear, compelling description
- Show screenshots or demo videos
- Explain your approach and learnings
- Credit any resources or tools used
      `,
      voting: `
### Voting System

**Who Can Vote:**
- Solo Traveler and above
- One vote per project per user

**Voting Period:**
- Usually the second half of each Sprint
- Winners announced at end of Sprint

**Rankings:**
- Based on total vote count
- Top 3 projects get special recognition
- All participants get visibility
      `,
    },

    shop: {
      plans: `
### Subscription Plans

**Explorer (Free)**
- Lv.1 (Free) courses access
- Forum interaction
- Sprint browsing
- Basic member dashboard

**Solo Traveler ($990/month)**
- All courses (Lv.1-10)
- Full forum access
- Sprint participation
- Full member dashboard
- Priority support
      `,
      duo: `
### Duo Tickets

| Ticket | Monthly | Quarterly | Benefits |
|--------|---------|-----------|----------|
| Duo Go | $XXX | $XXX | Basic matching |
| Duo Run | $XXX | $XXX | Certified Nunu |
| Duo Fly | $XXX | $XXX | Founder access |

*Duo Tickets require Solo Traveler subscription*
      `,
      events: `
### Events

nuvaClub hosts regular events including:

- **Workshops**: Hands-on learning sessions
- **Meetups**: Community gatherings
- **Webinars**: Expert presentations
- **AMAs**: Ask Me Anything sessions

Check the Shop for upcoming events and tickets.
      `,
      merch: `
### Merchandise

Show your nuvaClub pride with exclusive merchandise:

- T-shirts
- Hoodies
- Stickers
- Accessories

All merchandise ships worldwide.
      `,
    },

    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How do I access my member dashboard?',
          answer:
            'Click on your avatar in the top-right corner after logging in. You\'ll see options for Profile, My Courses, Favorites, Settings, and more.',
        },
        {
          question: 'What are the course levels?',
          answer:
            'Courses range from Lv.1 (Beginner) to Lv.10 (Grandmaster). Lv.1 courses are free. Solo Traveler subscribers get access to all levels.',
        },
        {
          question: 'How do I reset my password?',
          answer:
            'Click "Forgot Password" on the login page and follow the email instructions.',
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer:
            'Yes, you can cancel anytime. Your access continues until the end of the billing period.',
        },
        {
          question: 'How do I become a Nunu (mentor)?',
          answer:
            'Apply through the Space section. You need to demonstrate expertise and complete a verification process.',
        },
        {
          question: 'What if I fail a test?',
          answer:
            'You can retake tests unlimited times. Your best score is recorded.',
        },
        {
          question: 'How do I report inappropriate content?',
          answer:
            'Use the report button on any post or comment. Our team reviews all reports.',
        },
        {
          question: 'Can I switch my Duo Ticket level?',
          answer:
            'Yes, you can upgrade or downgrade at the next billing cycle.',
        },
        {
          question: 'Do courses expire?',
          answer:
            'No, once you have access, you can watch courses at your own pace.',
        },
        {
          question: 'How are Sprint winners selected?',
          answer:
            'Winners are determined by community votes during the voting period.',
        },
        {
          question: 'Where can I see previous versions of the Playbook?',
          answer:
            'Use the version selector dropdown at the top of this page to switch between Playbook versions.',
        },
      ],
    },
  },
};
