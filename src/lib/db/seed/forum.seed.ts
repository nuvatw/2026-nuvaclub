import type { MockDB } from '../core/MockDB';

/**
 * Seed forum module data
 * 30 posts from 10 users with diverse categories and engagement
 */
export async function seedForum(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // FORUM POSTS (30 posts)
  // ==========================================
  db.forumPosts.createMany([
    // Post 1 - user-1 (Alex Chen) - Question
    {
      id: 'post-1',
      authorId: 'user-1',
      title: 'How to write better code with ChatGPT?',
      content: `I recently started using ChatGPT to help write code, but I find that sometimes its answers are not quite accurate. I'd like to ask everyone what tips can help ChatGPT produce better code?

Here's what I currently do:
1. Describe requirements in as much detail as possible
2. Provide example code
3. Ask it to explain each step

But there are still some issues. Hope everyone can share their experience!`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-20T10:30:00'),
      updatedAt: now,
    },
    // Post 2 - user-2 (Sarah Lin) - Share (Pinned)
    {
      id: 'post-2',
      authorId: 'user-2',
      title: '[Share] My Side Project completed in one week using AI',
      content: `I want to share a Side Project I recently completed using AI tools!

It's an automated content management system, mainly using:
- ChatGPT 4 for content generation
- Midjourney for image generation
- Make.com for workflow automation

The entire development process took about a week. Without AI, it might have taken more than a month.

Feel free to check it out, and suggestions are welcome!`,
      category: 'share',
      isPinned: true,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-19T15:00:00'),
      updatedAt: new Date('2026-01-19T18:30:00'),
    },
    // Post 3 - user-3 (Mike Wang) - Discussion
    {
      id: 'post-3',
      authorId: 'user-3',
      title: 'Midjourney v6 New Features Discussion',
      content: `Midjourney v6 is out! Has everyone tried it?

I noticed several obvious improvements:
1. Text generation is more accurate
2. Character fingers are no longer that weird
3. Lighting and shadows are more natural

However, there are also some issues, such as the generation speed seems a bit slower.

Does anyone have any insights to share?`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-18T09:15:00'),
      updatedAt: now,
    },
    // Post 4 - user-4 (Emily Huang) - Resource (Pinned)
    {
      id: 'post-4',
      authorId: 'user-4',
      title: '[Resource] AI Tools Collection 2026 Edition',
      content: `I've compiled the latest list of AI tools for 2026. Hope it helps everyone!

## Text Generation
- ChatGPT 4 Turbo
- Claude 3
- Gemini Pro

## Image Generation
- Midjourney v6
- DALL-E 3
- Stable Diffusion XL

## Video Generation
- Runway Gen-2
- Pika Labs
- Sora (limited testing)

## Automation Tools
- Make.com
- Zapier
- n8n

Continuously updating. Feel free to add more!`,
      category: 'resource',
      isPinned: true,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-15T14:00:00'),
      updatedAt: new Date('2026-01-20T11:00:00'),
    },
    // Post 5 - user-5 (Kevin Lee) - Question
    {
      id: 'post-5',
      authorId: 'user-5',
      title: 'Beginner Question: How to start learning Prompt Engineering?',
      content: `Hello everyone, I'm new to AI and want to start learning Prompt Engineering.

I see related content in the courses, but I'd like to know first:
1. Do I need any prerequisite knowledge?
2. How long does it take to get started?
3. Is there a recommended learning sequence?

Thanks everyone!`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-21T08:00:00'),
      updatedAt: now,
    },
    // Post 6 - user-6 (Jessica Wu) - Share
    {
      id: 'post-6',
      authorId: 'user-6',
      title: 'My first AI-generated art collection - 30 days challenge complete!',
      content: `I just finished my 30-day AI art challenge! Every day I created one piece using different prompts and styles.

Key learnings:
- Consistency in style requires detailed prompt templates
- Negative prompts are just as important as positive ones
- Seed values help maintain character consistency

Check out my portfolio in the comments. Would love feedback!`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-17T16:45:00'),
      updatedAt: now,
    },
    // Post 7 - user-7 (David Zhang) - Discussion
    {
      id: 'post-7',
      authorId: 'user-7',
      title: 'Is AI replacing developers or empowering them?',
      content: `I've been thinking about this a lot lately. With tools like GitHub Copilot and ChatGPT, are we heading towards a future where developers become obsolete?

My take: AI is a tool, not a replacement. It handles the boring stuff so we can focus on creative problem-solving.

What do you all think? Has AI changed how you work?`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-16T11:20:00'),
      updatedAt: now,
    },
    // Post 8 - user-8 (Lisa Chen) - Question
    {
      id: 'post-8',
      authorId: 'user-8',
      title: 'Best practices for API cost optimization with LLMs?',
      content: `My startup is using GPT-4 API heavily and our costs are getting out of control. Currently spending about $500/month.

Has anyone found good strategies for:
1. Reducing token usage without losing quality?
2. Caching common responses?
3. Knowing when to use GPT-3.5 vs GPT-4?

Any tips would be greatly appreciated!`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-19T09:30:00'),
      updatedAt: now,
    },
    // Post 9 - user-9 (Tom Huang) - Resource
    {
      id: 'post-9',
      authorId: 'user-9',
      title: '[Guide] Setting up a local LLM with Ollama - Complete Tutorial',
      content: `Want to run AI locally without API costs? Here's my complete guide!

## What you'll need
- 16GB+ RAM (32GB recommended)
- GPU with 8GB+ VRAM (optional but helps)
- 50GB free disk space

## Steps
1. Install Ollama from ollama.ai
2. Pull a model: \`ollama pull llama2\`
3. Run it: \`ollama run llama2\`

## Best models for different tasks
- **Coding**: CodeLlama, DeepSeek Coder
- **General**: Llama 2, Mistral
- **Small/Fast**: Phi-2, TinyLlama

Let me know if you have questions!`,
      category: 'resource',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-14T20:15:00'),
      updatedAt: now,
    },
    // Post 10 - user-10 (Amy Lin) - Announcement
    {
      id: 'post-10',
      authorId: 'user-10',
      title: '[Announcement] Weekly AI Challenge - Week 4 Results & Week 5 Theme',
      content: `## Week 4 Results - "Retro Gaming"

Congratulations to our winners:
1. 🥇 @Sarah Lin - Amazing pixel art reimagining
2. 🥈 @Mike Wang - Creative 8-bit character designs
3. 🥉 @Jessica Wu - Nostalgic game cover art

## Week 5 Theme: "Futuristic Cities"

Create AI-generated cityscapes of the future! Deadline: Sunday 11:59 PM.

Post your entries with #AIChallenge5`,
      category: 'announcement',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-20T18:00:00'),
      updatedAt: now,
    },
    // Post 11 - user-2 (Sarah Lin) - Discussion
    {
      id: 'post-11',
      authorId: 'user-2',
      title: 'Claude vs ChatGPT for coding - My detailed comparison after 6 months',
      content: `After using both Claude and ChatGPT extensively for coding, here are my thoughts:

## ChatGPT Strengths
- Better at following complex instructions
- More creative solutions
- Larger context window with GPT-4 Turbo

## Claude Strengths
- More consistent code style
- Better at explaining its reasoning
- Fewer hallucinations in my experience

## My workflow
I use ChatGPT for initial implementation and Claude for code review and refactoring.

What's your preference?`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-18T14:30:00'),
      updatedAt: now,
    },
    // Post 12 - user-4 (Emily Huang) - Share
    {
      id: 'post-12',
      authorId: 'user-4',
      title: 'Built a Chrome extension with AI in 2 hours - here\'s how',
      content: `Yesterday I had an idea for a Chrome extension and decided to build it entirely with AI assistance.

The extension: Auto-summarizes any webpage with one click.

**Tools used:**
- ChatGPT for code generation
- Claude for debugging
- Midjourney for the icon

**Time breakdown:**
- Planning: 15 min
- Coding: 90 min
- Testing: 15 min

The code isn't perfect, but it works! Happy to share the source code if anyone's interested.`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-21T11:00:00'),
      updatedAt: now,
    },
    // Post 13 - user-1 (Alex Chen) - Resource
    {
      id: 'post-13',
      authorId: 'user-1',
      title: '[Cheat Sheet] 50 ChatGPT prompts for developers',
      content: `I've compiled my most useful ChatGPT prompts for development work:

## Code Review
- "Review this code for bugs and security issues: [code]"
- "Suggest performance improvements for: [code]"

## Documentation
- "Write JSDoc comments for this function: [code]"
- "Create a README for this project structure: [structure]"

## Debugging
- "Explain this error and suggest fixes: [error]"
- "Why might this code cause a memory leak: [code]"

## Learning
- "Explain [concept] like I'm a junior developer"
- "What are the trade-offs between [A] and [B]?"

Full list in the comments!`,
      category: 'resource',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-17T08:45:00'),
      updatedAt: now,
    },
    // Post 14 - user-3 (Mike Wang) - Question
    {
      id: 'post-14',
      authorId: 'user-3',
      title: 'How do you handle AI hallucinations in production apps?',
      content: `We're building a customer support chatbot and AI hallucinations are a real concern.

Current approach:
- Strict system prompts
- RAG for grounding responses
- Confidence scoring

But we still get occasional made-up information.

How are others handling this? Any patterns or libraries that help?`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-19T16:20:00'),
      updatedAt: now,
    },
    // Post 15 - user-5 (Kevin Lee) - Share
    {
      id: 'post-15',
      authorId: 'user-5',
      title: 'My journey from zero to building my first AI app - 1 month progress',
      content: `One month ago I knew nothing about AI development. Today I deployed my first AI-powered app!

**What I built:** A recipe generator that creates personalized meal plans based on dietary restrictions.

**What I learned:**
- Prompt engineering basics
- OpenAI API integration
- React fundamentals
- Vercel deployment

Thanks to everyone in this community who helped along the way. Special shoutout to @Amy Lin for the mentorship!`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-20T15:30:00'),
      updatedAt: now,
    },
    // Post 16 - user-6 (Jessica Wu) - Discussion
    {
      id: 'post-16',
      authorId: 'user-6',
      title: 'The ethics of AI art - where do we draw the line?',
      content: `With AI art becoming mainstream, I've been thinking about the ethical implications.

**Questions I'm wrestling with:**
1. Should AI art trained on copyrighted work be commercial?
2. How do we credit the original artists whose work trained the models?
3. Is using AI art in portfolios dishonest?

I don't have all the answers, but I think we need to have this conversation as a community.

What's your take?`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-16T19:45:00'),
      updatedAt: now,
    },
    // Post 17 - user-8 (Lisa Chen) - Resource
    {
      id: 'post-17',
      authorId: 'user-8',
      title: '[Template] My Notion setup for AI project management',
      content: `I've refined my Notion template for managing AI projects. Sharing it with the community!

**Features:**
- Prompt library with version history
- Model comparison tracker
- Cost calculator
- Project timeline template
- Weekly experiment log

**How to use:**
1. Duplicate the template (link in comments)
2. Customize the prompt categories
3. Connect to your API dashboard for cost tracking

Let me know what features you'd add!`,
      category: 'resource',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-15T10:00:00'),
      updatedAt: now,
    },
    // Post 18 - user-9 (Tom Huang) - Question
    {
      id: 'post-18',
      authorId: 'user-9',
      title: 'RAG vs Fine-tuning: When to use which?',
      content: `I'm building a domain-specific assistant and torn between RAG and fine-tuning.

**My use case:**
- Legal document analysis
- Need accurate citations
- ~10k documents in knowledge base

**My understanding:**
- RAG: Good for dynamic knowledge, easier to update
- Fine-tuning: Better for consistent style/format

But I'm not sure which is better for accuracy in specialized domains.

Anyone with experience in similar projects?`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-18T21:30:00'),
      updatedAt: now,
    },
    // Post 19 - user-10 (Amy Lin) - Share
    {
      id: 'post-19',
      authorId: 'user-10',
      title: 'How I automated 80% of my work with AI - A realistic guide',
      content: `After 8 months of experimenting, here's what I've actually automated:

## Successfully automated
- Email drafting and sorting
- Meeting summaries and action items
- Code documentation
- First-pass code reviews
- Social media content creation

## Partially automated (still need human review)
- Strategic decisions
- Client communications
- Complex debugging
- Creative direction

## Failed experiments
- Fully autonomous coding (too many errors)
- Legal document review (too risky)

The key is knowing what AI is good at and what it isn't.`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-17T13:00:00'),
      updatedAt: now,
    },
    // Post 20 - user-7 (David Zhang) - Question
    {
      id: 'post-20',
      authorId: 'user-7',
      title: 'Cheapest way to run Stable Diffusion locally?',
      content: `I want to experiment with Stable Diffusion but don't want to pay for cloud compute.

My current setup:
- MacBook Pro M2 (16GB)
- No dedicated GPU

Is this enough to run SD locally? If not, what's the minimum hardware needed?

Also interested in hearing about any cloud options that are pay-per-use rather than subscription.`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-21T09:15:00'),
      updatedAt: now,
    },
    // Post 21 - user-2 (Sarah Lin) - Resource
    {
      id: 'post-21',
      authorId: 'user-2',
      title: '[Video Course Notes] Advanced Prompt Engineering - My Summary',
      content: `Just finished the Advanced Prompt Engineering course. Here are my key takeaways:

## Chapter 1: Chain of Thought
- Always ask for step-by-step reasoning
- Use "Let's think through this" as a trigger

## Chapter 2: Few-Shot Learning
- 3-5 examples is usually optimal
- Order matters - put best examples first

## Chapter 3: System Prompts
- Be specific about personality and constraints
- Include format requirements upfront

## Chapter 4: Prompt Chaining
- Break complex tasks into smaller prompts
- Pass context between chains carefully

Full detailed notes in the attached PDF!`,
      category: 'resource',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-16T08:30:00'),
      updatedAt: now,
    },
    // Post 22 - user-4 (Emily Huang) - Discussion
    {
      id: 'post-22',
      authorId: 'user-4',
      title: 'The future of creative work in an AI world',
      content: `As a content creator, I've been thinking about where this is all heading.

**My predictions for 2027:**
1. AI will handle 90% of routine content
2. Human creativity will be more valued, not less
3. New hybrid roles will emerge (AI directors, prompt artists)
4. Authenticity will become a premium feature

**What I'm doing to prepare:**
- Learning to direct AI effectively
- Building personal brand beyond AI capabilities
- Focusing on strategic thinking

Curious what others in creative fields are thinking?`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-19T12:00:00'),
      updatedAt: now,
    },
    // Post 23 - user-1 (Alex Chen) - Share
    {
      id: 'post-23',
      authorId: 'user-1',
      title: 'Rebuilt my portfolio website with AI in a weekend',
      content: `I've been meaning to update my portfolio for months. Finally did it this weekend with AI help!

**Tech stack:**
- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- Vercel

**AI usage:**
- ChatGPT for component code
- Claude for content writing
- Midjourney for hero images

Total time: ~12 hours across 2 days

Before AI this would have taken me 2-3 weeks. Link in comments if you want to check it out!`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-21T14:00:00'),
      updatedAt: now,
    },
    // Post 24 - user-3 (Mike Wang) - Resource
    {
      id: 'post-24',
      authorId: 'user-3',
      title: '[Comparison] Vector Databases for RAG Applications',
      content: `I tested 5 popular vector databases for a RAG project. Here's my comparison:

| Database | Speed | Ease of Use | Cost | Best For |
|----------|-------|-------------|------|----------|
| Pinecone | Fast | Very Easy | $$$ | Production |
| Weaviate | Fast | Medium | Free tier | Flexible queries |
| Chroma | Medium | Very Easy | Free | Local dev |
| Milvus | Very Fast | Complex | Free | Scale |
| Qdrant | Fast | Easy | Free | Self-hosted |

**My recommendation:**
- Start with Chroma locally
- Move to Pinecone or Qdrant for production

Detailed benchmarks in the thread!`,
      category: 'resource',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-20T09:00:00'),
      updatedAt: now,
    },
    // Post 25 - user-6 (Jessica Wu) - Question
    {
      id: 'post-25',
      authorId: 'user-6',
      title: 'How to maintain consistent character design across multiple images?',
      content: `I'm working on a children's book and need the same character to appear in 20+ illustrations.

**Problem:** Every image looks slightly different even with detailed prompts.

**What I've tried:**
- Seed locking
- Detailed character descriptions
- Reference images

Still getting inconsistencies. Any Midjourney or SD experts have tips for this?`,
      category: 'question',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-18T16:00:00'),
      updatedAt: now,
    },
    // Post 26 - user-8 (Lisa Chen) - Discussion
    {
      id: 'post-26',
      authorId: 'user-8',
      title: 'Starting salary expectations for AI/ML roles in 2026?',
      content: `I'm transitioning from traditional web dev to AI/ML engineering and trying to understand the market.

**My background:**
- 4 years web development
- Self-taught ML (courses + projects)
- No formal ML degree

**Current offers:**
- Offer A: $95k (startup, more AI-focused)
- Offer B: $110k (big tech, some AI work)

Am I undervaluing myself? What are others seeing in the market?`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-17T20:30:00'),
      updatedAt: now,
    },
    // Post 27 - user-9 (Tom Huang) - Share
    {
      id: 'post-27',
      authorId: 'user-9',
      title: 'Open-sourcing my AI writing assistant - 6 months of work',
      content: `After 6 months of development, I'm finally open-sourcing my AI writing assistant!

**Features:**
- Multiple LLM support (OpenAI, Claude, Local)
- Style matching from your existing writing
- Grammar and tone suggestions
- Export to various formats

**Why open source?**
I built this for myself but realized others might find it useful. Plus I'd love community contributions!

GitHub link in comments. Stars appreciated! ⭐`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-19T19:00:00'),
      updatedAt: now,
    },
    // Post 28 - user-10 (Amy Lin) - Resource
    {
      id: 'post-28',
      authorId: 'user-10',
      title: '[Workshop Materials] Building Production AI Apps - Complete Guide',
      content: `Materials from my workshop on building production-ready AI applications:

## Module 1: Architecture Patterns
- Request/response vs streaming
- Caching strategies
- Error handling

## Module 2: Prompt Management
- Version control for prompts
- A/B testing frameworks
- Evaluation metrics

## Module 3: Deployment
- Rate limiting
- Cost monitoring
- Fallback strategies

## Module 4: Monitoring
- Token usage tracking
- Quality metrics
- Alert setup

All slides, code samples, and exercises available at the link below.`,
      category: 'resource',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-14T15:00:00'),
      updatedAt: now,
    },
    // Post 29 - user-5 (Kevin Lee) - Discussion
    {
      id: 'post-29',
      authorId: 'user-5',
      title: 'Imposter syndrome when using AI - anyone else feel this?',
      content: `Honest question: Does anyone else feel like a fraud when AI does most of the work?

I just built an app that would have been impossible for me to create alone. Now I'm wondering:
- Can I really call myself a developer?
- Should I disclose AI usage in job applications?
- Am I actually learning or just copying?

Maybe I'm overthinking this, but I'd love to hear how others deal with these feelings.`,
      category: 'discussion',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-21T16:45:00'),
      updatedAt: now,
    },
    // Post 30 - user-7 (David Zhang) - Share
    {
      id: 'post-30',
      authorId: 'user-7',
      title: 'Created a Discord bot that explains code - Free to use!',
      content: `Made a simple Discord bot that explains code snippets using GPT-4.

**How it works:**
1. Paste code with \`/explain\`
2. Bot analyzes and explains
3. Ask follow-up questions

**Features:**
- Supports 20+ languages
- Explains line by line or overview
- Suggests improvements

It's running on my server so completely free to use. Just add it to your Discord!

Bot invite link in comments. Feedback welcome!`,
      category: 'share',
      isPinned: false,
      isLocked: false,
      isDeleted: false,
      createdAt: new Date('2026-01-15T17:30:00'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // FORUM POST STATS (30 posts)
  // ==========================================
  db.forumPostStats.createMany([
    { postId: 'post-1', upvotes: 48, downvotes: 6, score: 42, viewCount: 328, commentCount: 8, bookmarkCount: 12, shareCount: 5, reportCount: 0, uniqueViewCount24h: 45, postPoints: 520, trendingScore: 8.5, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-2', upvotes: 92, downvotes: 6, score: 86, viewCount: 512, commentCount: 12, bookmarkCount: 28, shareCount: 15, reportCount: 0, uniqueViewCount24h: 85, postPoints: 1180, trendingScore: 12.2, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-3', upvotes: 38, downvotes: 4, score: 34, viewCount: 245, commentCount: 10, bookmarkCount: 8, shareCount: 3, reportCount: 0, uniqueViewCount24h: 32, postPoints: 410, trendingScore: 6.8, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-4', upvotes: 162, downvotes: 6, score: 156, viewCount: 1024, commentCount: 15, bookmarkCount: 45, shareCount: 22, reportCount: 0, uniqueViewCount24h: 120, postPoints: 1920, trendingScore: 9.5, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-5', upvotes: 22, downvotes: 4, score: 18, viewCount: 156, commentCount: 7, bookmarkCount: 5, shareCount: 2, reportCount: 0, uniqueViewCount24h: 28, postPoints: 232, trendingScore: 7.2, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-6', upvotes: 67, downvotes: 3, score: 64, viewCount: 389, commentCount: 9, bookmarkCount: 18, shareCount: 8, reportCount: 0, uniqueViewCount24h: 52, postPoints: 780, trendingScore: 7.9, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-7', upvotes: 89, downvotes: 12, score: 77, viewCount: 567, commentCount: 23, bookmarkCount: 14, shareCount: 11, reportCount: 0, uniqueViewCount24h: 78, postPoints: 920, trendingScore: 6.5, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-8', upvotes: 54, downvotes: 2, score: 52, viewCount: 298, commentCount: 11, bookmarkCount: 22, shareCount: 6, reportCount: 0, uniqueViewCount24h: 41, postPoints: 640, trendingScore: 9.1, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-9', upvotes: 118, downvotes: 5, score: 113, viewCount: 876, commentCount: 14, bookmarkCount: 52, shareCount: 19, reportCount: 0, uniqueViewCount24h: 95, postPoints: 1450, trendingScore: 8.3, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-10', upvotes: 45, downvotes: 1, score: 44, viewCount: 234, commentCount: 6, bookmarkCount: 8, shareCount: 4, reportCount: 0, uniqueViewCount24h: 67, postPoints: 510, trendingScore: 10.8, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-11', upvotes: 76, downvotes: 8, score: 68, viewCount: 445, commentCount: 18, bookmarkCount: 21, shareCount: 9, reportCount: 0, uniqueViewCount24h: 58, postPoints: 850, trendingScore: 7.4, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-12', upvotes: 83, downvotes: 4, score: 79, viewCount: 512, commentCount: 14, bookmarkCount: 31, shareCount: 12, reportCount: 0, uniqueViewCount24h: 89, postPoints: 990, trendingScore: 11.5, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-13', upvotes: 134, downvotes: 7, score: 127, viewCount: 892, commentCount: 16, bookmarkCount: 67, shareCount: 24, reportCount: 0, uniqueViewCount24h: 76, postPoints: 1680, trendingScore: 8.1, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-14', upvotes: 61, downvotes: 3, score: 58, viewCount: 367, commentCount: 13, bookmarkCount: 19, shareCount: 7, reportCount: 0, uniqueViewCount24h: 49, postPoints: 720, trendingScore: 8.8, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-15', upvotes: 56, downvotes: 2, score: 54, viewCount: 298, commentCount: 11, bookmarkCount: 15, shareCount: 8, reportCount: 0, uniqueViewCount24h: 62, postPoints: 650, trendingScore: 9.7, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-16', upvotes: 94, downvotes: 15, score: 79, viewCount: 623, commentCount: 28, bookmarkCount: 16, shareCount: 13, reportCount: 0, uniqueViewCount24h: 71, postPoints: 980, trendingScore: 7.1, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-17', upvotes: 87, downvotes: 3, score: 84, viewCount: 534, commentCount: 12, bookmarkCount: 42, shareCount: 16, reportCount: 0, uniqueViewCount24h: 64, postPoints: 1080, trendingScore: 7.8, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-18', upvotes: 71, downvotes: 4, score: 67, viewCount: 412, commentCount: 15, bookmarkCount: 24, shareCount: 9, reportCount: 0, uniqueViewCount24h: 55, postPoints: 830, trendingScore: 7.6, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-19', upvotes: 145, downvotes: 8, score: 137, viewCount: 956, commentCount: 19, bookmarkCount: 58, shareCount: 27, reportCount: 0, uniqueViewCount24h: 82, postPoints: 1780, trendingScore: 8.4, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-20', upvotes: 29, downvotes: 2, score: 27, viewCount: 178, commentCount: 8, bookmarkCount: 6, shareCount: 3, reportCount: 0, uniqueViewCount24h: 43, postPoints: 320, trendingScore: 8.9, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-21', upvotes: 98, downvotes: 4, score: 94, viewCount: 645, commentCount: 11, bookmarkCount: 48, shareCount: 18, reportCount: 0, uniqueViewCount24h: 59, postPoints: 1220, trendingScore: 7.3, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-22', upvotes: 82, downvotes: 9, score: 73, viewCount: 489, commentCount: 21, bookmarkCount: 17, shareCount: 10, reportCount: 0, uniqueViewCount24h: 66, postPoints: 890, trendingScore: 8.7, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-23', upvotes: 63, downvotes: 3, score: 60, viewCount: 356, commentCount: 9, bookmarkCount: 14, shareCount: 7, reportCount: 0, uniqueViewCount24h: 78, postPoints: 720, trendingScore: 10.2, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-24', upvotes: 112, downvotes: 5, score: 107, viewCount: 723, commentCount: 13, bookmarkCount: 54, shareCount: 21, reportCount: 0, uniqueViewCount24h: 91, postPoints: 1380, trendingScore: 10.6, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-25', upvotes: 43, downvotes: 2, score: 41, viewCount: 267, commentCount: 12, bookmarkCount: 11, shareCount: 4, reportCount: 0, uniqueViewCount24h: 38, postPoints: 510, trendingScore: 7.5, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-26', upvotes: 67, downvotes: 6, score: 61, viewCount: 398, commentCount: 16, bookmarkCount: 13, shareCount: 6, reportCount: 0, uniqueViewCount24h: 47, postPoints: 740, trendingScore: 7.9, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-27', upvotes: 89, downvotes: 4, score: 85, viewCount: 534, commentCount: 14, bookmarkCount: 38, shareCount: 15, reportCount: 0, uniqueViewCount24h: 72, postPoints: 1050, trendingScore: 9.3, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-28', upvotes: 156, downvotes: 6, score: 150, viewCount: 1123, commentCount: 18, bookmarkCount: 72, shareCount: 31, reportCount: 0, uniqueViewCount24h: 98, postPoints: 1950, trendingScore: 8.6, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-29', upvotes: 78, downvotes: 5, score: 73, viewCount: 445, commentCount: 24, bookmarkCount: 12, shareCount: 9, reportCount: 0, uniqueViewCount24h: 85, postPoints: 880, trendingScore: 11.2, trendingUpdatedAt: now, lastUpdatedAt: now },
    { postId: 'post-30', upvotes: 52, downvotes: 3, score: 49, viewCount: 312, commentCount: 10, bookmarkCount: 16, shareCount: 8, reportCount: 0, uniqueViewCount24h: 45, postPoints: 610, trendingScore: 7.0, trendingUpdatedAt: now, lastUpdatedAt: now },
  ]);

  // ==========================================
  // FORUM POST TAGS (Junction Table)
  // ==========================================
  db.forumPostTags.createMany([
    // Post 1 tags
    { id: 'ptag-1-1', postId: 'post-1', tag: 'ChatGPT' },
    { id: 'ptag-1-2', postId: 'post-1', tag: 'Programming' },
    { id: 'ptag-1-3', postId: 'post-1', tag: 'Tips' },
    // Post 2 tags
    { id: 'ptag-2-1', postId: 'post-2', tag: 'Side Project' },
    { id: 'ptag-2-2', postId: 'post-2', tag: 'AI Tools' },
    { id: 'ptag-2-3', postId: 'post-2', tag: 'Automation' },
    // Post 3 tags
    { id: 'ptag-3-1', postId: 'post-3', tag: 'Midjourney' },
    { id: 'ptag-3-2', postId: 'post-3', tag: 'Image Generation' },
    { id: 'ptag-3-3', postId: 'post-3', tag: 'New Features' },
    // Post 4 tags
    { id: 'ptag-4-1', postId: 'post-4', tag: 'AI Tools' },
    { id: 'ptag-4-2', postId: 'post-4', tag: 'Resources' },
    { id: 'ptag-4-3', postId: 'post-4', tag: '2026' },
    // Post 5 tags
    { id: 'ptag-5-1', postId: 'post-5', tag: 'Beginner' },
    { id: 'ptag-5-2', postId: 'post-5', tag: 'Prompt Engineering' },
    { id: 'ptag-5-3', postId: 'post-5', tag: 'Learning' },
    // Post 6 tags
    { id: 'ptag-6-1', postId: 'post-6', tag: 'AI Art' },
    { id: 'ptag-6-2', postId: 'post-6', tag: 'Challenge' },
    { id: 'ptag-6-3', postId: 'post-6', tag: 'Portfolio' },
    // Post 7 tags
    { id: 'ptag-7-1', postId: 'post-7', tag: 'AI Impact' },
    { id: 'ptag-7-2', postId: 'post-7', tag: 'Future of Work' },
    { id: 'ptag-7-3', postId: 'post-7', tag: 'Discussion' },
    // Post 8 tags
    { id: 'ptag-8-1', postId: 'post-8', tag: 'API Costs' },
    { id: 'ptag-8-2', postId: 'post-8', tag: 'Optimization' },
    { id: 'ptag-8-3', postId: 'post-8', tag: 'Production' },
    // Post 9 tags
    { id: 'ptag-9-1', postId: 'post-9', tag: 'Ollama' },
    { id: 'ptag-9-2', postId: 'post-9', tag: 'Local LLM' },
    { id: 'ptag-9-3', postId: 'post-9', tag: 'Tutorial' },
    // Post 10 tags
    { id: 'ptag-10-1', postId: 'post-10', tag: 'Challenge' },
    { id: 'ptag-10-2', postId: 'post-10', tag: 'Community' },
    { id: 'ptag-10-3', postId: 'post-10', tag: 'AI Art' },
    // Post 11 tags
    { id: 'ptag-11-1', postId: 'post-11', tag: 'Claude' },
    { id: 'ptag-11-2', postId: 'post-11', tag: 'ChatGPT' },
    { id: 'ptag-11-3', postId: 'post-11', tag: 'Comparison' },
    // Post 12 tags
    { id: 'ptag-12-1', postId: 'post-12', tag: 'Chrome Extension' },
    { id: 'ptag-12-2', postId: 'post-12', tag: 'Tutorial' },
    { id: 'ptag-12-3', postId: 'post-12', tag: 'Quick Build' },
    // Post 13 tags
    { id: 'ptag-13-1', postId: 'post-13', tag: 'Prompts' },
    { id: 'ptag-13-2', postId: 'post-13', tag: 'Cheat Sheet' },
    { id: 'ptag-13-3', postId: 'post-13', tag: 'Development' },
    // Post 14 tags
    { id: 'ptag-14-1', postId: 'post-14', tag: 'Hallucinations' },
    { id: 'ptag-14-2', postId: 'post-14', tag: 'Production' },
    { id: 'ptag-14-3', postId: 'post-14', tag: 'RAG' },
    // Post 15 tags
    { id: 'ptag-15-1', postId: 'post-15', tag: 'Journey' },
    { id: 'ptag-15-2', postId: 'post-15', tag: 'First App' },
    { id: 'ptag-15-3', postId: 'post-15', tag: 'Beginner' },
    // Post 16 tags
    { id: 'ptag-16-1', postId: 'post-16', tag: 'Ethics' },
    { id: 'ptag-16-2', postId: 'post-16', tag: 'AI Art' },
    { id: 'ptag-16-3', postId: 'post-16', tag: 'Discussion' },
    // Post 17 tags
    { id: 'ptag-17-1', postId: 'post-17', tag: 'Notion' },
    { id: 'ptag-17-2', postId: 'post-17', tag: 'Template' },
    { id: 'ptag-17-3', postId: 'post-17', tag: 'Project Management' },
    // Post 18 tags
    { id: 'ptag-18-1', postId: 'post-18', tag: 'RAG' },
    { id: 'ptag-18-2', postId: 'post-18', tag: 'Fine-tuning' },
    { id: 'ptag-18-3', postId: 'post-18', tag: 'Architecture' },
    // Post 19 tags
    { id: 'ptag-19-1', postId: 'post-19', tag: 'Automation' },
    { id: 'ptag-19-2', postId: 'post-19', tag: 'Productivity' },
    { id: 'ptag-19-3', postId: 'post-19', tag: 'Workflow' },
    // Post 20 tags
    { id: 'ptag-20-1', postId: 'post-20', tag: 'Stable Diffusion' },
    { id: 'ptag-20-2', postId: 'post-20', tag: 'Hardware' },
    { id: 'ptag-20-3', postId: 'post-20', tag: 'Local' },
    // Post 21 tags
    { id: 'ptag-21-1', postId: 'post-21', tag: 'Course Notes' },
    { id: 'ptag-21-2', postId: 'post-21', tag: 'Prompt Engineering' },
    { id: 'ptag-21-3', postId: 'post-21', tag: 'Summary' },
    // Post 22 tags
    { id: 'ptag-22-1', postId: 'post-22', tag: 'Future' },
    { id: 'ptag-22-2', postId: 'post-22', tag: 'Creative Work' },
    { id: 'ptag-22-3', postId: 'post-22', tag: 'Predictions' },
    // Post 23 tags
    { id: 'ptag-23-1', postId: 'post-23', tag: 'Portfolio' },
    { id: 'ptag-23-2', postId: 'post-23', tag: 'Next.js' },
    { id: 'ptag-23-3', postId: 'post-23', tag: 'Weekend Project' },
    // Post 24 tags
    { id: 'ptag-24-1', postId: 'post-24', tag: 'Vector Database' },
    { id: 'ptag-24-2', postId: 'post-24', tag: 'Comparison' },
    { id: 'ptag-24-3', postId: 'post-24', tag: 'RAG' },
    // Post 25 tags
    { id: 'ptag-25-1', postId: 'post-25', tag: 'Character Design' },
    { id: 'ptag-25-2', postId: 'post-25', tag: 'Consistency' },
    { id: 'ptag-25-3', postId: 'post-25', tag: 'Illustration' },
    // Post 26 tags
    { id: 'ptag-26-1', postId: 'post-26', tag: 'Career' },
    { id: 'ptag-26-2', postId: 'post-26', tag: 'Salary' },
    { id: 'ptag-26-3', postId: 'post-26', tag: 'ML Engineering' },
    // Post 27 tags
    { id: 'ptag-27-1', postId: 'post-27', tag: 'Open Source' },
    { id: 'ptag-27-2', postId: 'post-27', tag: 'Writing Assistant' },
    { id: 'ptag-27-3', postId: 'post-27', tag: 'Project' },
    // Post 28 tags
    { id: 'ptag-28-1', postId: 'post-28', tag: 'Workshop' },
    { id: 'ptag-28-2', postId: 'post-28', tag: 'Production' },
    { id: 'ptag-28-3', postId: 'post-28', tag: 'Best Practices' },
    // Post 29 tags
    { id: 'ptag-29-1', postId: 'post-29', tag: 'Imposter Syndrome' },
    { id: 'ptag-29-2', postId: 'post-29', tag: 'Mental Health' },
    { id: 'ptag-29-3', postId: 'post-29', tag: 'Community' },
    // Post 30 tags
    { id: 'ptag-30-1', postId: 'post-30', tag: 'Discord Bot' },
    { id: 'ptag-30-2', postId: 'post-30', tag: 'Free Tool' },
    { id: 'ptag-30-3', postId: 'post-30', tag: 'Code Explanation' },
  ]);

  // ==========================================
  // FORUM COMMENTS (sample for first 5 posts)
  // ==========================================
  db.forumComments.createMany([
    // Post 1 Comments (8 total)
    { id: 'comment-1-1', postId: 'post-1', authorId: 'user-2', content: 'My experience is to give ChatGPT more context, such as explaining your tech stack and project structure. This way it can give more relevant suggestions.', isDeleted: false, createdAt: new Date('2026-01-20T11:00:00'), updatedAt: now },
    { id: 'comment-1-2', postId: 'post-1', authorId: 'user-3', content: 'I recommend using the Chain of Thought approach, letting it think step by step. The accuracy will improve significantly!', isDeleted: false, createdAt: new Date('2026-01-20T12:30:00'), updatedAt: now },
    { id: 'comment-1-3', postId: 'post-1', parentId: 'comment-1-1', authorId: 'user-1', content: 'Thanks for sharing! I will try this method.', isDeleted: false, createdAt: new Date('2026-01-20T13:00:00'), updatedAt: now },
    { id: 'comment-1-4', postId: 'post-1', authorId: 'user-4', content: 'Also try specifying the output format you want - like asking for comments in the code, or specific variable naming conventions.', isDeleted: false, createdAt: new Date('2026-01-20T14:15:00'), updatedAt: now },
    { id: 'comment-1-5', postId: 'post-1', authorId: 'user-6', content: 'I find that asking ChatGPT to review its own code helps catch bugs before you even run it!', isDeleted: false, createdAt: new Date('2026-01-20T15:30:00'), updatedAt: now },
    { id: 'comment-1-6', postId: 'post-1', authorId: 'user-8', content: 'Breaking down complex problems into smaller tasks and tackling them one at a time really helps with accuracy.', isDeleted: false, createdAt: new Date('2026-01-20T16:00:00'), updatedAt: now },
    { id: 'comment-1-7', postId: 'post-1', authorId: 'user-9', content: 'Have you tried using the new GPT-4 Turbo? The code quality has improved noticeably compared to the older versions.', isDeleted: false, createdAt: new Date('2026-01-20T17:20:00'), updatedAt: now },
    { id: 'comment-1-8', postId: 'post-1', authorId: 'user-10', content: 'Pro tip: Always include error handling requirements in your prompts. ChatGPT often skips edge cases unless you explicitly ask.', isDeleted: false, createdAt: new Date('2026-01-20T18:00:00'), updatedAt: now },

    // Post 2 Comments (12 total)
    { id: 'comment-2-1', postId: 'post-2', authorId: 'user-1', content: 'Amazing! Is Make.com hard to learn? I\'ve been wanting to try automation tools.', isDeleted: false, createdAt: new Date('2026-01-19T16:00:00'), updatedAt: now },
    { id: 'comment-2-2', postId: 'post-2', parentId: 'comment-2-1', authorId: 'user-2', content: 'Not at all! Make.com has a visual interface that makes it super intuitive.', isDeleted: false, createdAt: new Date('2026-01-19T16:30:00'), updatedAt: now },
    { id: 'comment-2-3', postId: 'post-2', authorId: 'user-3', content: 'This is inspiring! What was the most challenging part of the project?', isDeleted: false, createdAt: new Date('2026-01-19T17:00:00'), updatedAt: now },
    { id: 'comment-2-4', postId: 'post-2', authorId: 'user-6', content: 'How much does it cost to run this system monthly? Curious about the API costs.', isDeleted: false, createdAt: new Date('2026-01-19T19:30:00'), updatedAt: now },
    { id: 'comment-2-5', postId: 'post-2', parentId: 'comment-2-4', authorId: 'user-2', content: 'It\'s about $50-80/month depending on usage. ChatGPT API is the biggest cost.', isDeleted: false, createdAt: new Date('2026-01-19T20:00:00'), updatedAt: now },
    { id: 'comment-2-6', postId: 'post-2', authorId: 'user-10', content: 'Excellent execution! This kind of project showcase is why I love this community.', isDeleted: false, createdAt: new Date('2026-01-20T08:00:00'), updatedAt: now },
    { id: 'comment-2-7', postId: 'post-2', authorId: 'user-5', content: 'This is so cool! I hope I can build something like this one day.', isDeleted: false, createdAt: new Date('2026-01-20T09:00:00'), updatedAt: now },
    { id: 'comment-2-8', postId: 'post-2', authorId: 'user-7', content: 'Would you consider open-sourcing part of it?', isDeleted: false, createdAt: new Date('2026-01-20T10:00:00'), updatedAt: now },
    { id: 'comment-2-9', postId: 'post-2', parentId: 'comment-2-8', authorId: 'user-2', content: 'Yes! Planning to write a tutorial series about it.', isDeleted: false, createdAt: new Date('2026-01-20T10:30:00'), updatedAt: now },
    { id: 'comment-2-10', postId: 'post-2', authorId: 'user-8', content: 'The Midjourney integration sounds interesting. How do you handle the image generation workflow?', isDeleted: false, createdAt: new Date('2026-01-20T11:00:00'), updatedAt: now },
    { id: 'comment-2-11', postId: 'post-2', authorId: 'user-4', content: 'Great work Sarah! Let me know if you want to collaborate on the tutorial.', isDeleted: false, createdAt: new Date('2026-01-20T12:00:00'), updatedAt: now },
    { id: 'comment-2-12', postId: 'post-2', authorId: 'user-9', content: 'Bookmarked! This is exactly the kind of project I want to build next.', isDeleted: false, createdAt: new Date('2026-01-20T14:00:00'), updatedAt: now },

    // Post 5 Comments (7 total)
    { id: 'comment-5-1', postId: 'post-5', authorId: 'user-2', content: 'You don\'t need much prerequisite knowledge. I recommend starting with the free courses here!', isDeleted: false, createdAt: new Date('2026-01-21T09:00:00'), updatedAt: now },
    { id: 'comment-5-2', postId: 'post-5', authorId: 'user-4', content: 'The basics can be learned in a weekend, but mastery takes continuous practice.', isDeleted: false, createdAt: new Date('2026-01-21T10:00:00'), updatedAt: now },
    { id: 'comment-5-3', postId: 'post-5', authorId: 'user-10', content: 'Welcome! I suggest: 1) Basic prompting course, 2) Practice daily with ChatGPT, 3) Move to specialized tools.', isDeleted: false, createdAt: new Date('2026-01-21T11:00:00'), updatedAt: now },
    { id: 'comment-5-4', postId: 'post-5', parentId: 'comment-5-3', authorId: 'user-5', content: 'This is exactly what I needed! Thank you for the clear roadmap!', isDeleted: false, createdAt: new Date('2026-01-21T11:30:00'), updatedAt: now },
    { id: 'comment-5-5', postId: 'post-5', authorId: 'user-3', content: 'No programming background needed! I started with zero tech experience.', isDeleted: false, createdAt: new Date('2026-01-21T12:00:00'), updatedAt: now },
    { id: 'comment-5-6', postId: 'post-5', authorId: 'user-6', content: 'Join the community Discord too! We have weekly prompt challenges.', isDeleted: false, createdAt: new Date('2026-01-21T13:00:00'), updatedAt: now },
    { id: 'comment-5-7', postId: 'post-5', authorId: 'user-9', content: 'The most important thing is just to start experimenting!', isDeleted: false, createdAt: new Date('2026-01-21T14:00:00'), updatedAt: now },

    // Post 12 Comments (sample)
    { id: 'comment-12-1', postId: 'post-12', authorId: 'user-1', content: 'This is incredible! 2 hours for a working extension is amazing.', isDeleted: false, createdAt: new Date('2026-01-21T12:00:00'), updatedAt: now },
    { id: 'comment-12-2', postId: 'post-12', authorId: 'user-5', content: 'Please share the source code! I\'d love to learn from it.', isDeleted: false, createdAt: new Date('2026-01-21T12:30:00'), updatedAt: now },
    { id: 'comment-12-3', postId: 'post-12', authorId: 'user-3', content: 'What API are you using for the summarization? OpenAI or something else?', isDeleted: false, createdAt: new Date('2026-01-21T13:00:00'), updatedAt: now },
    { id: 'comment-12-4', postId: 'post-12', parentId: 'comment-12-3', authorId: 'user-4', content: 'I used GPT-4 Turbo for the best quality summaries.', isDeleted: false, createdAt: new Date('2026-01-21T13:30:00'), updatedAt: now },

    // Post 29 Comments (sample for discussion post)
    { id: 'comment-29-1', postId: 'post-29', authorId: 'user-10', content: 'You\'re not alone! Many of us feel this way. The key is: AI is a tool, and knowing how to use tools well IS a skill.', isDeleted: false, createdAt: new Date('2026-01-21T17:00:00'), updatedAt: now },
    { id: 'comment-29-2', postId: 'post-29', authorId: 'user-2', content: 'Think of it like using a calculator - nobody calls mathematicians frauds for using calculators!', isDeleted: false, createdAt: new Date('2026-01-21T17:30:00'), updatedAt: now },
    { id: 'comment-29-3', postId: 'post-29', authorId: 'user-4', content: 'The fact that you\'re reflecting on this shows you care about your craft. That\'s what matters.', isDeleted: false, createdAt: new Date('2026-01-21T18:00:00'), updatedAt: now },
    { id: 'comment-29-4', postId: 'post-29', authorId: 'user-6', content: 'I had the same feelings! But remember - you still need to understand the code to modify it and make it work.', isDeleted: false, createdAt: new Date('2026-01-21T18:30:00'), updatedAt: now },
  ]);

  // ==========================================
  // FORUM COMMENT STATS
  // ==========================================
  db.forumCommentStats.createMany([
    { commentId: 'comment-1-1', upvotes: 18, downvotes: 3, score: 15, lastUpdatedAt: now },
    { commentId: 'comment-1-2', upvotes: 14, downvotes: 2, score: 12, lastUpdatedAt: now },
    { commentId: 'comment-1-3', upvotes: 5, downvotes: 0, score: 5, lastUpdatedAt: now },
    { commentId: 'comment-1-4', upvotes: 10, downvotes: 1, score: 9, lastUpdatedAt: now },
    { commentId: 'comment-1-5', upvotes: 8, downvotes: 0, score: 8, lastUpdatedAt: now },
    { commentId: 'comment-1-6', upvotes: 6, downvotes: 1, score: 5, lastUpdatedAt: now },
    { commentId: 'comment-1-7', upvotes: 7, downvotes: 0, score: 7, lastUpdatedAt: now },
    { commentId: 'comment-1-8', upvotes: 12, downvotes: 1, score: 11, lastUpdatedAt: now },
    { commentId: 'comment-2-1', upvotes: 8, downvotes: 0, score: 8, lastUpdatedAt: now },
    { commentId: 'comment-2-2', upvotes: 10, downvotes: 0, score: 10, lastUpdatedAt: now },
    { commentId: 'comment-2-3', upvotes: 6, downvotes: 0, score: 6, lastUpdatedAt: now },
    { commentId: 'comment-2-4', upvotes: 11, downvotes: 0, score: 11, lastUpdatedAt: now },
    { commentId: 'comment-2-5', upvotes: 15, downvotes: 0, score: 15, lastUpdatedAt: now },
    { commentId: 'comment-2-6', upvotes: 9, downvotes: 0, score: 9, lastUpdatedAt: now },
    { commentId: 'comment-2-7', upvotes: 4, downvotes: 0, score: 4, lastUpdatedAt: now },
    { commentId: 'comment-2-8', upvotes: 7, downvotes: 0, score: 7, lastUpdatedAt: now },
    { commentId: 'comment-2-9', upvotes: 12, downvotes: 0, score: 12, lastUpdatedAt: now },
    { commentId: 'comment-2-10', upvotes: 5, downvotes: 0, score: 5, lastUpdatedAt: now },
    { commentId: 'comment-2-11', upvotes: 8, downvotes: 0, score: 8, lastUpdatedAt: now },
    { commentId: 'comment-2-12', upvotes: 6, downvotes: 0, score: 6, lastUpdatedAt: now },
    { commentId: 'comment-5-1', upvotes: 10, downvotes: 1, score: 9, lastUpdatedAt: now },
    { commentId: 'comment-5-2', upvotes: 8, downvotes: 0, score: 8, lastUpdatedAt: now },
    { commentId: 'comment-5-3', upvotes: 15, downvotes: 0, score: 15, lastUpdatedAt: now },
    { commentId: 'comment-5-4', upvotes: 4, downvotes: 0, score: 4, lastUpdatedAt: now },
    { commentId: 'comment-5-5', upvotes: 7, downvotes: 0, score: 7, lastUpdatedAt: now },
    { commentId: 'comment-5-6', upvotes: 6, downvotes: 0, score: 6, lastUpdatedAt: now },
    { commentId: 'comment-5-7', upvotes: 9, downvotes: 0, score: 9, lastUpdatedAt: now },
    { commentId: 'comment-12-1', upvotes: 11, downvotes: 0, score: 11, lastUpdatedAt: now },
    { commentId: 'comment-12-2', upvotes: 8, downvotes: 0, score: 8, lastUpdatedAt: now },
    { commentId: 'comment-12-3', upvotes: 5, downvotes: 0, score: 5, lastUpdatedAt: now },
    { commentId: 'comment-12-4', upvotes: 7, downvotes: 0, score: 7, lastUpdatedAt: now },
    { commentId: 'comment-29-1', upvotes: 23, downvotes: 1, score: 22, lastUpdatedAt: now },
    { commentId: 'comment-29-2', upvotes: 18, downvotes: 2, score: 16, lastUpdatedAt: now },
    { commentId: 'comment-29-3', upvotes: 14, downvotes: 0, score: 14, lastUpdatedAt: now },
    { commentId: 'comment-29-4', upvotes: 11, downvotes: 0, score: 11, lastUpdatedAt: now },
  ]);

  // ==========================================
  // FORUM VOTES (sample)
  // ==========================================
  db.forumVotes.createMany([
    { id: 'vote-1', userId: 'user-2', targetType: 'post', targetId: 'post-1', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-2', userId: 'user-3', targetType: 'post', targetId: 'post-1', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-3', userId: 'user-4', targetType: 'post', targetId: 'post-2', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-4', userId: 'user-5', targetType: 'post', targetId: 'post-2', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-5', userId: 'user-6', targetType: 'post', targetId: 'post-3', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-6', userId: 'user-7', targetType: 'post', targetId: 'post-3', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-7', userId: 'user-8', targetType: 'post', targetId: 'post-4', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-8', userId: 'user-9', targetType: 'post', targetId: 'post-4', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-9', userId: 'user-10', targetType: 'post', targetId: 'post-5', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-10', userId: 'user-1', targetType: 'comment', targetId: 'comment-1-1', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-11', userId: 'user-1', targetType: 'comment', targetId: 'comment-1-2', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-12', userId: 'user-3', targetType: 'comment', targetId: 'comment-2-1', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-13', userId: 'user-1', targetType: 'post', targetId: 'post-12', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-14', userId: 'user-3', targetType: 'post', targetId: 'post-12', voteType: 'upvote', createdAt: now, updatedAt: now },
    { id: 'vote-15', userId: 'user-5', targetType: 'post', targetId: 'post-29', voteType: 'upvote', createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // FORUM BOOKMARKS
  // ==========================================
  db.forumBookmarks.createMany([
    { id: 'bookmark-1', userId: 'user-5', postId: 'post-1', createdAt: new Date('2026-01-20T15:00:00') },
    { id: 'bookmark-2', userId: 'user-6', postId: 'post-1', createdAt: new Date('2026-01-20T16:00:00') },
    { id: 'bookmark-3', userId: 'user-7', postId: 'post-2', createdAt: new Date('2026-01-19T20:00:00') },
    { id: 'bookmark-4', userId: 'user-8', postId: 'post-4', createdAt: new Date('2026-01-16T12:00:00') },
    { id: 'bookmark-5', userId: 'user-1', postId: 'post-4', createdAt: new Date('2026-01-17T10:00:00') },
    { id: 'bookmark-6', userId: 'user-5', postId: 'post-9', createdAt: new Date('2026-01-15T10:00:00') },
    { id: 'bookmark-7', userId: 'user-3', postId: 'post-13', createdAt: new Date('2026-01-17T12:00:00') },
    { id: 'bookmark-8', userId: 'user-6', postId: 'post-13', createdAt: new Date('2026-01-18T09:00:00') },
    { id: 'bookmark-9', userId: 'user-7', postId: 'post-17', createdAt: new Date('2026-01-16T14:00:00') },
    { id: 'bookmark-10', userId: 'user-1', postId: 'post-21', createdAt: new Date('2026-01-17T08:00:00') },
    { id: 'bookmark-11', userId: 'user-5', postId: 'post-28', createdAt: new Date('2026-01-15T18:00:00') },
    { id: 'bookmark-12', userId: 'user-8', postId: 'post-28', createdAt: new Date('2026-01-16T11:00:00') },
  ]);

  // ==========================================
  // FORUM POST EVENTS (Shares/Reports)
  // ==========================================
  db.forumPostEvents.createMany([
    // Shares
    { id: 'event-1', postId: 'post-1', userId: 'user-2', eventType: 'share', createdAt: new Date('2026-01-20T12:00:00') },
    { id: 'event-2', postId: 'post-1', userId: 'user-3', eventType: 'share', createdAt: new Date('2026-01-20T14:00:00') },
    { id: 'event-3', postId: 'post-2', userId: 'user-1', eventType: 'share', createdAt: new Date('2026-01-19T18:00:00') },
    { id: 'event-4', postId: 'post-2', userId: 'user-4', eventType: 'share', createdAt: new Date('2026-01-19T19:00:00') },
    { id: 'event-5', postId: 'post-4', userId: 'user-2', eventType: 'share', createdAt: new Date('2026-01-16T15:00:00') },
    { id: 'event-6', postId: 'post-4', userId: 'user-5', eventType: 'share', createdAt: new Date('2026-01-17T09:00:00') },
    { id: 'event-7', postId: 'post-4', userId: 'user-6', eventType: 'share', createdAt: new Date('2026-01-18T10:00:00') },
    { id: 'event-8', postId: 'post-9', userId: 'user-1', eventType: 'share', createdAt: new Date('2026-01-15T22:00:00') },
    { id: 'event-9', postId: 'post-13', userId: 'user-5', eventType: 'share', createdAt: new Date('2026-01-17T15:00:00') },
    { id: 'event-10', postId: 'post-19', userId: 'user-3', eventType: 'share', createdAt: new Date('2026-01-18T11:00:00') },
    { id: 'event-11', postId: 'post-28', userId: 'user-1', eventType: 'share', createdAt: new Date('2026-01-15T20:00:00') },
    { id: 'event-12', postId: 'post-28', userId: 'user-6', eventType: 'share', createdAt: new Date('2026-01-16T09:00:00') },
  ]);
}
