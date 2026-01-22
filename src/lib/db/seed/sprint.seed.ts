import type { MockDB } from '../core/MockDB';

/**
 * Seed sprint module data
 */
export async function seedSprint(db: MockDB): Promise<void> {
  const now = new Date();

  // Create seasons
  db.seasons.createMany([
    {
      id: 'season-1',
      name: '2026 Q1',
      description: '2026 First Quarter Sprint Season',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      createdAt: new Date('2025-12-01'),
    },
    {
      id: 'season-2',
      name: '2025 Q4',
      description: '2025 Fourth Quarter Sprint Season',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-31'),
      createdAt: new Date('2025-09-01'),
    },
  ]);

  // Create sprints
  db.sprints.createMany([
    {
      id: 'sprint-1',
      seasonId: 'season-1',
      title: 'AI Automation Tools',
      description: 'Build your own AI automation tools to boost daily productivity',
      theme: 'Automation',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      votingStartDate: new Date('2026-01-16'),
      projectCount: 12,
      createdAt: new Date('2025-12-15'),
    },
    {
      id: 'sprint-2',
      seasonId: 'season-1',
      title: 'AI Content Creation',
      description: 'Create various types of content with AI',
      theme: 'Creation',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
      votingStartDate: new Date('2026-02-13'),
      projectCount: 8,
      createdAt: new Date('2026-01-15'),
    },
    {
      id: 'sprint-3',
      seasonId: 'season-2',
      title: 'AI Customer Service Assistant',
      description: 'Build an intelligent customer service chatbot',
      theme: 'Customer Service',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31'),
      votingStartDate: new Date('2025-12-16'),
      projectCount: 15,
      createdAt: new Date('2025-11-15'),
    },
  ]);

  // Create projects
  db.projects.createMany([
    {
      id: 'project-1',
      sprintId: 'sprint-1',
      authorId: 'user-1',
      title: 'Automated Social Media Scheduler',
      description: 'Integrates ChatGPT and Make.com to automatically generate and schedule social media posts',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      githubUrl: 'https://github.com/example/social-scheduler',
      liveUrl: 'https://social-scheduler.demo.com',
      voteCount: 42,
      viewCount: 1280,
      starCount: 156,
      rank: 1,
      isWinner: true,
      submittedAt: new Date('2026-01-10'),
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: 'project-2',
      sprintId: 'sprint-1',
      authorId: 'user-2',
      title: 'AI Meeting Summary Assistant',
      description: 'Automatically records meetings and generates key summaries and action items',
      thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
      githubUrl: 'https://github.com/example/meeting-summary',
      voteCount: 38,
      viewCount: 980,
      starCount: 142,
      rank: 2,
      isWinner: false,
      submittedAt: new Date('2026-01-08'),
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-12'),
    },
    {
      id: 'project-3',
      sprintId: 'sprint-1',
      authorId: 'user-3',
      title: 'Smart Email Classifier',
      description: 'Uses AI to automatically categorize and prioritize emails',
      thumbnailUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800',
      voteCount: 28,
      viewCount: 756,
      starCount: 89,
      rank: 3,
      isWinner: false,
      submittedAt: new Date('2026-01-05'),
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: 'project-4',
      sprintId: 'sprint-1',
      authorId: 'user-4',
      title: 'Code Review Assistant',
      description: 'Automated code review with improvement suggestions',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      githubUrl: 'https://github.com/example/code-reviewer',
      voteCount: 25,
      viewCount: 620,
      starCount: 78,
      isWinner: false,
      submittedAt: new Date('2026-01-12'),
      createdAt: new Date('2026-01-12'),
      updatedAt: new Date('2026-01-14'),
    },
  ]);

  // Create project tech stack
  db.projectTechStack.createMany([
    { id: 'tech-1-1', projectId: 'project-1', technology: 'ChatGPT' },
    { id: 'tech-1-2', projectId: 'project-1', technology: 'Make.com' },
    { id: 'tech-1-3', projectId: 'project-1', technology: 'React' },
    { id: 'tech-2-1', projectId: 'project-2', technology: 'Whisper' },
    { id: 'tech-2-2', projectId: 'project-2', technology: 'GPT-4' },
    { id: 'tech-2-3', projectId: 'project-2', technology: 'Python' },
    { id: 'tech-3-1', projectId: 'project-3', technology: 'Claude' },
    { id: 'tech-3-2', projectId: 'project-3', technology: 'Zapier' },
    { id: 'tech-3-3', projectId: 'project-3', technology: 'Gmail API' },
    { id: 'tech-4-1', projectId: 'project-4', technology: 'GPT-4' },
    { id: 'tech-4-2', projectId: 'project-4', technology: 'GitHub API' },
    { id: 'tech-4-3', projectId: 'project-4', technology: 'TypeScript' },
  ]);

  // Create some project votes
  db.projectVotes.createMany([
    { id: 'pvote-1', projectId: 'project-1', userId: 'user-2', createdAt: new Date('2026-01-17') },
    { id: 'pvote-2', projectId: 'project-1', userId: 'user-3', createdAt: new Date('2026-01-18') },
    { id: 'pvote-3', projectId: 'project-1', userId: 'user-4', createdAt: new Date('2026-01-19') },
    { id: 'pvote-4', projectId: 'project-2', userId: 'user-1', createdAt: new Date('2026-01-17') },
    { id: 'pvote-5', projectId: 'project-2', userId: 'user-3', createdAt: new Date('2026-01-18') },
    { id: 'pvote-6', projectId: 'project-3', userId: 'user-1', createdAt: new Date('2026-01-19') },
    { id: 'pvote-7', projectId: 'project-3', userId: 'user-2', createdAt: new Date('2026-01-20') },
  ]);
}
