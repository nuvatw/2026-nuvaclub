import type { Post, Comment } from '@/features/forum/types';

/**
 * Mock forum posts data
 * Uses the 10 canonical users (user-1 through user-10)
 *
 * User Reference:
 * - user-1 (Alex Chen) - solo-traveler
 * - user-2 (Sarah Lin) - duo-run
 * - user-3 (Mike Wang) - solo-traveler
 * - user-4 (Emily Huang) - duo-fly
 * - user-5 (Kevin Lee) - explorer
 * - user-6 (Jessica Wu) - duo-go
 * - user-7 (David Zhang) - explorer
 * - user-8 (Lisa Chen) - duo-go
 * - user-9 (Tom Huang) - solo-traveler
 * - user-10 (Amy Lin) - duo-fly
 */
export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'How to write better code with ChatGPT?',
    content: `I recently started using ChatGPT to help with programming, but I found that sometimes its answers are not very accurate. I'd like to ask everyone what tips can make ChatGPT produce better code?

My current approach is:
1. Describe requirements in as much detail as possible
2. Provide example code
3. Ask it to explain each step

But there are still some issues, hope everyone can share their experience!`,
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
      identity: 'solo-traveler',
    },
    category: 'question',
    tags: ['ChatGPT', 'Programming', 'Tips'],
    score: 42,
    upvotes: 48,
    downvotes: 6,
    commentCount: 8,
    viewCount: 328,
    isPinned: false,
    createdAt: new Date('2026-01-20T10:30:00'),
    updatedAt: new Date('2026-01-20T10:30:00'),
  },
  {
    id: 'post-2',
    title: '[Share] My Side Project Completed in One Week Using AI',
    content: `I want to share a Side Project I recently completed using AI tools!

This is an automated content management system, mainly using:
- ChatGPT 4 for content generation
- Midjourney for image generation
- Make.com for workflow automation

The entire development process took about one week. Without AI, it might have taken more than a month.

Everyone is welcome to check it out and provide suggestions!`,
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
      identity: 'solo-traveler',
    },
    category: 'share',
    tags: ['Side Project', 'AI Tools', 'Automation'],
    score: 86,
    upvotes: 92,
    downvotes: 6,
    commentCount: 12,
    viewCount: 512,
    isPinned: true,
    createdAt: new Date('2026-01-19T15:00:00'),
    updatedAt: new Date('2026-01-19T18:30:00'),
  },
  {
    id: 'post-3',
    title: 'Midjourney v6 New Features Discussion',
    content: `Midjourney v6 is out! Has everyone tried it?

I found several notable improvements:
1. Text generation is more accurate
2. Human fingers are no longer so strange
3. Lighting and shadows are more natural

However, there are also some issues, such as the generation speed seems a bit slower.

Does anyone have any insights to share?`,
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
      identity: 'solo-traveler',
    },
    category: 'discussion',
    tags: ['Midjourney', 'Image Generation', 'New Features'],
    score: 34,
    upvotes: 38,
    downvotes: 4,
    commentCount: 10,
    viewCount: 245,
    isPinned: false,
    createdAt: new Date('2026-01-18T09:15:00'),
    updatedAt: new Date('2026-01-18T09:15:00'),
  },
  {
    id: 'post-4',
    title: '[Resource] AI Tools Collection 2026 Edition',
    content: `I've compiled a list of the latest AI tools for 2026, hope it helps everyone!

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
- Sora (Limited testing)

## Automation Tools
- Make.com
- Zapier
- n8n

Continuously updating, feel free to add more!`,
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairStraight',
      identity: 'solo-traveler',
    },
    category: 'resource',
    tags: ['AI Tools', 'Resource Collection', '2026'],
    score: 156,
    upvotes: 162,
    downvotes: 6,
    commentCount: 15,
    viewCount: 1024,
    isPinned: true,
    createdAt: new Date('2026-01-15T14:00:00'),
    updatedAt: new Date('2026-01-20T11:00:00'),
  },
  {
    id: 'post-5',
    title: 'Beginner Question: How to Start Learning Prompt Engineering?',
    content: `Hello everyone, I'm an AI beginner and want to start learning Prompt Engineering.

I saw related content in the courses, but I'd like to understand first:
1. What prerequisite knowledge is needed?
2. How long does it take to get started?
3. Is there a recommended learning path?

Thank you everyone!`,
    author: {
      id: 'user-5',
      name: 'Kevin Lee',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=kevin&top=shortHairShortFlat',
      identity: 'explorer',
    },
    category: 'question',
    tags: ['Beginner', 'Prompt Engineering', 'Learning'],
    score: 18,
    upvotes: 22,
    downvotes: 4,
    commentCount: 7,
    viewCount: 156,
    isPinned: false,
    createdAt: new Date('2026-01-21T08:00:00'),
    updatedAt: new Date('2026-01-21T08:00:00'),
  },
];

export const MOCK_COMMENTS: Comment[] = [
  // Post 1 comments
  {
    id: 'comment-1-1',
    postId: 'post-1',
    content: 'My experience is to give ChatGPT more context, such as explaining your tech stack and project structure, so it can give more relevant suggestions.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 15,
    createdAt: new Date('2026-01-20T11:00:00'),
  },
  {
    id: 'comment-1-2',
    postId: 'post-1',
    content: 'I suggest using the Chain of Thought approach, letting it think step by step, and the accuracy will improve a lot!',
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
    },
    score: 12,
    createdAt: new Date('2026-01-20T12:30:00'),
  },
  {
    id: 'comment-1-3',
    postId: 'post-1',
    parentId: 'comment-1-1',
    content: 'Thanks for sharing! I will try this method.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
    },
    score: 5,
    createdAt: new Date('2026-01-20T13:00:00'),
  },
  {
    id: 'comment-1-4',
    postId: 'post-1',
    content: 'Also try specifying the output format you want - like asking for comments in the code, or specific variable naming conventions.',
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairStraight',
    },
    score: 9,
    createdAt: new Date('2026-01-20T14:15:00'),
  },
  {
    id: 'comment-1-5',
    postId: 'post-1',
    content: 'I find that asking ChatGPT to review its own code helps catch bugs before you even run it!',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    },
    score: 8,
    createdAt: new Date('2026-01-20T15:30:00'),
  },
  {
    id: 'comment-1-6',
    postId: 'post-1',
    content: 'Breaking down complex problems into smaller tasks and tackling them one at a time really helps with accuracy.',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=lisa&top=longHairStraight',
    },
    score: 5,
    createdAt: new Date('2026-01-20T16:00:00'),
  },
  {
    id: 'comment-1-7',
    postId: 'post-1',
    content: 'Have you tried using the new GPT-4 Turbo? The code quality has improved noticeably compared to the older versions.',
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tom&top=shortHairShortFlat',
    },
    score: 7,
    createdAt: new Date('2026-01-20T17:20:00'),
  },
  {
    id: 'comment-1-8',
    postId: 'post-1',
    content: 'Pro tip: Always include error handling requirements in your prompts. ChatGPT often skips edge cases unless you explicitly ask.',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy&top=longHairStraight',
    },
    score: 11,
    createdAt: new Date('2026-01-20T18:00:00'),
  },
  // Post 2 comments
  {
    id: 'comment-2-1',
    postId: 'post-2',
    content: "Amazing! Is Make.com hard to learn? I've been wanting to try automation tools.",
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
    },
    score: 8,
    createdAt: new Date('2026-01-19T16:00:00'),
  },
  {
    id: 'comment-2-2',
    postId: 'post-2',
    parentId: 'comment-2-1',
    content: 'Not at all! Make.com has a visual interface that makes it super intuitive. I went from zero to building workflows in just a few hours.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 10,
    createdAt: new Date('2026-01-19T16:30:00'),
  },
  {
    id: 'comment-2-3',
    postId: 'post-2',
    content: 'This is inspiring! What was the most challenging part of the project?',
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
    },
    score: 6,
    createdAt: new Date('2026-01-19T17:00:00'),
  },
  {
    id: 'comment-2-4',
    postId: 'post-2',
    parentId: 'comment-2-3',
    content: 'Honestly, the hardest part was getting the Midjourney prompts just right for consistent brand visuals. Took some trial and error.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 8,
    createdAt: new Date('2026-01-19T17:30:00'),
  },
  {
    id: 'comment-2-5',
    postId: 'post-2',
    content: "Love this! I'm working on something similar. Do you have any tips for integrating ChatGPT API with Make.com?",
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairStraight',
    },
    score: 7,
    createdAt: new Date('2026-01-19T18:00:00'),
  },
  {
    id: 'comment-2-6',
    postId: 'post-2',
    content: "As a beginner, this really shows what's possible with AI tools. Bookmarked for future reference!",
    author: {
      id: 'user-5',
      name: 'Kevin Lee',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=kevin&top=shortHairShortFlat',
    },
    score: 4,
    createdAt: new Date('2026-01-19T19:00:00'),
  },
  {
    id: 'comment-2-7',
    postId: 'post-2',
    content: 'How much does it cost to run this system monthly? Curious about the API costs.',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    },
    score: 11,
    createdAt: new Date('2026-01-19T19:30:00'),
  },
  {
    id: 'comment-2-8',
    postId: 'post-2',
    parentId: 'comment-2-7',
    content: "Great question! It's about $50-80/month depending on usage. ChatGPT API is the biggest cost, Midjourney is a flat subscription.",
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 15,
    createdAt: new Date('2026-01-19T20:00:00'),
  },
  {
    id: 'comment-2-9',
    postId: 'post-2',
    content: 'Would you consider open-sourcing the Make.com templates? Would love to learn from your setup.',
    author: {
      id: 'user-7',
      name: 'David Zhang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=david&top=shortHairShortFlat',
    },
    score: 8,
    createdAt: new Date('2026-01-19T21:00:00'),
  },
  {
    id: 'comment-2-10',
    postId: 'post-2',
    content: 'This is exactly what I needed to see! Been procrastinating on my own project. Time to start!',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=lisa&top=longHairStraight',
    },
    score: 5,
    createdAt: new Date('2026-01-19T22:00:00'),
  },
  {
    id: 'comment-2-11',
    postId: 'post-2',
    content: 'The combination of tools you picked is solid. Have you considered adding n8n for more complex logic?',
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tom&top=shortHairShortFlat',
    },
    score: 6,
    createdAt: new Date('2026-01-19T23:00:00'),
  },
  {
    id: 'comment-2-12',
    postId: 'post-2',
    content: 'Excellent execution! This kind of project showcase is why I love this community. Keep sharing!',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy&top=longHairStraight',
    },
    score: 9,
    createdAt: new Date('2026-01-20T08:00:00'),
  },
  // Post 3 comments
  {
    id: 'comment-3-1',
    postId: 'post-3',
    content: 'Yes! The text generation improvement is huge. Finally can add proper text to images without weird characters.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
    },
    score: 11,
    createdAt: new Date('2026-01-18T10:00:00'),
  },
  {
    id: 'comment-3-2',
    postId: 'post-3',
    content: 'The finger issue fix is such a relief! My character designs look so much more natural now.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 15,
    createdAt: new Date('2026-01-18T10:30:00'),
  },
  {
    id: 'comment-3-3',
    postId: 'post-3',
    content: 'I noticed the --style raw parameter gives even better results in v6. Has anyone experimented with it?',
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairStraight',
    },
    score: 9,
    createdAt: new Date('2026-01-18T11:00:00'),
  },
  {
    id: 'comment-3-4',
    postId: 'post-3',
    parentId: 'comment-3-3',
    content: 'Yes! --style raw is amazing for photorealistic images. Less "AI look" if that makes sense.',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    },
    score: 8,
    createdAt: new Date('2026-01-18T11:30:00'),
  },
  {
    id: 'comment-3-5',
    postId: 'post-3',
    content: 'As someone just starting with image generation, should I begin with v6 or learn the basics with v5 first?',
    author: {
      id: 'user-5',
      name: 'Kevin Lee',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=kevin&top=shortHairShortFlat',
    },
    score: 5,
    createdAt: new Date('2026-01-18T12:00:00'),
  },
  {
    id: 'comment-3-6',
    postId: 'post-3',
    parentId: 'comment-3-5',
    content: "Definitely start with v6! It's more intuitive and the prompts work more naturally. No reason to learn older versions.",
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
    },
    score: 7,
    createdAt: new Date('2026-01-18T12:30:00'),
  },
  {
    id: 'comment-3-7',
    postId: 'post-3',
    content: 'The slower speed is noticeable but honestly worth it for the quality improvement.',
    author: {
      id: 'user-7',
      name: 'David Zhang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=david&top=shortHairShortFlat',
    },
    score: 5,
    createdAt: new Date('2026-01-18T13:00:00'),
  },
  {
    id: 'comment-3-8',
    postId: 'post-3',
    content: 'Anyone else notice the prompt understanding is way better? Less need for negative prompts now.',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=lisa&top=longHairStraight',
    },
    score: 10,
    createdAt: new Date('2026-01-18T14:00:00'),
  },
  {
    id: 'comment-3-9',
    postId: 'post-3',
    content: 'The aspect ratio options are also better. Getting cinematic 21:9 shots is so much easier now.',
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tom&top=shortHairShortFlat',
    },
    score: 8,
    createdAt: new Date('2026-01-18T15:00:00'),
  },
  {
    id: 'comment-3-10',
    postId: 'post-3',
    content: "Great discussion! I'm compiling a v6 tips document. Will share it once it's ready.",
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy&top=longHairStraight',
    },
    score: 14,
    createdAt: new Date('2026-01-18T16:00:00'),
  },
  // Post 4 comments
  {
    id: 'comment-4-1',
    postId: 'post-4',
    content: 'This list is incredibly comprehensive! Adding to my bookmarks.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
    },
    score: 12,
    createdAt: new Date('2026-01-15T15:00:00'),
  },
  {
    id: 'comment-4-2',
    postId: 'post-4',
    content: "You might want to add Perplexity AI to the text generation section - it's great for research.",
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 17,
    createdAt: new Date('2026-01-15T16:00:00'),
  },
  {
    id: 'comment-4-3',
    postId: 'post-4',
    parentId: 'comment-4-2',
    content: "Good suggestion! I'll add Perplexity and a few other research-focused tools.",
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairStraight',
    },
    score: 8,
    createdAt: new Date('2026-01-15T16:30:00'),
  },
  {
    id: 'comment-4-4',
    postId: 'post-4',
    content: 'For video generation, Kling AI is also worth mentioning. Great for longer videos.',
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
    },
    score: 9,
    createdAt: new Date('2026-01-15T17:00:00'),
  },
  {
    id: 'comment-4-5',
    postId: 'post-4',
    content: 'Perfect timing! I was just looking for a guide like this. Thank you so much!',
    author: {
      id: 'user-5',
      name: 'Kevin Lee',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=kevin&top=shortHairShortFlat',
    },
    score: 5,
    createdAt: new Date('2026-01-15T18:00:00'),
  },
  {
    id: 'comment-4-6',
    postId: 'post-4',
    content: 'Would be great to add a section for AI coding assistants - Cursor, GitHub Copilot, etc.',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    },
    score: 14,
    createdAt: new Date('2026-01-16T09:00:00'),
  },
  {
    id: 'comment-4-7',
    postId: 'post-4',
    content: 'Has anyone tried Leonardo AI for image generation? How does it compare to Midjourney?',
    author: {
      id: 'user-7',
      name: 'David Zhang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=david&top=shortHairShortFlat',
    },
    score: 7,
    createdAt: new Date('2026-01-16T10:00:00'),
  },
  {
    id: 'comment-4-8',
    postId: 'post-4',
    parentId: 'comment-4-7',
    content: 'Leonardo is great for gaming art and has better fine-tuning options. Midjourney is still king for general use.',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=lisa&top=longHairStraight',
    },
    score: 11,
    createdAt: new Date('2026-01-16T11:00:00'),
  },
  {
    id: 'comment-4-9',
    postId: 'post-4',
    content: "Don't forget ElevenLabs for voice generation! Essential for video content.",
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tom&top=shortHairShortFlat',
    },
    score: 13,
    createdAt: new Date('2026-01-17T08:00:00'),
  },
  {
    id: 'comment-4-10',
    postId: 'post-4',
    content: 'This should be pinned! Maybe add difficulty levels for beginners to know where to start.',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy&top=longHairStraight',
    },
    score: 16,
    createdAt: new Date('2026-01-17T10:00:00'),
  },
  {
    id: 'comment-4-11',
    postId: 'post-4',
    content: 'For automation, Bardeen is also worth checking out. Great for browser-based tasks.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=alex&top=shortHairShortFlat',
    },
    score: 6,
    createdAt: new Date('2026-01-18T09:00:00'),
  },
  {
    id: 'comment-4-12',
    postId: 'post-4',
    content: 'Would love to see a comparison section too - pros and cons of each tool.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 10,
    createdAt: new Date('2026-01-19T11:00:00'),
  },
  {
    id: 'comment-4-13',
    postId: 'post-4',
    content: "Notion AI is great for writing assistance if you're already in the Notion ecosystem.",
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
    },
    score: 7,
    createdAt: new Date('2026-01-19T14:00:00'),
  },
  {
    id: 'comment-4-14',
    postId: 'post-4',
    content: 'Updated my workflow based on this list. Productivity has gone through the roof!',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    },
    score: 8,
    createdAt: new Date('2026-01-20T08:00:00'),
  },
  {
    id: 'comment-4-15',
    postId: 'post-4',
    content: 'Thanks for keeping this updated! This is my go-to resource for trying new tools.',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=lisa&top=longHairStraight',
    },
    score: 9,
    createdAt: new Date('2026-01-20T15:00:00'),
  },
  // Post 5 comments
  {
    id: 'comment-5-1',
    postId: 'post-5',
    content: "You don't need much prerequisite knowledge. I recommend starting with the free courses and following along - you'll get the hang of it!",
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=sarah&top=longHairStraight',
    },
    score: 9,
    createdAt: new Date('2026-01-21T09:00:00'),
  },
  {
    id: 'comment-5-2',
    postId: 'post-5',
    content: 'The basics can be learned in a weekend, but mastery takes continuous practice. Start simple and build up!',
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=emily&top=longHairStraight',
    },
    score: 8,
    createdAt: new Date('2026-01-21T10:00:00'),
  },
  {
    id: 'comment-5-3',
    postId: 'post-5',
    content: 'Welcome! I suggest: 1) Basic prompting course, 2) Practice daily with ChatGPT, 3) Move to specialized tools. Took me about 2 weeks to feel comfortable.',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy&top=longHairStraight',
    },
    score: 15,
    createdAt: new Date('2026-01-21T11:00:00'),
  },
  {
    id: 'comment-5-4',
    postId: 'post-5',
    parentId: 'comment-5-3',
    content: 'This is exactly what I needed! Thank you for the clear roadmap!',
    author: {
      id: 'user-5',
      name: 'Kevin Lee',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=kevin&top=shortHairShortFlat',
    },
    score: 4,
    createdAt: new Date('2026-01-21T11:30:00'),
  },
  {
    id: 'comment-5-5',
    postId: 'post-5',
    content: 'No programming background needed! I started with zero tech experience and now I use AI daily for work.',
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=mike&top=shortHairShortFlat',
    },
    score: 7,
    createdAt: new Date('2026-01-21T12:00:00'),
  },
  {
    id: 'comment-5-6',
    postId: 'post-5',
    content: 'Join the community Discord too! We have weekly prompt challenges that really help with learning.',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=jessica&top=longHairStraight',
    },
    score: 6,
    createdAt: new Date('2026-01-21T13:00:00'),
  },
  {
    id: 'comment-5-7',
    postId: 'post-5',
    content: "The most important thing is just to start experimenting. Don't worry about being perfect - that's how we all learned!",
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=tom&top=shortHairShortFlat',
    },
    score: 9,
    createdAt: new Date('2026-01-21T14:00:00'),
  },
];

export function getPostById(id: string): Post | undefined {
  return MOCK_POSTS.find((p) => p.id === id);
}

export function getCommentsByPostId(postId: string): Comment[] {
  return MOCK_COMMENTS.filter((c) => c.postId === postId);
}

export function getPinnedPosts(): Post[] {
  return MOCK_POSTS.filter((p) => p.isPinned);
}

export function getRecentPosts(): Post[] {
  return [...MOCK_POSTS].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}
