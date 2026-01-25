/**
 * Comments Table
 *
 * Contains forum comments.
 * Uses canonical users (user-1 through user-10)
 */

export interface CommentAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  content: string;
  author: CommentAuthor;
  score: number;
  createdAt: Date;
}

export const CommentsTable: Comment[] = [
  // Post 1 comments
  {
    id: 'comment-1-1',
    postId: 'post-1',
    content:
      'My experience is to give ChatGPT more context, such as explaining your tech stack and project structure, so it can give more relevant suggestions.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 15,
    createdAt: new Date('2026-01-20T11:00:00'),
  },
  {
    id: 'comment-1-2',
    postId: 'post-1',
    content:
      'I suggest using the Chain of Thought approach, letting it think step by step, and the accuracy will improve a lot!',
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://i.pravatar.cc/150?u=mike',
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
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    score: 5,
    createdAt: new Date('2026-01-20T13:00:00'),
  },
  {
    id: 'comment-1-4',
    postId: 'post-1',
    content:
      'Also try specifying the output format you want - like asking for comments in the code, or specific variable naming conventions.',
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://i.pravatar.cc/150?u=emily',
    },
    score: 9,
    createdAt: new Date('2026-01-20T14:15:00'),
  },
  {
    id: 'comment-1-5',
    postId: 'post-1',
    content:
      'I find that asking ChatGPT to review its own code helps catch bugs before you even run it!',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://i.pravatar.cc/150?u=jessica',
    },
    score: 8,
    createdAt: new Date('2026-01-20T15:30:00'),
  },
  {
    id: 'comment-1-6',
    postId: 'post-1',
    content:
      'Breaking down complex problems into smaller tasks and tackling them one at a time really helps with accuracy.',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://i.pravatar.cc/150?u=lisa',
    },
    score: 5,
    createdAt: new Date('2026-01-20T16:00:00'),
  },
  {
    id: 'comment-1-7',
    postId: 'post-1',
    content:
      'Have you tried using the new GPT-4 Turbo? The code quality has improved noticeably compared to the older versions.',
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://i.pravatar.cc/150?u=tom',
    },
    score: 7,
    createdAt: new Date('2026-01-20T17:20:00'),
  },
  {
    id: 'comment-1-8',
    postId: 'post-1',
    content:
      'Pro tip: Always include error handling requirements in your prompts. ChatGPT often skips edge cases unless you explicitly ask.',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://i.pravatar.cc/150?u=amy',
    },
    score: 11,
    createdAt: new Date('2026-01-20T18:00:00'),
  },
  // Post 2 comments
  {
    id: 'comment-2-1',
    postId: 'post-2',
    content:
      "Amazing! Is Make.com hard to learn? I've been wanting to try automation tools.",
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    score: 8,
    createdAt: new Date('2026-01-19T16:00:00'),
  },
  {
    id: 'comment-2-2',
    postId: 'post-2',
    parentId: 'comment-2-1',
    content:
      'Not at all! Make.com has a visual interface that makes it super intuitive. I went from zero to building workflows in just a few hours.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 10,
    createdAt: new Date('2026-01-19T16:30:00'),
  },
  {
    id: 'comment-2-3',
    postId: 'post-2',
    content:
      'This is inspiring! What was the most challenging part of the project?',
    author: {
      id: 'user-3',
      name: 'Mike Wang',
      avatar: 'https://i.pravatar.cc/150?u=mike',
    },
    score: 6,
    createdAt: new Date('2026-01-19T17:00:00'),
  },
  {
    id: 'comment-2-4',
    postId: 'post-2',
    parentId: 'comment-2-3',
    content:
      'Honestly, the hardest part was getting the Midjourney prompts just right for consistent brand visuals. Took some trial and error.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 8,
    createdAt: new Date('2026-01-19T17:30:00'),
  },
  {
    id: 'comment-2-5',
    postId: 'post-2',
    content:
      "Love this! I'm working on something similar. Do you have any tips for integrating ChatGPT API with Make.com?",
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://i.pravatar.cc/150?u=emily',
    },
    score: 7,
    createdAt: new Date('2026-01-19T18:00:00'),
  },
  {
    id: 'comment-2-6',
    postId: 'post-2',
    content:
      "As a beginner, this really shows what's possible with AI tools. Bookmarked for future reference!",
    author: {
      id: 'user-5',
      name: 'Kevin Lee',
      avatar: 'https://i.pravatar.cc/150?u=kevin',
    },
    score: 4,
    createdAt: new Date('2026-01-19T19:00:00'),
  },
  {
    id: 'comment-2-7',
    postId: 'post-2',
    content:
      'How much does it cost to run this system monthly? Curious about the API costs.',
    author: {
      id: 'user-6',
      name: 'Jessica Wu',
      avatar: 'https://i.pravatar.cc/150?u=jessica',
    },
    score: 11,
    createdAt: new Date('2026-01-19T19:30:00'),
  },
  {
    id: 'comment-2-8',
    postId: 'post-2',
    parentId: 'comment-2-7',
    content:
      "Great question! It's about $50-80/month depending on usage. ChatGPT API is the biggest cost, Midjourney is a flat subscription.",
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 15,
    createdAt: new Date('2026-01-19T20:00:00'),
  },
  {
    id: 'comment-2-9',
    postId: 'post-2',
    content:
      'Would you consider open-sourcing the Make.com templates? Would love to learn from your setup.',
    author: {
      id: 'user-7',
      name: 'David Zhang',
      avatar: 'https://i.pravatar.cc/150?u=david',
    },
    score: 8,
    createdAt: new Date('2026-01-19T21:00:00'),
  },
  {
    id: 'comment-2-10',
    postId: 'post-2',
    content:
      'This is exactly what I needed to see! Been procrastinating on my own project. Time to start!',
    author: {
      id: 'user-8',
      name: 'Lisa Chen',
      avatar: 'https://i.pravatar.cc/150?u=lisa',
    },
    score: 5,
    createdAt: new Date('2026-01-19T22:00:00'),
  },
  {
    id: 'comment-2-11',
    postId: 'post-2',
    content:
      'The combination of tools you picked is solid. Have you considered adding n8n for more complex logic?',
    author: {
      id: 'user-9',
      name: 'Tom Huang',
      avatar: 'https://i.pravatar.cc/150?u=tom',
    },
    score: 6,
    createdAt: new Date('2026-01-19T23:00:00'),
  },
  {
    id: 'comment-2-12',
    postId: 'post-2',
    content:
      'Excellent execution! This kind of project showcase is why I love this community. Keep sharing!',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://i.pravatar.cc/150?u=amy',
    },
    score: 9,
    createdAt: new Date('2026-01-20T08:00:00'),
  },
  // Post 3 comments (abbreviated for length)
  {
    id: 'comment-3-1',
    postId: 'post-3',
    content:
      'Yes! The text generation improvement is huge. Finally can add proper text to images without weird characters.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    score: 11,
    createdAt: new Date('2026-01-18T10:00:00'),
  },
  {
    id: 'comment-3-2',
    postId: 'post-3',
    content:
      'The finger issue fix is such a relief! My character designs look so much more natural now.',
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 15,
    createdAt: new Date('2026-01-18T10:30:00'),
  },
  // Post 4 comments
  {
    id: 'comment-4-1',
    postId: 'post-4',
    content: 'This list is incredibly comprehensive! Adding to my bookmarks.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    score: 12,
    createdAt: new Date('2026-01-15T15:00:00'),
  },
  {
    id: 'comment-4-2',
    postId: 'post-4',
    content:
      "You might want to add Perplexity AI to the text generation section - it's great for research.",
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 17,
    createdAt: new Date('2026-01-15T16:00:00'),
  },
  // Post 5 comments
  {
    id: 'comment-5-1',
    postId: 'post-5',
    content:
      "You don't need much prerequisite knowledge. I recommend starting with the free courses and following along - you'll get the hang of it!",
    author: {
      id: 'user-2',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    score: 9,
    createdAt: new Date('2026-01-21T09:00:00'),
  },
  {
    id: 'comment-5-2',
    postId: 'post-5',
    content:
      'The basics can be learned in a weekend, but mastery takes continuous practice. Start simple and build up!',
    author: {
      id: 'user-4',
      name: 'Emily Huang',
      avatar: 'https://i.pravatar.cc/150?u=emily',
    },
    score: 8,
    createdAt: new Date('2026-01-21T10:00:00'),
  },
  {
    id: 'comment-5-3',
    postId: 'post-5',
    content:
      'Welcome! I suggest: 1) Basic prompting course, 2) Practice daily with ChatGPT, 3) Move to specialized tools. Took me about 2 weeks to feel comfortable.',
    author: {
      id: 'user-10',
      name: 'Amy Lin',
      avatar: 'https://i.pravatar.cc/150?u=amy',
    },
    score: 15,
    createdAt: new Date('2026-01-21T11:00:00'),
  },
];

// ============================================================
// Helper Functions
// ============================================================

export const getCommentById = (id: string): Comment | undefined =>
  CommentsTable.find((c) => c.id === id);

export const getCommentsByPostId = (postId: string): Comment[] =>
  CommentsTable.filter((c) => c.postId === postId);

export const getReplies = (commentId: string): Comment[] =>
  CommentsTable.filter((c) => c.parentId === commentId);

export const getTopLevelComments = (postId: string): Comment[] =>
  CommentsTable.filter((c) => c.postId === postId && !c.parentId);

export const getCommentCount = (postId: string): number =>
  CommentsTable.filter((c) => c.postId === postId).length;

export const getAllComments = (): Comment[] => CommentsTable;

// ============================================================
// Legacy Exports (for backward compatibility)
// ============================================================

/** @deprecated Use CommentsTable instead */
export const MOCK_COMMENTS = CommentsTable;
