import { UserIdentity } from './users';

export type PostCategory = 'discussion' | 'question' | 'resource' | 'announcement' | 'share';

export interface PostAuthor {
    id: string;
    name: string;
    avatar: string;
    identity?: UserIdentity;
}

export interface ForumPost {
    id: string;
    title: string;
    content: string;
    author: PostAuthor;
    category: PostCategory;
    tags: string[];
    score: number;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    viewCount: number;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
export const MOCK_POSTS: ForumPost[] = [
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
