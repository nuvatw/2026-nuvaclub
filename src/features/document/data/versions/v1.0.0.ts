/**
 * Playbook Version 1.0.0 - Initial Release
 * Release Date: 2025-01-01
 *
 * This is the original version of the nuvaClub Playbook,
 * containing the foundational documentation for the platform.
 */

import type { PlaybookVersion } from '../../types';

export const PLAYBOOK_V1_0_0: PlaybookVersion = {
  info: {
    version: '1.0.0',
    releaseDate: '2025-01-01',
    title: 'Initial Release',
    description: 'The foundational nuvaClub Playbook with complete platform documentation.',
  },

  quickStartItems: [
    {
      id: 'learn',
      title: 'Learn',
      description: 'Master AI skills with structured courses',
      icon: '📚',
      href: '#learn',
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      id: 'test',
      title: 'Test',
      description: 'Prove your knowledge with assessments',
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
        'View first chapter of any course',
        'Browse forum posts (read-only)',
        'View shop products and pricing',
        'Explore Sprint project showcases',
      ],
      limitations: [
        'Cannot access full courses',
        'Cannot post or comment in forum',
        'Cannot upload Sprint projects',
        'Cannot access Space matching',
      ],
      upgradePath: 'Register for free to become an Explorer',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Registered free members with basic access',
      color: 'primary',
      capabilities: [
        'Access all free courses',
        'View first chapter of paid courses',
        'Interact in forum (vote, comment)',
        'Browse Sprint projects',
      ],
      limitations: [
        'Cannot access paid courses',
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
        'Access all courses (free + paid)',
        'Full forum access (post, vote, comment)',
        'Upload projects to Sprint',
        'Vote on Sprint projects',
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
      feature: 'View First Chapter',
      guest: true,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Access Free Courses',
      guest: false,
      explorer: true,
      soloTraveler: true,
      duoGo: true,
      duoRun: true,
      duoFly: true,
    },
    {
      feature: 'Access All Courses',
      guest: false,
      explorer: false,
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
      id: 'learn',
      title: 'Learn',
      level: 1,
      children: [
        { id: 'learn-overview', title: 'Overview', level: 2 },
        { id: 'learn-access', title: 'Course Access Levels', level: 2 },
        { id: 'learn-progress', title: 'Progress Tracking', level: 2 },
      ],
    },
    {
      id: 'test',
      title: 'Test',
      level: 1,
      children: [
        { id: 'test-overview', title: 'Overview', level: 2 },
        { id: 'test-levels', title: 'Level System', level: 2 },
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
Welcome to nuvaClub! Here's how to get started in 3 simple steps:

**Step 1: Create Your Account**
Register for free to become an Explorer. You'll get access to free courses and can interact with the community.

**Step 2: Start Learning**
Browse our course catalog and start with free courses. Watch the first chapter of any course to preview the content.

**Step 3: Level Up**
As you grow, consider upgrading to Solo Traveler for full course access, or get a Duo Ticket to find a learning companion in Space.
      `,
    },

    learn: {
      overview: `
**Learn** is your gateway to mastering AI tools and skills. Our structured courses cover everything from ChatGPT basics to advanced automation workflows.

### Course Structure
Each course contains multiple lessons organized into chapters. You can track your progress and pick up where you left off anytime.

### Course Types
- **Free Courses**: Available to all registered users (Explorer+)
- **Premium Courses**: Require Solo Traveler subscription
- **First Chapter Preview**: Everyone can watch the first chapter of any course
      `,
      access: `
### Course Access Levels

| Access Level | Guest | Explorer | Solo Traveler |
|--------------|-------|----------|---------------|
| First Chapter | Yes | Yes | Yes |
| Free Courses | No | Yes | Yes |
| Premium Courses | No | No | Yes |

### Unlocking Content
- **Register** to access free courses
- **Subscribe to Solo Traveler** to unlock all premium content
      `,
      progress: `
### Tracking Your Learning

Your progress is automatically saved as you watch lessons. You can:
- See completion percentage for each course
- Resume from where you left off
- Track total learning time
- View your learning history
      `,
    },

    test: {
      overview: `
**Test** your AI knowledge and earn recognition for your skills. Our assessment system helps you validate what you've learned.

### Purpose
- Validate your understanding of course material
- Identify areas for improvement
- Earn badges and recognition
- Track your growth over time
      `,
      levels: `
### Level System

Tests are organized into four difficulty levels:

| Level | Difficulty | Questions | Time Limit |
|-------|------------|-----------|------------|
| Level 1-3 | Beginner | 10 | 10 min |
| Level 4-6 | Intermediate | 15 | 15 min |
| Level 7-9 | Advanced | 20 | 20 min |
| Level 10-12 | Expert | 25 | 30 min |

### Progression
- Start at Level 1
- Pass a level to unlock the next
- Higher levels have more complex questions
      `,
      types: `
### Question Types

**True/False**
Simple yes/no questions to test basic understanding.

**Multiple Choice**
Select the correct answer from 4 options.

**Short Answer**
Type a brief response (auto-graded with keyword matching).

**Essay**
Long-form responses for advanced levels (requires manual review).
      `,
      scoring: `
### Scoring & Passing

- **Passing Score**: 60% or higher
- **Retakes**: Unlimited attempts allowed
- **Best Score**: Your highest score is recorded
- **Time Bonus**: Finish faster for potential bonus points
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
Specially verified mentors with professional credentials.

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
2. **Enter Space** - Access the matching interface
3. **Browse Profiles** - View available Nunus
4. **Request Match** - Send a matching request
5. **Start Journey** - Begin your mentorship

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
- Free courses access
- Forum interaction
- Sprint browsing

**Solo Traveler ($990/month)**
- All courses (free + premium)
- Full forum access
- Sprint participation
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
      ],
    },
  },
};
